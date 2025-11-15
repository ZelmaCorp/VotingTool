import { db } from '../connection';
import { encrypt, decrypt } from '../../utils/encryption';
import { Chain } from '../../types/properties';
import { MultisigService, MultisigMember, MultisigInfo } from '../../services/multisig';
import { createSubsystemLogger } from '../../config/logger';
import { Subsystem } from '../../types/logging';

const logger = createSubsystemLogger(Subsystem.DATABASE);

/**
 * DAO configuration data (unencrypted)
 */
export interface DaoConfig {
    name: string;
    description?: string;
    status?: 'active' | 'inactive' | 'suspended';
    polkadot_multisig?: string;  // Unencrypted - will be encrypted before storage
    kusama_multisig?: string;    // Unencrypted - will be encrypted before storage
    proposer_mnemonic?: string;  // Unencrypted - will be encrypted before storage
}

/**
 * DAO record from database (encrypted credentials)
 */
export interface DaoRecord {
    id: number;
    name: string;
    description: string | null;
    status: 'active' | 'inactive' | 'suspended';
    polkadot_multisig_encrypted: string | null;
    kusama_multisig_encrypted: string | null;
    proposer_mnemonic_encrypted: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * DAO class for managing multiple DAOs
 * 
 * Each DAO has:
 * - Encrypted multisig addresses (Polkadot & Kusama)
 * - Encrypted proposer mnemonic
 * - Status (active/inactive/suspended)
 * - Team members (fetched from on-chain multisig via MultisigService)
 * 
 * Authentication is wallet-based:
 * - Users sign messages with their wallet
 * - Backend verifies they are in the DAO's multisig
 * - No DAO-level API keys
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
    
    /**
     * Get multisig members from on-chain (via MultisigService)
     */
    public static async getMembers(id: number, chain: Chain): Promise<MultisigMember[]> {
        const multisigAddress = await this.getDecryptedMultisig(id, chain);
        if (!multisigAddress) {
            logger.warn({ daoId: id, chain }, 'No multisig address configured for this chain');
            return [];
        }
        
        const network = chain === Chain.Polkadot ? 'Polkadot' : 'Kusama';
        const multisigService = new MultisigService();
        const members = await multisigService.getCachedTeamMembers(multisigAddress, network as "Polkadot" | "Kusama");
        
        logger.debug({ daoId: id, chain, memberCount: members.length }, 'Retrieved multisig members');
        return members;
    }
    
    /**
     * Get multisig info including members and threshold
     */
    public static async getMultisigInfo(id: number, chain: Chain): Promise<MultisigInfo | null> {
        const multisigAddress = await this.getDecryptedMultisig(id, chain);
        if (!multisigAddress) {
            logger.warn({ daoId: id, chain }, 'No multisig address configured for this chain');
            return null;
        }
        
        const network = chain === Chain.Polkadot ? 'Polkadot' : 'Kusama';
        const multisigService = new MultisigService();
        const info = await multisigService.getMultisigInfo(multisigAddress, network as "Polkadot" | "Kusama");
        
        logger.debug({ daoId: id, chain, threshold: info.threshold, memberCount: info.members.length }, 
            'Retrieved multisig info');
        return info;
    }
    
    /**
     * Check if a wallet address is a member of the DAO's multisig
     */
    public static async isValidMember(id: number, walletAddress: string, chain: Chain): Promise<boolean> {
        const multisigAddress = await this.getDecryptedMultisig(id, chain);
        if (!multisigAddress) {
            logger.warn({ daoId: id, chain }, 'No multisig address configured');
            return false;
        }
        
        const network = chain === Chain.Polkadot ? 'Polkadot' : 'Kusama';
        const multisigService = new MultisigService();
        const isMember = await multisigService.isTeamMember(walletAddress, multisigAddress, network as "Polkadot" | "Kusama");
        
        logger.debug({ daoId: id, walletAddress, chain, isMember }, 'Checked multisig membership');
        return isMember;
    }
    
    /**
     * Refresh the multisig members cache
     */
    public static async refreshMembersCache(id: number, chain: Chain): Promise<void> {
        const multisigAddress = await this.getDecryptedMultisig(id, chain);
        if (!multisigAddress) {
            logger.warn({ daoId: id, chain }, 'No multisig address configured');
            return;
        }
        
        // Force a fresh fetch by getting members (which will update the cache)
        const network = chain === Chain.Polkadot ? 'Polkadot' : 'Kusama';
        const multisigService = new MultisigService();
        await multisigService.getCachedTeamMembers(multisigAddress, network as "Polkadot" | "Kusama");
        
        logger.info({ daoId: id, chain }, 'Refreshed multisig members cache');
    }
    
    /**
     * Find DAO by multisig address
     * @param multisigAddress - The multisig address to search for
     * @param chain - The chain (Polkadot or Kusama)
     * @returns DAO record or null if not found
     */
    public static async findByMultisig(multisigAddress: string, chain: Chain): Promise<DaoRecord | null> {
        const fieldName = chain === Chain.Polkadot 
            ? 'polkadot_multisig_encrypted' 
            : 'kusama_multisig_encrypted';
        
        // Get all active DAOs
        const daos = await this.getAll(true);
        
        // Check each DAO's decrypted multisig
        for (const dao of daos) {
            const decryptedMultisig = await this.getDecryptedMultisig(dao.id, chain);
            if (decryptedMultisig && decryptedMultisig.toLowerCase() === multisigAddress.toLowerCase()) {
                return dao;
            }
        }
        
        logger.debug({ multisigAddress, chain }, 'No DAO found for multisig address');
        return null;
    }
    
    /**
     * Find all DAOs that a wallet address is a member of
     * Useful for determining which DAOs a user can access
     */
    public static async findDaosForWallet(walletAddress: string, chain: Chain): Promise<DaoRecord[]> {
        const allDaos = await this.getAll(true); // Only active DAOs
        const memberDaos: DaoRecord[] = [];
        
        for (const dao of allDaos) {
            const isMember = await this.isValidMember(dao.id, walletAddress, chain);
            if (isMember) {
                memberDaos.push(dao);
            }
        }
        
        logger.info({ walletAddress, chain, daoCount: memberDaos.length }, 
            'Found DAOs for wallet');
        return memberDaos;
    }
    
    /**
     * Get DAO statistics
     */
    public static async getStats(id: number): Promise<{
        total_referendums: number;
        active_referendums: number;
        voted_referendums: number;
        ready_to_vote: number;
    }> {
        const stats = await db.get(`
            SELECT 
                COUNT(*) as total_referendums,
                SUM(CASE WHEN internal_status NOT IN ('Voted Aye', 'Voted Nay', 'Voted Abstain', 'Not Voted') THEN 1 ELSE 0 END) as active_referendums,
                SUM(CASE WHEN internal_status IN ('Voted Aye', 'Voted Nay', 'Voted Abstain') THEN 1 ELSE 0 END) as voted_referendums,
                SUM(CASE WHEN internal_status = 'Ready to vote' THEN 1 ELSE 0 END) as ready_to_vote
            FROM referendums
            WHERE dao_id = ?
        `, [id]) as any;
        
        return {
            total_referendums: stats.total_referendums || 0,
            active_referendums: stats.active_referendums || 0,
            voted_referendums: stats.voted_referendums || 0,
            ready_to_vote: stats.ready_to_vote || 0
        };
    }
}

