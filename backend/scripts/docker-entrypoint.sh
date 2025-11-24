#!/bin/sh
# Docker Entrypoint Script
# Runs database migrations before starting the application

set -e

echo "=========================================="
echo "  Starting Polkadot Voting Tool"
echo "=========================================="
echo ""

# Change to app directory
cd /app

# Set database path
DB_PATH="${DATABASE_PATH:-/app/data/voting_tool.db}"
echo "📁 Database path: $DB_PATH"

# Ensure data directory exists
mkdir -p "$(dirname "$DB_PATH")"

# Check if database needs initialization
if [ ! -f "$DB_PATH" ]; then
    echo "📋 Creating new database from schema..."
    sqlite3 "$DB_PATH" < database/schema.sql
    echo "✅ Database created"
fi

# Check if migration is needed
DAOS_TABLE=$(sqlite3 "$DB_PATH" "SELECT name FROM sqlite_master WHERE type='table' AND name='daos';" 2>/dev/null || echo "")

if [ -z "$DAOS_TABLE" ]; then
    echo "📋 Running schema migration..."
    sqlite3 "$DB_PATH" < database/migrations/001_add_multi_dao_support.sql
    echo "✅ Schema migration complete"
else
    echo "✅ Schema already migrated"
fi

# Check if data migration is needed
NULL_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM referendums WHERE dao_id IS NULL;" 2>/dev/null || echo "0")

if [ "$NULL_COUNT" -gt "0" ] || [ "$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM daos;" 2>/dev/null || echo "0")" -eq "0" ]; then
    echo "📋 Running data migration..."
    
    # Run data migration with proper database path
    DATABASE_PATH="$DB_PATH" npx tsx database/migrations/direct_migrate.ts "$DB_PATH"
    
    echo "✅ Data migration complete"
else
    echo "✅ Data already migrated"
fi

echo ""
echo "=========================================="
echo "  ✅ Migrations Complete - Starting App"
echo "=========================================="
echo ""

# Execute the main command (passed as arguments to this script)
exec "$@"

