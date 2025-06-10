// Smart Jest setup that only applies to integration tests
require('dotenv').config();

// Check if this is an integration test by looking at the test path
const isIntegrationTest = expect.getState().testPath?.includes('integration') || 
                          process.env.JEST_INTEGRATION_TEST === 'true';

if (isIntegrationTest && process.env.NOTION_TEST_API_TOKEN && process.env.NOTION_TEST_DATABASE_ID) {
  // Map test environment variables to production variable names
  process.env.NOTION_API_TOKEN = process.env.NOTION_TEST_API_TOKEN;
  process.env.NOTION_DATABASE_ID = process.env.NOTION_TEST_DATABASE_ID;
  process.env.NOTION_VERSION = '2022-06-28';
  
  console.log('🧪 Integration test environment configured with test credentials');
} 