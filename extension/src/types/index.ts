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