import { db } from '../connection';
import { MimirTransactionRecord } from '../types';
import { Chain } from '../../types/properties';

export class MimirTransaction {
    
    /**
     * Create a new Mimir transaction record
     */
    public static async create(
        referendumId: number,
        daoId: number,
        calldata: string, 
        timestamp: number, 
        status: string = 'pending'
    ): Promise<number> {
        const sql = `
            INSERT INTO mimir_transactions (
                referendum_id, dao_id, calldata, timestamp, status
            ) VALUES (?, ?, ?, ?, ?)
        `;
        
        const params = [referendumId, daoId, calldata, timestamp, status];

        const result = await db.run(sql, params);
        return result.lastID!;
    }

    /**
     * Get all pending Mimir transactions, optionally filtered by DAO
     */
    public static async getPendingTransactions(daoId?: number): Promise<Array<{
        id: number;
        post_id: number;
        chain: Chain;
        voted: string;
        timestamp: number;
        referendum_id: number;
        dao_id: number;
    }>> {
        const whereClauses = ['mt.status = ?'];
        const params: any[] = ['pending'];

        if (daoId !== undefined) {
            whereClauses.push('mt.dao_id = ?');
            params.push(daoId);
        }

        const sql = `
            SELECT 
                mt.id,
                r.post_id,
                r.chain,
                vd.suggested_vote as voted,
                mt.timestamp,
                mt.referendum_id,
                mt.dao_id
            FROM mimir_transactions mt
            JOIN referendums r ON mt.referendum_id = r.id AND r.dao_id = mt.dao_id
            LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id AND vd.dao_id = mt.dao_id
            WHERE ${whereClauses.join(' AND ')}
            ORDER BY mt.created_at
        `;

        return await db.all(sql, params);
    }

    /**
     * Update transaction status (when vote is executed on-chain), scoped by DAO
     */
    public static async updateStatus(
        referendumId: number,
        daoId: number,
        status: 'executed' | 'failed', 
        extrinsicHash?: string
    ): Promise<void> {
        const sql = `
            UPDATE mimir_transactions 
            SET status = ?, extrinsic_hash = ?
            WHERE referendum_id = ? AND dao_id = ? AND status = 'pending'
        `;
        
        await db.run(sql, [status, extrinsicHash || null, referendumId, daoId]);
    }

    /**
     * Delete transaction record (when cleaning up), scoped by DAO
     */
    public static async deleteByReferendumId(referendumId: number, daoId: number): Promise<void> {
        const sql = `DELETE FROM mimir_transactions WHERE referendum_id = ? AND dao_id = ?`;
        await db.run(sql, [referendumId, daoId]);
    }

    /**
     * Check if a referendum already has a pending Mimir transaction, scoped by DAO
     */
    public static async hasPendingTransaction(referendumId: number, daoId: number): Promise<boolean> {
        const sql = `
            SELECT COUNT(*) as count 
            FROM mimir_transactions 
            WHERE referendum_id = ? AND dao_id = ? AND status = 'pending'
        `;
        const result = await db.get(sql, [referendumId, daoId]);
        return result.count > 0;
    }

    /**
     * Find transaction by post_id, chain, and daoId
     */
    public static async findByPostIdAndChain(postId: number, chain: Chain, daoId: number): Promise<{
        id: number;
        referendum_id: number;
        dao_id: number;
        calldata: string;
        timestamp: number;
        status: string;
        extrinsic_hash?: string;
    } | null> {
        const sql = `
            SELECT mt.*
            FROM mimir_transactions mt
            JOIN referendums r ON mt.referendum_id = r.id AND r.dao_id = mt.dao_id
            WHERE r.post_id = ? AND r.chain = ? AND mt.dao_id = ? AND mt.status = 'pending'
        `;
        
        return await db.get(sql, [postId, chain, daoId]);
    }

    /**
     * Clean up stale pending transactions (e.g., deleted from Mimir)
     * Marks transactions as 'failed' if they're older than the specified days
     * Optionally filtered by DAO
     */
    public static async cleanupStaleTransactions(olderThanDays: number = 7, daoId?: number): Promise<number> {
        const whereClauses = [
            'status = ?',
            `created_at < datetime('now', '-${olderThanDays} days')`
        ];
        const params: any[] = ['pending'];

        if (daoId !== undefined) {
            whereClauses.push('dao_id = ?');
            params.push(daoId);
        }

        const sql = `
            UPDATE mimir_transactions 
            SET status = 'failed'
            WHERE ${whereClauses.join(' AND ')}
        `;
        
        const result = await db.run(sql, params);
        return result.changes || 0;
    }

    /**
     * Get count of pending transactions older than specified days
     * Optionally filtered by DAO
     */
    public static async getStaleTransactionCount(olderThanDays: number = 7, daoId?: number): Promise<number> {
        const whereClauses = [
            'status = ?',
            `created_at < datetime('now', '-${olderThanDays} days')`
        ];
        const params: any[] = ['pending'];

        if (daoId !== undefined) {
            whereClauses.push('dao_id = ?');
            params.push(daoId);
        }

        const sql = `
            SELECT COUNT(*) as count
            FROM mimir_transactions 
            WHERE ${whereClauses.join(' AND ')}
        `;
        
        const result = await db.get(sql, params);
        return result.count || 0;
    }
} 