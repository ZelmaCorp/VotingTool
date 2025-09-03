-- Migration script to update referendum_team_roles table for DAO governance actions
-- This script updates the existing table structure to work with team member IDs and governance actions

-- Drop the old table if it exists (this will lose existing data)
DROP TABLE IF EXISTS referendum_team_roles;

-- Create the new table structure for governance actions during referendum discussion
CREATE TABLE referendum_team_roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referendum_id INTEGER NOT NULL,
    team_member_id INTEGER NOT NULL,
    role_type TEXT NOT NULL CHECK (role_type IN ('responsible_person', 'agree', 'no_way', 'recuse', 'to_be_discussed')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    
    FOREIGN KEY (referendum_id) REFERENCES referendums(id) ON DELETE CASCADE,
    UNIQUE(referendum_id, team_member_id, role_type)
);

-- Create index for team member lookups
CREATE INDEX IF NOT EXISTS idx_referendum_team_roles_team_member_id ON referendum_team_roles(team_member_id);
CREATE INDEX IF NOT EXISTS idx_referendum_team_roles_referendum_id ON referendum_team_roles(referendum_id);

-- Verify the table was created correctly
PRAGMA table_info(referendum_team_roles); 