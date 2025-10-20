/**
 * Cryptographic utilities for secure token handling
 * Provides encryption/decryption functions for sensitive data
 */
import CryptoJS from 'crypto-js';

// Get secret key from environment variables
const SECRET_KEY = process.env.REACT_APP_CRYPTO_SECRET || 'default_secret_key';

// Validate that we have a proper secret key
if (!process.env.REACT_APP_CRYPTO_SECRET) {
  console.warn(
    '⚠️  WARNING: Using default crypto secret key. Please set REACT_APP_CRYPTO_SECRET environment variable for production!'
  );
}

/**
 * Encrypt a token or sensitive data
 * @param {string} token - The data to encrypt
 * @returns {string} Encrypted data as base64 string
 * @throws {Error} If encryption fails
 */
export const encryptToken = (token) => {
  try {
    if (!token) {
      throw new Error('Token cannot be empty');
    }

    // Generate a random IV for each encryption
    const iv = CryptoJS.lib.WordArray.random(16);
    
    // Encrypt the token with AES-256-CBC
    const encrypted = CryptoJS.AES.encrypt(token, SECRET_KEY, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Combine IV and encrypted data
    const combined = iv.concat(encrypted.ciphertext);
    
    return combined.toString(CryptoJS.enc.Base64);
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt token');
  }
};

/**
 * Decrypt an encrypted token
 * @param {string} encrypted - The encrypted data as base64 string
 * @returns {string|null} Decrypted data or null if decryption fails
 */
export const decryptToken = (encrypted) => {
  try {
    if (!encrypted) {
      return null;
    }

    // Convert from base64
    const combined = CryptoJS.enc.Base64.parse(encrypted);
    
    // Extract IV (first 16 bytes)
    const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4));
    
    // Extract ciphertext (remaining bytes)
    const ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(4));
    
    // Decrypt
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: ciphertext },
      SECRET_KEY,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) {
      throw new Error('Decryption resulted in empty string');
    }

    return decryptedString;
  } catch (error) {
    console.warn('Decryption failed:', error.message);
    return null;
  }
};

/**
 * Hash a password using PBKDF2
 * @param {string} password - The password to hash
 * @param {string} salt - Optional salt (will generate if not provided)
 * @returns {Object} Object containing hash and salt
 */
export const hashPassword = (password, salt = null) => {
  try {
    if (!password) {
      throw new Error('Password cannot be empty');
    }

    // Generate salt if not provided
    const passwordSalt = salt || CryptoJS.lib.WordArray.random(128/8).toString();
    
    // Hash password with PBKDF2
    const hash = CryptoJS.PBKDF2(password, passwordSalt, {
      keySize: 256/32,
      iterations: 10000,
    });

    return {
      hash: hash.toString(),
      salt: passwordSalt,
    };
  } catch (error) {
    console.error('Password hashing failed:', error);
    throw new Error('Failed to hash password');
  }
};

/**
 * Verify a password against a hash
 * @param {string} password - The password to verify
 * @param {string} hash - The stored hash
 * @param {string} salt - The salt used for hashing
 * @returns {boolean} True if password matches, false otherwise
 */
export const verifyPassword = (password, hash, salt) => {
  try {
    if (!password || !hash || !salt) {
      return false;
    }

    const { hash: computedHash } = hashPassword(password, salt);
    return computedHash === hash;
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
};

/**
 * Generate a secure random token
 * @param {number} length - Length of the token in bytes (default: 32)
 * @returns {string} Random token as hex string
 */
export const generateSecureToken = (length = 32) => {
  try {
    const randomBytes = CryptoJS.lib.WordArray.random(length);
    return randomBytes.toString(CryptoJS.enc.Hex);
  } catch (error) {
    console.error('Token generation failed:', error);
    throw new Error('Failed to generate secure token');
  }
};

/**
 * Sanitize input to prevent XSS attacks
 * @param {string} input - The input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid, false otherwise
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with score and feedback
 */
export const validatePasswordStrength = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      score: 0,
      feedback: ['Password is required'],
    };
  }

  const feedback = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password must be at least 8 characters long');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one uppercase letter');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one lowercase letter');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one number');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one special character');
  }

  return {
    isValid: score >= 4,
    score,
    feedback,
  };
};
