import { db } from '../../src/database/connection';
import { encrypt } from '../../src/utils/encryption';
import * as dotenv from 'dotenv';

dotenv.config();

async function migrate() {
  console.log('=== Simple Migration ===\n');

  try {
    // Check if Default DAO exists
    const existing = await db.get("SELECT id FROM daos WHERE name = 'Default DAO'");
    if (existing) {
      console.log(`Default DAO already exists with ID: ${existing.id}`);
      console.log('Using existing DAO for migration...\n');
      return existing.id;
    }

    // Get env vars
    const polkadotMultisig = process.env.POLKADOT_MULTISIG;
    const kusamaMultisig = process.env.KUSAMA_MULTISIG;
    const proposerMnemonic = process.env.PROPOSER_MNEMONIC;

    if (!polkadotMultisig || !kusamaMultisig || !proposerMnemonic) {
      throw new Error('Missing environment variables: POLKADOT_MULTISIG, KUSAMA_MULTISIG, PROPOSER_MNEMONIC');
    }

    console.log(`Polkadot Multisig: ${polkadotMultisig}`);
    console.log(`Kusama Multisig: ${kusamaMultisig}`);
    console.log('');

    // Encrypt
    console.log('Encrypting credentials...');
    const polkadotEnc = encrypt(polkadotMultisig);
    const kusamaEnc = encrypt(kusamaMultisig);
    const mnemonicEnc = encrypt(proposerMnemonic);
    console.log('✓ Encrypted\n');

    // Insert DAO
    console.log('Creating Default DAO...');
    const result = await db.run(
      `INSERT INTO daos (name, description, status, polkadot_multisig_encrypted, kusama_multisig_encrypted, proposer_mnemonic_encrypted)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        'Default DAO',
        'Default DAO created from existing configuration during multi-DAO migration',
        'active',
        polkadotEnc,
        kusamaEnc,
        mnemonicEnc
      ]
    );

    const daoId = result.lastID;
    console.log(`✓ Created DAO with ID: ${daoId}\n`);

    return daoId;
  } catch (error: any) {
    console.error('Error creating DAO:', error.message);
    throw error;
  }
}

async function assignData(daoId: number) {
  console.log('=== Assigning Existing Data ===\n');

  const tables = [
    'referendums',
    'scoring_criteria',
    'referendum_team_roles',
    'voting_decisions',
    'discussion_topics',
    'referendum_comments',
    'mimir_transactions',
    'audit_log'
  ];

  for (const table of tables) {
    try {
      const count = await db.get(`SELECT COUNT(*) as count FROM ${table} WHERE dao_id IS NULL`);
      
      if (count.count > 0) {
        const result = await db.run(`UPDATE ${table} SET dao_id = ? WHERE dao_id IS NULL`, [daoId]);
        console.log(`✓ ${table}: Assigned ${result.changes} records`);
      } else {
        console.log(`- ${table}: No records to assign`);
      }
    } catch (error: any) {
      console.error(`✗ ${table}: ${error.message}`);
    }
  }
}

async function verify(daoId: number) {
  console.log('\n=== Verification ===\n');

  const checks = [
    { name: 'referendums', query: 'SELECT COUNT(*) as count FROM referendums WHERE dao_id IS NULL' },
    { name: 'voting_decisions', query: 'SELECT COUNT(*) as count FROM voting_decisions WHERE dao_id IS NULL' },
    { name: 'mimir_transactions', query: 'SELECT COUNT(*) as count FROM mimir_transactions WHERE dao_id IS NULL' }
  ];

  let allGood = true;
  for (const check of checks) {
    const result = await db.get(check.query);
    if (result.count > 0) {
      console.log(`✗ ${check.name}: ${result.count} records still have NULL dao_id`);
      allGood = false;
    } else {
      console.log(`✓ ${check.name}: All records assigned`);
    }
  }

  if (allGood) {
    console.log('\n✅ Migration complete! All data assigned to DAO ${daoId}');
  }
}

// Run it
(async () => {
  try {
    const daoId = await migrate();
    await assignData(daoId);
    await verify(daoId);
    console.log('\n✅ Migration successful!');
    process.exit(0);
  } catch (error: any) {
    console.error('\n✗ Migration failed:', error.message);
    process.exit(1);
  }
})();

