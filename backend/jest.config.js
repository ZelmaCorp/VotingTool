    // backend/jest.config.js
    module.exports = {
        preset: 'ts-jest',
        testEnvironment: 'node',
        testMatch: [
            "<rootDir>/tests/**/*.test.(ts|tsx)"
        ],
        moduleNameMapper: {
          // If you have path aliases in tsconfig.json, replicate them here
          // e.g., '^@/(.*)$': '<rootDir>/src/$1'
        },
        maxWorkers: '50%',
        testTimeout: 5000,
        verbose: false,
        silent: true
    };