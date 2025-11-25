import { db } from '../connection';
import { Chain, InternalStatus } from '../../types/properties';
import { ReferendumRecord, ReferendumWithDetails } from '../types';
import { logger } from '../../config/logger';

export class Referendum {
    
    /**
     * Create a new referendum
     */
    public static async create(data: ReferendumRecord): Promise<number> {
        const sql = `
            INSERT INTO referendums (
                post_id, chain, dao_id, title, description, requested_amount_usd,
                origin, referendum_timeline, internal_status, link,
                voting_start_date, voting_end_date, created_at,
                last_edited_by, public_comment, public_comment_made,
                ai_summary, reason_for_vote, reason_for_no_way, voted_link
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            data.post_id,
            data.chain,
            data.dao_id,
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
     * Find a referendum by post_id, chain, and daoId
     */
    public static async findByPostIdAndChain(postId: number, chain: Chain, daoId: number): Promise<ReferendumWithDetails | null> {
        const sql = `
            SELECT 
                r.*,
                sc.necessity_score, sc.funding_score, sc.competition_score,
                sc.blueprint_score, sc.track_record_score, sc.reports_score,
                sc.synergy_score, sc.revenue_score, sc.security_score,
                sc.open_source_score, sc.ref_score,
                vd.suggested_vote, vd.final_vote, vd.vote_executed, vd.vote_executed_date
            FROM referendums r
            LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id AND sc.dao_id = ?
            LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id AND vd.dao_id = ?
            WHERE r.post_id = ? AND r.chain = ? AND r.dao_id = ?
        `;

        const referendum = await db.get(sql, [daoId, daoId, postId, chain, daoId]);
        
        if (!referendum) {
            return null;
        }
        
        // Get team assignments separately since team_member_id is now a wallet address
        const assignmentsSql = `
            SELECT rtr.team_member_id as wallet_address, rtr.role_type, rtr.created_at
            FROM referendum_team_roles rtr
            WHERE rtr.referendum_id = ? AND rtr.dao_id = ?
            ORDER BY rtr.created_at DESC
        `;
        
        const assignments = await db.all(assignmentsSql, [referendum.id, daoId]);
        
        // Find who is assigned as responsible person
        const responsiblePerson = assignments.find(a => a.role_type === 'responsible_person');
        
        logger.debug({
            postId,
            chain,
            daoId,
            referendumId: referendum.id,
            totalAssignments: assignments.length,
            hasResponsiblePerson: !!responsiblePerson,
            responsiblePersonAddress: responsiblePerson?.wallet_address,
            allAssignments: assignments.map(a => ({ role: a.role_type, address: a.wallet_address }))
        }, 'Referendum.findByPostIdAndChain - Fetched assignment data');
        
        return {
            ...referendum,
            assigned_to: responsiblePerson?.wallet_address || null,
            team_assignments: assignments
        };
    }

    /**
     * Update a referendum
     */
    public static async update(postId: number, chain: Chain, daoId: number, updates: Partial<ReferendumRecord>): Promise<void> {
        // Build dynamic UPDATE query
        const fields: string[] = [];
        const params: any[] = [];

        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined && key !== 'id' && key !== 'dao_id') {
                fields.push(`${key} = ?`);
                params.push(value);
            }
        });

        if (fields.length === 0) return;

        // Always update the updated_at timestamp
        fields.push('updated_at = datetime("now")');
        
        // Add WHERE clause parameters
        params.push(postId, chain, daoId);

        const sql = `
            UPDATE referendums 
            SET ${fields.join(', ')}
            WHERE post_id = ? AND chain = ? AND dao_id = ?
        `;

        await db.run(sql, params);
    }

    /**
     * Get all referendums, optionally filtered by DAO
     */
    public static async getAll(daoId?: number): Promise<ReferendumWithDetails[]> {
        // First get all referendums with basic data
        const whereClauses: string[] = [];
        const params: any[] = [];

        if (daoId !== undefined) {
            whereClauses.push('r.dao_id = ?');
            params.push(daoId);
            params.push(daoId);
            params.push(daoId);
        }

        const sql = `
            SELECT 
                r.*,
                sc.ref_score,
                vd.suggested_vote, vd.final_vote, vd.vote_executed
            FROM referendums r
            LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id${daoId !== undefined ? ' AND sc.dao_id = ?' : ''}
            LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id${daoId !== undefined ? ' AND vd.dao_id = ?' : ''}
            ${whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : ''}
            ORDER BY r.created_at DESC
        `;

        const referendums = await db.all(sql, daoId !== undefined ? params : []);

        if (referendums.length === 0) {
            return [];
        }

        // Get all team assignments in one query
        const assignmentParams = referendums.map(r => r.id);
        if (daoId !== undefined) {
            assignmentParams.push(daoId);
        }

        const assignmentsSql = `
            SELECT 
                rtr.referendum_id,
                rtr.team_member_id as wallet_address,
                rtr.role_type,
                rtr.created_at
            FROM referendum_team_roles rtr
            WHERE rtr.referendum_id IN (${referendums.map(() => '?').join(',')})
            ${daoId !== undefined ? 'AND rtr.dao_id = ?' : ''}
            ORDER BY rtr.created_at DESC
        `;

        const assignments = await db.all(assignmentsSql, assignmentParams);

        // Group assignments by referendum_id
        const assignmentsByRef = assignments.reduce((acc, curr) => {
            if (!acc[curr.referendum_id]) {
                acc[curr.referendum_id] = [];
            }
            acc[curr.referendum_id].push(curr);
            return acc;
        }, {} as Record<number, { role_type: string; wallet_address: string; created_at: string }[]>);

        // Merge assignments into referendums
        return referendums.map(ref => {
            const refAssignments = assignmentsByRef[ref.id] || [];
            const responsiblePerson = refAssignments.find((a: { role_type: string }) => a.role_type === 'responsible_person');
            
            return {
                ...ref,
                assigned_to: responsiblePerson?.wallet_address || null,
                team_assignments: refAssignments
            };
        });
    }

    /**
     * Get referendums by status, optionally filtered by DAO
     */
    public static async getByStatus(status: InternalStatus, daoId?: number): Promise<ReferendumWithDetails[]> {
        const whereClauses = ['r.internal_status = ?'];
        const params: any[] = [status];

        if (daoId !== undefined) {
            whereClauses.push('r.dao_id = ?');
            params.push(daoId);
        }

        const sql = `
            SELECT 
                r.*,
                sc.ref_score,
                vd.suggested_vote, vd.final_vote, vd.vote_executed
            FROM referendums r
            LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id${daoId !== undefined ? ' AND sc.dao_id = ?' : ''}
            LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id${daoId !== undefined ? ' AND vd.dao_id = ?' : ''}
            WHERE ${whereClauses.join(' AND ')}
            ORDER BY r.created_at DESC
        `;

        if (daoId !== undefined) {
            params.push(daoId);
            params.push(daoId);
        }

        return await db.all(sql, params);
    }

    /**
     * Get referendums ready to vote (for Mimir integration), optionally filtered by DAO
     */
    public static async getReadyToVote(daoId?: number): Promise<ReferendumWithDetails[]> {
        const whereClauses = [
            "r.internal_status = 'Ready to vote'",
            "(r.voting_end_date IS NULL OR r.voting_end_date > datetime('now'))",
            "(vd.vote_executed IS NULL OR vd.vote_executed = FALSE)"
        ];
        const params: any[] = [];

        if (daoId !== undefined) {
            whereClauses.push('r.dao_id = ?');
            params.push(daoId);
        }

        const sql = `
            SELECT 
                r.*,
                vd.suggested_vote, vd.final_vote, vd.vote_executed
            FROM referendums r
            LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id AND vd.dao_id = r.dao_id
            WHERE ${whereClauses.join(' AND ')}
            ORDER BY r.voting_end_date
        `;

        return await db.all(sql, params);
    }

    /**
     * Update voting status (for Mimir integration)
     */
    public static async updateVotingStatus(
        postId: number, 
        chain: Chain,
        daoId: number,
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

        await this.update(postId, chain, daoId, updates);
    }

    /**
     * Check if referendum exists for a specific DAO
     */
    public static async exists(postId: number, chain: Chain, daoId: number): Promise<boolean> {
        const sql = 'SELECT COUNT(*) as count FROM referendums WHERE post_id = ? AND chain = ? AND dao_id = ?';
        const result = await db.get(sql, [postId, chain, daoId]);
        return result.count > 0;
    }

    /**
     * Delete a referendum (cascade will handle related records)
     */
    public static async delete(postId: number, chain: Chain, daoId: number): Promise<void> {
        const sql = 'DELETE FROM referendums WHERE post_id = ? AND chain = ? AND dao_id = ?';
        await db.run(sql, [postId, chain, daoId]);
    }

    /**
     * Get referendums assigned to a specific user, optionally filtered by DAO
     */
    public static async getAssignedToUser(userAddress: string, daoId?: number): Promise<ReferendumWithDetails[]> {
        const whereClauses = ["rtr.team_member_id = ?", "rtr.role_type = 'responsible_person'"];
        const params: any[] = [userAddress];

        if (daoId !== undefined) {
            whereClauses.push('r.dao_id = ?');
            params.push(daoId);
        }

        const sql = `
            SELECT 
                r.*,
                sc.necessity_score, sc.funding_score, sc.competition_score,
                sc.blueprint_score, sc.track_record_score, sc.reports_score,
                sc.synergy_score, sc.revenue_score, sc.security_score,
                sc.open_source_score, sc.ref_score,
                vd.suggested_vote, vd.final_vote, vd.vote_executed, vd.vote_executed_date
            FROM referendums r
            LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id${daoId !== undefined ? ' AND sc.dao_id = ?' : ''}
            LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id${daoId !== undefined ? ' AND vd.dao_id = ?' : ''}
            INNER JOIN referendum_team_roles rtr ON r.id = rtr.referendum_id${daoId !== undefined ? ' AND rtr.dao_id = ?' : ''}
            WHERE ${whereClauses.join(' AND ')}
            ORDER BY r.created_at DESC
        `;

        if (daoId !== undefined) {
            params.push(daoId);
            params.push(daoId);
            params.push(daoId);
        }

        const referendums = await db.all(sql, params);

        // Get team assignments for each referendum
        const results: ReferendumWithDetails[] = [];
        for (const ref of referendums) {
            const assignmentParams = [ref.id];
            if (daoId !== undefined) {
                assignmentParams.push(daoId);
            }

            const assignmentsSql = `
                SELECT rtr.team_member_id as wallet_address, rtr.role_type, rtr.created_at
                FROM referendum_team_roles rtr
                WHERE rtr.referendum_id = ?
                ${daoId !== undefined ? 'AND rtr.dao_id = ?' : ''}
                ORDER BY rtr.created_at DESC
            `;
            
            const assignments = await db.all(assignmentsSql, assignmentParams);
            
            results.push({
                ...ref,
                assigned_to: userAddress, // We know it's assigned to this user
                team_assignments: assignments
            });
        }

        return results;
    }
} 