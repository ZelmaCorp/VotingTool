export enum Chain {
    Polkadot = "Polkadot",
    Kusama = "Kusama"
}

export enum TimelineStatus {
    LeadIn = "Lead-in",
    DecisionDepositPlaced = "DecisionDepositPlaced",
    Submitted = "Submitted",
    Deciding = "Deciding",
    Confirmation = "Confirmation",
    Enactment = "Enactment",
    TimedOut = "TimedOut",
    Executed = "Executed",
    ExecutionFailed = "ExecutionFailed",
    ConfirmStarted = "ConfirmStarted",
    Confirmed = "Confirmed",
    Rejected = "Rejected",
    Cancelled = "Cancelled",
    Canceled = "Canceled",
    Killed = "Killed"
}

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
    Abstain = "✌️ Abstain ✌️"
}

export enum Origin {
    // Numbered origins
    Root0 = "0 - Root",
    WhitelistedCaller1 = "1 - Whitelisted Caller",
    WishForChange2 = "2 - Wish For Change",
    StakingAdmin10 = "10 - Staking Admin",
    Treasurer11 = "11 - Treasurer",
    LeaseAdmin12 = "12 - Lease Admin",
    FellowshipAdmin13 = "13 - Fellowship Admin",
    GeneralAdmin14 = "14 - General Admin",
    AuctionAdmin15 = "15 - Auction Admin",
    ReferendumCanceller20 = "20 - Referendum Canceller",
    ReferendumKiller21 = "21 - Referendum Killer",
    SmallTipper30 = "30 - Small Tipper",
    BigTipper31 = "31 - Big Tipper",
    SmallSpender32 = "32- Small Spender", // Note: Original has a missing space after the hyphen
    MediumSpender33 = "33 - Medium Spender",
    BigSpender34 = "34 - Big Spender",
    
    // Alternative names without numbers
    MediumSpender = "MediumSpender",
    BigTipper = "BigTipper",
    NoOriginInformationAvailable = "No origin information available",
    BigSpender = "BigSpender",
    ReferendumCanceller = "ReferendumCanceller",
    SmallSpender = "SmallSpender",
    WishForChange = "WishForChange",
    SmallTipper = "SmallTipper",
    FellowshipAdmin = "FellowshipAdmin",
    Root = "Root",
    WhitelistedCaller = "WhitelistedCaller",
    Treasurer = "Treasurer",
    ReferendumKiller = "ReferendumKiller",
    StakingAdmin = "StakingAdmin",
    LeaseAdmin = "LeaseAdmin",
    AuctionAdmin = "AuctionAdmin",
    GeneralAdmin = "GeneralAdmin"
}


export type Link = string;

export type VotingTime = string;

export type ReferendumId = number;

export type ExtrinsicHash = string;

export type ExtrinsicHashMap = {
    [key: ReferendumId]: ExtrinsicHash;
}