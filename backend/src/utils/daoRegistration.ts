import { signatureVerify } from '@polkadot/util-crypto';
import { hexToU8a } from '@polkadot/util';
import { multisigService } from '../services/multisig';
import { DAO } from '../database/models/dao';
import { Chain } from '../types/properties';
import { createSubsystemLogger, formatError } from '../config/logger';
import { Subsystem } from '../types/logging';

const logger = createSubsystemLogger(Subsystem.APP);

/**
 * Generate a BIP39 mnemonic phrase (24 words)
 */
export const generateMnemonic = (): string => {
  const { mnemonicGenerate } = require('@polkadot/util-crypto');
  return mnemonicGenerate(24);
};

/**
 * Verify wallet signature
 */
export const verifySignature = (address: string, message: string, signature: string): boolean => {
  try {
    const signatureU8a = hexToU8a(signature);
    const result = signatureVerify(message, signatureU8a, address);
    return result.isValid;
  } catch (error) {
    logger.error({ error: formatError(error), address }, 'Signature verification failed');
    return false;
  }
};

/**
 * Validate registration input
 */
export const validateRegistrationInput = (data: any): string[] => {
  const errors: string[] = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('DAO name is required');
  }
  if (data.name && data.name.length > 100) {
    errors.push('DAO name must be less than 100 characters');
  }
  if (!data.polkadotMultisig && !data.kusamaMultisig) {
    errors.push('At least one multisig address (Polkadot or Kusama) is required');
  }
  if (!data.walletAddress || typeof data.walletAddress !== 'string') {
    errors.push('Wallet address is required');
  }
  if (!data.signature || typeof data.signature !== 'string') {
    errors.push('Signature is required for verification');
  }
  if (!data.message || typeof data.message !== 'string') {
    errors.push('Message is required for verification');
  }
  
  return errors;
};

/**
 * Verify multisig and membership on-chain
 */
export const verifyMultisigMembership = async (
  multisigAddress: string | null, 
  walletAddress: string, 
  chain: Chain
): Promise<{ isVerified: boolean; error?: string }> => {
  if (!multisigAddress) {
    return { isVerified: false };
  }
  
  try {
    const multisigInfo = await multisigService.getMultisigInfo(multisigAddress, chain);
    if (!multisigInfo || !multisigInfo.members || multisigInfo.members.length === 0) {
      return { isVerified: false, error: `${chain} multisig address not found on-chain or has no members` };
    }
    
    const isMember = await multisigService.isTeamMember(walletAddress, multisigAddress, chain);
    if (!isMember) {
      return { isVerified: false, error: `Your wallet address is not a member of the ${chain} multisig` };
    }
    
    return { isVerified: true };
  } catch (error) {
    logger.error({ error: formatError(error), multisig: multisigAddress, chain }, 'Error verifying multisig');
    return { isVerified: false, error: `Failed to verify ${chain} multisig on-chain. Please check the address.` };
  }
};

/**
 * Verify all multisigs and return verified chains
 */
export const performMultisigVerifications = async (
  polkadotMultisig: string | null,
  kusamaMultisig: string | null,
  walletAddress: string
): Promise<{ success: boolean; chains?: Chain[]; errors?: string[] }> => {
  const verificationResults = await Promise.all([
    verifyMultisigMembership(polkadotMultisig, walletAddress, Chain.Polkadot),
    verifyMultisigMembership(kusamaMultisig, walletAddress, Chain.Kusama)
  ]);
  
  const errors = verificationResults.filter(r => r.error).map(r => r.error!);
  if (errors.length > 0) {
    return { success: false, errors };
  }
  
  const chains = verificationResults
    .map((r, i) => r.isVerified ? (i === 0 ? Chain.Polkadot : Chain.Kusama) : null)
    .filter(Boolean) as Chain[];
  
  if (chains.length === 0) {
    return { success: false, errors: ['You must be a member of at least one of the provided multisigs'] };
  }
  
  return { success: true, chains };
};

/**
 * Create DAO from registration data
 */
export const createDaoFromRegistration = async (
  name: string,
  description: string | undefined,
  polkadotMultisig: string | null,
  kusamaMultisig: string | null
): Promise<number> => {
  return await DAO.create({
    name: name.trim(),
    description: description?.trim() || undefined,
    polkadot_multisig: polkadotMultisig || undefined,
    kusama_multisig: kusamaMultisig || undefined,
    proposer_mnemonic: generateMnemonic(),
    status: 'active'
  });
};

