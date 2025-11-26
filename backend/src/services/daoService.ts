import { DAO } from '../database/models/dao';
import { DaoRecord, DaoSafeInfo, DaoStats } from '../database/types';
import { Chain } from '../types/properties';
import { MultisigService, MultisigMember, MultisigInfo } from './multisig';
import { db } from '../database/connection';
import { createSubsystemLogger } from '../config/logger';
import { Subsystem } from '../types/logging';

const logger = createSubsystemLogger(Subsystem.DATABASE);

/**
 * DaoService - Business logic layer for DAO operations
 * 
 * This service layer sits between routes and the data access layer,
 * handling complex operations that involve multiple data sources,
 * external services, or business logic.
 */
export class DaoService {
    private static multisigService = new MultisigService();

    /**
     * Get multisig members from on-chain (via MultisigService)
     */
    public static async getMembers(id: number, chain: Chain): Promise<MultisigMember[]> {
        const multisigAddress = await DAO.getDecryptedMultisig(id, chain);
        if (!multisigAddress) {
            logger.warn({ daoId: id, chain }, 'No multisig address configured for this chain');
            return [];
        }
        
        const network = chain === Chain.Polkadot ? 'Polkadot' : 'Kusama';
        const members = await this.multisigService.getCachedTeamMembers(multisigAddress, network as "Polkadot" | "Kusama");
        
        logger.debug({ daoId: id, chain, memberCount: members.length }, 'Retrieved multisig members');
        return members;
    }

    /**
     * Get multisig info including members and threshold
     */
    public static async getMultisigInfo(id: number, chain: Chain): Promise<MultisigInfo | null> {
        const multisigAddress = await DAO.getDecryptedMultisig(id, chain);
        if (!multisigAddress) {
            logger.warn({ daoId: id, chain }, 'No multisig address configured for this chain');
            return null;
        }
        
        const network = chain === Chain.Polkadot ? 'Polkadot' : 'Kusama';
        const info = await this.multisigService.getMultisigInfo(multisigAddress, network as "Polkadot" | "Kusama");
        
        logger.debug({ daoId: id, chain, threshold: info.threshold, memberCount: info.members.length }, 
            'Retrieved multisig info');
        return info;
    }

    /**
     * Check if a wallet address is a member of the DAO's multisig
     */
    public static async isValidMember(id: number, walletAddress: string, chain: Chain): Promise<boolean> {
        const multisigAddress = await DAO.getDecryptedMultisig(id, chain);
        if (!multisigAddress) {
            logger.warn({ daoId: id, chain }, 'No multisig address configured');
            return false;
        }
        
        const network = chain === Chain.Polkadot ? 'Polkadot' : 'Kusama';
        
        // Get all members first to log them
        const members = await this.multisigService.getCachedTeamMembers(multisigAddress, network as "Polkadot" | "Kusama");
        
        logger.info({ 
            daoId: id, 
            walletAddress, 
            chain,
            multisigAddress,
            cachedMemberCount: members.length,
            cachedMemberAddresses: members.map(m => m.wallet_address).slice(0, 3), // Show first 3
            sampleMemberNames: members.map(m => m.team_member_name).slice(0, 3)
        }, 'Checking multisig membership with cached data');
        
        const isMember = await this.multisigService.isTeamMember(walletAddress, multisigAddress, network as "Polkadot" | "Kusama");
        
        logger.info({ 
            daoId: id, 
            walletAddress, 
            chain, 
            isMember,
            multisigAddress 
        }, isMember ? 'Membership confirmed' : 'Membership check failed');
        
        return isMember;
    }

    /**
     * Refresh the multisig members cache
     */
    public static async refreshMembersCache(id: number, chain: Chain): Promise<void> {
        const multisigAddress = await DAO.getDecryptedMultisig(id, chain);
        if (!multisigAddress) {
            logger.warn({ daoId: id, chain }, 'No multisig address configured');
            return;
        }
        
        // Force a fresh fetch by getting members (which will update the cache)
        const network = chain === Chain.Polkadot ? 'Polkadot' : 'Kusama';
        await this.multisigService.getCachedTeamMembers(multisigAddress, network as "Polkadot" | "Kusama");
        
        logger.info({ daoId: id, chain }, 'Refreshed multisig members cache');
    }

    /**
     * Find DAO by multisig address
     * @param multisigAddress - The multisig address to search for
     * @param chain - The chain (Polkadot or Kusama)
     * @returns DAO record or null if not found
     */
    public static async findByMultisig(multisigAddress: string, chain: Chain): Promise<DaoRecord | null> {
        // Get all active DAOs
        const daos = await DAO.getAll(true);
        
        // Check each DAO's decrypted multisig
        for (const dao of daos) {
            const decryptedMultisig = await DAO.getDecryptedMultisig(dao.id, chain);
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
        const allDaos = await DAO.getAll(true); // Only active DAOs
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
    public static async getStats(id: number): Promise<DaoStats> {
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

    /**
     * Get safe DAO info (without sensitive fields like mnemonic)
     * Returns public information suitable for authenticated users
     * Aggregates data from multiple sources
     */
    public static async getSafeInfo(id: number): Promise<DaoSafeInfo | null> {
        const dao = await DAO.getById(id);
        if (!dao) {
            return null;
        }
        
        // Get decrypted multisig addresses (public on-chain data)
        const polkadotMultisig = dao.polkadot_multisig_encrypted 
            ? await DAO.getDecryptedMultisig(id, Chain.Polkadot)
            : null;
        const kusamaMultisig = dao.kusama_multisig_encrypted 
            ? await DAO.getDecryptedMultisig(id, Chain.Kusama)
            : null;
        
        // Determine which chains are configured
        const chains: Chain[] = [];
        if (polkadotMultisig) {
            chains.push(Chain.Polkadot);
        }
        if (kusamaMultisig) {
            chains.push(Chain.Kusama);
        }
        
        // Get member counts for each chain
        const polkadotMembers = polkadotMultisig 
            ? await this.getMembers(id, Chain.Polkadot) 
            : [];
        const kusamaMembers = kusamaMultisig 
            ? await this.getMembers(id, Chain.Kusama) 
            : [];
        
        // Get stats
        const stats = await this.getStats(id);
        
        return {
            id: dao.id,
            name: dao.name,
            description: dao.description,
            status: dao.status,
            created_at: dao.created_at,
            updated_at: dao.updated_at,
            chains,
            multisig_addresses: {
                polkadot: polkadotMultisig,
                kusama: kusamaMultisig
            },
            member_counts: {
                polkadot: polkadotMembers.length,
                kusama: kusamaMembers.length
            },
            stats
        };
    }
}

