    // backend/jest.config.js
    require('dotenv').config();
    
    module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "<rootDir>/tests/**/*.test.(ts|tsx)"
  ],
  // CRITICAL: Protect production database
  setupFiles: ['<rootDir>/jest.test-env.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.integration-setup.js'],
  moduleNameMapper: {
    // If you have path aliases in tsconfig.json, replicate them here
    // e.g., '^@/(.*)$': '<rootDir>/src/$1'
  },
  maxWorkers: 1,
  testTimeout: 180000, // Increased timeout for integration tests
  verbose: false,
  silent: true,
  // Additional settings to handle Node.js issues
  workerIdleMemoryLimit: '512MB',
  detectOpenHandles: true,
  forceExit: true
};