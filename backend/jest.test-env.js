// Jest test environment setup - PROTECTS PRODUCTION DATABASE
// This file runs before ALL tests to ensure they use a separate test database

// Force all tests to use a separate test database
process.env.DATABASE_PATH = 'test_voting_tool.db';

// Prevent any accidental production database access
if (process.env.NODE_ENV !== 'test') {
  process.env.NODE_ENV = 'test';
}

console.log('🧪 Test Environment: Using database:', process.env.DATABASE_PATH);
console.log('🛡️  Production database protected!'); 