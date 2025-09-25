# Testing Guide - OpenGov Voting Tool

## Overview

This guide covers how to run tests for the OpenGov Voting Tool. The project includes both backend and frontend testing:

- **Backend**: Uses Jest as the testing framework (Node.js/TypeScript)
- **Frontend Extension**: Uses Vitest as the testing framework (Vue.js/TypeScript)
- **Test Frontend**: A simple test application for integration testing

## Backend Testing

**Important**: All backend tests must be run from the `backend/` directory.

## Running Tests

### Quick Start

```bash  
# Run all tests
npm test

# Run with coverage report
npm run test:coverage
```

### Specific Test Suites

#### Unit Tests Only
```bash
npm run test:unit
```

#### Integration Tests Only
```bash
npm run test:integration
```

#### All Tests (Unit + Integration)
```bash
npm run test:all
```

### Specific Test Categories

```bash
# Rate limiting tests (unit)
npm run test:unit:rate-limit

# Utility function tests (unit)  
npm run test:unit:utils

# Fetch referendas tests (unit)
npm run test:unit:fetch

# Polkassembly integration tests
npm run test:integration:polkassembly

# Rate limiting integration tests
npm run test:integration:rate-limit

# CoinGecko integration tests
npm run test:integration:coingecko

# Fetch referendas tests (integration)
npm run test:integration:fetch
```

### Test Modes

#### Watch Mode (Development)
```bash
npm run test:watch
```
Runs tests in watch mode, automatically re-running when files change.

#### Verbose Output
```bash
npm run test:verbose
```
Shows detailed output for all tests, including console logs.

#### Coverage Report
```bash
npm run test:coverage
```
Generates a detailed coverage report showing which lines are tested.

## Test Environment Setup

### Required Environment Variables

For integration tests to work properly, you need to set up test-specific environment variables. These are already included in the main `env.example` file.

#### Test Sandbox Configuration
```bash
# Test proposer mnemonic (for sandbox testing)
SANDBOX_PROPOSER_MNEMONIC=test_mnemonic_here

# Test multisig addresses (for sandbox testing)
SANDBOX_KUSAMA_MULTISIG=test_kusama_multisig_here
SANDBOX_POLKADOT_MULTISIG=test_polkadot_multisig_here
```

### Setting Up Test Environment

1. **Copy environment variables:**
   ```bash
   # From project root
   cp env.example .env
   ```

2. **Configure test variables:**
   - Uncomment and set up the test-specific variables in your `.env` file
   - Configure sandbox accounts for multisig testing

3. **Verify setup:**
   ```bash
   # Test all integrations
   npm run test:integration
   ```

## Frontend Extension Testing

**Important**: All frontend extension tests must be run from the `extension/` directory.

### Quick Start

```bash
# Navigate to extension directory
cd extension

# Run all frontend tests
npm test

# Run tests once (non-watch mode)
npm run test:run

# Run with coverage report
npm run test:coverage
```

### Frontend Test Features

#### Watch Mode (Development)
```bash
cd extension
npm test
```
Runs tests in watch mode using Vitest, automatically re-running when files change.

#### Single Run Mode
```bash
cd extension
npm run test:run
```
Runs all tests once and exits - useful for CI/CD pipelines.

#### Coverage Report
```bash
cd extension
npm run test:coverage
```
Generates a detailed coverage report for the Vue.js extension code.

### Frontend Test Structure

The extension tests are located in:
- `extension/src/__tests__/` - Main test files
  - `inject.test.ts` - Tests for content script injection functionality
  - `background.test.ts` - Tests for background script functionality
- `extension/src/stores/__tests__/` - Store test files
  - `teamStore.test.ts` - Tests for team store functionality
  - `proposalStore.test.ts` - Tests for proposal store functionality
  - `authStore.test.ts` - Tests for authentication store functionality
- `extension/src/utils/__tests__/` - Utility test files
  - `teamUtils.test.ts` - Tests for team utility functions
  - `browser.test.ts` - Tests for browser utility functions
- `extension/src/test/setup.ts` - Test configuration and setup

### Frontend Test Environment

- **Framework**: Vitest with Vue Test Utils
- **Environment**: happy-dom (lightweight DOM simulation)
- **Coverage**: V8 provider with HTML, JSON, and text reports
- **Global Setup**: Configured in `vitest.config.ts`

## Test Frontend Application

The `test-frontend/` directory contains a simple Vue.js application for manual integration testing.

### Running the Test Frontend

```bash
# Navigate to test-frontend directory
cd test-frontend

# Install dependencies (if not already done)
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Serve on all interfaces (useful for Docker/remote testing)
npm run serve
```

### Test Frontend Purpose

This application is designed for:
- Manual testing of the voting tool API endpoints
- SQLite database migration testing
- Integration testing between frontend and backend
- UI/UX testing of voting workflows

## Running All Tests

### Complete Test Suite
```bash
# Run backend tests
cd backend && npm test

# Run frontend extension tests
cd ../extension && npm run test:run

# Optional: Start test frontend for manual testing
cd ../test-frontend && npm run dev
```

### CI/CD Pipeline Tests
```bash
# Backend with coverage
cd backend && npm run test:coverage

# Frontend with coverage
cd ../extension && npm run test:coverage
``` 