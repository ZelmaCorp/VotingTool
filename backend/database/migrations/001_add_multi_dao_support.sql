-- ============================================================================
-- Migration: 001_add_multi_dao_support.sql
-- Description: Add multi-DAO support to the database
-- Date: 2025-11-15
-- ============================================================================
-- This migration adds support for multiple DAOs in a single database instance.
-- It creates the daos table and adds dao_id foreign keys to all existing tables.
-- 
-- IMPORTANT: Run this migration on a BACKUP of your database first!
-- ============================================================================

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Start transaction for atomic migration
BEGIN TRANSACTION;

-- ============================================================================
-- STEP 1: Create DAOs table
-- ============================================================================

CREATE TABLE IF NOT EXISTS daos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Basic information
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    
    -- Encrypted credentials (encrypted using MASTER_ENCRYPTION_KEY)
    polkadot_multisig_encrypted TEXT,      -- Encrypted Polkadot multisig address
    kusama_multisig_encrypted TEXT,        -- Encrypted Kusama multisig address
    proposer_mnemonic_encrypted TEXT,      -- Encrypted proposer mnemonic phrase
    
    -- Timestamps
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================================
-- STEP 2: Create indexes on DAOs table
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_daos_status ON daos(status);
CREATE INDEX IF NOT EXISTS idx_daos_name ON daos(name);
CREATE INDEX IF NOT EXISTS idx_daos_created_at ON daos(created_at);

-- ============================================================================
-- STEP 3: Add dao_id column to referendums table
-- ============================================================================

-- Add dao_id column (nullable for migration)
ALTER TABLE referendums ADD COLUMN dao_id INTEGER REFERENCES daos(id) ON DELETE CASCADE;

-- Create index on dao_id
CREATE INDEX IF NOT EXISTS idx_referendums_dao_id ON referendums(dao_id);

-- Note: The old UNIQUE constraint on (post_id, chain) will remain in place.
-- After all dao_id values are populated, you should:
-- 1. Create a new unique index: CREATE UNIQUE INDEX idx_referendums_unique ON referendums(post_id, chain, dao_id);
-- 2. Consider rebuilding the table to remove the old constraint if needed (see migration 002)

-- ============================================================================
-- STEP 4: Add dao_id column to scoring_criteria table
-- ============================================================================

ALTER TABLE scoring_criteria ADD COLUMN dao_id INTEGER REFERENCES daos(id) ON DELETE CASCADE;

-- Create index on dao_id
CREATE INDEX IF NOT EXISTS idx_scoring_criteria_dao_id ON scoring_criteria(dao_id);

-- ============================================================================
-- STEP 5: Add dao_id column to referendum_team_roles table
-- ============================================================================

ALTER TABLE referendum_team_roles ADD COLUMN dao_id INTEGER REFERENCES daos(id) ON DELETE CASCADE;

-- Create index on dao_id
CREATE INDEX IF NOT EXISTS idx_referendum_team_roles_dao_id ON referendum_team_roles(dao_id);

-- ============================================================================
-- STEP 6: Add dao_id column to voting_decisions table
-- ============================================================================

ALTER TABLE voting_decisions ADD COLUMN dao_id INTEGER REFERENCES daos(id) ON DELETE CASCADE;

-- Create index on dao_id
CREATE INDEX IF NOT EXISTS idx_voting_decisions_dao_id ON voting_decisions(dao_id);

-- ============================================================================
-- STEP 7: Add dao_id column to discussion_topics table
-- ============================================================================

ALTER TABLE discussion_topics ADD COLUMN dao_id INTEGER REFERENCES daos(id) ON DELETE CASCADE;

-- Create index on dao_id
CREATE INDEX IF NOT EXISTS idx_discussion_topics_dao_id ON discussion_topics(dao_id);

-- ============================================================================
-- STEP 8: Add dao_id column to referendum_comments table
-- ============================================================================

ALTER TABLE referendum_comments ADD COLUMN dao_id INTEGER REFERENCES daos(id) ON DELETE CASCADE;

-- Create index on dao_id
CREATE INDEX IF NOT EXISTS idx_referendum_comments_dao_id ON referendum_comments(dao_id);

-- ============================================================================
-- STEP 9: Add dao_id column to mimir_transactions table
-- ============================================================================

ALTER TABLE mimir_transactions ADD COLUMN dao_id INTEGER REFERENCES daos(id) ON DELETE CASCADE;

-- Create index on dao_id
CREATE INDEX IF NOT EXISTS idx_mimir_transactions_dao_id ON mimir_transactions(dao_id);

-- Add columns to track which DAO initiated the transaction
ALTER TABLE mimir_transactions ADD COLUMN voted TEXT;  -- The suggested vote (Aye/Nay/Abstain)
ALTER TABLE mimir_transactions ADD COLUMN post_id INTEGER;  -- Referendum post_id
ALTER TABLE mimir_transactions ADD COLUMN chain TEXT CHECK (chain IN ('Polkadot', 'Kusama'));

-- Create composite index for faster lookups
CREATE INDEX IF NOT EXISTS idx_mimir_transactions_dao_post ON mimir_transactions(dao_id, post_id, chain);

-- ============================================================================
-- STEP 10: Add dao_id column to audit_log table
-- ============================================================================

ALTER TABLE audit_log ADD COLUMN dao_id INTEGER REFERENCES daos(id) ON DELETE SET NULL;

-- Create index on dao_id
CREATE INDEX IF NOT EXISTS idx_audit_log_dao_id ON audit_log(dao_id);

-- ============================================================================
-- STEP 11: Update views to include dao_id
-- ============================================================================

-- Drop existing views
DROP VIEW IF EXISTS ready_to_vote_referendums;
DROP VIEW IF EXISTS pending_evaluation_referendums;
DROP VIEW IF EXISTS completed_votes;

-- Recreate view for ready to vote referendums with dao_id
CREATE VIEW ready_to_vote_referendums AS
SELECT 
    r.id,
    r.post_id,
    r.chain,
    r.dao_id,
    r.title,
    r.requested_amount_usd,
    r.referendum_timeline,
    r.internal_status,
    r.voting_end_date,
    vd.suggested_vote,
    vd.final_vote,
    sc.ref_score,
    d.name as dao_name
FROM referendums r
LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id
LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id
LEFT JOIN daos d ON r.dao_id = d.id
WHERE r.internal_status = 'Ready to vote'
  AND r.voting_end_date > datetime('now');

-- Recreate view for referendums needing evaluation with dao_id
CREATE VIEW pending_evaluation_referendums AS
SELECT 
    r.id,
    r.post_id,
    r.chain,
    r.dao_id,
    r.title,
    r.requested_amount_usd,
    r.referendum_timeline,
    r.internal_status,
    r.created_at,
    sc.ref_score,
    d.name as dao_name
FROM referendums r
LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id
LEFT JOIN daos d ON r.dao_id = d.id
WHERE r.internal_status IN ('Not started', 'Considering')
ORDER BY r.created_at DESC;

-- Recreate view for completed votes with dao_id
CREATE VIEW completed_votes AS
SELECT 
    r.id,
    r.post_id,
    r.chain,
    r.dao_id,
    r.title,
    r.requested_amount_usd,
    vd.final_vote,
    vd.vote_executed_date,
    sc.ref_score,
    d.name as dao_name
FROM referendums r
JOIN voting_decisions vd ON r.id = vd.referendum_id
LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id
LEFT JOIN daos d ON r.dao_id = d.id
WHERE vd.vote_executed = TRUE
ORDER BY vd.vote_executed_date DESC;

-- ============================================================================
-- STEP 12: Create trigger to update daos.updated_at
-- ============================================================================

CREATE TRIGGER IF NOT EXISTS update_daos_updated_at
    AFTER UPDATE ON daos
    FOR EACH ROW
BEGIN
    UPDATE daos SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Commit the transaction
COMMIT;

-- ============================================================================
-- POST-MIGRATION STEPS (Run these manually after populating dao_id values)
-- ============================================================================

-- After migrating existing data to a default DAO and setting dao_id values:
-- 
-- 1. Make dao_id NOT NULL on all tables:
--    ALTER TABLE referendums ALTER COLUMN dao_id SET NOT NULL;  -- Not supported in SQLite
--    
--    Instead, you'll need to recreate tables with NOT NULL constraint after data migration.
--    This can be done in a subsequent migration script after dao_id values are populated.
--
-- 2. Create unique constraint on referendums(post_id, chain, dao_id):
--    CREATE UNIQUE INDEX idx_referendums_unique ON referendums(post_id, chain, dao_id);
--
-- 3. Update foreign key constraints on related tables to include dao_id verification
--
-- See migration script 002_finalize_multi_dao_constraints.sql for these steps.

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify daos table was created:
-- SELECT name FROM sqlite_master WHERE type='table' AND name='daos';

-- Verify dao_id columns were added:
-- PRAGMA table_info(referendums);
-- PRAGMA table_info(scoring_criteria);
-- PRAGMA table_info(referendum_team_roles);
-- PRAGMA table_info(voting_decisions);
-- PRAGMA table_info(discussion_topics);
-- PRAGMA table_info(referendum_comments);
-- PRAGMA table_info(mimir_transactions);
-- PRAGMA table_info(audit_log);

-- Verify indexes were created:
-- SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_dao%';

-- Count existing records that need dao_id assignment:
-- SELECT COUNT(*) FROM referendums WHERE dao_id IS NULL;
-- SELECT COUNT(*) FROM scoring_criteria WHERE dao_id IS NULL;
-- SELECT COUNT(*) FROM referendum_team_roles WHERE dao_id IS NULL;
-- SELECT COUNT(*) FROM voting_decisions WHERE dao_id IS NULL;
-- SELECT COUNT(*) FROM discussion_topics WHERE dao_id IS NULL;
-- SELECT COUNT(*) FROM referendum_comments WHERE dao_id IS NULL;
-- SELECT COUNT(*) FROM mimir_transactions WHERE dao_id IS NULL;

-- ============================================================================
-- ROLLBACK SCRIPT (if needed)
-- ============================================================================

-- To rollback this migration, run the following in a transaction:
/*
BEGIN TRANSACTION;

-- Drop views
DROP VIEW IF EXISTS ready_to_vote_referendums;
DROP VIEW IF EXISTS pending_evaluation_referendums;
DROP VIEW IF EXISTS completed_votes;

-- Drop indexes
DROP INDEX IF EXISTS idx_daos_api_key_hash;
DROP INDEX IF EXISTS idx_daos_status;
DROP INDEX IF EXISTS idx_daos_name;
DROP INDEX IF EXISTS idx_daos_created_at;
DROP INDEX IF EXISTS idx_referendums_dao_id;
DROP INDEX IF EXISTS idx_scoring_criteria_dao_id;
DROP INDEX IF EXISTS idx_referendum_team_roles_dao_id;
DROP INDEX IF EXISTS idx_voting_decisions_dao_id;
DROP INDEX IF EXISTS idx_discussion_topics_dao_id;
DROP INDEX IF EXISTS idx_referendum_comments_dao_id;
DROP INDEX IF EXISTS idx_mimir_transactions_dao_id;
DROP INDEX IF EXISTS idx_mimir_transactions_dao_post;
DROP INDEX IF EXISTS idx_audit_log_dao_id;

-- Remove columns (SQLite doesn't support DROP COLUMN directly)
-- You'll need to recreate tables without dao_id columns

-- Drop daos table
DROP TABLE IF EXISTS daos;

-- Recreate original views
-- [Insert original view definitions here]

COMMIT;
*/

