# Testing Guide - OpenGov Voting Tool

## Overview

This guide covers how to run tests for the OpenGov Voting Tool. The project uses Jest as the testing framework.

**Important**: All tests must be run from the `backend/` directory.

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
# Rate limiting tests
npm run test:unit:rate-limit

# Utility function tests
npm run test:unit:utils

# Notion integration tests
npm run test:integration:notion

# Polkassembly integration tests
npm run test:integration:polkassembly

# Rate limiting integration tests
npm run test:integration:rate-limit

# CoinGecko integration tests
npm run test:integration:coingecko
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

For integration tests to work properly, you need to set up test-specific environment variables. These are already included in the main `backend/.env.example` file.

#### Test Notion Configuration
```bash
# Test Notion API token (different from production)
NOTION_TEST_API_TOKEN=your_test_notion_api_token

# Test Notion database ID (separate from production)
NOTION_TEST_DATABASE_ID=your_test_notion_database_id
```

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
   cd backend
   cp .env.example .env
   ```

2. **Configure test variables:**
   - Uncomment and set up the test-specific variables in your `.env` file
   - Set up a separate Notion integration for testing
   - Create a test database in Notion
   - Configure sandbox accounts for multisig testing

3. **Verify setup:**
   ```bash
   # Test Notion connection
   npm run test:integration:notion
   
   # Test all integrations
   npm run test:integration
   ``` 