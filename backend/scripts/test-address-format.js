const { multisigService } = require('../dist/services/multisig');

async function testAddressFormat() {
  console.log('Testing address format matching...\n');
  
  try {
    // Test with the Alice address from the frontend
    const aliceAddress = '15oF4uVJwmo4TdGW7V2Yzgb5nTRw4CqxQ7Fq6QZ6QZ6QZ6QZ6QZ6';
    
    console.log('=== TESTING ALICE ADDRESS ===');
    console.log('Alice address:', aliceAddress);
    console.log('Length:', aliceAddress.length);
    console.log('Format check:', aliceAddress.startsWith('1') ? 'Valid Polkadot format' : 'Invalid format');
    
    // Get team members to see the exact format
    console.log('\n=== FETCHING TEAM MEMBERS ===');
    const polkadotMembers = await multisigService.getCachedTeamMembers('Polkadot');
    const kusamaMembers = await multisigService.getCachedTeamMembers('Kusama');
    
    console.log(`Polkadot members: ${polkadotMembers.length}`);
    if (polkadotMembers.length > 0) {
      console.log('Sample Polkadot member:');
      console.log('  Address:', polkadotMembers[0].wallet_address);
      console.log('  Length:', polkadotMembers[0].wallet_address.length);
      console.log('  Format check:', polkadotMembers[0].wallet_address.startsWith('1') ? 'Valid Polkadot format' : 'Invalid format');
      
      // Test exact match
      const exactMatch = polkadotMembers[0].wallet_address === aliceAddress;
      console.log('  Exact match with Alice:', exactMatch);
      
      // Test if Alice is in the list
      const aliceInList = polkadotMembers.some(m => m.wallet_address === aliceAddress);
      console.log('  Alice found in list:', aliceInList);
    }
    
    console.log(`\nKusama members: ${kusamaMembers.length}`);
    if (kusamaMembers.length > 0) {
      console.log('Sample Kusama member:');
      console.log('  Address:', kusamaMembers[0].wallet_address);
      console.log('  Length:', kusamaMembers[0].wallet_address.length);
      console.log('  Format check:', kusamaMembers[0].wallet_address.startsWith('H') ? 'Valid Kusama format' : 'Invalid format');
      
      // Test exact match
      const exactMatch = kusamaMembers[0].wallet_address === aliceAddress;
      console.log('  Exact match with Alice:', exactMatch);
      
      // Test if Alice is in the list
      const aliceInList = kusamaMembers.some(m => m.wallet_address === aliceAddress);
      console.log('  Alice found in list:', aliceInList);
    }
    
    // Test the isTeamMember function directly
    console.log('\n=== TESTING isTeamMember FUNCTION ===');
    const isPolkadotMember = await multisigService.isTeamMember(aliceAddress, 'Polkadot');
    const isKusamaMember = await multisigService.isTeamMember(aliceAddress, 'Kusama');
    
    console.log('Is Polkadot member:', isPolkadotMember);
    console.log('Is Kusama member:', isKusamaMember);
    
  } catch (error) {
    console.error('Error testing address format:', error);
  }
}

testAddressFormat(); 