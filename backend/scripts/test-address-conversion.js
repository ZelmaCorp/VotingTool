const { decodeAddress, encodeAddress } = require('@polkadot/keyring');

// Test address conversion
function testAddressConversion() {
  console.log('Testing address format conversion...\n');
  
  // Your generic address that starts with 5
  const genericAddress = '5FRPxqwZaqh5uoYBD8U5VYpEYmhZYyKjVnRe5JBVyyzVMxqk';
  
  try {
    // Decode the generic address to get the public key
    const publicKey = decodeAddress(genericAddress);
    console.log('✅ Generic address decoded successfully');
    console.log(`   Generic: ${genericAddress}`);
    console.log(`   Public Key: ${publicKey.toString('hex')}\n`);
    
    // Convert to Polkadot network format (prefix 0)
    const polkadotAddress = encodeAddress(publicKey, 0);
    console.log('✅ Converted to Polkadot format');
    console.log(`   Polkadot: ${polkadotAddress}\n`);
    
    // Convert to Kusama network format (prefix 2)
    const kusamaAddress = encodeAddress(publicKey, 2);
    console.log('✅ Converted to Kusama format');
    console.log(`   Kusama: ${kusamaAddress}\n`);
    
    // Test the conversion
    console.log('🔍 Conversion Results:');
    console.log(`   Generic (5...): ${genericAddress}`);
    console.log(`   Polkadot (1...): ${polkadotAddress}`);
    console.log(`   Kusama (J...): ${kusamaAddress}`);
    
    // Verify the conversion is correct
    const expectedPolkadot = genericAddress.replace(/^5/, '1');
    const expectedKusama = genericAddress.replace(/^5/, 'J');
    
    console.log('\n🔍 Expected vs Actual:');
    console.log(`   Expected Polkadot: ${expectedPolkadot}`);
    console.log(`   Actual Polkadot:   ${polkadotAddress}`);
    console.log(`   Match: ${expectedPolkadot === polkadotAddress ? '✅' : '❌'}`);
    
    console.log(`   Expected Kusama: ${expectedKusama}`);
    console.log(`   Actual Kusama:   ${kusamaAddress}`);
    console.log(`   Match: ${expectedKusama === kusamaAddress ? '✅' : '❌'}`);
    
  } catch (error) {
    console.error('❌ Error during address conversion:', error.message);
  }
}

testAddressConversion(); 