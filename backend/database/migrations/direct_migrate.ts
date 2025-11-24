import sqlite3 from 'sqlite3';
import { encrypt } from '../../src/utils/encryption';
import * as dotenv from 'dotenv';

dotenv.config();

const DB_PATH = './voting_tool.db';

function runAsync(db: sqlite3.Database, sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (this: sqlite3.RunResult, err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function getAsync(db: sqlite3.Database, sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

async function main() {
  console.log('=== Direct Migration ===\n');

  const db = new sqlite3.Database(DB_PATH);

  try {
    // Check if Default DAO exists
    const existing = await getAsync(db, "SELECT id FROM daos WHERE name = 'Default DAO'");
    
    let daoId: number;
    
    if (existing) {
      console.log(`✓ Default DAO already exists with ID: ${existing.id}\n`);
      daoId = existing.id;
    } else {
      // Get env vars
      const polkadotMultisig = process.env.POLKADOT_MULTISIG;
      const kusamaMultisig = process.env.KUSAMA_MULTISIG;
      const proposerMnemonic = process.env.PROPOSER_MNEMONIC;

      if (!polkadotMultisig || !kusamaMultisig || !proposerMnemonic) {
        throw new Error('Missing environment variables');
      }

      console.log(`Polkadot Multisig: ${polkadotMultisig}`);
      console.log(`Kusama Multisig: ${kusamaMultisig}\n`);

      // Encrypt
      console.log('Encrypting credentials...');
      const polkadotEnc = encrypt(polkadotMultisig);
      const kusamaEnc = encrypt(kusamaMultisig);
      const mnemonicEnc = encrypt(proposerMnemonic);
      console.log('✓ Encrypted\n');

      // Insert DAO
      console.log('Creating Default DAO...');
      const result = await runAsync(
        db,
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

      daoId = result.lastID;
      console.log(`✓ Created DAO with ID: ${daoId}\n`);
    }

    // Assign existing data
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
      const count = await getAsync(db, `SELECT COUNT(*) as count FROM ${table} WHERE dao_id IS NULL`);
      
      if (count.count > 0) {
        const result = await runAsync(db, `UPDATE ${table} SET dao_id = ? WHERE dao_id IS NULL`, [daoId]);
        console.log(`✓ ${table}: Assigned ${result.changes} records`);
      } else {
        console.log(`- ${table}: No records to assign`);
      }
    }

    // Verify
    console.log('\n=== Verification ===\n');
    const refCount = await getAsync(db, 'SELECT COUNT(*) as count FROM referendums WHERE dao_id IS NULL');
    const voteCount = await getAsync(db, 'SELECT COUNT(*) as count FROM voting_decisions WHERE dao_id IS NULL');
    const mimirCount = await getAsync(db, 'SELECT COUNT(*) as count FROM mimir_transactions WHERE dao_id IS NULL');

    console.log(`Referendums with NULL dao_id: ${refCount.count}`);
    console.log(`Voting decisions with NULL dao_id: ${voteCount.count}`);
    console.log(`Mimir transactions with NULL dao_id: ${mimirCount.count}`);

    if (refCount.count === 0 && voteCount.count === 0 && mimirCount.count === 0) {
      console.log('\n✅ Migration complete! All data assigned to DAO ' + daoId);
    }

    db.close();
    process.exit(0);
  } catch (error: any) {
    console.error('\n✗ Migration failed:', error.message);
    db.close();
    process.exit(1);
  }
}

main();

