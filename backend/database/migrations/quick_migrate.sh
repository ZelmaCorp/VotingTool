#!/bin/bash
set -e

echo "=== Quick Migration Script ==="
echo ""

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Check required vars
if [ -z "$POLKADOT_MULTISIG" ] || [ -z "$KUSAMA_MULTISIG" ] || [ -z "$PROPOSER_MNEMONIC" ]; then
  echo "Error: Missing required environment variables"
  exit 1
fi

# Generate encrypted values using Node.js
echo "Generating encrypted values..."
node << 'NODE_SCRIPT'
const { encrypt } = require('./src/utils/encryption');
require('dotenv').config();

const polkadotEnc = encrypt(process.env.POLKADOT_MULTISIG);
const kusamaEnc = encrypt(process.env.KUSAMA_MULTISIG);
const mnemonicEnc = encrypt(process.env.PROPOSER_MNEMONIC);

console.log(JSON.stringify({
  polkadot: polkadotEnc,
  kusama: kusamaEnc,
  mnemonic: mnemonicEnc
}));
NODE_SCRIPT

echo "Migration prepared. Run the SQL commands manually."
