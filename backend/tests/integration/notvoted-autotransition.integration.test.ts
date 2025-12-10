import { DatabaseConnection } from '../../src/database/connection';
import { DAO } from '../../src/database/models/dao';
import { Referendum } from '../../src/database/models/referendum';
import { checkAllReferendumsForNotVoted } from '../../src/refresh';
import { Chain, InternalStatus, TimelineStatus, Origin } from '../../src/types/properties';
import { VOTE_OVER_STATUSES, VOTED_STATUSES } from '../../src/utils/constants';
import { multisigService } from '../../src/services/multisig';

const db = DatabaseConnection.getInstance();

// Mock the multisig service to avoid external API calls during tests
jest.mock('../../src/services/multisig');

/**
 * Integration test for NotVoted auto-transition mechanism
 * 
 * Tests verify that referendums with vote-over timeline statuses are automatically
 * transitioned to NotVoted if they haven't been marked as voted.
 */
describe('NotVoted Auto-Transition Integration Test', () => {
  let testDaoId: number;
  const basePostId = 900000;

  beforeAll(async () => {
    process.env.MASTER_ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    await db.initialize();
    
    // Mock multisig service
    const mockMultisigService = multisigService as jest.Mocked<typeof multisigService>;
    mockMultisigService.getMultisigInfo.mockResolvedValue({
      members: [{
        wallet_address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        team_member_name: 'Test Member',
        network: 'Polkadot'
      }],
      threshold: 1
    });
    mockMultisigService.isTeamMember.mockResolvedValue(true);
    mockMultisigService.getCachedTeamMembers.mockResolvedValue([{
      wallet_address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
      team_member_name: 'Test Member',
      network: 'Polkadot'
    }]);
    
    // Create test DAO
    testDaoId = await DAO.create({
      name: 'NotVoted Test DAO ' + Date.now(),
      description: 'Test DAO',
      polkadot_multisig: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
      proposer_mnemonic: 'test test test test test test test test test test test test'
    });
  });

  afterAll(async () => {
    try {
      await db.run('DELETE FROM referendum_team_roles WHERE referendum_id IN (SELECT id FROM referendums WHERE dao_id = ?)', [testDaoId]);
      await db.run('DELETE FROM voting_decisions WHERE referendum_id IN (SELECT id FROM referendums WHERE dao_id = ?)', [testDaoId]);
      await db.run('DELETE FROM referendums WHERE dao_id = ?', [testDaoId]);
      if (testDaoId) {
        await db.run('DELETE FROM daos WHERE id = ?', [testDaoId]);
      }
    } catch (error: any) {
      console.log('Cleanup warning:', error?.message || error);
    }
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    await db.run('DELETE FROM referendums WHERE post_id >= ? AND dao_id = ?', [basePostId, testDaoId]);
  });

  describe('Basic functionality', () => {
    it('should transition vote-over referendums to NotVoted when not already voted', async () => {
      const postId = basePostId + 1;
      await Referendum.create({
        post_id: postId,
        chain: Chain.Polkadot,
        dao_id: testDaoId,
        title: `Test Referendum ${postId}`,
        description: 'Test',
        requested_amount_usd: 10000,
        origin: Origin.Root,
        referendum_timeline: VOTE_OVER_STATUSES[0],
        internal_status: InternalStatus.Considering,
        link: `https://polkadot.polkassembly.io/referenda/${postId}`,
        voting_start_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

      await checkAllReferendumsForNotVoted();

      const ref = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(ref!.internal_status).toBe(InternalStatus.NotVoted);
    });

    it('should NOT transition referendums that are already voted', async () => {
      const postId = basePostId + 2;
      await Referendum.create({
        post_id: postId,
        chain: Chain.Polkadot,
        dao_id: testDaoId,
        title: `Test Referendum ${postId}`,
        description: 'Test',
        requested_amount_usd: 10000,
        origin: Origin.Root,
        referendum_timeline: VOTE_OVER_STATUSES[0],
        internal_status: InternalStatus.VotedAye,
        link: `https://polkadot.polkassembly.io/referenda/${postId}`,
        voting_start_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

      await checkAllReferendumsForNotVoted();

      const ref = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(ref!.internal_status).toBe(InternalStatus.VotedAye);
    });
  });

  describe('BUG: refreshReferendas failure prevents NotVoted transition', () => {
    /**
     * ⚠️ THESE TESTS WILL FAIL UNTIL THE BUG IS FIXED ⚠️
     * 
     * When refreshReferendas() fails (API timeout, network error, etc.),
     * checkAllReferendumsForNotVoted() is NEVER called because it's inside
     * the try block, after the API calls.
     * 
     * These tests verify the bug exists and will PASS when we fix it by
     * moving checkAllReferendumsForNotVoted() to the finally block.
     */

    it('SHOULD transition NotVoted even when refreshReferendas fails due to API timeout', async () => {
      /**
       * Production bug: When Polkassembly API times out, refreshReferendas() fails
       * and checkAllReferendumsForNotVoted() never runs.
       * 
       * This test will FAIL until we fix the bug by moving the check to finally block.
       * After fix: This test will PASS.
       */
      const postId = basePostId + 100;
      
      // Create referendum that needs transition
      await Referendum.create({
        post_id: postId,
        chain: Chain.Polkadot,
        dao_id: testDaoId,
        title: `Test Referendum ${postId}`,
        description: 'Should transition even if API fails',
        requested_amount_usd: 10000,
        origin: Origin.Root,
        referendum_timeline: VOTE_OVER_STATUSES[0],
        internal_status: InternalStatus.Considering,
        link: `https://polkadot.polkassembly.io/referenda/${postId}`,
        voting_start_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

      // Mock API timeout (production scenario)
      const polkAssemblyModule = await import('../../src/polkAssembly/fetchReferendas');
      jest.spyOn(polkAssemblyModule, 'fetchDataFromAPI').mockRejectedValueOnce(
        Object.assign(new Error('timeout of 30000ms exceeded'), {
          code: 'ECONNABORTED',
          isAxiosError: true
        })
      );

      // Call refreshReferendas - it will fail
      const refreshModule = await import('../../src/refresh');
      try {
        await refreshModule.refreshReferendas(30, testDaoId);
      } catch (error) {
        // Expected to fail
      }

      // ⚠️ THIS WILL FAIL UNTIL BUG IS FIXED
      // Currently: check never runs, so status stays as Considering
      // After fix: check runs in finally block, so status becomes NotVoted
      const ref = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(ref!.internal_status).toBe(InternalStatus.NotVoted);
      
      jest.restoreAllMocks();
    });

    it('SHOULD transition NotVoted even when refreshReferendas returns early (no DAOs)', async () => {
      /**
       * When refreshReferendas() returns early (no active DAOs), check never runs.
       * 
       * This test will FAIL until we fix the bug.
       * After fix: This test will PASS.
       */
      const postId = basePostId + 101;
      
      await Referendum.create({
        post_id: postId,
        chain: Chain.Polkadot,
        dao_id: testDaoId,
        title: `Test Referendum ${postId}`,
        description: 'Should transition even if no DAOs',
        requested_amount_usd: 10000,
        origin: Origin.Root,
        referendum_timeline: VOTE_OVER_STATUSES[0],
        internal_status: InternalStatus.Considering,
        link: `https://polkadot.polkassembly.io/referenda/${postId}`,
        voting_start_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      });

      // Temporarily deactivate DAO
      await db.run('UPDATE daos SET status = ? WHERE id = ?', ['inactive', testDaoId]);
      
      // Call refreshReferendas - it will return early
      const refreshModule = await import('../../src/refresh');
      await refreshModule.refreshReferendas(30); // No daoId, should get all active DAOs
      
      // ⚠️ THIS WILL FAIL UNTIL BUG IS FIXED
      // Currently: check never runs, so status stays as Considering
      // After fix: check runs even on early return, so status becomes NotVoted
      const ref = await Referendum.findByPostIdAndChain(postId, Chain.Polkadot, testDaoId);
      expect(ref!.internal_status).toBe(InternalStatus.NotVoted);
      
      // Reactivate DAO
      await db.run('UPDATE daos SET status = ? WHERE id = ?', ['active', testDaoId]);
    });
  });
});
