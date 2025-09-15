import { VotingDecision } from '../../src/database/models/votingDecision';
import { db } from '../../src/database/connection';
import { VotingRecord } from '../../src/database/types';

// Mock the database connection
jest.mock('../../src/database/connection', () => ({
  db: {
    run: jest.fn(),
    get: jest.fn(),
    all: jest.fn()
  }
}));

describe('VotingDecision Model', () => {
  const mockDb = db as jest.Mocked<typeof db>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('upsert()', () => {
    const mockVotingData: Partial<VotingRecord> = {
      suggested_vote: '👍 Aye 👍',
      final_vote: '👍 Aye 👍',
      vote_executed: false,
      vote_executed_date: undefined
    };

    it('should create new voting decision when none exists', async () => {
      // Mock no existing record
      mockDb.get.mockResolvedValue(null);
      mockDb.run.mockResolvedValue({ lastID: 1, changes: 1 } as any);

      const result = await VotingDecision.upsert(123, mockVotingData);

      expect(result).toBe(1);
      expect(mockDb.get).toHaveBeenCalledWith(
        'SELECT * FROM voting_decisions WHERE referendum_id = ?',
        [123]
      );
      expect(mockDb.run).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO voting_decisions'),
        expect.arrayContaining([
          123,
          mockVotingData.suggested_vote,
          mockVotingData.final_vote,
          mockVotingData.vote_executed,
          null
        ])
      );
    });

    it('should update existing voting decision', async () => {
      const existingRecord: VotingRecord = {
        id: 1,
        referendum_id: 123,
        suggested_vote: '👎 Nay 👎',
        final_vote: undefined,
        vote_executed: false,
        vote_executed_date: undefined
      };

      mockDb.get.mockResolvedValue(existingRecord);
      mockDb.run.mockResolvedValue({ changes: 1 } as any);

      const result = await VotingDecision.upsert(123, mockVotingData);

      expect(result).toBe(1);
      expect(mockDb.run).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE voting_decisions'),
        expect.arrayContaining([
          mockVotingData.suggested_vote,
          mockVotingData.final_vote,
          mockVotingData.vote_executed,
          mockVotingData.vote_executed_date,
          123
        ])
      );
    });

    it('should preserve existing values when partial update provided', async () => {
      const existingRecord: VotingRecord = {
        id: 1,
        referendum_id: 123,
        suggested_vote: '👍 Aye 👍',
        final_vote: '👍 Aye 👍',
        vote_executed: false,
        vote_executed_date: undefined
      };

      const partialUpdate = {
        vote_executed: true,
        vote_executed_date: '2024-01-15T10:30:00Z'
      };

      mockDb.get.mockResolvedValue(existingRecord);
      mockDb.run.mockResolvedValue({ changes: 1 } as any);

      await VotingDecision.upsert(123, partialUpdate);

      expect(mockDb.run).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE voting_decisions'),
        [
          existingRecord.suggested_vote, // Preserved from existing
          existingRecord.final_vote, // Preserved from existing
          true, // Updated
          '2024-01-15T10:30:00Z', // Updated
          123
        ]
      );
    });

    it('should handle boolean values correctly', async () => {
      mockDb.get.mockResolvedValue(null);
      mockDb.run.mockResolvedValue({ lastID: 2, changes: 1 } as any);

      const dataWithFalse = {
        suggested_vote: '👍 Aye 👍',
        vote_executed: false // Explicitly false
      };

      await VotingDecision.upsert(456, dataWithFalse);

      expect(mockDb.run).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO voting_decisions'),
        expect.arrayContaining([
          456,
          '👍 Aye 👍',
          null,
          false, // Should be false, not falsy
          null
        ])
      );
    });

    it('should handle null values correctly in create', async () => {
      mockDb.get.mockResolvedValue(null);
      mockDb.run.mockResolvedValue({ lastID: 3, changes: 1 } as any);

      const minimalData = {
        suggested_vote: '✌️ Abstain ✌️'
      };

      await VotingDecision.upsert(789, minimalData);

      expect(mockDb.run).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO voting_decisions'),
        [
          789,
          '✌️ Abstain ✌️',
          null, // final_vote
          false, // vote_executed default
          null // vote_executed_date
        ]
      );
    });

    it('should propagate database errors', async () => {
      const error = new Error('Database constraint violation');
      mockDb.get.mockRejectedValue(error);

      await expect(VotingDecision.upsert(123, mockVotingData)).rejects.toThrow(error);
    });
  });

  describe('getByReferendumId()', () => {
    it('should return voting decision when found', async () => {
      const mockVotingRecord: VotingRecord = {
        id: 1,
        referendum_id: 123,
        suggested_vote: '👍 Aye 👍',
        final_vote: '👍 Aye 👍',
        vote_executed: true,
        vote_executed_date: '2024-01-15T10:30:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T10:30:00Z'
      };

      mockDb.get.mockResolvedValue(mockVotingRecord);

      const result = await VotingDecision.getByReferendumId(123);

      expect(result).toEqual(mockVotingRecord);
      expect(mockDb.get).toHaveBeenCalledWith(
        'SELECT * FROM voting_decisions WHERE referendum_id = ?',
        [123]
      );
    });

    it('should return null when voting decision not found', async () => {
      mockDb.get.mockResolvedValue(null);

      const result = await VotingDecision.getByReferendumId(999);

      expect(result).toBeNull();
      expect(mockDb.get).toHaveBeenCalledWith(
        'SELECT * FROM voting_decisions WHERE referendum_id = ?',
        [999]
      );
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection error');
      mockDb.get.mockRejectedValue(error);

      await expect(VotingDecision.getByReferendumId(123)).rejects.toThrow(error);
    });
  });

  describe('deleteByReferendumId()', () => {
    it('should delete voting decision successfully', async () => {
      mockDb.run.mockResolvedValue({ changes: 1 } as any);

      await VotingDecision.deleteByReferendumId(123);

      expect(mockDb.run).toHaveBeenCalledWith(
        'DELETE FROM voting_decisions WHERE referendum_id = ?',
        [123]
      );
    });

    it('should handle case when no record exists to delete', async () => {
      mockDb.run.mockResolvedValue({ changes: 0 } as any);

      await expect(VotingDecision.deleteByReferendumId(999)).resolves.toBeUndefined();
      expect(mockDb.run).toHaveBeenCalledWith(
        'DELETE FROM voting_decisions WHERE referendum_id = ?',
        [999]
      );
    });

    it('should propagate database errors', async () => {
      const error = new Error('Foreign key constraint error');
      mockDb.run.mockRejectedValue(error);

      await expect(VotingDecision.deleteByReferendumId(123)).rejects.toThrow(error);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete voting workflow', async () => {
      const referendumId = 123;

      // Step 1: Create initial suggested vote
      mockDb.get.mockResolvedValueOnce(null); // No existing record
      mockDb.run.mockResolvedValueOnce({ lastID: 1, changes: 1 } as any);

      await VotingDecision.upsert(referendumId, { 
        suggested_vote: '👍 Aye 👍' 
      });

      // Step 2: Update with final vote
      const existingRecord = {
        id: 1,
        referendum_id: referendumId,
        suggested_vote: '👍 Aye 👍',
        final_vote: undefined,
        vote_executed: false
      };

      mockDb.get.mockResolvedValueOnce(existingRecord);
      mockDb.run.mockResolvedValueOnce({ changes: 1 } as any);

      await VotingDecision.upsert(referendumId, { 
        final_vote: '👍 Aye 👍' 
      });

      // Step 3: Mark as executed
      const updatedRecord = {
        ...existingRecord,
        final_vote: '👍 Aye 👍'
      };

      mockDb.get.mockResolvedValueOnce(updatedRecord);
      mockDb.run.mockResolvedValueOnce({ changes: 1 } as any);

      await VotingDecision.upsert(referendumId, { 
        vote_executed: true,
        vote_executed_date: '2024-01-15T10:30:00Z'
      });

      expect(mockDb.run).toHaveBeenCalledTimes(3);
      expect(mockDb.get).toHaveBeenCalledTimes(3);
    });

    it('should handle vote change scenarios', async () => {
      const referendumId = 456;
      const existingRecord = {
        id: 2,
        referendum_id: referendumId,
        suggested_vote: '👍 Aye 👍',
        final_vote: '👍 Aye 👍',
        vote_executed: false,
        vote_executed_date: undefined
      };

      // Change vote before execution
      mockDb.get.mockResolvedValue(existingRecord);
      mockDb.run.mockResolvedValue({ changes: 1 } as any);

      await VotingDecision.upsert(referendumId, { 
        final_vote: '👎 Nay 👎' 
      });

      expect(mockDb.run).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE voting_decisions'),
        expect.arrayContaining([
          '👍 Aye 👍', // suggested_vote preserved
          '👎 Nay 👎', // final_vote changed
          false, // vote_executed preserved
          existingRecord.vote_executed_date, // preserved
          referendumId
        ])
      );
    });
  });
}); 