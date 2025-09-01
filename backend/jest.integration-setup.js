// Smart Jest setup that only applies to integration tests
require('dotenv').config();

// Check if this is an integration test by looking at the test path
const isIntegrationTest = expect.getState().testPath?.includes('integration') || 
                          process.env.JEST_INTEGRATION_TEST === 'true';

if (isIntegrationTest) {
  console.log('🧪 Integration test environment configured');
} 