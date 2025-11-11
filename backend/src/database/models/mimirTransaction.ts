import { db } from '../connection';
import { MimirTransactionRecord } from '../types';
import { Chain } from '../../types/properties';

export class MimirTransaction {
    
    /**
     * Create a new Mimir transaction record
     */
    public static async create(
        referendumId: number, 
        calldata: string, 
        timestamp: number, 
        status: string = 'pending'
    ): Promise<number> {
        const sql = `
            INSERT INTO mimir_transactions (
                referendum_id, calldata, timestamp, status
            ) VALUES (?, ?, ?, ?)
        `;
        
        const params = [referendumId, calldata, timestamp, status];

        const result = await db.run(sql, params);
        return result.lastID!;
    }

    /**
     * Get all pending Mimir transactions (equivalent to readyProposals)
     */
    public static async getPendingTransactions(): Promise<Array<{
        id: number;
        post_id: number;
        chain: Chain;
        voted: string;
        timestamp: number;
        referendum_id: number;
    }>> {
        const sql = `
            SELECT 
                mt.id,
                r.post_id,
                r.chain,
                vd.suggested_vote as voted,
                mt.timestamp,
                mt.referendum_id
            FROM mimir_transactions mt
            JOIN referendums r ON mt.referendum_id = r.id
            LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id
            WHERE mt.status = 'pending'
            ORDER BY mt.created_at
        `;

        return await db.all(sql);
    }

    /**
     * Update transaction status (when vote is executed on-chain)
     */
    public static async updateStatus(
        referendumId: number, 
        status: 'executed' | 'failed', 
        extrinsicHash?: string
    ): Promise<void> {
        const sql = `
            UPDATE mimir_transactions 
            SET status = ?, extrinsic_hash = ?
            WHERE referendum_id = ? AND status = 'pending'
        `;
        
        await db.run(sql, [status, extrinsicHash || null, referendumId]);
    }

    /**
     * Delete transaction record (when cleaning up)
     */
    public static async deleteByReferendumId(referendumId: number): Promise<void> {
        const sql = `DELETE FROM mimir_transactions WHERE referendum_id = ?`;
        await db.run(sql, [referendumId]);
    }

    /**
     * Check if a referendum already has a pending Mimir transaction
     */
    public static async hasPendingTransaction(referendumId: number): Promise<boolean> {
        const sql = `
            SELECT COUNT(*) as count 
            FROM mimir_transactions 
            WHERE referendum_id = ? AND status = 'pending'
        `;
        const result = await db.get(sql, [referendumId]);
        return result.count > 0;
    }

    /**
     * Find transaction by post_id and chain (for compatibility with existing code)
     */
    public static async findByPostIdAndChain(postId: number, chain: Chain): Promise<{
        id: number;
        referendum_id: number;
        calldata: string;
        timestamp: number;
        status: string;
        extrinsic_hash?: string;
    } | null> {
        const sql = `
            SELECT mt.*
            FROM mimir_transactions mt
            JOIN referendums r ON mt.referendum_id = r.id
            WHERE r.post_id = ? AND r.chain = ? AND mt.status = 'pending'
        `;
        
        return await db.get(sql, [postId, chain]);
    }

    /**
     * Clean up stale pending transactions (e.g., deleted from Mimir)
     * Marks transactions as 'failed' if they're older than the specified days
     */
    public static async cleanupStaleTransactions(olderThanDays: number = 7): Promise<number> {
        const sql = `
            UPDATE mimir_transactions 
            SET status = 'failed'
            WHERE status = 'pending' 
              AND created_at < datetime('now', '-${olderThanDays} days')
        `;
        
        const result = await db.run(sql);
        return result.changes || 0;
    }

    /**
     * Get count of pending transactions older than specified days
     */
    public static async getStaleTransactionCount(olderThanDays: number = 7): Promise<number> {
        const sql = `
            SELECT COUNT(*) as count
            FROM mimir_transactions 
            WHERE status = 'pending' 
              AND created_at < datetime('now', '-${olderThanDays} days')
        `;
        
        const result = await db.get(sql);
        return result.count || 0;
    }
} 