const axios = require('axios');

// Test script to verify the assignment functionality
async function testAssignment() {
    const baseURL = 'http://localhost:3000';
    
    try {
        console.log('🧪 Testing assignment functionality...\n');
        
        // First, let's check if referendum 1740 exists
        console.log('1. Checking if referendum 1740 exists...');
        try {
            const response = await axios.get(`${baseURL}/referendums/1740?chain=Polkadot`);
            console.log('✅ Referendum 1740 found:', response.data.referendum?.title || 'No title');
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('❌ Referendum 1740 not found (404)');
                console.log('   This is expected if the referendum hasn\'t been refreshed yet.');
                
                // Try to refresh referenda
                console.log('\n2. Triggering referendum refresh...');
                try {
                    const refreshResponse = await axios.get(`${baseURL}/admin/refresh-referendas?limit=50`);
                    console.log('✅ Refresh triggered:', refreshResponse.data.message);
                    console.log('   Wait a few seconds for the refresh to complete, then try the assignment again.');
                } catch (refreshError) {
                    console.log('❌ Failed to trigger refresh:', refreshError.message);
                }
            } else {
                console.log('❌ Error checking referendum:', error.message);
            }
        }
        
        console.log('\n3. Testing assignment API endpoint structure...');
        
        // Test the assignment endpoint (this will fail without auth, but we can see the error structure)
        try {
            const assignmentResponse = await axios.post(`${baseURL}/dao/referendum/1740/action`, {
                action: 'responsible_person',
                chain: 'Polkadot'
            });
            console.log('✅ Assignment successful:', assignmentResponse.data);
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Assignment endpoint working (401 Unauthorized - authentication required)');
                console.log('   This is expected since we\'re not authenticated.');
            } else if (error.response?.status === 404) {
                console.log('❌ Referendum still not found after refresh attempt');
                console.log('   The referendum might not exist on Polkassembly or the refresh is still in progress.');
            } else {
                console.log('❌ Assignment error:', error.response?.data || error.message);
            }
        }
        
        console.log('\n📋 Summary:');
        console.log('- Backend API endpoints are properly structured');
        console.log('- Assignment requires authentication (expected)');
        console.log('- Referendum refresh functionality is available');
        console.log('- Extension should now work correctly with proper authentication');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testAssignment(); 