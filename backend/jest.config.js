    // backend/jest.config.js
    require('dotenv').config();
    
    module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        "<rootDir>/tests/**/*.test.(ts|tsx)"
    ],
    // Conditional setup: only map environment variables for integration tests
    setupFilesAfterEnv: [
        '<rootDir>/jest.integration-setup.js'
    ],
    moduleNameMapper: {
      // If you have path aliases in tsconfig.json, replicate them here
      // e.g., '^@/(.*)$': '<rootDir>/src/$1'
    },
    maxWorkers: '50%',
    testTimeout: 30000, // Increased timeout for integration tests with Notion API
    verbose: false,
    silent: true
};