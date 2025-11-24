import { multisigService } from '../../src/services/multisig';
import { DatabaseConnection } from '../../src/database/connection';

const db = DatabaseConnection.getInstance();

describe('Multisig Service Integration', () => {
  const multisigAddress = process.env.SANDBOX_POLKADOT_MULTISIG || process.env.POLKADOT_MULTISIG || '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5';

  beforeAll(async () => {
    // Initialize database
    await db.initialize();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  it('should fetch and cache real multisig members from blockchain', async () => {
    // First fetch members using the service directly to test caching
    const members = await multisigService.getCachedTeamMembers(multisigAddress, 'Polkadot');
    
    expect(members).toBeInstanceOf(Array);
    
    // Verify the structure of returned members
    if (members.length > 0) {
      const member = members[0];
      expect(member).toHaveProperty('wallet_address');
      expect(member).toHaveProperty('team_member_name');
      expect(member).toHaveProperty('network');
      expect(typeof member.wallet_address).toBe('string');
      expect(typeof member.team_member_name).toBe('string');
      expect(['Polkadot', 'Kusama']).toContain(member.network);
    }

    // Test caching - second call should be faster (from cache)
    const startTime = Date.now();
    const cachedMembers = await multisigService.getCachedTeamMembers(multisigAddress, 'Polkadot');
    const endTime = Date.now();

    expect(cachedMembers).toEqual(members);
    
    // Cached response should be very fast (under 50ms)
    expect(endTime - startTime).toBeLessThan(50);
  });

  it('should detect proxy relationships and parent addresses', async () => {
    // Test parent address detection directly with the service
    const parentInfo = await multisigService.getParentAddress(multisigAddress, 'Polkadot');
    
    expect(parentInfo).toHaveProperty('isProxy');
    expect(parentInfo).toHaveProperty('currentAddress');
    expect(parentInfo).toHaveProperty('network');
    
    // Verify the response structure
    expect(typeof parentInfo.isProxy).toBe('boolean');
    expect(typeof parentInfo.currentAddress).toBe('string');
    expect(['Polkadot', 'Kusama']).toContain(parentInfo.network);
    
    if (parentInfo.isProxy) {
      expect(parentInfo).toHaveProperty('parentAddress');
      expect(typeof parentInfo.parentAddress).toBe('string');
    }
  });

  it('should support flexible address matching', async () => {
    // Test address normalization by calling the service directly
    const members = await multisigService.getCachedTeamMembers(multisigAddress, 'Polkadot');
    expect(members).toBeInstanceOf(Array);
    
    if (members.length > 0) {
      // Test flexible address matching
      const testAddress = members[0].wallet_address;
      const foundMember = multisigService.findMemberByAddress(members, testAddress);
      expect(foundMember).toBeTruthy();
      expect(foundMember?.wallet_address).toBe(testAddress);
      
      // Test case-insensitive matching
      const lowerCaseAddress = testAddress.toLowerCase();
      const foundMemberCaseInsensitive = multisigService.findMemberByAddress(members, lowerCaseAddress);
      // Should find member even with different case (depending on implementation)
      expect(foundMemberCaseInsensitive).toBeTruthy();
    }
  });
}); 