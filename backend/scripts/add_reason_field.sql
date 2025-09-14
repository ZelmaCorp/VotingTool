-- Migration script to add reason field to referendum_team_roles table
-- This allows team members to provide reasons for their actions (especially for no_way votes)

-- Add the reason column to the existing table
ALTER TABLE referendum_team_roles ADD COLUMN reason TEXT;

-- Verify the table structure
PRAGMA table_info(referendum_team_roles); 