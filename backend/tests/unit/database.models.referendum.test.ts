import { Referendum } from '../../src/database/models/referendum';
import { db } from '../../src/database/connection';
import { Chain, InternalStatus } from '../../src/types/properties';
import { ReferendumRecord } from '../../src/database/types';

// Mock the database connection
jest.mock('../../src/database/connection', () => ({
    db: {
        run: jest.fn(),
        get: jest.fn(),
        all: jest.fn()
    }
}));

describe('Referendum Model - Multi-DAO Support', () => {
    const mockDbRun = db.run as jest.MockedFunction<typeof db.run>;
    const mockDbGet = db.get as jest.MockedFunction<typeof db.get>;
    const mockDbAll = db.all as jest.MockedFunction<typeof db.all>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create()', () => {
        it('should create a referendum with dao_id', async () => {
            const referendumData: ReferendumRecord = {
                post_id: 123,
                chain: Chain.Polkadot,
                dao_id: 1,
                title: 'Test Proposal',
                description: 'Test Description',
                requested_amount_usd: 10000,
                origin: 'Root',
                referendum_timeline: '7 days',
                internal_status: InternalStatus.NotStarted,
                link: 'https://polkadot.polkassembly.io/referendum/123',
                created_at: '2025-01-01T00:00:00Z',
                voting_start_date: undefined,
                voting_end_date: undefined,
                last_edited_by: undefined,
                public_comment: undefined,
                public_comment_made: false,
                ai_summary: undefined,
                reason_for_vote: undefined,
                reason_for_no_way: undefined,
                voted_link: undefined,
                vote_executed_date: undefined,
                updated_at: '2025-01-01T00:00:00Z'
            };

            mockDbRun.mockResolvedValue({ lastID: 1, changes: 1 } as any);

            const result = await Referendum.create(referendumData);

            expect(result).toBe(1);
            expect(mockDbRun).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO referendums'),
                expect.arrayContaining([123, Chain.Polkadot, 1, 'Test Proposal'])
            );
        });
    });

    describe('findByPostIdAndChain()', () => {
        it('should find referendum by post_id, chain, and dao_id', async () => {
            const mockReferendum = {
                id: 1,
                post_id: 123,
                chain: Chain.Polkadot,
                dao_id: 1,
                title: 'Test Proposal',
                internal_status: InternalStatus.NotStarted
            };

            mockDbGet.mockResolvedValue(mockReferendum);
            mockDbAll.mockResolvedValue([]);

            const result = await Referendum.findByPostIdAndChain(123, Chain.Polkadot, 1);

            expect(result).toBeDefined();
            expect(result?.dao_id).toBe(1);
            expect(mockDbGet).toHaveBeenCalledWith(
                expect.stringContaining('WHERE r.post_id = ? AND r.chain = ? AND r.dao_id = ?'),
                [1, 1, 123, Chain.Polkadot, 1]
            );
        });

        it('should return null if referendum not found for DAO', async () => {
            mockDbGet.mockResolvedValue(null);

            const result = await Referendum.findByPostIdAndChain(123, Chain.Polkadot, 999);

            expect(result).toBeNull();
        });
    });

    describe('update()', () => {
        it('should update referendum scoped by dao_id', async () => {
            mockDbRun.mockResolvedValue({ lastID: 1, changes: 1 } as any);

            await Referendum.update(123, Chain.Polkadot, 1, {
                internal_status: InternalStatus.Considering
            });

            expect(mockDbRun).toHaveBeenCalledWith(
                expect.stringContaining('WHERE post_id = ? AND chain = ? AND dao_id = ?'),
                expect.arrayContaining([InternalStatus.Considering, 123, Chain.Polkadot, 1])
            );
        });

        it('should not allow updating dao_id field', async () => {
            mockDbRun.mockResolvedValue({ lastID: 1, changes: 1 } as any);

            await Referendum.update(123, Chain.Polkadot, 1, {
                dao_id: 999, // This should be ignored
                internal_status: InternalStatus.Considering
            });

            const call = mockDbRun.mock.calls[0];
            const sql = call[0] as string;
            
            // dao_id should only appear in WHERE clause, not in SET clause
            const setClause = sql.split('WHERE')[0];
            expect(setClause).not.toContain('dao_id = ?');
            
            // But it should be in the WHERE clause
            expect(sql).toContain('WHERE post_id = ? AND chain = ? AND dao_id = ?');
        });
    });

    describe('getAll()', () => {
        it('should get all referendums without dao filter', async () => {
            const mockReferendums = [
                { id: 1, dao_id: 1, title: 'DAO 1 Ref' },
                { id: 2, dao_id: 2, title: 'DAO 2 Ref' }
            ];

            mockDbAll
                .mockResolvedValueOnce(mockReferendums)
                .mockResolvedValueOnce([]);

            const result = await Referendum.getAll();

            expect(result).toHaveLength(2);
            expect(mockDbAll).toHaveBeenCalledWith(
                expect.not.stringContaining('WHERE'),
                []
            );
        });

        it('should filter referendums by dao_id', async () => {
            const mockReferendums = [
                { id: 1, dao_id: 1, title: 'DAO 1 Ref' }
            ];

            mockDbAll
                .mockResolvedValueOnce(mockReferendums)
                .mockResolvedValueOnce([]);

            const result = await Referendum.getAll(1);

            expect(result).toHaveLength(1);
            expect(result[0].dao_id).toBe(1);
            expect(mockDbAll).toHaveBeenCalledWith(
                expect.stringContaining('WHERE r.dao_id = ?'),
                [1, 1, 1]
            );
        });
    });

    describe('getByStatus()', () => {
        it('should filter by status and dao_id', async () => {
            mockDbAll.mockResolvedValue([
                { id: 1, dao_id: 1, internal_status: InternalStatus.ReadyToVote }
            ]);

            await Referendum.getByStatus(InternalStatus.ReadyToVote, 1);

            expect(mockDbAll).toHaveBeenCalledWith(
                expect.stringContaining('WHERE r.internal_status = ? AND r.dao_id = ?'),
                [InternalStatus.ReadyToVote, 1, 1, 1]
            );
        });

        it('should filter by status only when dao_id not provided', async () => {
            mockDbAll.mockResolvedValue([
                { id: 1, dao_id: 1, internal_status: InternalStatus.ReadyToVote },
                { id: 2, dao_id: 2, internal_status: InternalStatus.ReadyToVote }
            ]);

            await Referendum.getByStatus(InternalStatus.ReadyToVote);

            expect(mockDbAll).toHaveBeenCalledWith(
                expect.stringContaining('WHERE r.internal_status = ?'),
                [InternalStatus.ReadyToVote]
            );
        });
    });

    describe('getReadyToVote()', () => {
        it('should get ready-to-vote referendums for specific DAO', async () => {
            mockDbAll.mockResolvedValue([
                { id: 1, dao_id: 1, internal_status: InternalStatus.ReadyToVote }
            ]);

            await Referendum.getReadyToVote(1);

            expect(mockDbAll).toHaveBeenCalledWith(
                expect.stringContaining("r.internal_status = 'Ready to vote'"),
                [1]
            );
            expect(mockDbAll).toHaveBeenCalledWith(
                expect.stringContaining('r.dao_id = ?'),
                [1]
            );
        });

        it('should get ready-to-vote referendums for all DAOs', async () => {
            mockDbAll.mockResolvedValue([
                { id: 1, dao_id: 1, internal_status: InternalStatus.ReadyToVote },
                { id: 2, dao_id: 2, internal_status: InternalStatus.ReadyToVote }
            ]);

            await Referendum.getReadyToVote();

            expect(mockDbAll).toHaveBeenCalledWith(
                expect.stringContaining("r.internal_status = 'Ready to vote'"),
                []
            );
        });
    });

    describe('updateVotingStatus()', () => {
        it('should update voting status with dao_id', async () => {
            mockDbRun.mockResolvedValue({ lastID: 1, changes: 1 } as any);

            await Referendum.updateVotingStatus(
                123,
                Chain.Polkadot,
                1,
                InternalStatus.VotedAye,
                'https://mimir.global/tx/123'
            );

            expect(mockDbRun).toHaveBeenCalledWith(
                expect.stringContaining('WHERE post_id = ? AND chain = ? AND dao_id = ?'),
                expect.arrayContaining([123, Chain.Polkadot, 1])
            );
        });
    });

    describe('exists()', () => {
        it('should check existence with dao_id', async () => {
            mockDbGet.mockResolvedValue({ count: 1 });

            const result = await Referendum.exists(123, Chain.Polkadot, 1);

            expect(result).toBe(true);
            expect(mockDbGet).toHaveBeenCalledWith(
                expect.stringContaining('WHERE post_id = ? AND chain = ? AND dao_id = ?'),
                [123, Chain.Polkadot, 1]
            );
        });

        it('should return false when referendum does not exist for DAO', async () => {
            mockDbGet.mockResolvedValue({ count: 0 });

            const result = await Referendum.exists(123, Chain.Polkadot, 999);

            expect(result).toBe(false);
        });
    });

    describe('delete()', () => {
        it('should delete referendum scoped by dao_id', async () => {
            mockDbRun.mockResolvedValue({ lastID: 1, changes: 1 } as any);

            await Referendum.delete(123, Chain.Polkadot, 1);

            expect(mockDbRun).toHaveBeenCalledWith(
                expect.stringContaining('WHERE post_id = ? AND chain = ? AND dao_id = ?'),
                [123, Chain.Polkadot, 1]
            );
        });
    });

    describe('getAssignedToUser()', () => {
        it('should filter by user and dao_id', async () => {
            const mockReferendums = [
                { id: 1, dao_id: 1, title: 'Assigned Ref' }
            ];

            mockDbAll
                .mockResolvedValueOnce(mockReferendums)
                .mockResolvedValue([]);

            await Referendum.getAssignedToUser('0x123...abc', 1);

            expect(mockDbAll).toHaveBeenCalledWith(
                expect.stringContaining('r.dao_id = ?'),
                ['0x123...abc', 1, 1, 1, 1]
            );
        });

        it('should get assignments across all DAOs when dao_id not provided', async () => {
            const mockReferendums = [
                { id: 1, dao_id: 1, title: 'DAO 1 Ref' },
                { id: 2, dao_id: 2, title: 'DAO 2 Ref' }
            ];

            mockDbAll
                .mockResolvedValueOnce(mockReferendums)
                .mockResolvedValue([]);

            await Referendum.getAssignedToUser('0x123...abc');

            expect(mockDbAll).toHaveBeenCalledWith(
                expect.not.stringContaining('r.dao_id = ?'),
                ['0x123...abc']
            );
        });
    });
});
