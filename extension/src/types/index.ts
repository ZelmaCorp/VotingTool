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
    | 'TimedOut'
    | 'Rejected';

export type SuggestedVote = 'Aye' | 'Nay' | 'Abstain';

export interface ProposalData {
    id?: number;
    post_id: number;
    chain: Chain;
    title: string;
    description?: string;
    internal_status: InternalStatus;
    referendum_timeline?: TimelineStatus;
    suggested_vote?: SuggestedVote;
    final_vote?: SuggestedVote;
    assigned_to?: string;
    link?: string;
    voting_start_date?: string;
    voting_end_date?: string;
    created_at: string;
    updated_at?: string;
    last_edited_by?: string;
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

// Modal types
export interface ModalState {
    isOpen: boolean;
    type: 'status' | 'assignment' | 'voting' | 'detail' | null;
    proposalId?: number;
    data?: any;
} 