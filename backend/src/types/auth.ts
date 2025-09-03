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
  id: number;
  name: string;
  email?: string;
  wallet_address: string;
  role?: string;
  network?: "Polkadot" | "Kusama" | "Unknown";
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
  NO_WAY = "no_way",                            // Strongly opose this proposal
  RECUSE = "recuse",                            // Abstain due to conflict of interest
  TO_BE_DISCUSSED = "to_be_discussed"           // Needs further discussion
}

// Legacy type for backward compatibility (deprecated)
export type TeamRoleType = ReferendumAction;

export interface ReferendumActionAssignment {
  referendum_id: number;
  wallet_address: string;
  action: ReferendumAction;
} 