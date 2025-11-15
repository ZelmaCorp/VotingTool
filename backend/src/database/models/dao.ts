import { db } from '../connection';
import { encrypt, decrypt } from '../../utils/encryption';
import { Chain } from '../../types/properties';
import { createSubsystemLogger } from '../../config/logger';
import { Subsystem } from '../../types/logging';
import { DaoConfig, DaoRecord } from '../types';

const logger = createSubsystemLogger(Subsystem.DATABASE);

/**
 * DAO Model - Data Access Layer
 * 
 * Handles database operations for DAO records:
 * - CRUD operations
 * - Encryption/decryption of sensitive fields
 * - Basic data retrieval
 * 
 * For business logic (membership checks, stats, aggregations),
 * see services/daoService.ts
 */
export class DAO {
    
    /**
     * Create a new DAO
     * Encrypts sensitive credentials before storage
     */
    public static async create(config: DaoConfig): Promise<number> {
        logger.info({ name: config.name }, 'Creating new DAO');
        
        // Encrypt sensitive data
        const polkadotEncrypted = config.polkadot_multisig 
            ? encrypt(config.polkadot_multisig) 
            : null;
        const kusamaEncrypted = config.kusama_multisig 
            ? encrypt(config.kusama_multisig) 
            : null;
        const mnemonicEncrypted = config.proposer_mnemonic 
            ? encrypt(config.proposer_mnemonic) 
            : null;
        
        const sql = `
            INSERT INTO daos (
                name,
                description,
                status,
                polkadot_multisig_encrypted,
                kusama_multisig_encrypted,
                proposer_mnemonic_encrypted
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            config.name,
            config.description || null,
            config.status || 'active',
            polkadotEncrypted,
            kusamaEncrypted,
            mnemonicEncrypted
        ];
        
        const result = await db.run(sql, params);
        const daoId = result.lastID!;
        
        logger.info({ daoId, name: config.name }, 'DAO created successfully');
        return daoId;
    }
    
    /**
     * Get a DAO by ID
     */
    public static async getById(id: number): Promise<DaoRecord | null> {
        const sql = `SELECT * FROM daos WHERE id = ?`;
        const dao = await db.get(sql, [id]) as DaoRecord | undefined;
        return dao || null;
    }
    
    /**
     * Get a DAO by name
     */
    public static async getByName(name: string): Promise<DaoRecord | null> {
        const sql = `SELECT * FROM daos WHERE name = ?`;
        const dao = await db.get(sql, [name]) as DaoRecord | undefined;
        return dao || null;
    }
    
    /**
     * Get all DAOs
     * @param activeOnly - If true, only return active DAOs
     */
    public static async getAll(activeOnly: boolean = false): Promise<DaoRecord[]> {
        const sql = activeOnly
            ? `SELECT * FROM daos WHERE status = 'active' ORDER BY created_at DESC`
            : `SELECT * FROM daos ORDER BY created_at DESC`;
        
        const daos = await db.all(sql) as DaoRecord[];
        return daos;
    }
    
    /**
     * Update a DAO
     * Encrypts sensitive fields if they are being updated
     */
    public static async update(id: number, updates: Partial<DaoConfig>): Promise<void> {
        logger.info({ daoId: id, updates: Object.keys(updates) }, 'Updating DAO');
        
        const fields: string[] = [];
        const params: any[] = [];
        
        // Handle non-encrypted fields
        if (updates.name !== undefined) {
            fields.push('name = ?');
            params.push(updates.name);
        }
        if (updates.description !== undefined) {
            fields.push('description = ?');
            params.push(updates.description);
        }
        if (updates.status !== undefined) {
            fields.push('status = ?');
            params.push(updates.status);
        }
        
        // Handle encrypted fields
        if (updates.polkadot_multisig !== undefined) {
            fields.push('polkadot_multisig_encrypted = ?');
            params.push(updates.polkadot_multisig ? encrypt(updates.polkadot_multisig) : null);
        }
        if (updates.kusama_multisig !== undefined) {
            fields.push('kusama_multisig_encrypted = ?');
            params.push(updates.kusama_multisig ? encrypt(updates.kusama_multisig) : null);
        }
        if (updates.proposer_mnemonic !== undefined) {
            fields.push('proposer_mnemonic_encrypted = ?');
            params.push(updates.proposer_mnemonic ? encrypt(updates.proposer_mnemonic) : null);
        }
        
        if (fields.length === 0) {
            logger.warn({ daoId: id }, 'No fields to update');
            return;
        }
        
        // Add updated_at
        fields.push('updated_at = datetime(\'now\')');
        
        const sql = `UPDATE daos SET ${fields.join(', ')} WHERE id = ?`;
        params.push(id);
        
        await db.run(sql, params);
        logger.info({ daoId: id }, 'DAO updated successfully');
    }
    
    /**
     * Deactivate a DAO (soft delete)
     */
    public static async deactivate(id: number): Promise<void> {
        logger.info({ daoId: id }, 'Deactivating DAO');
        const sql = `UPDATE daos SET status = 'inactive', updated_at = datetime('now') WHERE id = ?`;
        await db.run(sql, [id]);
        logger.info({ daoId: id }, 'DAO deactivated');
    }
    
    /**
     * Activate a DAO
     */
    public static async activate(id: number): Promise<void> {
        logger.info({ daoId: id }, 'Activating DAO');
        const sql = `UPDATE daos SET status = 'active', updated_at = datetime('now') WHERE id = ?`;
        await db.run(sql, [id]);
        logger.info({ daoId: id }, 'DAO activated');
    }
    
    /**
     * Delete a DAO permanently
     * Warning: This will cascade delete all related data!
     */
    public static async delete(id: number): Promise<void> {
        logger.warn({ daoId: id }, 'Permanently deleting DAO and all related data');
        const sql = `DELETE FROM daos WHERE id = ?`;
        await db.run(sql, [id]);
        logger.warn({ daoId: id }, 'DAO permanently deleted');
    }
    
    /**
     * Get decrypted multisig address for a chain
     */
    public static async getDecryptedMultisig(id: number, chain: Chain): Promise<string | null> {
        const dao = await this.getById(id);
        if (!dao) {
            throw new Error(`DAO ${id} not found`);
        }
        
        const encryptedField = chain === Chain.Polkadot 
            ? dao.polkadot_multisig_encrypted 
            : dao.kusama_multisig_encrypted;
        
        if (!encryptedField) {
            return null;
        }
        
        try {
            return decrypt(encryptedField);
        } catch (error) {
            logger.error({ error, daoId: id, chain }, 'Failed to decrypt multisig address');
            throw new Error(`Failed to decrypt multisig address for DAO ${id} on ${chain}`);
        }
    }
    
    /**
     * Get decrypted proposer mnemonic
     */
    public static async getDecryptedMnemonic(id: number): Promise<string | null> {
        const dao = await this.getById(id);
        if (!dao) {
            throw new Error(`DAO ${id} not found`);
        }
        
        if (!dao.proposer_mnemonic_encrypted) {
            return null;
        }
        
        try {
            return decrypt(dao.proposer_mnemonic_encrypted);
        } catch (error) {
            logger.error({ error, daoId: id }, 'Failed to decrypt proposer mnemonic');
            throw new Error(`Failed to decrypt proposer mnemonic for DAO ${id}`);
        }
    }
    
    /**
     * Get all decrypted credentials for a DAO
     */
    public static async getDecryptedCredentials(id: number): Promise<{
        polkadot_multisig: string | null;
        kusama_multisig: string | null;
        proposer_mnemonic: string | null;
    }> {
        const dao = await this.getById(id);
        if (!dao) {
            throw new Error(`DAO ${id} not found`);
        }
        
        return {
            polkadot_multisig: dao.polkadot_multisig_encrypted 
                ? decrypt(dao.polkadot_multisig_encrypted) 
                : null,
            kusama_multisig: dao.kusama_multisig_encrypted 
                ? decrypt(dao.kusama_multisig_encrypted) 
                : null,
            proposer_mnemonic: dao.proposer_mnemonic_encrypted 
                ? decrypt(dao.proposer_mnemonic_encrypted) 
                : null
        };
    }
}

