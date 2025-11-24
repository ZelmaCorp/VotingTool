#!/bin/bash
# Database Migration Script for Docker
# This script handles the multi-DAO migration safely

set -e  # Exit on error

echo "=========================================="
echo "  Database Migration Script"
echo "=========================================="
echo ""

# Check if database exists
if [ ! -f "./voting_tool.db" ]; then
    echo "❌ Database file not found at ./voting_tool.db"
    echo "Creating new database from schema..."
    sqlite3 voting_tool.db < database/schema.sql
    echo "✅ Database created"
fi

# Check if migration is needed
DAOS_TABLE=$(sqlite3 voting_tool.db "SELECT name FROM sqlite_master WHERE type='table' AND name='daos';" || echo "")

if [ -z "$DAOS_TABLE" ]; then
    echo "📋 Running schema migration..."
    sqlite3 voting_tool.db < database/migrations/001_add_multi_dao_support.sql
    echo "✅ Schema migration complete"
else
    echo "✅ Schema already migrated (daos table exists)"
fi

# Check if data migration is needed
NULL_COUNT=$(sqlite3 voting_tool.db "SELECT COUNT(*) FROM referendums WHERE dao_id IS NULL;" 2>/dev/null || echo "0")

if [ "$NULL_COUNT" -gt "0" ]; then
    echo "📋 Found $NULL_COUNT referendums without dao_id"
    echo "📋 Running data migration..."
    npx tsx database/migrations/direct_migrate.ts
    echo "✅ Data migration complete"
else
    DAO_COUNT=$(sqlite3 voting_tool.db "SELECT COUNT(*) FROM daos;" 2>/dev/null || echo "0")
    if [ "$DAO_COUNT" -eq "0" ]; then
        echo "📋 No DAOs exist, running data migration to create default DAO..."
        npx tsx database/migrations/direct_migrate.ts
        echo "✅ Data migration complete"
    else
        echo "✅ Data already migrated ($DAO_COUNT DAO(s) exist)"
    fi
fi

echo ""
echo "=========================================="
echo "  ✅ Migration Complete"
echo "=========================================="
echo ""

# Show DAO status
echo "Current DAO status:"
sqlite3 voting_tool.db "SELECT id, name, status, created_at FROM daos;"
echo ""

