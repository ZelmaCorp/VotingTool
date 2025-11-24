import { DAO } from '../../src/database/models/dao';
import { DaoConfig, DaoRecord } from '../../src/database/types';
import { db } from '../../src/database/connection';
import { Chain } from '../../src/types/properties';
import * as encryption from '../../src/utils/encryption';
import { MultisigService } from '../../src/services/multisig';
import { DaoService } from '../../src/services/daoService';

// Mock the database connection
jest.mock('../../src/database/connection', () => ({
  db: {
    run: jest.fn(),
    get: jest.fn(),
    all: jest.fn()
  }
}));

// Mock encryption utilities
jest.mock('../../src/utils/encryption', () => ({
  encrypt: jest.fn((plaintext: string) => `encrypted_${plaintext}`),
  decrypt: jest.fn((ciphertext: string) => ciphertext.replace('encrypted_', ''))
}));

// Mock MultisigService
jest.mock('../../src/services/multisig');

describe('DAO Model', () => {
  const mockDb = db as jest.Mocked<typeof db>;
  const mockEncrypt = encryption.encrypt as jest.MockedFunction<typeof encryption.encrypt>;
  const mockDecrypt = encryption.decrypt as jest.MockedFunction<typeof encryption.decrypt>;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementations
    mockEncrypt.mockImplementation((plaintext: string) => `encrypted_${plaintext}`);
    mockDecrypt.mockImplementation((ciphertext: string) => ciphertext.replace('encrypted_', ''));
  });

  describe('create()', () => {
    it('should create DAO with encryption and default status', async () => {
      const config: DaoConfig = {
        name: 'Test DAO',
        description: 'A test DAO',
        polkadot_multisig: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
        proposer_mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
      };

      const mockResult = { lastID: 1, changes: 1 };
      mockDb.run.mockResolvedValue(mockResult as any);

      const result = await DAO.create(config);

      expect(result).toBe(1);
      expect(mockEncrypt).toHaveBeenCalledTimes(2);
      expect(mockDb.run).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO daos'),
        expect.arrayContaining(['Test DAO', 'active'])
      );
    });
  });

  describe('retrieval methods', () => {
    it('should retrieve DAO by ID or return null', async () => {
      const mockDao: DaoRecord = {
        id: 1,
        name: 'Test DAO',
        description: 'Test',
        status: 'active',
        polkadot_multisig_encrypted: 'encrypted_polkadot',
        kusama_multisig_encrypted: 'encrypted_kusama',
        proposer_mnemonic_encrypted: 'encrypted_mnemonic',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      mockDb.get.mockResolvedValue(mockDao);
      const result = await DAO.getById(1);
      expect(result).toEqual(mockDao);

      mockDb.get.mockResolvedValue(undefined);
      const notFound = await DAO.getById(999);
      expect(notFound).toBeNull();
    });
  });

  describe('getAll()', () => {
    it('should retrieve all or active-only DAOs', async () => {
      const mockDaos: DaoRecord[] = [
        {
          id: 1,
          name: 'DAO 1',
          description: null,
          status: 'active',
          polkadot_multisig_encrypted: null,
          kusama_multisig_encrypted: null,
          proposer_mnemonic_encrypted: null,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      mockDb.all.mockResolvedValue(mockDaos);
      const all = await DAO.getAll();
      expect(all).toEqual(mockDaos);

      const active = await DAO.getAll(true);
      expect(active).toEqual(mockDaos);
    });
  });

  describe('update and status changes', () => {
    it('should update fields with auto-encryption', async () => {
      const mockResult = { changes: 1 };
      mockDb.run.mockResolvedValue(mockResult as any);

      await DAO.update(1, { name: 'Updated Name' });
      expect(mockEncrypt).not.toHaveBeenCalled();

      await DAO.update(1, { polkadot_multisig: 'new_address' });
      expect(mockEncrypt).toHaveBeenCalledWith('new_address');
    });

    it('should handle activate/deactivate/delete', async () => {
      const mockResult = { changes: 1 };
      mockDb.run.mockResolvedValue(mockResult as any);

      await DAO.deactivate(1);
      await DAO.activate(1);
      await DAO.delete(1);
      
      expect(mockDb.run).toHaveBeenCalledTimes(3);
    });
  });

  describe('decryption', () => {
    it('should decrypt credentials and handle missing data', async () => {
      const mockDao: DaoRecord = {
        id: 1,
        name: 'Test DAO',
        description: null,
        status: 'active',
        polkadot_multisig_encrypted: 'encrypted_polkadot',
        kusama_multisig_encrypted: 'encrypted_kusama',
        proposer_mnemonic_encrypted: 'encrypted_mnemonic',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      mockDb.get.mockResolvedValue(mockDao);

      const polkadot = await DAO.getDecryptedMultisig(1, Chain.Polkadot);
      expect(polkadot).toBe('polkadot');

      const mnemonic = await DAO.getDecryptedMnemonic(1);
      expect(mnemonic).toBe('mnemonic');

      const all = await DAO.getDecryptedCredentials(1);
      expect(all.polkadot_multisig).toBe('polkadot');
      expect(mockDecrypt).toHaveBeenCalled();
    });

    it('should throw on decryption failure', async () => {
      const mockDao: DaoRecord = {
        id: 1,
        name: 'Test DAO',
        description: null,
        status: 'active',
        polkadot_multisig_encrypted: 'invalid_data',
        kusama_multisig_encrypted: null,
        proposer_mnemonic_encrypted: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      mockDb.get.mockResolvedValue(mockDao);
      mockDecrypt.mockImplementation(() => { throw new Error('Decryption failed'); });

      await expect(DAO.getDecryptedMultisig(1, Chain.Polkadot))
        .rejects.toThrow('Failed to decrypt multisig address');
    });
  });

  describe('stats', () => {
    it('should return DAO statistics with null handling', async () => {
      mockDb.get.mockResolvedValue({
        total_referendums: 10,
        active_referendums: 3,
        voted_referendums: 5,
        ready_to_vote: 2
      });

      const result = await DaoService.getStats(1);
      expect(result.total_referendums).toBe(10);
      
      mockDb.get.mockResolvedValue({ total_referendums: null });
      const empty = await DaoService.getStats(1);
      expect(empty.total_referendums).toBe(0);
    });
  });

  describe('member validation', () => {
    it('should validate multisig members', async () => {
      const mockDao: DaoRecord = {
        id: 1,
        name: 'Test DAO',
        description: null,
        status: 'active',
        polkadot_multisig_encrypted: 'encrypted_multisig',
        kusama_multisig_encrypted: null,
        proposer_mnemonic_encrypted: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      mockDb.get.mockResolvedValue(mockDao);
      
      // Spy on DaoService.isValidMember and mock its return value
      jest.spyOn(DaoService, 'isValidMember').mockResolvedValue(true);

      const isValid = await DaoService.isValidMember(1, '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5', Chain.Polkadot);
      expect(isValid).toBe(true);
    });
  });
});

