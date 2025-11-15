# Database Migrations

This directory contains database migration scripts for the OpenGov Voting Tool.

## Migration 001: Add Multi-DAO Support

**File**: `001_add_multi_dao_support.sql`

### Purpose
Adds support for multiple DAOs (Decentralized Autonomous Organizations) in a single database instance. This migration:
- Creates the `daos` table with encrypted credential storage
- Adds `dao_id` foreign keys to all existing tables
- Updates views to include DAO information
- Maintains backward compatibility during migration

### Prerequisites

1. **Backup your database** before running any migration!
   ```bash
   cp backend/database/voting_tool.db backend/database/voting_tool.db.backup
   ```

2. **Generate encryption key** (if not already set):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   
   Add to `.env`:
   ```
   MASTER_ENCRYPTION_KEY=your_64_character_hex_key_here
   ```

3. **Ensure environment variables are set**:
   - `POLKADOT_MULTISIG`
   - `KUSAMA_MULTISIG`
   - `PROPOSER_MNEMONIC`
   - `MASTER_ENCRYPTION_KEY`

### Running the Migration

#### Step 1: Test the Schema Migration

Test on a copy of your database first:

```bash
cd backend/database/migrations
./test_migration.sh
```

This will:
- Create a test copy of your database
- Run the schema migration
- Verify all changes were applied correctly
- Test data insertion
- Check foreign key constraints

#### Step 2: Run Schema Migration on Production

If the test passes, run on your production database:

```bash
cd backend/database
sqlite3 voting_tool.db < migrations/001_add_multi_dao_support.sql
```

Or using the backup:

```bash
cp voting_tool.db voting_tool_pre_migration.db
sqlite3 voting_tool.db < migrations/001_add_multi_dao_support.sql
```

#### Step 3: Migrate Existing Data

After the schema migration, populate `dao_id` values for existing records:

**Option A: Using TypeScript (Recommended)**

Run the migration:

```bash
cd backend
npm run build
node dist/database/migrations/migrate_existing_data.js
```

Or specify a custom database path:

```bash
node dist/database/migrations/migrate_existing_data.js /path/to/your/database.db
```

**Option B: Manual SQL**

If you prefer manual control (you'll need to encrypt the values first using the encryption utilities):

```sql
-- 1. Create default DAO
INSERT INTO daos (
  name, 
  description, 
  status, 
  polkadot_multisig_encrypted, 
  kusama_multisig_encrypted, 
  proposer_mnemonic_encrypted
) VALUES (
  'Default DAO',
  'Migrated from single-DAO configuration',
  'active',
  'your_encrypted_polkadot_address',
  'your_encrypted_kusama_address',
  'your_encrypted_mnemonic'
);

-- 2. Get the DAO ID
SELECT id FROM daos WHERE name = 'Default DAO';  -- Note this ID

-- 3. Assign all existing records to the DAO (replace 1 with your DAO ID)
UPDATE referendums SET dao_id = 1 WHERE dao_id IS NULL;
UPDATE scoring_criteria SET dao_id = 1 WHERE dao_id IS NULL;
UPDATE referendum_team_roles SET dao_id = 1 WHERE dao_id IS NULL;
UPDATE voting_decisions SET dao_id = 1 WHERE dao_id IS NULL;
UPDATE discussion_topics SET dao_id = 1 WHERE dao_id IS NULL;
UPDATE referendum_comments SET dao_id = 1 WHERE dao_id IS NULL;
UPDATE mimir_transactions SET dao_id = 1 WHERE dao_id IS NULL;
UPDATE audit_log SET dao_id = 1 WHERE dao_id IS NULL;
```

#### Step 4: Verify Migration

```sql
-- Check that all records have dao_id assigned
SELECT 
  'referendums' as table_name, 
  COUNT(*) as total, 
  SUM(CASE WHEN dao_id IS NULL THEN 1 ELSE 0 END) as null_count
FROM referendums
UNION ALL
SELECT 'scoring_criteria', COUNT(*), SUM(CASE WHEN dao_id IS NULL THEN 1 ELSE 0 END) FROM scoring_criteria
UNION ALL
SELECT 'voting_decisions', COUNT(*), SUM(CASE WHEN dao_id IS NULL THEN 1 ELSE 0 END) FROM voting_decisions
UNION ALL
SELECT 'mimir_transactions', COUNT(*), SUM(CASE WHEN dao_id IS NULL THEN 1 ELSE 0 END) FROM mimir_transactions;

-- View the default DAO
SELECT id, name, description, status, created_at FROM daos;
```

### Schema Changes

#### New Tables

**`daos`** - Stores DAO configurations
- `id` - Primary key
- `name` - DAO name (unique)
- `description` - DAO description
- `status` - active/inactive/suspended
- `polkadot_multisig_encrypted` - Encrypted Polkadot multisig address
- `kusama_multisig_encrypted` - Encrypted Kusama multisig address
- `proposer_mnemonic_encrypted` - Encrypted proposer mnemonic
- `created_at`, `updated_at` - Timestamps

**Note**: Authentication is handled through wallet signatures. Users must be members of the multisig to access the DAO.

#### Modified Tables

All tables now include `dao_id INTEGER` foreign key:
- `referendums` - Added `dao_id`, updated UNIQUE constraint
- `scoring_criteria` - Added `dao_id`
- `referendum_team_roles` - Added `dao_id`
- `voting_decisions` - Added `dao_id`
- `discussion_topics` - Added `dao_id`
- `referendum_comments` - Added `dao_id`
- `mimir_transactions` - Added `dao_id`, `voted`, `post_id`, `chain`
- `audit_log` - Added `dao_id`

#### New Indexes

- `idx_daos_status` - Filter by DAO status
- `idx_daos_name` - Search by DAO name
- `idx_daos_created_at` - Sort by creation date
- `idx_referendums_dao_id` - Filter referendums by DAO
- `idx_scoring_criteria_dao_id` - Filter scoring by DAO
- `idx_referendum_team_roles_dao_id` - Filter team roles by DAO
- `idx_voting_decisions_dao_id` - Filter votes by DAO
- `idx_discussion_topics_dao_id` - Filter topics by DAO
- `idx_referendum_comments_dao_id` - Filter comments by DAO
- `idx_mimir_transactions_dao_id` - Filter transactions by DAO
- `idx_mimir_transactions_dao_post` - Composite index for lookups
- `idx_audit_log_dao_id` - Filter audit log by DAO

#### Updated Views

All views now include `dao_id` and `dao_name`:
- `ready_to_vote_referendums`
- `pending_evaluation_referendums`
- `completed_votes`

### Rollback

If you need to rollback the migration:

```bash
# Restore from backup
cp voting_tool_pre_migration.db voting_tool.db
```

Or run the rollback script provided in the migration file comments.

### Troubleshooting

#### Error: "table daos already exists"
The migration has already been run. Check if the table exists:
```sql
SELECT name FROM sqlite_master WHERE type='table' AND name='daos';
```

#### Error: "MASTER_ENCRYPTION_KEY is not set"
Make sure the encryption key is in your `.env` file:
```bash
echo "MASTER_ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")" >> .env
```

#### Error: "Cannot add foreign key constraint"
Ensure foreign keys are enabled:
```sql
PRAGMA foreign_keys = ON;
```

#### Records still have NULL dao_id
Run the data migration script again or manually update records as shown in Step 3.

### Post-Migration Tasks

After successful migration:

1. **Update application code** to support multi-DAO queries
2. **Test authentication** with wallet signatures from multisig members
3. **Update documentation** with new multi-DAO features
4. **Consider running migration 002** to enforce NOT NULL constraints

### Files in This Directory

- `001_add_multi_dao_support.sql` - Schema migration SQL
- `migrate_existing_data.ts` - TypeScript data migration script
- `test_migration.sh` - Bash script to test migration safely
- `README.md` - This file

### Next Migration

After successfully completing this migration, you can run:
- `002_finalize_multi_dao_constraints.sql` - Enforces NOT NULL on dao_id columns

## Support

For issues or questions:
1. Check the verification queries in the migration SQL file
2. Review the test migration output
3. Ensure all prerequisites are met
4. Check the main project README

## Security Notes

⚠️ **Important Security Considerations:**

- Keep your `MASTER_ENCRYPTION_KEY` secure and backed up
- Never commit the `.env` file to version control
- Encrypted data cannot be recovered if the encryption key is lost
- Use different encryption keys for development, staging, and production
- Authentication is based on wallet signatures - only multisig members can access their DAO's data

## Backup Strategy

Before any migration:

1. **Full database backup**:
   ```bash
   cp voting_tool.db voting_tool_$(date +%Y%m%d_%H%M%S).db
   ```

2. **Export as SQL** (optional):
   ```bash
   sqlite3 voting_tool.db .dump > voting_tool_backup.sql
   ```

3. **Verify backup**:
   ```bash
   sqlite3 voting_tool_backup.db < voting_tool_backup.sql
   sqlite3 voting_tool_backup.db "SELECT COUNT(*) FROM referendums;"
   ```

Always keep at least one backup from before the migration!

