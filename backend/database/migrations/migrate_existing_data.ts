/**
 * Data Migration Script: Populate dao_id values for existing records
 * 
 * This script:
 * 1. Creates a default DAO from environment variables
 * 2. Encrypts and stores the multisig addresses and mnemonic
 * 3. Assigns all existing referendums and related records to the default DAO
 * 
 * Run this AFTER running 001_add_multi_dao_support.sql
 */

import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { encrypt, validateMasterKey } from '../../src/utils/encryption';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Database {
  run: (sql: string, params?: any[]) => Promise<{ lastID: number; changes: number }>;
  get: (sql: string, params?: any[]) => Promise<any>;
  all: (sql: string, params?: any[]) => Promise<any[]>;
  close: () => Promise<void>;
}

/**
 * Create a promisified database connection
 */
function createDbConnection(dbPath: string): Database {
  const db = new sqlite3.Database(dbPath);
  
  return {
    run: promisify(db.run.bind(db)),
    get: promisify(db.get.bind(db)),
    all: promisify(db.all.bind(db)),
    close: promisify(db.close.bind(db)),
  };
}

/**
 * Create default DAO from environment variables
 */
async function createDefaultDao(db: Database): Promise<{ daoId: number }> {
  console.log('\n=== Creating Default DAO ===\n');
  
  // Check if default DAO already exists
  const existing = await db.get("SELECT id FROM daos WHERE name = 'Default DAO'");
  if (existing) {
    console.log(`Default DAO already exists with ID: ${existing.id}`);
    throw new Error('Default DAO already exists. Remove it first if you want to recreate it.');
  }
  
  // Get configuration from environment
  const polkadotMultisig = process.env.POLKADOT_MULTISIG;
  const kusamaMultisig = process.env.KUSAMA_MULTISIG;
  const proposerMnemonic = process.env.PROPOSER_MNEMONIC;
  
  if (!polkadotMultisig || !kusamaMultisig || !proposerMnemonic) {
    throw new Error(
      'Missing required environment variables: POLKADOT_MULTISIG, KUSAMA_MULTISIG, PROPOSER_MNEMONIC'
    );
  }
  
  // Validate encryption key is configured
  try {
    validateMasterKey();
  } catch (error) {
    throw new Error(
      'MASTER_ENCRYPTION_KEY is not properly configured. ' +
      'Generate one using: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }
  
  // Encrypt sensitive data
  console.log('Encrypting multisig addresses and mnemonic...');
  const polkadotEncrypted = encrypt(polkadotMultisig);
  const kusamaEncrypted = encrypt(kusamaMultisig);
  const mnemonicEncrypted = encrypt(proposerMnemonic);
  
  // Insert default DAO
  const result = await db.run(
    `INSERT INTO daos (
      name, 
      description, 
      status, 
      polkadot_multisig_encrypted, 
      kusama_multisig_encrypted, 
      proposer_mnemonic_encrypted
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      'Default DAO',
      'Default DAO created from existing configuration during multi-DAO migration',
      'active',
      polkadotEncrypted,
      kusamaEncrypted,
      mnemonicEncrypted
    ]
  );
  
  const daoId = result.lastID;
  
  console.log(`✓ Default DAO created with ID: ${daoId}`);
  console.log(`✓ Polkadot multisig: ${polkadotMultisig}`);
  console.log(`✓ Kusama multisig: ${kusamaMultisig}`);
  console.log(`\n✅ Default DAO successfully created!`);
  console.log(`   Authentication will be based on wallet signatures from multisig members.\n`);
  
  return { daoId };
}

/**
 * Assign existing referendums to default DAO
 */
async function migrateReferendums(db: Database, daoId: number): Promise<number> {
  console.log('\n=== Migrating Referendums ===\n');
  
  // Count referendums without dao_id
  const count = await db.get('SELECT COUNT(*) as count FROM referendums WHERE dao_id IS NULL');
  
  if (count.count === 0) {
    console.log('No referendums to migrate.');
    return 0;
  }
  
  console.log(`Migrating ${count.count} referendums to DAO ${daoId}...`);
  
  const result = await db.run(
    'UPDATE referendums SET dao_id = ? WHERE dao_id IS NULL',
    [daoId]
  );
  
  console.log(`✓ Migrated ${result.changes} referendums`);
  return result.changes;
}

/**
 * Assign existing scoring criteria to default DAO
 */
async function migrateScoringCriteria(db: Database, daoId: number): Promise<number> {
  console.log('\n=== Migrating Scoring Criteria ===\n');
  
  const count = await db.get('SELECT COUNT(*) as count FROM scoring_criteria WHERE dao_id IS NULL');
  
  if (count.count === 0) {
    console.log('No scoring criteria to migrate.');
    return 0;
  }
  
  console.log(`Migrating ${count.count} scoring criteria records to DAO ${daoId}...`);
  
  const result = await db.run(
    'UPDATE scoring_criteria SET dao_id = ? WHERE dao_id IS NULL',
    [daoId]
  );
  
  console.log(`✓ Migrated ${result.changes} scoring criteria records`);
  return result.changes;
}

/**
 * Assign existing team roles to default DAO
 */
async function migrateTeamRoles(db: Database, daoId: number): Promise<number> {
  console.log('\n=== Migrating Team Roles ===\n');
  
  const count = await db.get('SELECT COUNT(*) as count FROM referendum_team_roles WHERE dao_id IS NULL');
  
  if (count.count === 0) {
    console.log('No team roles to migrate.');
    return 0;
  }
  
  console.log(`Migrating ${count.count} team roles to DAO ${daoId}...`);
  
  const result = await db.run(
    'UPDATE referendum_team_roles SET dao_id = ? WHERE dao_id IS NULL',
    [daoId]
  );
  
  console.log(`✓ Migrated ${result.changes} team roles`);
  return result.changes;
}

/**
 * Assign existing voting decisions to default DAO
 */
async function migrateVotingDecisions(db: Database, daoId: number): Promise<number> {
  console.log('\n=== Migrating Voting Decisions ===\n');
  
  const count = await db.get('SELECT COUNT(*) as count FROM voting_decisions WHERE dao_id IS NULL');
  
  if (count.count === 0) {
    console.log('No voting decisions to migrate.');
    return 0;
  }
  
  console.log(`Migrating ${count.count} voting decisions to DAO ${daoId}...`);
  
  const result = await db.run(
    'UPDATE voting_decisions SET dao_id = ? WHERE dao_id IS NULL',
    [daoId]
  );
  
  console.log(`✓ Migrated ${result.changes} voting decisions`);
  return result.changes;
}

/**
 * Assign existing discussion topics to default DAO
 */
async function migrateDiscussionTopics(db: Database, daoId: number): Promise<number> {
  console.log('\n=== Migrating Discussion Topics ===\n');
  
  const count = await db.get('SELECT COUNT(*) as count FROM discussion_topics WHERE dao_id IS NULL');
  
  if (count.count === 0) {
    console.log('No discussion topics to migrate.');
    return 0;
  }
  
  console.log(`Migrating ${count.count} discussion topics to DAO ${daoId}...`);
  
  const result = await db.run(
    'UPDATE discussion_topics SET dao_id = ? WHERE dao_id IS NULL',
    [daoId]
  );
  
  console.log(`✓ Migrated ${result.changes} discussion topics`);
  return result.changes;
}

/**
 * Assign existing comments to default DAO
 */
async function migrateComments(db: Database, daoId: number): Promise<number> {
  console.log('\n=== Migrating Comments ===\n');
  
  const count = await db.get('SELECT COUNT(*) as count FROM referendum_comments WHERE dao_id IS NULL');
  
  if (count.count === 0) {
    console.log('No comments to migrate.');
    return 0;
  }
  
  console.log(`Migrating ${count.count} comments to DAO ${daoId}...`);
  
  const result = await db.run(
    'UPDATE referendum_comments SET dao_id = ? WHERE dao_id IS NULL',
    [daoId]
  );
  
  console.log(`✓ Migrated ${result.changes} comments`);
  return result.changes;
}

/**
 * Assign existing Mimir transactions to default DAO
 */
async function migrateMimirTransactions(db: Database, daoId: number): Promise<number> {
  console.log('\n=== Migrating Mimir Transactions ===\n');
  
  const count = await db.get('SELECT COUNT(*) as count FROM mimir_transactions WHERE dao_id IS NULL');
  
  if (count.count === 0) {
    console.log('No Mimir transactions to migrate.');
    return 0;
  }
  
  console.log(`Migrating ${count.count} Mimir transactions to DAO ${daoId}...`);
  
  const result = await db.run(
    'UPDATE mimir_transactions SET dao_id = ? WHERE dao_id IS NULL',
    [daoId]
  );
  
  console.log(`✓ Migrated ${result.changes} Mimir transactions`);
  return result.changes;
}

/**
 * Assign existing audit log entries to default DAO
 */
async function migrateAuditLog(db: Database, daoId: number): Promise<number> {
  console.log('\n=== Migrating Audit Log ===\n');
  
  const count = await db.get('SELECT COUNT(*) as count FROM audit_log WHERE dao_id IS NULL');
  
  if (count.count === 0) {
    console.log('No audit log entries to migrate.');
    return 0;
  }
  
  console.log(`Migrating ${count.count} audit log entries to DAO ${daoId}...`);
  
  const result = await db.run(
    'UPDATE audit_log SET dao_id = ? WHERE dao_id IS NULL',
    [daoId]
  );
  
  console.log(`✓ Migrated ${result.changes} audit log entries`);
  return result.changes;
}

/**
 * Verify migration results
 */
async function verifyMigration(db: Database, daoId: number): Promise<void> {
  console.log('\n=== Verifying Migration ===\n');
  
  const checks = [
    { table: 'referendums', query: 'SELECT COUNT(*) as count FROM referendums WHERE dao_id IS NULL' },
    { table: 'scoring_criteria', query: 'SELECT COUNT(*) as count FROM scoring_criteria WHERE dao_id IS NULL' },
    { table: 'referendum_team_roles', query: 'SELECT COUNT(*) as count FROM referendum_team_roles WHERE dao_id IS NULL' },
    { table: 'voting_decisions', query: 'SELECT COUNT(*) as count FROM voting_decisions WHERE dao_id IS NULL' },
    { table: 'discussion_topics', query: 'SELECT COUNT(*) as count FROM discussion_topics WHERE dao_id IS NULL' },
    { table: 'referendum_comments', query: 'SELECT COUNT(*) as count FROM referendum_comments WHERE dao_id IS NULL' },
    { table: 'mimir_transactions', query: 'SELECT COUNT(*) as count FROM mimir_transactions WHERE dao_id IS NULL' },
  ];
  
  let allGood = true;
  
  for (const check of checks) {
    const result = await db.get(check.query);
    if (result.count > 0) {
      console.log(`✗ ${check.table}: ${result.count} records still have NULL dao_id`);
      allGood = false;
    } else {
      console.log(`✓ ${check.table}: All records have dao_id assigned`);
    }
  }
  
  if (allGood) {
    console.log('\n✓ All data successfully migrated!');
  } else {
    console.log('\n✗ Some records were not migrated. Please review the output above.');
  }
}

/**
 * Main migration function
 */
async function main() {
  console.log('============================================================================');
  console.log('  Multi-DAO Data Migration');
  console.log('============================================================================');
  
  // Get database path from command line or use default
  const dbPath = process.argv[2] || './backend/database/voting_tool.db';
  
  console.log(`\nDatabase: ${dbPath}`);
  console.log('\n⚠️  WARNING: This will modify your database!');
  console.log('   Make sure you have a backup before proceeding.\n');
  
  // Connect to database
  const db = createDbConnection(dbPath);
  
  try {
    // Create default DAO
    const { daoId } = await createDefaultDao(db);
    
    // Migrate all existing data
    await migrateReferendums(db, daoId);
    await migrateScoringCriteria(db, daoId);
    await migrateTeamRoles(db, daoId);
    await migrateVotingDecisions(db, daoId);
    await migrateDiscussionTopics(db, daoId);
    await migrateComments(db, daoId);
    await migrateMimirTransactions(db, daoId);
    await migrateAuditLog(db, daoId);
    
    // Verify migration
    await verifyMigration(db, daoId);
    
    console.log('\n============================================================================');
    console.log('  Migration Complete!');
    console.log('============================================================================\n');
    console.log('Next steps:');
    console.log('1. Run migration 002_finalize_multi_dao_constraints.sql to enforce NOT NULL');
    console.log('2. Test the application with the new multi-DAO setup');
    console.log('3. Authentication will use wallet signatures from multisig members');
    console.log('4. Update application code to support multi-DAO queries\n');
    
  } catch (error) {
    console.error('\n✗ Migration failed:', (error as Error).message);
    console.error((error as Error).stack);
    process.exit(1);
  } finally {
    await db.close();
  }
}

// Run migration
main().catch(console.error);

