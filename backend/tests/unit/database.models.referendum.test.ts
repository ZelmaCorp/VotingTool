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

describe('Referendum Model', () => {
  const mockDb = db as jest.Mocked<typeof db>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    const validReferendumData: ReferendumRecord = {
      post_id: 123,
      chain: Chain.Polkadot,
      title: 'Test Referendum',
      description: 'Test description',
      requested_amount_usd: 10000,
      origin: 'SmallTipper',
      referendum_timeline: 'Voting',
      internal_status: InternalStatus.NotStarted,
      link: 'https://polkadot.polkassembly.io/referendum/123',
      voting_start_date: '2024-01-01T00:00:00Z',
      voting_end_date: '2024-01-15T00:00:00Z',
      created_at: '2024-01-01T00:00:00Z'
    };

    it('should create referendum successfully', async () => {
      const mockResult = { lastID: 1, changes: 1 };
      mockDb.run.mockResolvedValue(mockResult as any);

      const result = await Referendum.create(validReferendumData);

      expect(result).toBe(1);
      expect(mockDb.run).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO referendums'),
        expect.arrayContaining([
          validReferendumData.post_id,
          validReferendumData.chain,
          validReferendumData.title,
          validReferendumData.description,
          validReferendumData.requested_amount_usd,
          validReferendumData.origin,
          validReferendumData.referendum_timeline,
          validReferendumData.internal_status,
          validReferendumData.link,
          validReferendumData.voting_start_date,
          validReferendumData.voting_end_date,
          validReferendumData.created_at
        ])
      );
    });

    it('should handle null values correctly', async () => {
      const minimalData: ReferendumRecord = {
        post_id: 123,
        chain: Chain.Polkadot,
        title: 'Test Referendum',
        created_at: '2024-01-01T00:00:00Z'
      };

      const mockResult = { lastID: 2, changes: 1 };
      mockDb.run.mockResolvedValue(mockResult as any);

      const result = await Referendum.create(minimalData);

      expect(result).toBe(2);
      expect(mockDb.run).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO referendums'),
        expect.arrayContaining([
          minimalData.post_id,
          minimalData.chain,
          minimalData.title,
          null, // description
          null, // requested_amount_usd
          null, // origin
          null, // referendum_timeline
          InternalStatus.NotStarted, // default internal_status
          null, // link
          null, // voting_start_date
          null, // voting_end_date
          minimalData.created_at
        ])
      );
    });

    it('should propagate database errors', async () => {
      const error = new Error('Database constraint violation');
      mockDb.run.mockRejectedValue(error);

      await expect(Referendum.create(validReferendumData)).rejects.toThrow(error);
    });
  });

  describe('findByPostIdAndChain()', () => {
    it('should return referendum with details when found', async () => {
      const mockReferendum = {
        id: 1,
        post_id: 123,
        chain: Chain.Polkadot,
        title: 'Test Referendum',
        description: 'Test description',
        necessity_score: 4,
        funding_score: 3,
        ref_score: 3.5,
        suggested_vote: '👍 Aye 👍',
        final_vote: null,
        vote_executed: false
      };

      const mockAssignments = [
        { wallet_address: '1abc...def', role_type: 'responsible_person', created_at: '2024-01-01T00:00:00Z' },
        { wallet_address: '2def...ghi', role_type: 'agree', created_at: '2024-01-01T01:00:00Z' }
      ];

      mockDb.get.mockResolvedValue(mockReferendum);
      mockDb.all.mockResolvedValue(mockAssignments);

      const result = await Referendum.findByPostIdAndChain(123, Chain.Polkadot);

      expect(result).toEqual({
        ...mockReferendum,
        assigned_to: '1abc...def',
        team_assignments: mockAssignments
      });

      expect(mockDb.get).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [123, Chain.Polkadot]
      );
      expect(mockDb.all).toHaveBeenCalledWith(
        expect.stringContaining('SELECT rtr.team_member_id'),
        [mockReferendum.id]
      );
    });

    it('should return null when referendum not found', async () => {
      mockDb.get.mockResolvedValue(null);

      const result = await Referendum.findByPostIdAndChain(999, Chain.Polkadot);

      expect(result).toBeNull();
      expect(mockDb.all).not.toHaveBeenCalled(); // Should not query assignments
    });

    it('should handle referendum without responsible person', async () => {
      const mockReferendum = {
        id: 1,
        post_id: 123,
        chain: Chain.Polkadot,
        title: 'Test Referendum'
      };

      const mockAssignments = [
        { wallet_address: '2def...ghi', role_type: 'agree', created_at: '2024-01-01T01:00:00Z' }
      ];

      mockDb.get.mockResolvedValue(mockReferendum);
      mockDb.all.mockResolvedValue(mockAssignments);

      const result = await Referendum.findByPostIdAndChain(123, Chain.Polkadot);

      expect(result?.assigned_to).toBeNull();
      expect(result?.team_assignments).toEqual(mockAssignments);
    });
  });

  describe('update()', () => {
    it('should update referendum successfully', async () => {
      const updates = {
        title: 'Updated Title',
        internal_status: InternalStatus.ReadyToVote,
        requested_amount_usd: 15000
      };

      mockDb.run.mockResolvedValue({ changes: 1 } as any);

      await Referendum.update(123, Chain.Polkadot, updates);

      expect(mockDb.run).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE referendums'),
        expect.arrayContaining([
          'Updated Title',
          InternalStatus.ReadyToVote,
          15000,
          123,
          Chain.Polkadot
        ])
      );
    });

    it('should skip update when no fields provided', async () => {
      await Referendum.update(123, Chain.Polkadot, {});

      expect(mockDb.run).not.toHaveBeenCalled();
    });

    it('should ignore undefined values', async () => {
      const updates = {
        title: 'Updated Title',
        description: undefined,
        requested_amount_usd: 15000
      };

      mockDb.run.mockResolvedValue({ changes: 1 } as any);

      await Referendum.update(123, Chain.Polkadot, updates);

      const call = mockDb.run.mock.calls[0];
      const sql = call[0];
      const params = call[1];

      expect(sql).toContain('title = ?');
      expect(sql).not.toContain('description = ?');
      expect(sql).toContain('requested_amount_usd = ?');
      expect(params).toContain('Updated Title');
      expect(params).toContain(15000);
      expect(params).not.toContain(undefined);
    });

    it('should always update updated_at timestamp', async () => {
      const updates = { title: 'Updated Title' };
      mockDb.run.mockResolvedValue({ changes: 1 } as any);

      await Referendum.update(123, Chain.Polkadot, updates);

      const call = mockDb.run.mock.calls[0];
      const sql = call[0];

      expect(sql).toContain('updated_at = datetime("now")');
    });
  });

  describe('getAll()', () => {
    it('should return all referendums with assignments', async () => {
      const mockReferendums = [
        { id: 1, post_id: 123, title: 'Referendum 1', ref_score: 3.5 },
        { id: 2, post_id: 124, title: 'Referendum 2', ref_score: 4.0 }
      ];

      const mockAssignments = [
        { referendum_id: 1, wallet_address: '1abc...def', role_type: 'responsible_person', created_at: '2024-01-01T00:00:00Z' },
        { referendum_id: 2, wallet_address: '2def...ghi', role_type: 'responsible_person', created_at: '2024-01-01T01:00:00Z' }
      ];

      mockDb.all
        .mockResolvedValueOnce(mockReferendums)
        .mockResolvedValueOnce(mockAssignments);

      const result = await Referendum.getAll();

      expect(result).toHaveLength(2);
      expect(result[0].assigned_to).toBe('1abc...def');
      expect(result[1].assigned_to).toBe('2def...ghi');
      expect(result[0].team_assignments).toEqual([mockAssignments[0]]);
      expect(result[1].team_assignments).toEqual([mockAssignments[1]]);
    });

    it('should handle referendums without assignments', async () => {
      const mockReferendums = [
        { id: 1, post_id: 123, title: 'Referendum 1' }
      ];

      mockDb.all
        .mockResolvedValueOnce(mockReferendums)
        .mockResolvedValueOnce([]); // No assignments

      const result = await Referendum.getAll();

      expect(result).toHaveLength(1);
      expect(result[0].assigned_to).toBeNull();
      expect(result[0].team_assignments).toEqual([]);
    });
  });

  describe('getByStatus()', () => {
    it('should return referendums filtered by status', async () => {
      const mockReferendums = [
        { id: 1, post_id: 123, internal_status: InternalStatus.ReadyToVote },
        { id: 2, post_id: 124, internal_status: InternalStatus.ReadyToVote }
      ];

      mockDb.all.mockResolvedValue(mockReferendums);

      const result = await Referendum.getByStatus(InternalStatus.ReadyToVote);

      expect(result).toEqual(mockReferendums);
      expect(mockDb.all).toHaveBeenCalledWith(
        expect.stringContaining('WHERE r.internal_status = ?'),
        [InternalStatus.ReadyToVote]
      );
    });
  });

  describe('getReadyToVote()', () => {
    it('should return referendums ready to vote', async () => {
      const mockReferendums = [
        { 
          id: 1, 
          post_id: 123, 
          internal_status: InternalStatus.ReadyToVote,
          voting_end_date: '2024-12-31T23:59:59Z',
          suggested_vote: '👍 Aye 👍',
          vote_executed: false
        }
      ];

      mockDb.all.mockResolvedValue(mockReferendums);

      const result = await Referendum.getReadyToVote();

      expect(result).toEqual(mockReferendums);
      expect(mockDb.all).toHaveBeenCalled();
    });
  });

  describe('updateVotingStatus()', () => {
    it('should update voting status with voted link', async () => {
      mockDb.run.mockResolvedValue({ changes: 1 } as any);

      await Referendum.updateVotingStatus(
        123, 
        Chain.Polkadot, 
        InternalStatus.VotedAye, 
        'https://polkadot.subscan.io/extrinsic/123'
      );

      // Should call update method internally
      expect(mockDb.run).toHaveBeenCalled();
    });

    it('should update voting status without voted link', async () => {
      mockDb.run.mockResolvedValue({ changes: 1 } as any);

      await Referendum.updateVotingStatus(123, Chain.Polkadot, InternalStatus.VotedAye);

      expect(mockDb.run).toHaveBeenCalled();
    });
  });

  describe('exists()', () => {
    it('should return true when referendum exists', async () => {
      mockDb.get.mockResolvedValue({ count: 1 });

      const result = await Referendum.exists(123, Chain.Polkadot);

      expect(result).toBe(true);
      expect(mockDb.get).toHaveBeenCalledWith(
        'SELECT COUNT(*) as count FROM referendums WHERE post_id = ? AND chain = ?',
        [123, Chain.Polkadot]
      );
    });

    it('should return false when referendum does not exist', async () => {
      mockDb.get.mockResolvedValue({ count: 0 });

      const result = await Referendum.exists(999, Chain.Polkadot);

      expect(result).toBe(false);
    });
  });

  describe('delete()', () => {
    it('should delete referendum', async () => {
      mockDb.run.mockResolvedValue({ changes: 1 } as any);

      await Referendum.delete(123, Chain.Polkadot);

      expect(mockDb.run).toHaveBeenCalledWith(
        'DELETE FROM referendums WHERE post_id = ? AND chain = ?',
        [123, Chain.Polkadot]
      );
    });
  });

  describe('getAssignedToUser()', () => {
    it('should return referendums assigned to specific user', async () => {
      const userAddress = '1abc...def';
      const mockReferendums = [
        { 
          id: 1, 
          post_id: 123, 
          title: 'Assigned Referendum',
          necessity_score: 4,
          ref_score: 3.8
        }
      ];

      const mockAssignments = [
        { wallet_address: userAddress, role_type: 'responsible_person', created_at: '2024-01-01T00:00:00Z' }
      ];

      mockDb.all
        .mockResolvedValueOnce(mockReferendums)
        .mockResolvedValueOnce(mockAssignments);

      const result = await Referendum.getAssignedToUser(userAddress);

      expect(result).toHaveLength(1);
      expect(result[0].assigned_to).toBe(userAddress);
      expect(result[0].team_assignments).toEqual(mockAssignments);

      expect(mockDb.all).toHaveBeenCalledWith(
        expect.stringContaining('WHERE rtr.team_member_id = ? AND rtr.role_type = \'responsible_person\''),
        [userAddress]
      );
    });

    it('should return empty array when user has no assignments', async () => {
      mockDb.all.mockResolvedValue([]);

      const result = await Referendum.getAssignedToUser('1nonexistent...user');

      expect(result).toEqual([]);
    });
  });
}); 