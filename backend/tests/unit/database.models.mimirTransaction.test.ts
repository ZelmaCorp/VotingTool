import { MimirTransaction } from '../../src/database/models/mimirTransaction';
import { db } from '../../src/database/connection';
import { Chain } from '../../src/types/properties';

// Mock the database connection
jest.mock('../../src/database/connection', () => ({
    db: {
        run: jest.fn(),
        get: jest.fn(),
        all: jest.fn()
    }
}));

describe('MimirTransaction Model - Multi-DAO Support', () => {
    const mockDbRun = db.run as jest.MockedFunction<typeof db.run>;
    const mockDbGet = db.get as jest.MockedFunction<typeof db.get>;
    const mockDbAll = db.all as jest.MockedFunction<typeof db.all>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create()', () => {
        it('should create a Mimir transaction with dao_id', async () => {
            const referendumId = 1;
            const daoId = 1;
            const calldata = '0x1234abcd';
            const timestamp = Date.now();

            mockDbRun.mockResolvedValue({ lastID: 10, changes: 1 } as any);

            const result = await MimirTransaction.create(referendumId, daoId, calldata, timestamp);

            expect(result).toBe(10);
            expect(mockDbRun).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO mimir_transactions'),
                expect.arrayContaining([referendumId, daoId, calldata, timestamp, 'pending'])
            );
        });

        it('should create transactions with custom status', async () => {
            mockDbRun.mockResolvedValue({ lastID: 11, changes: 1 } as any);

            await MimirTransaction.create(1, 1, '0xabcd', Date.now(), 'executed');

            expect(mockDbRun).toHaveBeenCalledWith(
                expect.anything(),
                expect.arrayContaining(['executed'])
            );
        });

        it('should allow multiple DAOs to create transactions for same referendum', async () => {
            const referendumId = 1;
            const calldata = '0x1234';
            const timestamp = Date.now();

            mockDbRun.mockResolvedValue({ lastID: 10, changes: 1 } as any);
            await MimirTransaction.create(referendumId, 1, calldata, timestamp);

            mockDbRun.mockResolvedValue({ lastID: 11, changes: 1 } as any);
            await MimirTransaction.create(referendumId, 2, calldata, timestamp);

            expect(mockDbRun).toHaveBeenCalledTimes(2);
            expect(mockDbRun).toHaveBeenNthCalledWith(1,
                expect.anything(),
                expect.arrayContaining([referendumId, 1, calldata])
            );
            expect(mockDbRun).toHaveBeenNthCalledWith(2,
                expect.anything(),
                expect.arrayContaining([referendumId, 2, calldata])
            );
        });
    });

    describe('getPendingTransactions()', () => {
        it('should get all pending transactions without DAO filter', async () => {
            const mockTransactions = [
                { id: 1, dao_id: 1, post_id: 100, chain: Chain.Polkadot, voted: 'Aye', timestamp: Date.now(), referendum_id: 1 },
                { id: 2, dao_id: 2, post_id: 200, chain: Chain.Kusama, voted: 'Nay', timestamp: Date.now(), referendum_id: 2 }
            ];

            mockDbAll.mockResolvedValue(mockTransactions);

            const result = await MimirTransaction.getPendingTransactions();

            expect(result).toHaveLength(2);
            expect(mockDbAll).toHaveBeenCalledWith(
                expect.stringContaining('WHERE mt.status = ?'),
                ['pending']
            );
            expect(mockDbAll).toHaveBeenCalledWith(
                expect.not.stringContaining('mt.dao_id = ?'),
                expect.anything()
            );
        });

        it('should filter pending transactions by dao_id', async () => {
            const mockTransactions = [
                { id: 1, dao_id: 1, post_id: 100, chain: Chain.Polkadot, voted: 'Aye', timestamp: Date.now(), referendum_id: 1 }
            ];

            mockDbAll.mockResolvedValue(mockTransactions);

            const result = await MimirTransaction.getPendingTransactions(1);

            expect(result).toHaveLength(1);
            expect(result[0].dao_id).toBe(1);
            expect(mockDbAll).toHaveBeenCalledWith(
                expect.stringContaining('mt.dao_id = ?'),
                ['pending', 1]
            );
        });

        it('should properly join with referendums and voting_decisions scoped by dao_id', async () => {
            mockDbAll.mockResolvedValue([]);

            await MimirTransaction.getPendingTransactions(1);

            const call = mockDbAll.mock.calls[0];
            const sql = call[0] as string;

            expect(sql).toContain('JOIN referendums r ON mt.referendum_id = r.id AND r.dao_id = mt.dao_id');
            expect(sql).toContain('LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id AND vd.dao_id = mt.dao_id');
        });
    });

    describe('updateStatus()', () => {
        it('should update transaction status scoped by dao_id', async () => {
            const referendumId = 1;
            const daoId = 1;
            const extrinsicHash = '0xabc123';

            mockDbRun.mockResolvedValue({ lastID: 0, changes: 1 } as any);

            await MimirTransaction.updateStatus(referendumId, daoId, 'executed', extrinsicHash);

            expect(mockDbRun).toHaveBeenCalledWith(
                expect.stringContaining('WHERE referendum_id = ? AND dao_id = ?'),
                ['executed', extrinsicHash, referendumId, daoId]
            );
        });

        it('should only update pending transactions', async () => {
            mockDbRun.mockResolvedValue({ lastID: 0, changes: 1 } as any);

            await MimirTransaction.updateStatus(1, 1, 'executed');

            const call = mockDbRun.mock.calls[0];
            const sql = call[0] as string;
            
            expect(sql).toContain("status = 'pending'");
        });

        it('should not update other DAO\'s transactions', async () => {
            mockDbRun.mockResolvedValue({ lastID: 0, changes: 1 } as any);

            await MimirTransaction.updateStatus(1, 1, 'executed');

            expect(mockDbRun).toHaveBeenCalledWith(
                expect.stringContaining('dao_id = ?'),
                expect.arrayContaining([1])
            );
        });
    });

    describe('deleteByReferendumId()', () => {
        it('should delete transaction scoped by dao_id', async () => {
            const referendumId = 1;
            const daoId = 1;

            mockDbRun.mockResolvedValue({ lastID: 0, changes: 1 } as any);

            await MimirTransaction.deleteByReferendumId(referendumId, daoId);

            expect(mockDbRun).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM mimir_transactions WHERE referendum_id = ? AND dao_id = ?'),
                [referendumId, daoId]
            );
        });

        it('should only delete the specific DAO\'s transaction', async () => {
            mockDbRun.mockResolvedValue({ lastID: 0, changes: 1 } as any);

            await MimirTransaction.deleteByReferendumId(1, 1);

            expect(mockDbRun).toHaveBeenCalledWith(
                expect.stringContaining('dao_id = ?'),
                [1, 1]
            );
        });
    });

    describe('hasPendingTransaction()', () => {
        it('should check for pending transaction scoped by dao_id', async () => {
            mockDbGet.mockResolvedValue({ count: 1 });

            const result = await MimirTransaction.hasPendingTransaction(1, 1);

            expect(result).toBe(true);
            expect(mockDbGet).toHaveBeenCalledWith(
                expect.stringContaining('WHERE referendum_id = ? AND dao_id = ?'),
                [1, 1]
            );
        });

        it('should return false when no pending transaction exists for DAO', async () => {
            mockDbGet.mockResolvedValue({ count: 0 });

            const result = await MimirTransaction.hasPendingTransaction(1, 999);

            expect(result).toBe(false);
        });

        it('should allow different DAOs to have different pending status for same referendum', async () => {
            // DAO 1 has pending transaction
            mockDbGet.mockResolvedValueOnce({ count: 1 });
            const dao1Result = await MimirTransaction.hasPendingTransaction(1, 1);

            // DAO 2 does not have pending transaction
            mockDbGet.mockResolvedValueOnce({ count: 0 });
            const dao2Result = await MimirTransaction.hasPendingTransaction(1, 2);

            expect(dao1Result).toBe(true);
            expect(dao2Result).toBe(false);
        });
    });

    describe('findByPostIdAndChain()', () => {
        it('should find transaction scoped by dao_id', async () => {
            const mockTransaction = {
                id: 1,
                referendum_id: 1,
                dao_id: 1,
                calldata: '0x1234',
                timestamp: Date.now(),
                status: 'pending'
            };

            mockDbGet.mockResolvedValue(mockTransaction);

            const result = await MimirTransaction.findByPostIdAndChain(100, Chain.Polkadot, 1);

            expect(result).toEqual(mockTransaction);
            expect(mockDbGet).toHaveBeenCalledWith(
                expect.stringContaining('WHERE r.post_id = ? AND r.chain = ? AND mt.dao_id = ?'),
                [100, Chain.Polkadot, 1]
            );
        });

        it('should return null if transaction not found for DAO', async () => {
            mockDbGet.mockResolvedValue(null);

            const result = await MimirTransaction.findByPostIdAndChain(100, Chain.Polkadot, 999);

            expect(result).toBeNull();
        });

        it('should properly join with referendums scoped by dao_id', async () => {
            mockDbGet.mockResolvedValue(null);

            await MimirTransaction.findByPostIdAndChain(100, Chain.Polkadot, 1);

            const call = mockDbGet.mock.calls[0];
            const sql = call[0] as string;

            expect(sql).toContain('JOIN referendums r ON mt.referendum_id = r.id AND r.dao_id = mt.dao_id');
        });
    });

    describe('cleanupStaleTransactions()', () => {
        it('should cleanup stale transactions for all DAOs', async () => {
            mockDbRun.mockResolvedValue({ lastID: 0, changes: 3 } as any);

            const result = await MimirTransaction.cleanupStaleTransactions(7);

            expect(result).toBe(3);
            expect(mockDbRun).toHaveBeenCalledWith(
                expect.stringContaining("status = ?"),
                ['pending']
            );
            expect(mockDbRun).toHaveBeenCalledWith(
                expect.not.stringContaining('dao_id = ?'),
                expect.anything()
            );
        });

        it('should cleanup stale transactions for specific DAO', async () => {
            mockDbRun.mockResolvedValue({ lastID: 0, changes: 1 } as any);

            const result = await MimirTransaction.cleanupStaleTransactions(7, 1);

            expect(result).toBe(1);
            expect(mockDbRun).toHaveBeenCalledWith(
                expect.stringContaining('dao_id = ?'),
                ['pending', 1]
            );
        });

        it('should use custom days parameter', async () => {
            mockDbRun.mockResolvedValue({ lastID: 0, changes: 2 } as any);

            await MimirTransaction.cleanupStaleTransactions(14, 1);

            const call = mockDbRun.mock.calls[0];
            const sql = call[0] as string;

            expect(sql).toContain("'-14 days'");
        });
    });

    describe('getStaleTransactionCount()', () => {
        it('should get stale count for all DAOs', async () => {
            mockDbGet.mockResolvedValue({ count: 5 });

            const result = await MimirTransaction.getStaleTransactionCount(7);

            expect(result).toBe(5);
            expect(mockDbGet).toHaveBeenCalledWith(
                expect.not.stringContaining('dao_id = ?'),
                ['pending']
            );
        });

        it('should get stale count for specific DAO', async () => {
            mockDbGet.mockResolvedValue({ count: 2 });

            const result = await MimirTransaction.getStaleTransactionCount(7, 1);

            expect(result).toBe(2);
            expect(mockDbGet).toHaveBeenCalledWith(
                expect.stringContaining('dao_id = ?'),
                ['pending', 1]
            );
        });

        it('should return 0 when count is null', async () => {
            mockDbGet.mockResolvedValue({ count: null });

            const result = await MimirTransaction.getStaleTransactionCount(7);

            expect(result).toBe(0);
        });

        it('should use custom days parameter', async () => {
            mockDbGet.mockResolvedValue({ count: 3 });

            await MimirTransaction.getStaleTransactionCount(30, 1);

            const call = mockDbGet.mock.calls[0];
            const sql = call[0] as string;

            expect(sql).toContain("'-30 days'");
        });
    });
});
