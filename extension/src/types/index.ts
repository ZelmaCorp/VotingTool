// OpenGov VotingTool Extension Types

// Authentication types
export interface Web3AuthRequest {
    address: string;
    signature: string;
    message: string;
    timestamp: number;
}

export interface AuthenticatedUser {
    address: string;
    name: string;
    network: "Polkadot" | "Kusama" | "Unknown";
}

export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: AuthenticatedUser;
    error?: string;
    valid?: boolean; // For token verification endpoint
}

export interface AuthState {
    isAuthenticated: boolean;
    user: AuthenticatedUser | null;
    token: string | null;
    isLoading: boolean;
}

// Proposal/Referendum types
export type Chain = 'Polkadot' | 'Kusama';

export type InternalStatus = 
    | 'Not started'
    | 'Considering'
    | 'Ready for approval'
    | 'Waiting for agreement'
    | 'Ready to vote'
    | 'Reconsidering'
    | 'Voted 👍 Aye 👍'
    | 'Voted 👎 Nay 👎'
    | 'Voted ✌️ Abstain ✌️'
    | 'Not Voted';

export type TimelineStatus = 
    | 'Lead-in'
    | 'DecisionDepositPlaced'
    | 'Submitted'
    | 'Deciding'
    | 'Confirmation'
    | 'ConfirmStarted'
    | 'Enactment'
    | 'Executed'
    | 'ExecutionFailed'
    | 'TimedOut'
    | 'Rejected'
    | 'Cancelled'
    | 'Canceled'
    | 'Killed'
    | 'Confirmed';

export type SuggestedVote = '👍 Aye 👍' | '👎 Nay 👎' | '✌️ Abstain ✌️';

// New types for team collaboration
export type TeamAction = 
    | 'Agree'
    | 'To be discussed'
    | 'NO WAY'  // VETO
    | 'Recuse';

export interface TeamMember {
    address: string;
    name: string;
}

export interface ProposalAction {
    id?: number;
    proposal_id?: number;
    team_member_id: string;      // Backend field name
    wallet_address: string;      // Backend enriched field
    role_type: string;       // Backend field name
    team_member_name?: string;   // Backend enriched field
    reason?: string;
    timestamp?: string;
    network?: string;            // Backend enriched field
    created_at: string;
    updated_at?: string;
}

export interface ProposalComment {
    id?: number;
    proposal_id: number;
    user_address: string;
    user_name: string;
    content: string;
    created_at: string;
    updated_at?: string;
}

export interface ProposalData {
    id?: number;
    post_id: number;
    chain: Chain;
    title: string;
    description?: string;
    internal_status: InternalStatus;
    referendum_timeline?: TimelineStatus;
    suggested_vote?: SuggestedVote;
    reason_for_vote?: string;  // Changed from suggested_vote_reason to match backend
    final_vote?: SuggestedVote;
    assigned_to?: string;
    link?: string;
    voting_start_date?: string;
    voting_end_date?: string;
    created_at: string;
    updated_at?: string;
    last_edited_by?: string;
    
    // New fields for team collaboration
    team_actions?: ProposalAction[];
    comments?: ProposalComment[];
    agreement_count?: number;
    required_agreements?: number;  // Default 4, but configurable per DAO
}

// Agreement summary for UI
export interface AgreementSummary {
    total_agreements: number;
    required_agreements: number;
    agreed_members: TeamMember[];
    pending_members: TeamMember[];
    vetoed: boolean;
    veto_reason?: string;
    veto_by?: string;
    recused_members: TeamMember[];
    to_be_discussed_members: TeamMember[];
}

// UI Component Props
export interface StatusBadgeProps {
    status: InternalStatus;
    proposalId: number;
    editable?: boolean;
}

export interface AssignmentDisplayProps {
    assignedTo?: string;
    proposalId: number;
    currentUser?: string;
}

export interface QuickVoteProps {
    suggestedVote?: SuggestedVote;
    personalVote?: SuggestedVote;
    proposalId: number;
}

// New component props for team functionality
export interface TeamActionsProps {
    proposalId: number;
    currentUserAction?: TeamAction;
    agreementSummary: AgreementSummary;
}

export interface DiscussionPanelProps {
    proposalId: number;
    comments: ProposalComment[];
    canComment: boolean;
}

export interface VoteReasonModalProps {
    show: boolean;
    currentVote?: SuggestedVote;
    currentReason?: string;
    proposalId: number;
}

// Modal types
export interface ModalState {
    isOpen: boolean;
    type: 'status' | 'assignment' | 'voting' | 'detail' | 'discussion' | 'team-action' | 'vote-reason' | null;
    proposalId?: number;
    data?: any;
}

// Configuration types
export interface DAOConfig {
    required_agreements: number;
    team_members: TeamMember[];         // Team members are coming from the multisig
    name: string;
    multisig_address?: string;
} 

export interface Proposal {
    id: string;
    chain: Chain;
    status: InternalStatus;
    assignedTo?: string;
    suggestedVote?: SuggestedVote;
    title: string;
    description?: string;
    updatedAt: string;
    createdAt: string;
}

export interface FilterOptions {
    status?: InternalStatus;
    chain?: Chain;
    assignedTo?: string;
    suggestedVote?: SuggestedVote;
} 