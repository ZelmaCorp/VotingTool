import { MimirTransaction } from '../../src/database/models/mimirTransaction';
import { Chain } from '../../src/types/properties';

// Mock the database connection
jest.mock('../../src/database/connection', () => ({
  db: {
    run: jest.fn(),
    get: jest.fn(),
    all: jest.fn()
  }
}));

import { db } from '../../src/database/connection';
const mockDb = db as jest.Mocked<typeof db>;

describe('MimirTransaction Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should create new Mimir transaction successfully', async () => {
      const referendumId = 123;
      const calldata = '0x1234567890abcdef';
      const timestamp = Date.now();

      mockDb.run.mockResolvedValue({ lastID: 1, changes: 1 } as any);

      const result = await MimirTransaction.create(referendumId, calldata, timestamp);

      expect(result).toBe(1);
      expect(mockDb.run).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO mimir_transactions'),
        [referendumId, calldata, timestamp, 'pending']
      );
    });

    it('should create transaction with custom status', async () => {
      const referendumId = 456;
      const calldata = '0xabcdef1234567890';
      const timestamp = Date.now();
      const status = 'executed';

      mockDb.run.mockResolvedValue({ lastID: 2, changes: 1 } as any);

      const result = await MimirTransaction.create(referendumId, calldata, timestamp, status);

      expect(result).toBe(2);
      expect(mockDb.run).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO mimir_transactions'),
        [referendumId, calldata, timestamp, status]
      );
    });

    it('should propagate database errors', async () => {
      const error = new Error('Database constraint violation');
      mockDb.run.mockRejectedValue(error);

      await expect(MimirTransaction.create(123, '0x123', Date.now())).rejects.toThrow(error);
    });
  });

  describe('getPendingTransactions()', () => {
    it('should return pending transactions with referendum details', async () => {
      const mockTransactions = [
        {
          id: 1,
          post_id: 123,
          chain: Chain.Polkadot,
          voted: '👍 Aye 👍',
          timestamp: 1640995200000,
          referendum_id: 456
        },
        {
          id: 2,
          post_id: 124,
          chain: Chain.Kusama,
          voted: '👎 Nay 👎',
          timestamp: 1641081600000,
          referendum_id: 457
        }
      ];

      mockDb.all.mockResolvedValue(mockTransactions);

      const result = await MimirTransaction.getPendingTransactions();

      expect(result).toEqual(mockTransactions);
      expect(mockDb.all).toHaveBeenCalledWith(
        expect.stringContaining("WHERE mt.status = 'pending'")
      );
    });

    it('should return empty array when no pending transactions', async () => {
      mockDb.all.mockResolvedValue([]);

      const result = await MimirTransaction.getPendingTransactions();

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection error');
      mockDb.all.mockRejectedValue(error);

      await expect(MimirTransaction.getPendingTransactions()).rejects.toThrow(error);
    });
  });

  describe('updateStatus()', () => {
    it('should update transaction status to executed with hash', async () => {
      const referendumId = 123;
      const extrinsicHash = '0xabcdef1234567890';

      mockDb.run.mockResolvedValue({ changes: 1 } as any);

      await MimirTransaction.updateStatus(referendumId, 'executed', extrinsicHash);

      expect(mockDb.run).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE mimir_transactions'),
        ['executed', extrinsicHash, referendumId]
      );
    });

    it('should update transaction status to failed without hash', async () => {
      const referendumId = 456;

      mockDb.run.mockResolvedValue({ changes: 1 } as any);

      await MimirTransaction.updateStatus(referendumId, 'failed');

      expect(mockDb.run).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE mimir_transactions'),
        ['failed', null, referendumId]
      );
    });

    it('should only update pending transactions', async () => {
      mockDb.run.mockResolvedValue({ changes: 1 } as any);

      await MimirTransaction.updateStatus(123, 'executed');

      const [sql] = mockDb.run.mock.calls[0];
      expect(sql).toContain("status = 'pending'");
    });
  });

  describe('deleteByReferendumId()', () => {
    it('should delete transaction by referendum ID', async () => {
      const referendumId = 123;

      mockDb.run.mockResolvedValue({ changes: 1 } as any);

      await MimirTransaction.deleteByReferendumId(referendumId);

      expect(mockDb.run).toHaveBeenCalledWith(
        'DELETE FROM mimir_transactions WHERE referendum_id = ?',
        [referendumId]
      );
    });

    it('should handle case when no transaction exists', async () => {
      mockDb.run.mockResolvedValue({ changes: 0 } as any);

      await expect(MimirTransaction.deleteByReferendumId(999)).resolves.toBeUndefined();
    });
  });

  describe('hasPendingTransaction()', () => {
    it('should return true when referendum has pending transaction', async () => {
      mockDb.get.mockResolvedValue({ count: 1 });

      const result = await MimirTransaction.hasPendingTransaction(123);

      expect(result).toBe(true);
      expect(mockDb.get).toHaveBeenCalledWith(
        expect.stringContaining("WHERE referendum_id = ? AND status = 'pending'"),
        [123]
      );
    });

    it('should return false when referendum has no pending transaction', async () => {
      mockDb.get.mockResolvedValue({ count: 0 });

      const result = await MimirTransaction.hasPendingTransaction(999);

      expect(result).toBe(false);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockDb.get.mockRejectedValue(error);

      await expect(MimirTransaction.hasPendingTransaction(123)).rejects.toThrow(error);
    });
  });

  describe('findByPostIdAndChain()', () => {
    it('should find transaction by post ID and chain', async () => {
      const mockTransaction = {
        id: 1,
        referendum_id: 123,
        calldata: '0x1234567890',
        timestamp: 1640995200000,
        status: 'pending',
        extrinsic_hash: null
      };

      mockDb.get.mockResolvedValue(mockTransaction);

      const result = await MimirTransaction.findByPostIdAndChain(456, Chain.Polkadot);

      expect(result).toEqual(mockTransaction);
      expect(mockDb.get).toHaveBeenCalledWith(
        expect.stringContaining("WHERE r.post_id = ? AND r.chain = ? AND mt.status = 'pending'"),
        [456, Chain.Polkadot]
      );
    });

    it('should return null when transaction not found', async () => {
      mockDb.get.mockResolvedValue(null);

      const result = await MimirTransaction.findByPostIdAndChain(999, Chain.Polkadot);

      expect(result).toBeNull();
    });

    it('should only find pending transactions', async () => {
      mockDb.get.mockResolvedValue(null);

      await MimirTransaction.findByPostIdAndChain(123, Chain.Polkadot);

      const [sql] = mockDb.get.mock.calls[0];
      expect(sql).toContain("mt.status = 'pending'");
    });
  });

  describe('cleanupStaleTransactions()', () => {
    it('should cleanup stale transactions with default days', async () => {
      mockDb.run.mockResolvedValue({ changes: 3 } as any);

      const result = await MimirTransaction.cleanupStaleTransactions();

      expect(result).toBe(3);
      expect(mockDb.run).toHaveBeenCalledWith(
        expect.stringContaining("created_at < datetime('now', '-7 days')")
      );
    });

    it('should cleanup stale transactions with custom days', async () => {
      mockDb.run.mockResolvedValue({ changes: 1 } as any);

      const result = await MimirTransaction.cleanupStaleTransactions(14);

      expect(result).toBe(1);
      expect(mockDb.run).toHaveBeenCalledWith(
        expect.stringContaining("created_at < datetime('now', '-14 days')")
      );
    });

    it('should return 0 when no stale transactions found', async () => {
      mockDb.run.mockResolvedValue({ changes: 0 } as any);

      const result = await MimirTransaction.cleanupStaleTransactions();

      expect(result).toBe(0);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockDb.run.mockRejectedValue(error);

      await expect(MimirTransaction.cleanupStaleTransactions()).rejects.toThrow(error);
    });
  });

  describe('getStaleTransactionCount()', () => {
    it('should return count of stale transactions with default days', async () => {
      mockDb.get.mockResolvedValue({ count: 5 });

      const result = await MimirTransaction.getStaleTransactionCount();

      expect(result).toBe(5);
      expect(mockDb.get).toHaveBeenCalledWith(
        expect.stringContaining("created_at < datetime('now', '-7 days')")
      );
    });

    it('should return count with custom days', async () => {
      mockDb.get.mockResolvedValue({ count: 2 });

      const result = await MimirTransaction.getStaleTransactionCount(30);

      expect(result).toBe(2);
      expect(mockDb.get).toHaveBeenCalledWith(
        expect.stringContaining("created_at < datetime('now', '-30 days')")
      );
    });

    it('should return 0 when no stale transactions', async () => {
      mockDb.get.mockResolvedValue({ count: 0 });

      const result = await MimirTransaction.getStaleTransactionCount();

      expect(result).toBe(0);
    });

    it('should handle null count gracefully', async () => {
      mockDb.get.mockResolvedValue({ count: null });

      const result = await MimirTransaction.getStaleTransactionCount();

      expect(result).toBe(0);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete Mimir transaction lifecycle', async () => {
      const referendumId = 123;
      const calldata = '0x1234567890';
      const timestamp = Date.now();

      // Step 1: Create pending transaction
      mockDb.run.mockResolvedValueOnce({ lastID: 1, changes: 1 } as any);
      await MimirTransaction.create(referendumId, calldata, timestamp);

      // Step 2: Check if pending transaction exists
      mockDb.get.mockResolvedValueOnce({ count: 1 });
      const hasPending = await MimirTransaction.hasPendingTransaction(referendumId);
      expect(hasPending).toBe(true);

      // Step 3: Update status to executed
      mockDb.run.mockResolvedValueOnce({ changes: 1 } as any);
      await MimirTransaction.updateStatus(referendumId, 'executed', '0xhash123');

      expect(mockDb.run).toHaveBeenCalledTimes(2);
      expect(mockDb.get).toHaveBeenCalledTimes(1);
    });

    it('should handle duplicate prevention workflow', async () => {
      const referendumId = 456;

      // Check if already has pending transaction
      mockDb.get.mockResolvedValue({ count: 1 });
      const hasPending = await MimirTransaction.hasPendingTransaction(referendumId);

      if (!hasPending) {
        // Only create if no pending transaction exists
        mockDb.run.mockResolvedValue({ lastID: 2, changes: 1 } as any);
        await MimirTransaction.create(referendumId, '0xdata', Date.now());
      }

      // Should not have called create
      expect(mockDb.run).not.toHaveBeenCalled();
    });
  });
}); 