import { db } from '../connection';
import { VotingRecord } from '../types';

export class VotingDecision {
    
    /**
     * Create or update a voting decision for a referendum
     */
    public static async upsert(referendumId: number, data: Partial<VotingRecord>): Promise<number> {
        // Check if voting decision already exists
        const existing = await this.getByReferendumId(referendumId);
        
        if (existing) {
            // Update existing record
            const sql = `
                UPDATE voting_decisions 
                SET suggested_vote = ?, final_vote = ?, vote_executed = ?, vote_executed_date = ?, updated_at = datetime('now')
                WHERE referendum_id = ?
            `;
            
            const params = [
                data.suggested_vote || existing.suggested_vote,
                data.final_vote || existing.final_vote,
                data.vote_executed !== undefined ? data.vote_executed : existing.vote_executed,
                data.vote_executed_date || existing.vote_executed_date,
                referendumId
            ];

            await db.run(sql, params);
            return existing.id!;
        } else {
            // Create new record
            const sql = `
                INSERT INTO voting_decisions (
                    referendum_id, suggested_vote, final_vote, vote_executed, vote_executed_date, created_at
                ) VALUES (?, ?, ?, ?, ?, datetime('now'))
            `;
            
            const params = [
                referendumId,
                data.suggested_vote || null,
                data.final_vote || null,
                data.vote_executed || false,
                data.vote_executed_date || null
            ];

            const result = await db.run(sql, params);
            return result.lastID!;
        }
    }

    /**
     * Get voting decision by referendum ID
     */
    public static async getByReferendumId(referendumId: number): Promise<VotingRecord | null> {
        const sql = `SELECT * FROM voting_decisions WHERE referendum_id = ?`;
        return await db.get(sql, [referendumId]);
    }

    /**
     * Delete voting decision by referendum ID
     */
    public static async deleteByReferendumId(referendumId: number): Promise<void> {
        const sql = `DELETE FROM voting_decisions WHERE referendum_id = ?`;
        await db.run(sql, [referendumId]);
    }
} 