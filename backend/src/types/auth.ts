/**
 * Authentication and authorization types for Web3 integration
 */

export interface Web3AuthRequest {
  address: string;
  signature: string;
  message: string;
  timestamp: number;
}

export interface Web3AuthResponse {
  success: boolean;
  token?: string;
  user?: AuthenticatedUser;
  error?: string;
}

export interface AuthenticatedUser {
  address: string;  // Changed from wallet_address to match desired format
  name: string;
  network: "Polkadot" | "Kusama" | "Unknown";
}

export interface AuthToken {
  token: string;
  user: AuthenticatedUser;
  expires_at: number;
}

export interface AuthMiddlewareRequest extends Request {
  user?: AuthenticatedUser;
  isAuthenticated: boolean;
}

// Governance action types for referendum discussion period
export enum ReferendumAction {
  RESPONSIBLE_PERSON = "responsible_person",    // Lead evaluator for this referendum
  AGREE = "agree",                              // Agree with the evaluator
  NO_WAY = "no_way",                            // Strongly opose this proposal (Veto)
  RECUSE = "recuse",                            // Abstain due to conflict of interest
  TO_BE_DISCUSSED = "to_be_discussed"           // Needs further discussion
}

export interface ReferendumActionAssignment {
  referendum_id: number;
  wallet_address: string;
  action: ReferendumAction;
} 