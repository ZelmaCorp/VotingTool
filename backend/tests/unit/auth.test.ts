import { verifyWeb3Signature, generateAuthToken, verifyAuthToken } from '../../src/utils/auth';
import { Web3AuthRequest } from '../../src/types/auth';

describe('Authentication Utils', () => {
  const mockUser = {
    address: '15oF4uVJwmo4TdGW7V2Yzgb5nTRw4CqxQ7Fq6QZ6QZ6QZ6QZ6QZ6',
    name: 'Test User',
    network: 'Polkadot' as const
  };

  describe('generateAuthToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateAuthToken(mockUser);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    it('should generate different tokens for different users', () => {
      const user1 = { ...mockUser, name: 'User 1' };
      const user2 = { ...mockUser, name: 'User 2' };
      
      const token1 = generateAuthToken(user1);
      const token2 = generateAuthToken(user2);
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyAuthToken', () => {
    it('should verify a valid token', () => {
      const token = generateAuthToken(mockUser);
      const verified = verifyAuthToken(token);
      
      expect(verified).toBeDefined();
      expect(verified?.address).toBe(mockUser.address);
      expect(verified?.name).toBe(mockUser.name);
      expect(verified?.network).toBe(mockUser.network);
    });

    it('should return null for invalid token', () => {
      const verified = verifyAuthToken('invalid.token.here');
      expect(verified).toBeNull();
    });

    it('should return null for malformed token', () => {
      const verified = verifyAuthToken('not-a-jwt-token');
      expect(verified).toBeNull();
    });
  });

  describe('verifyWeb3Signature', () => {
    it('should reject requests with missing fields', async () => {
      const invalidRequest: Web3AuthRequest = {
        address: '15oF4uVJwmo4TdGW7V2Yzgb5nTRw4CqxQ7Fq6QZ6QZ6QZ6QZ6QZ6',
        signature: '',
        message: '',
        timestamp: Date.now()
      };
      
      const result = await verifyWeb3Signature(invalidRequest);
      expect(result).toBe(false);
    });

    it('should reject requests with invalid address format', async () => {
      const invalidRequest: Web3AuthRequest = {
        address: 'invalid-address',
        signature: 'signature',
        message: 'message',
        timestamp: Date.now()
      };
      
      const result = await verifyWeb3Signature(invalidRequest);
      expect(result).toBe(false);
    });

    it('should reject expired requests', async () => {
      const expiredRequest: Web3AuthRequest = {
        address: '15oF4uVJwmo4TdGW7V2Yzgb5nTRw4CqxQ7Fq6QZ6QZ6QZ6QZ6QZ6',
        signature: 'signature',
        message: 'message',
        timestamp: Date.now() - (6 * 60 * 1000) // 6 minutes ago
      };
      
      const result = await verifyWeb3Signature(expiredRequest);
      expect(result).toBe(false);
    });
  });
}); 