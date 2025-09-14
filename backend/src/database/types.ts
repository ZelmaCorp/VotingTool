import { Chain, InternalStatus, TimelineStatus, Origin } from '../types/properties';

/**
 * Database-specific types that exactly match the SQLite schema
 * Database record types for SQLite storage
 */

// Base referendum record as stored in database
export interface ReferendumRecord {
    id?: number;                        // AUTO INCREMENT primary key
    post_id: number;                    // Polkassembly post ID
    chain: Chain;                       // 'Polkadot' | 'Kusama'
    title: string;
    description?: string;
    requested_amount_usd?: number;      // USD amount (calculated)
    origin?: string;                    // Origin enum value
    referendum_timeline?: string;       // Timeline status
    internal_status?: string;           // Internal workflow status
    link?: string;                      // Polkassembly URL
    voting_start_date?: string;         // ISO date string
    voting_end_date?: string;           // ISO date string
    vote_executed_date?: string;        // When vote was executed
    created_at: string;                 // ISO date string (required)
    updated_at?: string;                // Auto-updated by trigger
    last_edited_by?: string;
    public_comment?: string;
    public_comment_made?: boolean;
    ai_summary?: string;
    reason_for_vote?: string;
    reason_for_no_way?: string;
    voted_link?: string;                // Subscan extrinsic URL
}

// Referendum with related data (scoring, voting, team roles)
export interface ReferendumWithDetails extends ReferendumRecord {
    // From scoring_criteria table
    necessity_score?: number;
    funding_score?: number;
    competition_score?: number;
    blueprint_score?: number;
    track_record_score?: number;
    reports_score?: number;
    synergy_score?: number;
    revenue_score?: number;
    security_score?: number;
    open_source_score?: number;
    ref_score?: number;                 // Calculated score
    
    // From voting_decisions table
    suggested_vote?: string;
    final_vote?: string;
    vote_executed?: boolean;
    vote_executed_date?: string;
    
    // From team assignments (concatenated)
    team_roles?: string;                // "Alice:Lead,Bob:Reviewer"
}

// Scoring criteria record
export interface ScoringRecord {
    id?: number;
    referendum_id: number;
    necessity_score?: number;           // 1-5
    funding_score?: number;             // 1-5
    competition_score?: number;         // 1-5
    blueprint_score?: number;           // 1-5
    track_record_score?: number;        // 1-5
    reports_score?: number;             // 1-5
    synergy_score?: number;             // 1-5
    revenue_score?: number;             // 1-5
    security_score?: number;            // 1-5
    open_source_score?: number;         // 1-5
    ref_score?: number;                 // Calculated automatically
    created_at?: string;
    updated_at?: string;
}

// Voting decision record
export interface VotingRecord {
    id?: number;
    referendum_id: number;
    suggested_vote?: string;            // 'AYE' | 'NAY' | 'ABSTAIN'
    final_vote?: string;
    vote_executed?: boolean;
    vote_executed_date?: string;
    created_at?: string;
    updated_at?: string;
}

// Multisig member role assignment
export interface TeamRoleRecord {
    id?: number;
    referendum_id: number;
    team_member_id: string;                      // Team member wallet address (changed from number to string)
    role_type: string;                           // "responsible_person", "agree", "no_way", "recuse", "to_be_discussed"
    reason?: string;                             // Optional reason for the action
    created_at?: string;
}

// Discussion topic record
export interface DiscussionRecord {
    id?: number;
    referendum_id: number;
    topic: string;
    content?: string;
    author?: string;
    created_at?: string;
}

// Mimir transaction record
export interface MimirTransactionRecord {
    id?: number;
    referendum_id: number;
    calldata: string;                   // Transaction calldata
    timestamp: number;                  // Unix timestamp
    status: string;                     // 'pending', 'executed', 'failed'
    extrinsic_hash?: string;            // On-chain transaction hash
    created_at?: string;
}

// App configuration record
export interface ConfigRecord {
    key: string;                        // Primary key
    value: string;
    description?: string;
    updated_at?: string;
}

// Audit log record
export interface AuditRecord {
    id?: number;
    table_name: string;
    record_id: string;
    operation: string;                  // 'INSERT', 'UPDATE', 'DELETE'
    old_values?: string;                // JSON
    new_values?: string;                // JSON
    changed_by?: string;
    changed_at?: string;
} 