// OpenGov VotingTool Extension Types

export enum InternalStatus {
    NotStarted = "Not started",
    Considering = "Considering",
    ReadyForApproval = "Ready for approval",
    WaitingForAgreement = "Waiting for agreement",
    ReadyToVote = "Ready to vote",
    Reconsidering = "Reconsidering",
    VotedAye = "Voted 👍 Aye 👍",
    VotedNay = "Voted 👎 Nay 👎",
    VotedAbstain = "Voted ✌️ Abstain ✌️",
    NotVoted = "Not Voted"
}

export enum SuggestedVote {
    Aye = "👍 Aye 👍",
    Nay = "👎 Nay 👎",
    Abstain = "✌️ Abstain ✌️",
    None = "No suggestion"
}

export interface Proposal {
    id: string;
    title: string;
    description: string;
    chain: 'Polkadot' | 'Kusama';
    amount?: string;
    origin?: string;
    status: InternalStatus;
    suggestedVote: SuggestedVote;
    assignedTo?: string;
    assignedAt?: string;
    reason?: string;
    noWayReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    address: string;
    name?: string;
    role: 'reviewer' | 'voter' | 'admin';
}

export interface Assignment {
    proposalId: string;
    userId: string;
    assignedAt: string;
    assignedBy: string;
}

export interface Vote {
    proposalId: string;
    userId: string;
    vote: 'aye' | 'nay' | 'abstain';
    reason: string;
    votedAt: string;
}

export interface Comment {
    id: string;
    proposalId: string;
    userId: string;
    content: string;
    createdAt: string;
}

export interface FilterOptions {
    status?: InternalStatus;
    chain?: 'Polkadot' | 'Kusama';
    assignedTo?: string;
    suggestedVote?: SuggestedVote;
} 