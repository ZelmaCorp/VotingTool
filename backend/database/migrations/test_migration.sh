#!/bin/bash
# ============================================================================
# Test Migration Script
# Tests the 001_add_multi_dao_support.sql migration on a copy of the database
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DB_DIR="$(dirname "$SCRIPT_DIR")"
PROD_DB="$DB_DIR/voting_tool.db"
TEST_DB="$DB_DIR/voting_tool_migration_test.db"
MIGRATION_SQL="$SCRIPT_DIR/001_add_multi_dao_support.sql"

echo "============================================================================"
echo "  Testing Multi-DAO Migration"
echo "============================================================================"
echo ""

# Check if production database exists
if [ ! -f "$PROD_DB" ]; then
    echo -e "${RED}Error: Production database not found at $PROD_DB${NC}"
    echo "This script expects a database file to test the migration against."
    echo "If this is a fresh setup, create a database first using schema.sql"
    exit 1
fi

# Check if migration SQL exists
if [ ! -f "$MIGRATION_SQL" ]; then
    echo -e "${RED}Error: Migration SQL not found at $MIGRATION_SQL${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Creating backup of production database${NC}"
cp "$PROD_DB" "$TEST_DB"
echo -e "${GREEN}✓ Backup created at $TEST_DB${NC}"
echo ""

echo -e "${YELLOW}Step 2: Checking database before migration${NC}"
sqlite3 "$TEST_DB" << 'EOF'
.mode column
.headers on

-- Check if daos table exists (should not)
SELECT 'DAOs table exists: ' || CASE WHEN COUNT(*) > 0 THEN 'YES (unexpected)' ELSE 'NO (expected)' END as result
FROM sqlite_master 
WHERE type='table' AND name='daos';

-- Check referendums table structure
SELECT 'Referendums columns:';
PRAGMA table_info(referendums);

-- Count existing records
SELECT 'Existing referendums: ' || COUNT(*) as count FROM referendums;
SELECT 'Existing scoring_criteria: ' || COUNT(*) as count FROM scoring_criteria;
SELECT 'Existing voting_decisions: ' || COUNT(*) as count FROM voting_decisions;
SELECT 'Existing mimir_transactions: ' || COUNT(*) as count FROM mimir_transactions;
EOF
echo ""

echo -e "${YELLOW}Step 3: Running migration${NC}"
if sqlite3 "$TEST_DB" < "$MIGRATION_SQL"; then
    echo -e "${GREEN}✓ Migration executed successfully${NC}"
else
    echo -e "${RED}✗ Migration failed${NC}"
    echo "Check the error messages above."
    exit 1
fi
echo ""

echo -e "${YELLOW}Step 4: Verifying migration results${NC}"
sqlite3 "$TEST_DB" << 'EOF'
.mode column
.headers on

-- Verify daos table was created
SELECT '=== DAOs Table ===' as section;
SELECT name, sql FROM sqlite_master WHERE type='table' AND name='daos';

-- Verify columns were added
SELECT '=== Referendums Table Columns ===' as section;
PRAGMA table_info(referendums);

-- Verify dao_id column exists in all tables
SELECT '=== Tables with dao_id column ===' as section;
SELECT 
    m.name as table_name,
    CASE 
        WHEN p.name = 'dao_id' THEN 'YES' 
        ELSE 'NO' 
    END as has_dao_id_column
FROM sqlite_master m
LEFT JOIN pragma_table_info(m.name) p ON p.name = 'dao_id'
WHERE m.type = 'table' 
  AND m.name IN (
    'referendums', 
    'scoring_criteria', 
    'referendum_team_roles', 
    'voting_decisions', 
    'discussion_topics', 
    'referendum_comments', 
    'mimir_transactions', 
    'audit_log'
  )
GROUP BY m.name;

-- Verify indexes were created
SELECT '=== DAO-related Indexes ===' as section;
SELECT name, tbl_name 
FROM sqlite_master 
WHERE type='index' 
  AND (name LIKE 'idx_dao%' OR name LIKE '%_dao_id');

-- Verify views were updated
SELECT '=== Views ===' as section;
SELECT name FROM sqlite_master WHERE type='view';

-- Check data integrity
SELECT '=== Data Integrity ===' as section;
SELECT 'Referendums with NULL dao_id: ' || COUNT(*) as result FROM referendums WHERE dao_id IS NULL;
SELECT 'Scoring criteria with NULL dao_id: ' || COUNT(*) as result FROM scoring_criteria WHERE dao_id IS NULL;
SELECT 'Voting decisions with NULL dao_id: ' || COUNT(*) as result FROM voting_decisions WHERE dao_id IS NULL;
EOF
echo ""

echo -e "${YELLOW}Step 5: Testing data insertion${NC}"
sqlite3 "$TEST_DB" << 'EOF'
.mode column
.headers on

-- Try to insert a test DAO
BEGIN TRANSACTION;

INSERT INTO daos (name, description, status, api_key_hash, polkadot_multisig_encrypted, kusama_multisig_encrypted, proposer_mnemonic_encrypted)
VALUES (
    'Test DAO', 
    'A test DAO for migration verification', 
    'active',
    '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEF',  -- Fake bcrypt hash
    'encrypted_polkadot_address_here',
    'encrypted_kusama_address_here',
    'encrypted_mnemonic_here'
);

SELECT 'Test DAO created with ID: ' || last_insert_rowid() as result;

-- Verify the DAO was inserted
SELECT * FROM daos WHERE name = 'Test DAO';

ROLLBACK;  -- Don't keep the test data

SELECT 'Test data insertion successful (rolled back)' as result;
EOF
echo ""

echo -e "${YELLOW}Step 6: Checking foreign key constraints${NC}"
sqlite3 "$TEST_DB" << 'EOF'
PRAGMA foreign_keys = ON;
PRAGMA foreign_key_check;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ No foreign key violations${NC}"
else
    echo -e "${RED}✗ Foreign key violations detected${NC}"
fi
echo ""

echo "============================================================================"
echo -e "${GREEN}Migration Test Complete!${NC}"
echo "============================================================================"
echo ""
echo "Summary:"
echo "- Production DB: $PROD_DB"
echo "- Test DB: $TEST_DB"
echo ""
echo "Next steps:"
echo "1. Review the test database to ensure everything looks correct"
echo "2. Create a data migration script to populate dao_id values"
echo "3. Run the migration on production (with a backup!)"
echo ""
echo "To inspect the test database:"
echo "  sqlite3 $TEST_DB"
echo ""
echo "To clean up the test database:"
echo "  rm $TEST_DB"
echo ""

