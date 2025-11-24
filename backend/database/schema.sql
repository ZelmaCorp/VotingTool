-- SQLite Database Schema for OpenGov Voting Tool (Multi-DAO Support)
-- This replaces the Notion database with a local SQLite database
-- Supports multiple DAOs in a single database instance

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- ============================================================================
-- DAO TABLES
-- ============================================================================

-- DAOs table - stores configuration for multiple DAOs
CREATE TABLE daos (
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

-- Create indexes on DAOs table
CREATE INDEX idx_daos_status ON daos(status);
CREATE INDEX idx_daos_name ON daos(name);
CREATE INDEX idx_daos_created_at ON daos(created_at);

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Main referendums table
CREATE TABLE referendums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,                    -- Polkassembly post ID
    chain TEXT NOT NULL CHECK (chain IN ('Polkadot', 'Kusama')),
    dao_id INTEGER NOT NULL,                     -- DAO that owns this referendum
    title TEXT NOT NULL,
    description TEXT,                            -- Full description content
    requested_amount_usd REAL,                   -- Calculated USD amount
    origin TEXT,                                 -- Origin enum value
    referendum_timeline TEXT,                    -- Timeline status
    internal_status TEXT DEFAULT 'Not started',  -- Internal workflow status
    link TEXT,                                   -- Polkassembly URL
    voting_start_date TEXT,                      -- ISO date string
    voting_end_date TEXT,                        -- ISO date string
    vote_executed_date TEXT,                     -- When vote was executed
    created_at TEXT NOT NULL,                    -- ISO date string
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_edited_by TEXT,                         -- User who last edited
    public_comment TEXT,                         -- Public comment content
    public_comment_made BOOLEAN DEFAULT FALSE,   -- Whether public comment was made
    ai_summary TEXT,                             -- AI-generated summary
    reason_for_vote TEXT,                        -- Reason for the vote decision
    reason_for_no_way TEXT,                      -- Reason for NO WAY vote
    voted_link TEXT,                             -- Subscan extrinsic URL after vote execution
    
    -- Foreign key constraint
    FOREIGN KEY (dao_id) REFERENCES daos(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicates per DAO
    UNIQUE(post_id, chain, dao_id)
);

-- Create indexes for common queries
CREATE INDEX idx_referendums_post_id ON referendums(post_id);
CREATE INDEX idx_referendums_chain ON referendums(chain);
CREATE INDEX idx_referendums_dao_id ON referendums(dao_id);
CREATE INDEX idx_referendums_internal_status ON referendums(internal_status);
CREATE INDEX idx_referendums_timeline ON referendums(referendum_timeline);
CREATE INDEX idx_referendums_created_at ON referendums(created_at);
CREATE INDEX idx_referendums_voting_end_date ON referendums(voting_end_date);
CREATE INDEX idx_referendums_updated_at ON referendums(updated_at);

-- ============================================================================
-- SCORING TABLES
-- ============================================================================

-- Scoring criteria table (stores the 10 scoring criteria)
CREATE TABLE scoring_criteria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referendum_id INTEGER NOT NULL,
    dao_id INTEGER NOT NULL,
    
    -- The 10 scoring criteria (1-5 scale)
    necessity_score INTEGER CHECK (necessity_score >= 1 AND necessity_score <= 5),
    funding_score INTEGER CHECK (funding_score >= 1 AND funding_score <= 5),
    competition_score INTEGER CHECK (competition_score >= 1 AND competition_score <= 5),
    blueprint_score INTEGER CHECK (blueprint_score >= 1 AND blueprint_score <= 5),
    track_record_score INTEGER CHECK (track_record_score >= 1 AND track_record_score <= 5),
    reports_score INTEGER CHECK (reports_score >= 1 AND reports_score <= 5),
    synergy_score INTEGER CHECK (synergy_score >= 1 AND synergy_score <= 5),
    revenue_score INTEGER CHECK (revenue_score >= 1 AND revenue_score <= 5),
    security_score INTEGER CHECK (security_score >= 1 AND security_score <= 5),
    open_source_score INTEGER CHECK (open_source_score >= 1 AND open_source_score <= 5),
    
    -- Calculated average score
    ref_score REAL GENERATED ALWAYS AS (
        ROUND(
            (COALESCE(necessity_score, 0) + 
             COALESCE(funding_score, 0) + 
             COALESCE(competition_score, 0) + 
             COALESCE(blueprint_score, 0) + 
             COALESCE(track_record_score, 0) + 
             COALESCE(reports_score, 0) + 
             COALESCE(synergy_score, 0) + 
             COALESCE(revenue_score, 0) + 
             COALESCE(security_score, 0) + 
             COALESCE(open_source_score, 0)) / 10.0, 2
        )
    ) STORED,
    
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    
    FOREIGN KEY (referendum_id) REFERENCES referendums(id) ON DELETE CASCADE,
    FOREIGN KEY (dao_id) REFERENCES daos(id) ON DELETE CASCADE,
    UNIQUE(referendum_id)
);

CREATE INDEX idx_scoring_criteria_dao_id ON scoring_criteria(dao_id);
CREATE INDEX idx_scoring_criteria_ref_score ON scoring_criteria(ref_score);

-- ============================================================================
-- DAO GOVERNANCE TABLES
-- ============================================================================

-- Governance actions for referendums during discussion period (using on-chain multisig addresses)
CREATE TABLE referendum_team_roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referendum_id INTEGER NOT NULL,
    dao_id INTEGER NOT NULL,
    team_member_id TEXT NOT NULL, -- Wallet address
    role_type TEXT NOT NULL CHECK (role_type IN ('responsible_person', 'agree', 'no_way', 'recuse', 'to_be_discussed')),
    reason TEXT,                  -- Optional reason for the action (especially important for no_way votes)
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    
    FOREIGN KEY (referendum_id) REFERENCES referendums(id) ON DELETE CASCADE,
    FOREIGN KEY (dao_id) REFERENCES daos(id) ON DELETE CASCADE,
    -- Allow one person to have multiple different roles for the same referendum
    UNIQUE(referendum_id, team_member_id, role_type)
);

-- Ensure only one responsible person per referendum
CREATE UNIQUE INDEX idx_one_responsible_person_per_referendum 
ON referendum_team_roles(referendum_id) 
WHERE role_type = 'responsible_person';

CREATE INDEX idx_referendum_team_roles_dao_id ON referendum_team_roles(dao_id);

-- ============================================================================
-- VOTING TABLES
-- ============================================================================

-- Voting decisions table
CREATE TABLE voting_decisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referendum_id INTEGER NOT NULL,
    dao_id INTEGER NOT NULL,
    suggested_vote TEXT CHECK (suggested_vote IN ('👍 Aye 👍', '👎 Nay 👎', '✌️ Abstain ✌️')),
    final_vote TEXT CHECK (final_vote IN ('👍 Aye 👍', '👎 Nay 👎', '✌️ Abstain ✌️')),
    vote_executed BOOLEAN DEFAULT FALSE,
    vote_executed_date TEXT,                     -- ISO date string
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    
    FOREIGN KEY (referendum_id) REFERENCES referendums(id) ON DELETE CASCADE,
    FOREIGN KEY (dao_id) REFERENCES daos(id) ON DELETE CASCADE,
    UNIQUE(referendum_id)
);

CREATE INDEX idx_voting_decisions_dao_id ON voting_decisions(dao_id);
CREATE INDEX idx_voting_decisions_vote_executed ON voting_decisions(vote_executed);
CREATE INDEX idx_voting_decisions_vote_executed_date ON voting_decisions(vote_executed_date);

-- ============================================================================
-- DISCUSSION TABLES
-- ============================================================================

-- Discussion topics for referendums
CREATE TABLE discussion_topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referendum_id INTEGER NOT NULL,
    dao_id INTEGER NOT NULL,
    topic_name TEXT NOT NULL,
    topic_id INTEGER,                            -- External topic ID if applicable
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    
    FOREIGN KEY (referendum_id) REFERENCES referendums(id) ON DELETE CASCADE,
    FOREIGN KEY (dao_id) REFERENCES daos(id) ON DELETE CASCADE
);

CREATE INDEX idx_discussion_topics_dao_id ON discussion_topics(dao_id);

-- Comments for referendum discussions
CREATE TABLE referendum_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referendum_id INTEGER NOT NULL,
    dao_id INTEGER NOT NULL,
    team_member_id TEXT NOT NULL,               -- Wallet address of commenter
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    
    FOREIGN KEY (referendum_id) REFERENCES referendums(id) ON DELETE CASCADE,
    FOREIGN KEY (dao_id) REFERENCES daos(id) ON DELETE CASCADE
);

CREATE INDEX idx_referendum_comments_dao_id ON referendum_comments(dao_id);

-- Create trigger to auto-update updated_at for comments
CREATE TRIGGER update_referendum_comments_updated_at
    AFTER UPDATE ON referendum_comments
    FOR EACH ROW
BEGIN
    UPDATE referendum_comments SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- ============================================================================
-- MIMIR INTEGRATION TABLES
-- ============================================================================

-- Mimir transaction tracking
CREATE TABLE mimir_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referendum_id INTEGER NOT NULL,
    dao_id INTEGER NOT NULL,
    calldata TEXT NOT NULL,                      -- Transaction calldata
    timestamp INTEGER NOT NULL,                  -- Unix timestamp
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'executed', 'failed')),
    extrinsic_hash TEXT,                         -- On-chain transaction hash
    voted TEXT,                                  -- The suggested vote (Aye/Nay/Abstain)
    post_id INTEGER,                             -- Referendum post_id
    chain TEXT CHECK (chain IN ('Polkadot', 'Kusama')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    
    FOREIGN KEY (referendum_id) REFERENCES referendums(id) ON DELETE CASCADE,
    FOREIGN KEY (dao_id) REFERENCES daos(id) ON DELETE CASCADE
);

CREATE INDEX idx_mimir_transactions_dao_id ON mimir_transactions(dao_id);
CREATE INDEX idx_mimir_transactions_status ON mimir_transactions(status);
CREATE INDEX idx_mimir_transactions_timestamp ON mimir_transactions(timestamp);
CREATE INDEX idx_mimir_transactions_dao_post ON mimir_transactions(dao_id, post_id, chain);

-- ============================================================================
-- AUDIT TABLES
-- ============================================================================

-- Audit log for all changes
CREATE TABLE audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referendum_id INTEGER,
    dao_id INTEGER,
    table_name TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values TEXT,                             -- JSON string of old values
    new_values TEXT,                             -- JSON string of new values
    changed_by TEXT,                             -- User who made the change
    changed_at TEXT NOT NULL DEFAULT (datetime('now')),
    
    FOREIGN KEY (referendum_id) REFERENCES referendums(id) ON DELETE SET NULL,
    FOREIGN KEY (dao_id) REFERENCES daos(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_log_dao_id ON audit_log(dao_id);
CREATE INDEX idx_audit_log_changed_at ON audit_log(changed_at);
CREATE INDEX idx_audit_log_referendum_id ON audit_log(referendum_id);

-- ============================================================================
-- CONFIGURATION TABLES
-- ============================================================================

-- Application configuration
CREATE TABLE app_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Configuration will be populated by application code from environment variables
-- This table stores runtime configuration that can be updated without code changes

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for ready to vote referendums
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
LEFT JOIN voting_decisions vd ON r.id = vd.referendum_id AND r.dao_id = vd.dao_id
LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id AND r.dao_id = sc.dao_id
LEFT JOIN daos d ON r.dao_id = d.id
WHERE r.internal_status = 'Ready to vote'
  AND r.voting_end_date > datetime('now');

-- View for referendums needing evaluation
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
LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id AND r.dao_id = sc.dao_id
LEFT JOIN daos d ON r.dao_id = d.id
WHERE r.internal_status IN ('Not started', 'Considering')
ORDER BY r.created_at DESC;

-- View for completed votes
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
JOIN voting_decisions vd ON r.id = vd.referendum_id AND r.dao_id = vd.dao_id
LEFT JOIN scoring_criteria sc ON r.id = sc.referendum_id AND r.dao_id = sc.dao_id
LEFT JOIN daos d ON r.dao_id = d.id
WHERE vd.vote_executed = TRUE
ORDER BY vd.vote_executed_date DESC;

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Trigger to update daos.updated_at
CREATE TRIGGER update_daos_updated_at
    AFTER UPDATE ON daos
    FOR EACH ROW
BEGIN
    UPDATE daos SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_referendums_updated_at
    AFTER UPDATE ON referendums
    FOR EACH ROW
BEGIN
    UPDATE referendums SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Trigger to update scoring_criteria updated_at
CREATE TRIGGER update_scoring_criteria_updated_at
    AFTER UPDATE ON scoring_criteria
    FOR EACH ROW
BEGIN
    UPDATE scoring_criteria SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Trigger to update voting_decisions updated_at
CREATE TRIGGER update_voting_decisions_updated_at
    AFTER UPDATE ON voting_decisions
    FOR EACH ROW
BEGIN
    UPDATE voting_decisions SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- ============================================================================
-- SCHEMA CREATION COMPLETE
-- ============================================================================

-- Database schema has been created successfully with multi-DAO support
-- 
-- Authentication: Users authenticate with wallet signatures
-- - Users must be members of the multisig to access their DAO's data
-- - No DAO-level API keys - authentication is user-based
-- 
-- To verify table creation, run: .schema
-- To inspect table structure, run: PRAGMA table_info(table_name);
