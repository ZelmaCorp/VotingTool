const { multisigService } = require('../dist/services/multisig');

async function fetchMultisigMembers() {
  console.log('Fetching multisig members...\n');
  
  try {
    // Fetch Polkadot multisig members
    console.log('=== POLKADOT MULTISIG ===');
    const polkadotMembers = await multisigService.getCachedTeamMembers('Polkadot');
    console.log(`Found ${polkadotMembers.length} members:`);
    polkadotMembers.forEach((member, index) => {
      console.log(`${index + 1}. ${member.team_member_name} (${member.wallet_address})`);
    });
    
    console.log('\n=== KUSAMA MULTISIG ===');
    const kusamaMembers = await multisigService.getCachedTeamMembers('Kusama');
    console.log(`Found ${kusamaMembers.length} members:`);
    kusamaMembers.forEach((member, index) => {
      console.log(`${index + 1}. ${member.team_member_name} (${member.wallet_address})`);
    });
    
    console.log('\n=== SUMMARY ===');
    console.log(`Total Polkadot members: ${polkadotMembers.length}`);
    console.log(`Total Kusama members: ${kusamaMembers.length}`);
    
    if (polkadotMembers.length === 0 && kusamaMembers.length === 0) {
      console.log('\n⚠️  No members found! This could mean:');
      console.log('   - SUBSCAN_API_KEY is invalid or expired');
      console.log('   - Multisig addresses are incorrect');
      console.log('   - Network issues with Subscan API');
    }
    
  } catch (error) {
    console.error('Error fetching multisig members:', error);
  }
}

fetchMultisigMembers(); 