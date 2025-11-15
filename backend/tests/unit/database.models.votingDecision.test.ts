import { VotingDecision } from '../../src/database/models/votingDecision';
import { db } from '../../src/database/connection';
import { VotingRecord } from '../../src/database/types';
import { SuggestedVote } from '../../src/types/properties';

// Mock the database connection
jest.mock('../../src/database/connection', () => ({
    db: {
        run: jest.fn(),
        get: jest.fn(),
        all: jest.fn()
    }
}));

describe('VotingDecision Model - Multi-DAO Support', () => {
    const mockDbRun = db.run as jest.MockedFunction<typeof db.run>;
    const mockDbGet = db.get as jest.MockedFunction<typeof db.get>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('upsert()', () => {
        it('should create a new voting decision with dao_id', async () => {
            const referendumId = 1;
            const daoId = 1;
            const votingData: Partial<VotingRecord> = {
                suggested_vote: SuggestedVote.Aye,
                final_vote: undefined,
                vote_executed: false,
                vote_executed_date: undefined
            };

            // Mock that no existing record exists
            mockDbGet.mockResolvedValue(null);
            mockDbRun.mockResolvedValue({ lastID: 10, changes: 1 } as any);

            const result = await VotingDecision.upsert(referendumId, daoId, votingData);

            expect(result).toBe(10);
            expect(mockDbGet).toHaveBeenCalledWith(
                expect.stringContaining('WHERE referendum_id = ? AND dao_id = ?'),
                [referendumId, daoId]
            );
            expect(mockDbRun).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO voting_decisions'),
                expect.arrayContaining([referendumId, daoId, SuggestedVote.Aye])
            );
        });

        it('should update existing voting decision scoped by dao_id', async () => {
            const referendumId = 1;
            const daoId = 1;
            const existingRecord: VotingRecord = {
                id: 10,
                referendum_id: referendumId,
                dao_id: daoId,
                suggested_vote: SuggestedVote.Aye,
                final_vote: undefined,
                vote_executed: false,
                vote_executed_date: undefined,
                created_at: '2025-01-01T00:00:00Z',
                updated_at: '2025-01-01T00:00:00Z'
            };

            const updateData: Partial<VotingRecord> = {
                final_vote: SuggestedVote.Aye,
                vote_executed: true,
                vote_executed_date: '2025-01-02T00:00:00Z'
            };

            mockDbGet.mockResolvedValue(existingRecord);
            mockDbRun.mockResolvedValue({ lastID: 10, changes: 1 } as any);

            const result = await VotingDecision.upsert(referendumId, daoId, updateData);

            expect(result).toBe(10);
            expect(mockDbRun).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE voting_decisions'),
                expect.arrayContaining([
                    SuggestedVote.Aye, // suggested_vote (from existing)
                    SuggestedVote.Aye, // final_vote (from update)
                    true, // vote_executed
                    '2025-01-02T00:00:00Z', // vote_executed_date
                    referendumId,
                    daoId
                ])
            );
            expect(mockDbRun).toHaveBeenCalledWith(
                expect.stringContaining('WHERE referendum_id = ? AND dao_id = ?'),
                expect.anything()
            );
        });

        it('should allow multiple DAOs to have different voting decisions for same referendum', async () => {
            const referendumId = 1;
            
            // DAO 1 votes Aye
            mockDbGet.mockResolvedValue(null);
            mockDbRun.mockResolvedValue({ lastID: 10, changes: 1 } as any);
            await VotingDecision.upsert(referendumId, 1, { suggested_vote: SuggestedVote.Aye });

            // DAO 2 votes Nay
            mockDbGet.mockResolvedValue(null);
            mockDbRun.mockResolvedValue({ lastID: 11, changes: 1 } as any);
            await VotingDecision.upsert(referendumId, 2, { suggested_vote: SuggestedVote.Nay });

            // Verify both calls included dao_id
            expect(mockDbRun).toHaveBeenCalledTimes(2);
            expect(mockDbRun).toHaveBeenNthCalledWith(1,
                expect.stringContaining('INSERT INTO voting_decisions'),
                expect.arrayContaining([referendumId, 1, SuggestedVote.Aye])
            );
            expect(mockDbRun).toHaveBeenNthCalledWith(2,
                expect.stringContaining('INSERT INTO voting_decisions'),
                expect.arrayContaining([referendumId, 2, SuggestedVote.Nay])
            );
        });

        it('should preserve existing values when updating with partial data', async () => {
            const referendumId = 1;
            const daoId = 1;
            const existingRecord: VotingRecord = {
                id: 10,
                referendum_id: referendumId,
                dao_id: daoId,
                suggested_vote: SuggestedVote.Aye,
                final_vote: SuggestedVote.Aye,
                vote_executed: true,
                vote_executed_date: '2025-01-01T00:00:00Z',
                created_at: '2025-01-01T00:00:00Z',
                updated_at: '2025-01-01T00:00:00Z'
            };

            // Only update suggested_vote, everything else should be preserved
            mockDbGet.mockResolvedValue(existingRecord);
            mockDbRun.mockResolvedValue({ lastID: 10, changes: 1 } as any);

            await VotingDecision.upsert(referendumId, daoId, { suggested_vote: SuggestedVote.Nay });

            expect(mockDbRun).toHaveBeenCalledWith(
                expect.anything(),
                expect.arrayContaining([
                    SuggestedVote.Nay, // new suggested_vote
                    SuggestedVote.Aye, // preserved final_vote
                    true, // preserved vote_executed
                    '2025-01-01T00:00:00Z', // preserved vote_executed_date
                    referendumId,
                    daoId
                ])
            );
        });
    });

    describe('getByReferendumId()', () => {
        it('should get voting decision scoped by dao_id', async () => {
            const referendumId = 1;
            const daoId = 1;
            const mockRecord: VotingRecord = {
                id: 10,
                referendum_id: referendumId,
                dao_id: daoId,
                suggested_vote: SuggestedVote.Aye,
                final_vote: undefined,
                vote_executed: false,
                vote_executed_date: undefined,
                created_at: '2025-01-01T00:00:00Z',
                updated_at: '2025-01-01T00:00:00Z'
            };

            mockDbGet.mockResolvedValue(mockRecord);

            const result = await VotingDecision.getByReferendumId(referendumId, daoId);

            expect(result).toEqual(mockRecord);
            expect(mockDbGet).toHaveBeenCalledWith(
                expect.stringContaining('WHERE referendum_id = ? AND dao_id = ?'),
                [referendumId, daoId]
            );
        });

        it('should return null if voting decision does not exist for DAO', async () => {
            mockDbGet.mockResolvedValue(null);

            const result = await VotingDecision.getByReferendumId(1, 999);

            expect(result).toBeNull();
        });

        it('should return different decisions for different DAOs on same referendum', async () => {
            const referendumId = 1;

            // DAO 1's decision
            const dao1Record: VotingRecord = {
                id: 10,
                referendum_id: referendumId,
                dao_id: 1,
                suggested_vote: SuggestedVote.Aye,
                final_vote: undefined,
                vote_executed: false,
                vote_executed_date: undefined,
                created_at: '2025-01-01T00:00:00Z',
                updated_at: '2025-01-01T00:00:00Z'
            };

            // DAO 2's decision
            const dao2Record: VotingRecord = {
                id: 11,
                referendum_id: referendumId,
                dao_id: 2,
                suggested_vote: SuggestedVote.Nay,
                final_vote: undefined,
                vote_executed: false,
                vote_executed_date: undefined,
                created_at: '2025-01-01T00:00:00Z',
                updated_at: '2025-01-01T00:00:00Z'
            };

            mockDbGet.mockResolvedValueOnce(dao1Record).mockResolvedValueOnce(dao2Record);

            const dao1Result = await VotingDecision.getByReferendumId(referendumId, 1);
            const dao2Result = await VotingDecision.getByReferendumId(referendumId, 2);

            expect(dao1Result?.suggested_vote).toBe(SuggestedVote.Aye);
            expect(dao2Result?.suggested_vote).toBe(SuggestedVote.Nay);
        });
    });

    describe('deleteByReferendumId()', () => {
        it('should delete voting decision scoped by dao_id', async () => {
            const referendumId = 1;
            const daoId = 1;

            mockDbRun.mockResolvedValue({ lastID: 0, changes: 1 } as any);

            await VotingDecision.deleteByReferendumId(referendumId, daoId);

            expect(mockDbRun).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM voting_decisions WHERE referendum_id = ? AND dao_id = ?'),
                [referendumId, daoId]
            );
        });

        it('should only delete the specific DAO\'s voting decision', async () => {
            const referendumId = 1;

            mockDbRun.mockResolvedValue({ lastID: 0, changes: 1 } as any);

            // Delete DAO 1's decision
            await VotingDecision.deleteByReferendumId(referendumId, 1);

            // Verify it's scoped by dao_id
            expect(mockDbRun).toHaveBeenCalledWith(
                expect.stringContaining('WHERE referendum_id = ? AND dao_id = ?'),
                [referendumId, 1]
            );

            // DAO 2's decision should still exist (different dao_id)
            mockDbRun.mockClear();
            await VotingDecision.deleteByReferendumId(referendumId, 2);

            expect(mockDbRun).toHaveBeenCalledWith(
                expect.stringContaining('WHERE referendum_id = ? AND dao_id = ?'),
                [referendumId, 2]
            );
        });
    });
});
