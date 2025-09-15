import { MultisigService, MultisigMember } from '../../src/services/multisig';
import axios from 'axios';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';

// Mock dependencies
jest.mock('axios');
jest.mock('@polkadot/keyring');

describe('MultisigService', () => {
  let multisigService: MultisigService;
  const mockAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset environment variables
    process.env.SUBSCAN_API_KEY = 'test-api-key';
    process.env.POLKADOT_MULTISIG = '1PolkadotMultisigAddress';
    process.env.KUSAMA_MULTISIG = '2KusamaMultisigAddress';

    multisigService = new MultisigService();

    // Mock address conversion functions
    (decodeAddress as jest.Mock).mockReturnValue(new Uint8Array(32));
    (encodeAddress as jest.Mock).mockImplementation((publicKey, prefix) => {
      return prefix === 0 ? '1ConvertedPolkadotAddress' : '2ConvertedKusamaAddress';
    });
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.SUBSCAN_API_KEY;
    delete process.env.POLKADOT_MULTISIG;
    delete process.env.KUSAMA_MULTISIG;
  });

  describe('Constructor', () => {
    it('should initialize with environment variables', () => {
      expect(multisigService).toBeDefined();
    });

    it('should handle missing SUBSCAN_API_KEY', () => {
      delete process.env.SUBSCAN_API_KEY;
      
      // Should not throw, but log a warning
      expect(() => new MultisigService()).not.toThrow();
    });
  });

  describe('getCachedTeamMembers()', () => {
    const mockMembers: MultisigMember[] = [
      {
        wallet_address: '1PolkadotAddress1',
        team_member_name: 'Alice',
        network: 'Polkadot'
      },
      {
        wallet_address: '1PolkadotAddress2',
        team_member_name: 'Bob',
        network: 'Polkadot'
      }
    ];

    it('should return cached members if cache is valid', async () => {
      // Pre-populate cache
      const service = new MultisigService();
      (service as any).cache.set('members_Polkadot', mockMembers);
      (service as any).cacheExpiry.set('members_Polkadot', Date.now() + 300000); // 5 minutes future

      const result = await service.getCachedTeamMembers('Polkadot');

      expect(result).toEqual(mockMembers);
      expect(mockAxios.post).not.toHaveBeenCalled();
    });

    it('should fetch new members if cache is expired', async () => {
      // Mock expired cache
      const service = new MultisigService();
      (service as any).cache.set('members_Polkadot', mockMembers);
      (service as any).cacheExpiry.set('members_Polkadot', Date.now() - 1000); // 1 second ago

      // Mock fetchMultisigMembers method
      jest.spyOn(service as any, 'fetchMultisigMembers').mockResolvedValue(mockMembers);

      const result = await service.getCachedTeamMembers('Polkadot');

      expect(result).toEqual(mockMembers);
      expect((service as any).fetchMultisigMembers).toHaveBeenCalledWith('Polkadot');
    });

    it('should fetch new members if no cache exists', async () => {
      const service = new MultisigService();
      
      // Mock fetchMultisigMembers method
      jest.spyOn(service as any, 'fetchMultisigMembers').mockResolvedValue(mockMembers);

      const result = await service.getCachedTeamMembers('Polkadot');

      expect(result).toEqual(mockMembers);
      expect((service as any).fetchMultisigMembers).toHaveBeenCalledWith('Polkadot');
    });

    it('should default to Polkadot network', async () => {
      const service = new MultisigService();
      jest.spyOn(service as any, 'fetchMultisigMembers').mockResolvedValue(mockMembers);

      await service.getCachedTeamMembers();

      expect((service as any).fetchMultisigMembers).toHaveBeenCalledWith('Polkadot');
    });

    it('should update cache after fetching', async () => {
      const service = new MultisigService();
      jest.spyOn(service as any, 'fetchMultisigMembers').mockResolvedValue(mockMembers);

      await service.getCachedTeamMembers('Polkadot');

      expect((service as any).cache.get('members_Polkadot')).toEqual(mockMembers);
      expect((service as any).cacheExpiry.get('members_Polkadot')).toBeGreaterThan(Date.now());
    });
  });

  describe('getParentAddress()', () => {
    it('should return proxy information when found', async () => {
      const mockResponse = {
        data: {
          code: 0,
          data: {
            account: {
              delegate: {
                conviction_delegated: [
                  {
                    delegate_account: {
                      people: {
                        parent: {
                          address: '1ParentAddress'
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const result = await multisigService.getParentAddress('Polkadot');

      expect(result).toEqual({
        isProxy: true,
        parentAddress: '1ParentAddress',
        currentAddress: '1PolkadotMultisigAddress',
        network: 'Polkadot'
      });

      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://polkadot.api.subscan.io/api/v2/scan/search',
        { key: '1PolkadotMultisigAddress' },
        expect.objectContaining({
          headers: {
            'X-API-Key': 'test-api-key',
            'Content-Type': 'application/json'
          }
        })
      );
    });

    it('should return non-proxy information when no parent found', async () => {
      const mockResponse = {
        data: {
          code: 0,
          data: {
            account: {
              delegate: {
                conviction_delegated: []
              }
            }
          }
        }
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const result = await multisigService.getParentAddress('Kusama');

      expect(result).toEqual({
        isProxy: false,
        currentAddress: '2KusamaMultisigAddress',
        network: 'Kusama'
      });
    });

    it('should handle missing API key', async () => {
      delete process.env.SUBSCAN_API_KEY;
      const serviceWithoutKey = new MultisigService();

      const result = await serviceWithoutKey.getParentAddress('Polkadot');

      expect(result).toEqual({
        isProxy: false,
        currentAddress: '1PolkadotMultisigAddress',
        network: 'Polkadot'
      });

      expect(mockAxios.post).not.toHaveBeenCalled();
    });

    it('should handle missing multisig address', async () => {
      delete process.env.POLKADOT_MULTISIG;
      const serviceWithoutMultisig = new MultisigService();

      const result = await serviceWithoutMultisig.getParentAddress('Polkadot');

      expect(result).toEqual({
        isProxy: false,
        currentAddress: '',
        network: 'Polkadot'
      });
    });

    it('should handle API errors gracefully', async () => {
      mockAxios.post.mockRejectedValue(new Error('Network error'));

      const result = await multisigService.getParentAddress('Polkadot');

      expect(result).toEqual({
        isProxy: false,
        currentAddress: '1PolkadotMultisigAddress',
        network: 'Polkadot'
      });
    });

    it('should handle malformed API response', async () => {
      const mockResponse = {
        data: {
          code: 1,
          message: 'Error'
        }
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const result = await multisigService.getParentAddress('Polkadot');

      expect(result).toEqual({
        isProxy: false,
        currentAddress: '1PolkadotMultisigAddress',
        network: 'Polkadot'
      });
    });
  });

  describe('Address conversion', () => {
    it('should convert address to network-specific format', () => {
      const service = new MultisigService();
      
      // Test the private method via reflection
      const convertMethod = (service as any).convertToNetworkAddress;
      
      const result = convertMethod('1GenericAddress', 'Polkadot');
      
      expect(decodeAddress).toHaveBeenCalledWith('1GenericAddress');
      expect(encodeAddress).toHaveBeenCalledWith(expect.any(Uint8Array), 0);
      expect(result).toBe('1ConvertedPolkadotAddress');
    });

    it('should convert address to Kusama format', () => {
      const service = new MultisigService();
      const convertMethod = (service as any).convertToNetworkAddress;
      
      const result = convertMethod('1GenericAddress', 'Kusama');
      
      expect(encodeAddress).toHaveBeenCalledWith(expect.any(Uint8Array), 2);
      expect(result).toBe('2ConvertedKusamaAddress');
    });

    it('should handle address conversion errors', () => {
      (decodeAddress as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid address format');
      });

      const service = new MultisigService();
      const convertMethod = (service as any).convertToNetworkAddress;
      
      const result = convertMethod('InvalidAddress', 'Polkadot');
      
      // Should return original address on error
      expect(result).toBe('InvalidAddress');
    });
  });

  describe('Cache management', () => {
    it('should respect cache duration', async () => {
      const service = new MultisigService();
      const mockMembers = [{ wallet_address: '1Address', team_member_name: 'Test', network: 'Polkadot' as const }];
      
      // Set cache with short expiry
      (service as any).cache.set('members_Polkadot', mockMembers);
      (service as any).cacheExpiry.set('members_Polkadot', Date.now() + 100); // 100ms
      
      // First call should use cache
      let result = await service.getCachedTeamMembers('Polkadot');
      expect(result).toEqual(mockMembers);
      
      // Wait for cache to expire
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Mock fresh fetch
      jest.spyOn(service as any, 'fetchMultisigMembers').mockResolvedValue([]);
      
      // Second call should fetch fresh data
      result = await service.getCachedTeamMembers('Polkadot');
      expect((service as any).fetchMultisigMembers).toHaveBeenCalled();
    });

    it('should handle separate caches for different networks', async () => {
      const service = new MultisigService();
      const polkadotMembers = [{ wallet_address: '1Address', team_member_name: 'Polkadot User', network: 'Polkadot' as const }];
      const kusamaMembers = [{ wallet_address: '2Address', team_member_name: 'Kusama User', network: 'Kusama' as const }];
      
      jest.spyOn(service as any, 'fetchMultisigMembers')
        .mockResolvedValueOnce(polkadotMembers)
        .mockResolvedValueOnce(kusamaMembers);
      
      const polkadotResult = await service.getCachedTeamMembers('Polkadot');
      const kusamaResult = await service.getCachedTeamMembers('Kusama');
      
      expect(polkadotResult).toEqual(polkadotMembers);
      expect(kusamaResult).toEqual(kusamaMembers);
      expect((service as any).fetchMultisigMembers).toHaveBeenCalledTimes(2);
    });
  });
}); 