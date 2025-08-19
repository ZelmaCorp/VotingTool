import { db } from '../connection';
import { Chain, InternalStatus } from '../../types/properties';
import { ReferendumRecord, ReferendumWithDetails } from '../types';

export class Referendum {
    
    /**
     * Create a new referendum (replaces Notion createReferenda function)
     */
    public static async create(data: ReferendumRecord): Promise<number> {
        const sql = `
            INSERT INTO referendums (
                post_id, chain, title, description, requested_amount_usd,
                origin, referendum_timeline, internal_status, link,
                voting_start_date, voting_end_date, created_at,
                last_edited_by, public_comment, public_comment_made,
                ai_summary, reason_for_vote, reason_for_no_way, voted_link
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            data.post_id,
            data.chain,
            data.title,
            data.description || null,
            data.requested_amount_usd || null,
            data.origin || null,
            data.referendum_timeline || null,
            data.internal_status || InternalStatus.NotStarted,
            data.link || null,
            data.voting_start_date || null,
            data.voting_end_date || null,
            data.created_at,
            data.last_edited_by || null,
            data.public_comment || null,
            data.public_comment_made || false,
            data.ai_summary || null,
            data.reason_for_vote || null,
            data.reason_for_no_way || null,
            data.voted_link || null
        ];

        const result = await db.run(sql, params);
        return result.lastID!;
    }

    /**
     * Find a referendum by post_id and chain (replaces findNotionPageByPostId)
     */
    public static async findByPostIdAndChain(postId: number, chain: Chain): Promise<ReferendumWithDetails | null> {
        const sql = `
            SELECT 
                r.*,
                sc.necessity_score, sc.funding_score, sc.competition_score,
                sc.blueprint_score, sc.track_record_score, sc.reports_score,
                sc.synergy_score, sc.revenue_score, sc.security_score,
                sc.open_source_score, sc.ref_score,
                vd.suggested_vote, vd.final_vote, vd.vote_executed, vd.vote_executed_date,
                GROUP_CONCAT(DISTINCT tm.name || ':' || rtr.role_type) as team_roles
            FROM referendums r
            LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id
            LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id
            LEFT JOIN referendum_team_roles rtr ON r.id = rtr.referendum_id
            LEFT JOIN team_members tm ON rtr.team_member_id = tm.id
            WHERE r.post_id = ? AND r.chain = ?
            GROUP BY r.id
        `;

        return await db.get(sql, [postId, chain]);
    }

    /**
     * Update a referendum (replaces Notion updateReferenda function)
     */
    public static async update(postId: number, chain: Chain, updates: Partial<ReferendumRecord>): Promise<void> {
        // Build dynamic UPDATE query
        const fields: string[] = [];
        const params: any[] = [];

        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined && key !== 'id') {
                fields.push(`${key} = ?`);
                params.push(value);
            }
        });

        if (fields.length === 0) return;

        // Always update the updated_at timestamp
        fields.push('updated_at = datetime("now")');
        
        // Add WHERE clause parameters
        params.push(postId, chain);

        const sql = `
            UPDATE referendums 
            SET ${fields.join(', ')}
            WHERE post_id = ? AND chain = ?
        `;

        await db.run(sql, params);
    }

    /**
     * Get all referendums (replaces getNotionPages)
     */
    public static async getAll(): Promise<ReferendumWithDetails[]> {
        const sql = `
            SELECT 
                r.*,
                sc.ref_score,
                vd.suggested_vote, vd.final_vote, vd.vote_executed
            FROM referendums r
            LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id
            LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id
            ORDER BY r.created_at DESC
        `;

        return await db.all(sql);
    }

    /**
     * Get referendums by status
     */
    public static async getByStatus(status: InternalStatus): Promise<ReferendumWithDetails[]> {
        const sql = `
            SELECT 
                r.*,
                sc.ref_score,
                vd.suggested_vote, vd.final_vote, vd.vote_executed
            FROM referendums r
            LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id
            LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id
            WHERE r.internal_status = ?
            ORDER BY r.created_at DESC
        `;

        return await db.all(sql, [status]);
    }

    /**
     * Get referendums ready to vote (for Mimir integration)
     */
    public static async getReadyToVote(): Promise<ReferendumWithDetails[]> {
        const sql = `
            SELECT 
                r.*,
                vd.suggested_vote, vd.final_vote, vd.vote_executed
            FROM referendums r
            LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id
            WHERE r.internal_status = 'Ready to vote'
              AND r.voting_end_date > datetime('now')
              AND (vd.vote_executed IS NULL OR vd.vote_executed = FALSE)
            ORDER BY r.voting_end_date
        `;

        return await db.all(sql);
    }

    /**
     * Update voting status (for Mimir integration)
     */
    public static async updateVotingStatus(
        postId: number, 
        chain: Chain, 
        status: InternalStatus, 
        votedLink?: string
    ): Promise<void> {
        const updates: Partial<ReferendumRecord> = {
            internal_status: status,
            vote_executed_date: new Date().toISOString()
        };

        if (votedLink) {
            updates.voted_link = votedLink;
        }

        await this.update(postId, chain, updates);
    }

    /**
     * Check if referendum exists
     */
    public static async exists(postId: number, chain: Chain): Promise<boolean> {
        const sql = 'SELECT COUNT(*) as count FROM referendums WHERE post_id = ? AND chain = ?';
        const result = await db.get(sql, [postId, chain]);
        return result.count > 0;
    }

    /**
     * Delete a referendum (cascade will handle related records)
     */
    public static async delete(postId: number, chain: Chain): Promise<void> {
        const sql = 'DELETE FROM referendums WHERE post_id = ? AND chain = ?';
        await db.run(sql, [postId, chain]);
    }
} 