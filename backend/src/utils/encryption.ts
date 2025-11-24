import crypto from 'crypto';
import { createSubsystemLogger } from '../config/logger';
import { Subsystem } from '../types/logging';

const logger = createSubsystemLogger(Subsystem.DATABASE);

// Algorithm configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16;  // 128 bits (recommended for GCM)
const AUTH_TAG_LENGTH = 16; // 128 bits
const ENCODING: BufferEncoding = 'hex';

/**
 * Get the master encryption key from environment variables
 * The key should be a 64-character hex string (32 bytes)
 */
function getMasterKey(): Buffer {
  const keyHex = process.env.MASTER_ENCRYPTION_KEY;
  
  if (!keyHex) {
    throw new Error(
      'MASTER_ENCRYPTION_KEY is not set in environment variables. ' +
      'Generate one using: node -e "console.log(crypto.randomBytes(32).toString(\'hex\'))"'
    );
  }
  
  // Validate key format
  if (!/^[0-9a-f]{64}$/i.test(keyHex)) {
    throw new Error(
      'MASTER_ENCRYPTION_KEY must be a 64-character hexadecimal string (32 bytes). ' +
      'Generate one using: node -e "console.log(crypto.randomBytes(32).toString(\'hex\'))"'
    );
  }
  
  return Buffer.from(keyHex, 'hex');
}

/**
 * Encrypts a plaintext string using AES-256-GCM
 * 
 * @param plaintext - The string to encrypt
 * @returns Encrypted string in format: iv:authTag:ciphertext (all hex encoded)
 * @throws Error if encryption fails or MASTER_ENCRYPTION_KEY is not set
 * 
 * @example
 * ```typescript
 * const encrypted = encrypt('my secret data');
 * // Returns: "a1b2c3d4....:e5f6g7h8....:i9j0k1l2...."
 * ```
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) {
    throw new Error('Cannot encrypt empty or null plaintext');
  }
  
  try {
    const key = getMasterKey();
    
    // Generate random IV for this encryption
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    // Encrypt the data
    let ciphertext = cipher.update(plaintext, 'utf8', ENCODING);
    ciphertext += cipher.final(ENCODING);
    
    // Get authentication tag (GCM provides authenticated encryption)
    const authTag = cipher.getAuthTag();
    
    // Combine IV + authTag + ciphertext (all hex encoded)
    const encrypted = `${iv.toString(ENCODING)}:${authTag.toString(ENCODING)}:${ciphertext}`;
    
    logger.debug({ 
      plaintextLength: plaintext.length,
      encryptedLength: encrypted.length 
    }, 'Successfully encrypted data');
    
    return encrypted;
  } catch (error) {
    logger.error({ error: (error as Error).message }, 'Encryption failed');
    throw new Error(`Encryption failed: ${(error as Error).message}`);
  }
}

/**
 * Decrypts a ciphertext string that was encrypted with encrypt()
 * 
 * @param encryptedData - Encrypted string in format: iv:authTag:ciphertext (hex encoded)
 * @returns Decrypted plaintext string
 * @throws Error if decryption fails, data is tampered, or format is invalid
 * 
 * @example
 * ```typescript
 * const plaintext = decrypt('a1b2c3d4....:e5f6g7h8....:i9j0k1l2....');
 * // Returns: "my secret data"
 * ```
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) {
    throw new Error('Cannot decrypt empty or null encrypted data');
  }
  
  try {
    const key = getMasterKey();
    
    // Split the encrypted data into components
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error(
        `Invalid encrypted data format. Expected "iv:authTag:ciphertext", got ${parts.length} parts`
      );
    }
    
    const [ivHex, authTagHex, ciphertext] = parts;
    
    // Convert hex strings back to buffers
    const iv = Buffer.from(ivHex, ENCODING);
    const authTag = Buffer.from(authTagHex, ENCODING);
    
    // Validate component lengths
    if (iv.length !== IV_LENGTH) {
      throw new Error(`Invalid IV length: expected ${IV_LENGTH}, got ${iv.length}`);
    }
    if (authTag.length !== AUTH_TAG_LENGTH) {
      throw new Error(`Invalid auth tag length: expected ${AUTH_TAG_LENGTH}, got ${authTag.length}`);
    }
    
    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    
    // Set authentication tag (GCM will verify data integrity)
    decipher.setAuthTag(authTag);
    
    // Decrypt the data
    let plaintext = decipher.update(ciphertext, ENCODING, 'utf8');
    plaintext += decipher.final('utf8');
    
    logger.debug({ 
      encryptedLength: encryptedData.length,
      plaintextLength: plaintext.length 
    }, 'Successfully decrypted data');
    
    return plaintext;
  } catch (error) {
    const errorMessage = (error as Error).message;
    
    // Check for authentication failure (data was tampered with)
    if (errorMessage.includes('Unsupported state or unable to authenticate data')) {
      logger.error('Decryption failed: Data authentication failed (data may have been tampered with)');
      throw new Error('Decryption failed: Data authentication failed. The data may have been tampered with or the encryption key is incorrect.');
    }
    
    logger.error({ error: errorMessage }, 'Decryption failed');
    throw new Error(`Decryption failed: ${errorMessage}`);
  }
}

/**
 * Utility function to generate a new master encryption key
 * This is useful for initial setup or key rotation
 * 
 * @returns A 64-character hexadecimal string suitable for MASTER_ENCRYPTION_KEY
 * 
 * @example
 * ```typescript
 * const newKey = generateMasterKey();
 * console.log(`MASTER_ENCRYPTION_KEY=${newKey}`);
 * ```
 */
export function generateMasterKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
}

/**
 * Validates that the MASTER_ENCRYPTION_KEY is properly configured
 * 
 * @returns true if key is valid, throws error otherwise
 * @throws Error if key is missing or invalid
 */
export function validateMasterKey(): boolean {
  try {
    getMasterKey();
    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Tests encryption/decryption round-trip to ensure configuration is correct
 * 
 * @returns true if test passes, throws error otherwise
 * @throws Error if encryption/decryption test fails
 */
export function testEncryption(): boolean {
  const testData = 'test-encryption-round-trip-' + Date.now();
  
  try {
    const encrypted = encrypt(testData);
    const decrypted = decrypt(encrypted);
    
    if (decrypted !== testData) {
      throw new Error('Round-trip test failed: decrypted data does not match original');
    }
    
    logger.info('Encryption test passed successfully');
    return true;
  } catch (error) {
    logger.error({ error: (error as Error).message }, 'Encryption test failed');
    throw new Error(`Encryption test failed: ${(error as Error).message}`);
  }
}

