/**
 * Unit tests for encryption utilities
 * Tests AES-256-GCM encryption/decryption with various data types
 */

import crypto from 'crypto';
import { encrypt, decrypt, generateMasterKey, validateMasterKey, testEncryption } from '../../src/utils/encryption';

describe('Encryption Utilities', () => {
  const originalEnv = process.env.MASTER_ENCRYPTION_KEY;
  
  // Generate a valid test key
  const testKey = crypto.randomBytes(32).toString('hex');
  
  beforeEach(() => {
    // Set a valid test key for each test
    process.env.MASTER_ENCRYPTION_KEY = testKey;
  });
  
  afterEach(() => {
    // Restore original environment
    process.env.MASTER_ENCRYPTION_KEY = originalEnv;
  });

  describe('encrypt()', () => {
    it('should encrypt a simple string', () => {
      const plaintext = 'Hello, World!';
      const encrypted = encrypt(plaintext);
      
      expect(encrypted).toBeDefined();
      expect(typeof encrypted).toBe('string');
      expect(encrypted).not.toBe(plaintext);
    });

    it('should produce different ciphertext for same plaintext (random IV)', () => {
      const plaintext = 'same data';
      const encrypted1 = encrypt(plaintext);
      const encrypted2 = encrypt(plaintext);
      
      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should encrypt long strings', () => {
      const plaintext = 'A'.repeat(10000);
      const encrypted = encrypt(plaintext);
      
      expect(encrypted).toBeDefined();
      expect(encrypted.length).toBeGreaterThan(plaintext.length);
    });

    it('should encrypt special and unicode characters', () => {
      const plaintext = '!@#$%^&*()_+-=[]{}|;:",.<>?/~` 你好世界 🌍';
      const encrypted = encrypt(plaintext);
      
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(plaintext);
    });

    it('should return encrypted data in correct format (iv:authTag:ciphertext)', () => {
      const plaintext = 'test data';
      const encrypted = encrypt(plaintext);
      
      const parts = encrypted.split(':');
      expect(parts).toHaveLength(3);
      
      // IV should be 32 hex chars (16 bytes)
      expect(parts[0]).toHaveLength(32);
      expect(/^[0-9a-f]{32}$/i.test(parts[0])).toBe(true);
      
      // Auth tag should be 32 hex chars (16 bytes)
      expect(parts[1]).toHaveLength(32);
      expect(/^[0-9a-f]{32}$/i.test(parts[1])).toBe(true);
      
      // Ciphertext should be hex encoded
      expect(/^[0-9a-f]+$/i.test(parts[2])).toBe(true);
    });

    it('should throw error for empty string', () => {
      expect(() => encrypt('')).toThrow('Cannot encrypt empty or null plaintext');
    });

    it('should throw error if MASTER_ENCRYPTION_KEY is not set', () => {
      delete process.env.MASTER_ENCRYPTION_KEY;
      expect(() => encrypt('test')).toThrow('MASTER_ENCRYPTION_KEY is not set');
    });

    it('should throw error if MASTER_ENCRYPTION_KEY is invalid format', () => {
      process.env.MASTER_ENCRYPTION_KEY = 'invalid-key';
      expect(() => encrypt('test')).toThrow('must be a 64-character hexadecimal string');
    });
  });

  describe('decrypt()', () => {
    it('should decrypt data that was encrypted', () => {
      const plaintext = 'Hello, World!';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);
      
      expect(decrypted).toBe(plaintext);
    });

    it('should decrypt long strings', () => {
      const plaintext = 'B'.repeat(10000);
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);
      
      expect(decrypted).toBe(plaintext);
    });

    it('should decrypt special characters and unicode', () => {
      const plaintext = '!@#$%^&*() 你好世界 🌍 Héllo';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);
      
      expect(decrypted).toBe(plaintext);
    });

    it('should throw error for empty string', () => {
      expect(() => decrypt('')).toThrow('Cannot decrypt empty or null encrypted data');
    });

    it('should throw error for invalid format', () => {
      expect(() => decrypt('invalid')).toThrow('Invalid encrypted data format');
      expect(() => decrypt('part1:part2')).toThrow('Invalid encrypted data format');
    });

    it('should throw error for tampered data', () => {
      const plaintext = 'test data';
      const encrypted = encrypt(plaintext);
      
      // Tamper with the ciphertext
      const parts = encrypted.split(':');
      parts[2] = parts[2].substring(0, parts[2].length - 2) + 'ff';
      const tampered = parts.join(':');
      
      expect(() => decrypt(tampered)).toThrow('Data authentication failed');
    });

    it('should throw error with wrong encryption key', () => {
      const plaintext = 'test data';
      const encrypted = encrypt(plaintext);
      
      // Change the encryption key
      process.env.MASTER_ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex');
      
      expect(() => decrypt(encrypted)).toThrow();
    });
  });

  describe('Round-trip encryption/decryption', () => {
    it('should handle various data types as strings', () => {
      const testCases = ['12345', 'true', 'null', ' ', '\n', '\t'];
      
      testCases.forEach(testCase => {
        const encrypted = encrypt(testCase);
        const decrypted = decrypt(encrypted);
        expect(decrypted).toBe(testCase);
      });
    });

    it('should handle repeated encryption/decryption', () => {
      let data = 'original data';
      
      for (let i = 0; i < 5; i++) {
        const encrypted = encrypt(data);
        const decrypted = decrypt(encrypted);
        expect(decrypted).toBe(data);
        data = decrypted;
      }
    });
  });

  describe('generateMasterKey()', () => {
    it('should generate a valid 64-character hex string', () => {
      const key = generateMasterKey();
      
      expect(key).toHaveLength(64);
      expect(/^[0-9a-f]{64}$/i.test(key)).toBe(true);
    });

    it('should generate unique keys each time', () => {
      const key1 = generateMasterKey();
      const key2 = generateMasterKey();
      
      expect(key1).not.toBe(key2);
    });

    it('should generate keys that work for encryption', () => {
      const key = generateMasterKey();
      process.env.MASTER_ENCRYPTION_KEY = key;
      
      const plaintext = 'test data with generated key';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);
      
      expect(decrypted).toBe(plaintext);
    });
  });

  describe('validateMasterKey()', () => {
    it('should return true for valid key', () => {
      expect(validateMasterKey()).toBe(true);
    });

    it('should throw error if key is not set', () => {
      delete process.env.MASTER_ENCRYPTION_KEY;
      expect(() => validateMasterKey()).toThrow('MASTER_ENCRYPTION_KEY is not set');
    });

    it('should throw error if key is invalid format', () => {
      process.env.MASTER_ENCRYPTION_KEY = 'invalid';
      expect(() => validateMasterKey()).toThrow('must be a 64-character hexadecimal string');
    });
  });

  describe('testEncryption()', () => {
    it('should return true if encryption is working correctly', () => {
      expect(testEncryption()).toBe(true);
    });

    it('should throw error if key is not set', () => {
      delete process.env.MASTER_ENCRYPTION_KEY;
      expect(() => testEncryption()).toThrow();
    });
  });

  describe('Real-world data types', () => {
    it('should encrypt/decrypt wallet mnemonics', () => {
      const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
      const encrypted = encrypt(mnemonic);
      const decrypted = decrypt(encrypted);
      
      expect(decrypted).toBe(mnemonic);
      expect(encrypted).not.toContain('abandon');
    });

    it('should encrypt/decrypt Polkadot addresses', () => {
      const address = '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5';
      const encrypted = encrypt(address);
      const decrypted = decrypt(encrypted);
      
      expect(decrypted).toBe(address);
      expect(encrypted).not.toContain(address);
    });

    it('should encrypt/decrypt configuration objects', () => {
      const config = {
        polkadot_multisig: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
        kusama_multisig: 'FmtsP3Zvj8HMK5vYJ3oXY51K6Mww64iDo8QdNjtKVwxdCaC',
        proposer_mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
      };
      
      const configString = JSON.stringify(config);
      const encrypted = encrypt(configString);
      const decrypted = decrypt(encrypted);
      
      expect(decrypted).toBe(configString);
      expect(JSON.parse(decrypted)).toEqual(config);
    });
  });

  describe('Security properties', () => {
    it('should use different IVs for each encryption', () => {
      const plaintext = 'same data';
      const encrypted1 = encrypt(plaintext);
      const encrypted2 = encrypt(plaintext);
      
      const iv1 = encrypted1.split(':')[0];
      const iv2 = encrypted2.split(':')[0];
      
      expect(iv1).not.toBe(iv2);
    });

    it('should produce ciphertext that looks random', () => {
      const plaintext = 'aaaaaaaaaa';
      const encrypted = encrypt(plaintext);
      
      // Ciphertext should not contain repeated patterns
      expect(encrypted).not.toContain('aaaa');
      expect(encrypted).not.toContain('0000');
    });
  });
});
