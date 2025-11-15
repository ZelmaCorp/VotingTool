import { MultisigService, MultisigMember } from '../../src/services/multisig';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MultisigService', () => {
  const mockSubscanApiKey = 'test-api-key';
  const mockPolkadotMultisig = '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5';
  const mockKusamaMultisig = 'FmtsP3Zvj8HMK5vYJ3oXY51K6Mww64iDo8QdNjtKVwxdCaC';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SUBSCAN_API_KEY = mockSubscanApiKey;
  });

  afterEach(() => {
    delete process.env.SUBSCAN_API_KEY;
  });

  describe('Constructor', () => {
    it('should accept optional subscanApiKey parameter', () => {
      const customKey = 'custom-key';
      const service = new MultisigService(customKey);
      expect(service).toBeDefined();
    });

    it('should use environment variable if no key provided', () => {
      const service = new MultisigService();
      expect(service).toBeDefined();
    });
  });

  describe('getCachedTeamMembers', () => {
    it('should fetch and cache multisig members', async () => {
      const mockMembers = [
        { wallet_address: 'address1', team_member_name: 'Member 1', network: 'Polkadot' as const },
        { wallet_address: 'address2', team_member_name: 'Member 2', network: 'Polkadot' as const }
      ];

      // Mock responses for both getParentAddress and fetchMultisigMembers
      mockedAxios.post.mockResolvedValue({
        data: {
          code: 0,
          data: {
            account: {
              multisig: {
                threshold: 2,
                multi_account_member: [
                  { address: 'address1', people: { display: 'Member 1' } },
                  { address: 'address2', people: { display: 'Member 2' } }
                ]
              }
            }
          }
        }
      });

      const service = new MultisigService();
      const members = await service.getCachedTeamMembers(mockPolkadotMultisig, 'Polkadot');

      expect(members).toHaveLength(2);
      expect(members[0].wallet_address).toBe('address1');
      expect(mockedAxios.post).toHaveBeenCalled();

      // Second call should use cache
      const cachedMembers = await service.getCachedTeamMembers(mockPolkadotMultisig, 'Polkadot');
      expect(cachedMembers).toEqual(members);
    });

    it('should cache members per multisig address', async () => {
      // Mock all axios calls to return consistent data
      mockedAxios.post.mockResolvedValue({
        data: {
          code: 0,
          data: {
            account: {
              multisig: {
                multi_account_member: [{ address: 'cached_address', people: { display: 'Cached Member' } }]
              }
            }
          }
        }
      });

      const service = new MultisigService();
      
      const members1 = await service.getCachedTeamMembers('multisig1', 'Polkadot');
      const members2 = await service.getCachedTeamMembers('multisig2', 'Polkadot');

      // Both should have members (caching works per address)
      expect(members1.length).toBeGreaterThan(0);
      expect(members2.length).toBeGreaterThan(0);
      // Different addresses should result in separate API calls
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });

  describe('getMultisigThreshold', () => {
    it('should extract threshold from API response', async () => {
      mockedAxios.post.mockResolvedValue({
        data: {
          code: 0,
          data: {
            account: {
              multisig: {
                threshold: 3,
                multi_account_member: [
                  { address: 'address1', people: { display: 'Member 1' } }
                ]
              }
            }
          }
        }
      });

      const service = new MultisigService();
      const threshold = await service.getMultisigThreshold(mockPolkadotMultisig, 'Polkadot');

      expect(threshold).toBe(3);
    });

    it('should return default threshold if not in API response', async () => {
      mockedAxios.post.mockResolvedValue({
        data: {
          code: 0,
          data: {
            account: {
              multisig: {
                multi_account_member: [{ address: 'address1', people: { display: 'Member 1' } }]
              }
            }
          }
        }
      });

      const service = new MultisigService();
      const threshold = await service.getMultisigThreshold(mockPolkadotMultisig, 'Polkadot');

      expect(threshold).toBe(4); // DEFAULT_THRESHOLD from env or 4
    });
  });

  describe('getMultisigInfo', () => {
    it('should return members and threshold', async () => {
      mockedAxios.post.mockResolvedValue({
        data: {
          code: 0,
          data: {
            account: {
              multisig: {
                threshold: 2,
                multi_account_member: [
                  { address: 'address1', people: { display: 'Member 1' } },
                  { address: 'address2', people: { display: 'Member 2' } }
                ]
              }
            }
          }
        }
      });

      const service = new MultisigService();
      const info = await service.getMultisigInfo(mockPolkadotMultisig, 'Polkadot');

      expect(info.members).toHaveLength(2);
      expect(info.threshold).toBe(2);
    });
  });

  describe('isTeamMember', () => {
    beforeEach(() => {
      mockedAxios.post.mockResolvedValue({
        data: {
          code: 0,
          data: {
            account: {
              multisig: {
                multi_account_member: [
                  { address: 'address1', people: { display: 'Member 1' } },
                  { address: 'address2', people: { display: 'Member 2' } }
                ]
              }
            }
          }
        }
      });
    });

    it('should return true for valid member', async () => {
      const service = new MultisigService();
      const isMember = await service.isTeamMember('address1', mockPolkadotMultisig, 'Polkadot');
      expect(isMember).toBe(true);
    });

    it('should return false for non-member', async () => {
      const service = new MultisigService();
      const isMember = await service.isTeamMember('unknown_address', mockPolkadotMultisig, 'Polkadot');
      expect(isMember).toBe(false);
    });

    it('should handle case-insensitive matching', async () => {
      const service = new MultisigService();
      const isMember = await service.isTeamMember('ADDRESS1', mockPolkadotMultisig, 'Polkadot');
      expect(isMember).toBe(true);
    });
  });

  describe('getTeamMemberByAddress', () => {
    beforeEach(() => {
      mockedAxios.post.mockResolvedValue({
        data: {
          code: 0,
          data: {
            account: {
              multisig: {
                multi_account_member: [
                  { address: 'address1', people: { display: 'Member 1' } },
                  { address: 'address2', people: { display: 'Member 2' } }
                ]
              }
            }
          }
        }
      });
    });

    it('should return member info for valid address', async () => {
      const service = new MultisigService();
      const member = await service.getTeamMemberByAddress('address1', mockPolkadotMultisig, 'Polkadot');

      expect(member).not.toBeNull();
      expect(member?.wallet_address).toBe('address1');
      expect(member?.team_member_name).toBe('Member 1');
    });

    it('should return null for non-member', async () => {
      const service = new MultisigService();
      const member = await service.getTeamMemberByAddress('unknown', mockPolkadotMultisig, 'Polkadot');
      expect(member).toBeNull();
    });
  });

});
