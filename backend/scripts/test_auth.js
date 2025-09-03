#!/usr/bin/env node

/**
 * Test script for Web3 authentication system (Multisig-based)
 * Run this script to test the authentication endpoints
 */

const axios = require('axios');

const BASE_URL = process.env.API_URL || 'http://localhost:3000';

// Test data - replace with actual values for testing
const TEST_DATA = {
    address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', // Example address
    signature: '0x1234567890abcdef', // Example signature
    message: 'Test authentication message',
    timestamp: Date.now()
};

async function testAuthEndpoints() {
    console.log('🧪 Testing Blockchain-Based Web3 Authentication System\n');
    
    try {
        // Test 1: Health check
        console.log('1. Testing health endpoint...');
        const healthResponse = await axios.get(`${BASE_URL}/health`);
        console.log('✅ Health check passed:', healthResponse.data.status);
        
        // Test 2: Try to access protected endpoint without auth
        console.log('\n2. Testing protected endpoint without authentication...');
        try {
            await axios.get(`${BASE_URL}/auth/profile`);
            console.log('❌ Should have failed - endpoint not properly protected');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Protected endpoint properly requires authentication');
            } else {
                console.log('⚠️ Unexpected error:', error.response?.status);
            }
        }
        
        // Test 3: Test Web3 login with invalid data
        console.log('\n3. Testing Web3 login with invalid data...');
        try {
            await axios.post(`${BASE_URL}/auth/web3-login`, TEST_DATA);
            console.log('❌ Should have failed - invalid signature');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Invalid signature properly rejected');
            } else {
                console.log('⚠️ Unexpected error:', error.response?.status);
            }
        }
        
        // Test 4: Test DAO governance endpoints without auth
        console.log('\n4. Testing DAO governance endpoints without authentication...');
        try {
          await axios.get(`${BASE_URL}/dao/members`);
          console.log('❌ Should have failed - endpoint not properly protected');
        } catch (error) {
          if (error.response?.status === 401) {
            console.log('✅ DAO endpoint properly requires authentication');
          } else {
            console.log('⚠️ Unexpected error:', error.response?.status);
          }
        }
        
        // Test 5: Test DAO governance endpoints with auth (should work)
        console.log('\n5. Testing DAO governance endpoints with authentication...');
        try {
          // This will fail with 401 since we don't have a valid token
          // but it tests the authentication flow
          await axios.get(`${BASE_URL}/dao/members`, {
            headers: { Authorization: 'Bearer invalid-token' }
          });
          console.log('❌ Should have failed - invalid token');
        } catch (error) {
          if (error.response?.status === 401) {
            console.log('✅ Invalid token properly rejected');
          } else {
            console.log('⚠️ Unexpected error:', error.response?.status);
          }
        }
        
        console.log('\n🎉 DAO governance authentication system tests completed!');
        console.log('\n📝 Next steps:');
        console.log('1. Ensure POLKADOT_MULTISIG and KUSAMA_MULTISIG are set in .env');
        console.log('2. Ensure SUBSCAN_API_KEY is set for blockchain data fetching');
        console.log('3. Test with a real Polkadot wallet extension');
        console.log('4. Verify multisig member addresses are fetched from blockchain');
        console.log('5. Test governance action assignment during referendum discussion');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Make sure the backend server is running on', BASE_URL);
        }
    }
}

// Run tests if this script is executed directly
if (require.main === module) {
    testAuthEndpoints();
}

module.exports = { testAuthEndpoints }; 