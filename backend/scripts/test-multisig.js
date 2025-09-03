const { multisigService } = require('../dist/services/multisig');

async function testMultisig() {
  console.log('Testing multisig service...');
  
  try {
    // Test with the Alice address from the frontend
    const aliceAddress = '15oF4uVJwmo4TdGW7V2Yzgb5nTRw4CqxQ7Fq6QZ6QZ6QZ6QZ6QZ6';
    
    console.log('Testing address:', aliceAddress);
    
    // Check if it's a team member
    const isMember = await multisigService.isTeamMember(aliceAddress, 'Polkadot');
    console.log('Is Polkadot member:', isMember);
    
    const isKusamaMember = await multisigService.isTeamMember(aliceAddress, 'Kusama');
    console.log('Is Kusama member:', isKusamaMember);
    
    // Get team members
    const polkadotMembers = await multisigService.getCachedTeamMembers('Polkadot');
    console.log('Polkadot members count:', polkadotMembers.length);
    console.log('Polkadot members:', polkadotMembers.map(m => ({ address: m.wallet_address, name: m.team_member_name })));
    
    const kusamaMembers = await multisigService.getCachedTeamMembers('Kusama');
    console.log('Kusama members count:', kusamaMembers.length);
    console.log('Kusama members:', kusamaMembers.map(m => ({ address: m.wallet_address, name: m.team_member_name })));
    
    // Check if Alice is in any of the lists
    const foundInPolkadot = polkadotMembers.find(m => m.wallet_address === aliceAddress);
    const foundInKusama = kusamaMembers.find(m => m.wallet_address === aliceAddress);
    
    console.log('Alice found in Polkadot:', !!foundInPolkadot);
    console.log('Alice found in Kusama:', !!foundInKusama);
    
  } catch (error) {
    console.error('Error testing multisig:', error);
  }
}

testMultisig(); 