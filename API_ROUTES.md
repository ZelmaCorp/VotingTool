# API Routes Documentation

**Version**: 2.0.0 (Multi-DAO)  
**Last Updated**: November 24, 2025

---

## 🔐 Authentication

All routes except `/auth/*` and `/health` require authentication via Bearer token.

**Token Format**: `Authorization: Bearer <token>`

### Multi-DAO Context

Most DAO-related endpoints use the `addDaoContext` middleware which automatically determines which DAO(s) the authenticated user belongs to. You can specify a DAO in two ways:

1. **Query Parameter**: `?multisig=<multisig-address>`
2. **Header**: `X-Multisig-Address: <multisig-address>`

If not specified, the system uses the first DAO the user's wallet belongs to.

---

## 📋 Routes Overview

### Auth Routes (`/auth`)
- `POST /auth/web3-login` - Authenticate with Web3 wallet
- `GET /auth/verify` - Verify token validity
- `POST /auth/logout` - Logout user
- `GET /auth/profile` - Get user profile

### DAO Routes (`/dao`)
- `GET /dao/:daoId` - Get DAO information
- `GET /dao/:daoId/stats` - Get DAO statistics
- `POST /dao/register` - Register new DAO
- `GET /dao/members` - Get DAO members
- `GET /dao/:daoId/members/:chain` - Get members for specific DAO
- `POST /dao/:daoId/members/:chain/refresh` - Refresh member cache
- `GET /dao/:daoId/members/:chain/:walletAddress` - Check membership
- `GET /dao/parent` - Get parent address
- `GET /dao/config` - Get DAO configuration
- `GET /dao/my-assignments` - Get user's assignments
- `GET /dao/workflow` - Get workflow data
- `POST /dao/sync` - Sync with Polkassembly
- `POST /dao/cleanup-duplicate-actions` - Cleanup utility

### Referendum Routes (`/referendums`)
- `GET /referendums` - Get all referendums
- `GET /referendums/:postId` - Get specific referendum
- `PUT /referendums/:postId/:chain` - Update referendum
- `GET /referendums/:postId/actions` - Get team actions
- `POST /referendums/:postId/actions` - Add team action
- `DELETE /referendums/:postId/actions` - Delete team action
- `POST /referendums/:postId/assign` - Assign to referendum
- `POST /referendums/:postId/unassign` - Unassign from referendum
- `GET /referendums/:postId/comments` - Get comments
- `POST /referendums/:postId/comments` - Add comment
- `DELETE /comments/:commentId` - Delete comment
- `GET /referendums/:postId/agreement-summary` - Get agreement summary

### Admin Routes (`/admin`)
- `GET /admin/refresh-referendas` - Refresh from Polkassembly
- `GET /admin/process-pending-transitions` - Process status transitions
- `GET /admin/cleanup-mimir-transactions` - Cleanup Mimir transactions

### Mimir Routes
- `GET /send-to-mimir` - Send ready proposals to Mimir

### System Routes
- `GET /health` - Health check

---

## 📖 Detailed Route Documentation

## Auth Routes

### `POST /auth/web3-login`
Authenticate user with Web3 wallet signature. Searches across all registered DAOs.

**Request**:
```typescript
{
  address: string;      // Wallet address
  signature: string;    // Web3 signature
  message: string;      // Message that was signed
  timestamp: number;    // Timestamp when message was signed
}
```

**Response (Success)**:
```typescript
{
  success: true;
  token: string;       // JWT token
  user: {
    address: string;
    name: string;
    network: string;
  }
}
```

**Response (403 - Not a Member)**:
```typescript
{
  success: false;
  error: "Access denied: Wallet address not registered as multisig member";
  details: {
    address: string;
    reason: string;
    suggestion: string;
  }
}
```

**Notes**:
- Searches all active DAOs for wallet membership
- Checks both Polkadot and Kusama multisigs
- Token contains wallet address, subsequent requests use `addDaoContext` to determine DAO(s)

---

### `GET /auth/verify`
Verify if authentication token is valid.

**Headers**: `Authorization: Bearer <token>`

**Response**:
```typescript
{
  success: true;
  valid: true;
  user: {
    address: string;
    name: string;
    network: string;
  }
}
```

---

### `POST /auth/logout`
Logout user (client should discard token).

**Headers**: `Authorization: Bearer <token>`

**Response**:
```typescript
{
  success: true;
  message: "Logged out successfully"
}
```

---

### `GET /auth/profile`
Get current user profile.

**Headers**: `Authorization: Bearer <token>`

**Response**:
```typescript
{
  success: true;
  user: {
    address: string;
    name: string;
    network: string;
  }
}
```

---

## DAO Routes

### `GET /dao/:daoId`
Get DAO information (without sensitive fields).

**Headers**: `Authorization: Bearer <token>`

**Response**:
```typescript
{
  success: true;
  dao: {
    id: number;
    name: string;
    description: string | null;
    status: string | null;
    created_at: string;
    updated_at: string | null;
    chains: Chain[];  // ['Polkadot', 'Kusama', or both]
    multisig_addresses: {
      polkadot: string | null;
      kusama: string | null;
    };
    member_counts: {
      polkadot: number;
      kusama: number;
    };
    stats: {
      total_referendums: number;
      active_referendums: number;
      voted_referendums: number;
      ready_to_vote: number;
    };
  }
}
```

---

### `GET /dao/:daoId/stats`
Get DAO statistics.

**Headers**: `Authorization: Bearer <token>`

**Response**:
```typescript
{
  success: true;
  stats: {
    total_referendums: number;
    active_referendums: number;
    voted_referendums: number;
    ready_to_vote: number;
  }
}
```

---

### `POST /dao/register`
Register a new DAO with on-chain verification.

**Headers**: `Authorization: Bearer <token>`

**Request**:
```typescript
{
  name: string;                    // DAO name (3-100 chars)
  description?: string;            // Optional description
  polkadotMultisig?: string;       // Polkadot multisig address (at least one required)
  kusamaMultisig?: string;         // Kusama multisig address (at least one required)
  walletAddress: string;           // Registrant's wallet address
  signature: string;               // Wallet signature proving ownership
  message: string;                 // Message that was signed (must include DAO name)
}
```

**Response (Success)**:
```typescript
{
  success: true;
  message: "DAO registered successfully";
  dao: {
    id: number;
    name: string;
    description: string | null;
    chains: Chain[];
    status: "active";
  }
}
```

**Response (Error)**:
```typescript
{
  success: false;
  error: string;
  errors?: string[];  // Validation errors
}
```

**Error Codes**:
- `400` - Validation failed (missing fields, invalid addresses, etc.)
- `403` - Wallet not a member of provided multisig(s)
- `409` - DAO name already exists

**Notes**:
- Verifies wallet signature to prove ownership
- Verifies multisig(s) exist on-chain
- Verifies wallet is a member of provided multisig(s)
- Automatically generates proposer mnemonic
- Encrypts sensitive data (multisig addresses, mnemonic)

---

### `GET /dao/members`
Get multisig members for the user's DAO.

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `chain`: `Polkadot` | `Kusama` (default: `Polkadot`)
- `multisig`: Optional multisig address to specify which DAO

**Response**:
```typescript
{
  success: true;
  members: Array<{
    address: string;
    name: string;
    network: string;
  }>
}
```

---

### `GET /dao/:daoId/members/:chain`
Get members for a specific DAO and chain.

**Headers**: `Authorization: Bearer <token>`

**Parameters**:
- `daoId`: DAO ID (number)
- `chain`: `Polkadot` | `Kusama`

**Response**:
```typescript
{
  success: true;
  members: Array<{
    address: string;
    name: string;
    network: string;
  }>
}
```

---

### `POST /dao/:daoId/members/:chain/refresh`
Refresh the member cache for a specific DAO and chain.

**Headers**: `Authorization: Bearer <token>`

**Parameters**:
- `daoId`: DAO ID (number)
- `chain`: `Polkadot` | `Kusama`

**Response**:
```typescript
{
  success: true;
  message: "Member cache refreshed successfully"
}
```

---

### `GET /dao/:daoId/members/:chain/:walletAddress`
Check if a wallet address is a member of a specific DAO.

**Headers**: `Authorization: Bearer <token>`

**Parameters**:
- `daoId`: DAO ID (number)
- `chain`: `Polkadot` | `Kusama`
- `walletAddress`: Wallet address to check

**Response**:
```typescript
{
  success: true;
  isMember: boolean;
  member?: {
    address: string;
    name: string;
    network: string;
  }
}
```

---

### `GET /dao/parent`
Get the parent address if the multisig is a proxy/delegate account.

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `chain`: `Polkadot` | `Kusama` (default: `Polkadot`)
- `multisig`: Optional multisig address

**Response**:
```typescript
{
  success: true;
  parent: {
    address: string | null;
    type: string | null;
  }
}
```

---

### `GET /dao/config`
Get DAO configuration including multisig addresses and team info.

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `chain`: `Polkadot` | `Kusama` (default: `Polkadot`)
- `multisig`: Optional multisig address

**Response**:
```typescript
{
  success: true;
  config: {
    name: string;
    team_members: TeamMember[];
    required_agreements: number;      // Multisig threshold
    multisig_address: string;         // Primary multisig
    polkadot_multisig: string | null;
    kusama_multisig: string | null;
  }
}
```

---

### `GET /dao/my-assignments`
Get all referendums assigned to the current user across all their DAOs.

**Headers**: `Authorization: Bearer <token>`

**Response**:
```typescript
{
  success: true;
  referendums: Array<{
    id: number;
    post_id: number;
    chain: Chain;
    dao_id: number;
    title: string;
    description: string;
    internal_status: string;
    link: string;
    voting_start_date?: string;
    voting_end_date?: string;
    created_at: string;
    updated_at: string;
  }>
}
```

---

### `GET /dao/workflow`
Get all workflow data in a single request for the user's DAO.

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `chain`: `Polkadot` | `Kusama` (default: `Polkadot`)
- `multisig`: Optional multisig address

**Response**:
```typescript
{
  success: true;
  data: {
    needsAgreement: ProposalSummary[];
    readyToVote: ProposalSummary[];
    forDiscussion: ProposalSummary[];
    vetoedProposals: ProposalSummary[];
  }
}
```

**Notes**:
- `needsAgreement`: Proposals needing more team member agreements
- `readyToVote`: Proposals with sufficient agreements, ready for Mimir
- `forDiscussion`: Proposals marked for discussion
- `vetoedProposals`: Proposals with NO_WAY (veto) actions

---

### `POST /dao/sync`
Trigger data synchronization with Polkassembly for the user's DAO.

**Headers**: `Authorization: Bearer <token>`

**Request**:
```typescript
{
  type?: "normal" | "deep";  // default: "normal"
}
```

**Response**:
```typescript
{
  success: true;
  message: string;
  type: "normal" | "deep";
  limit: number;              // 30 for normal, 100 for deep
  timestamp: string;
  status: "started";
}
```

**Notes**:
- `normal`: Fetches last 30 referendums
- `deep`: Fetches last 100 referendums
- Sync runs in background, returns immediately

---

### `POST /dao/cleanup-duplicate-actions`
Clean up duplicate team actions (utility endpoint).

**Response**:
```typescript
{
  success: true;
  message: "Duplicate team actions cleaned up successfully";
  deletedCount: number;
  duplicatesFound: number;
  details: Array<{
    referendum_id: number;
    post_id: number;
    title: string;
    team_member_id: string;
  }>
}
```

---

## Referendum Routes

### `GET /referendums`
Get all referendums for the user's DAO(s).

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `multisig`: Optional multisig address to filter by specific DAO

**Response**:
```typescript
{
  success: true;
  referendums: ProposalData[]
}
```

---

### `GET /referendums/:postId`
Get a specific referendum by post ID.

**Headers**: `Authorization: Bearer <token>`

**Parameters**:
- `postId`: Polkassembly post ID (number)

**Query Parameters**:
- `chain`: `Polkadot` | `Kusama` (required)
- `multisig`: Optional multisig address

**Response**:
```typescript
{
  success: true;
  referendum: ProposalData
}
```

**Error (404)**:
```typescript
{
  success: false;
  error: "Referendum {postId} not found on {chain} network"
}
```

---

### `PUT /referendums/:postId/:chain`
Update a referendum.

**Headers**: `Authorization: Bearer <token>`

**Parameters**:
- `postId`: Polkassembly post ID (number)
- `chain`: `Polkadot` | `Kusama`

**Request** (all fields optional):
```typescript
{
  // Referendum fields
  title?: string;
  description?: string;
  requested_amount_usd?: number;
  origin?: string;
  referendum_timeline?: string;
  internal_status?: InternalStatus;
  link?: string;
  voting_start_date?: string;
  voting_end_date?: string;
  last_edited_by?: string;
  public_comment?: string;
  public_comment_made?: boolean;
  ai_summary?: string;
  reason_for_vote?: string;
  reason_for_no_way?: string;
  voted_link?: string;

  // Voting fields
  suggested_vote?: "Aye" | "Nay" | "Abstain";
  final_vote?: "Aye" | "Nay" | "Abstain";
  vote_executed?: boolean;
  vote_executed_date?: string;
}
```

**Response**:
```typescript
{
  success: true;
  message: "Referendum updated successfully"
}
```

**Notes**:
- Status transitions are validated
- Only assigned users can change status (except special statuses)
- Suggested vote updates may trigger automatic status changes
- Cannot update `dao_id` field

---

### `GET /referendums/:postId/actions`
Get team actions for a referendum.

**Headers**: `Authorization: Bearer <token>`

**Parameters**:
- `postId`: Polkassembly post ID (number)

**Query Parameters**:
- `chain`: `Polkadot` | `Kusama` (required)

**Response**:
```typescript
{
  success: true;
  actions: Array<{
    id: number;
    team_member_id: string;
    team_member_name: string;
    role_type: string;
    reason?: string;
    created_at: string;
    updated_at?: string;
    wallet_address: string;
    network: string;
  }>
}
```

---

### `POST /referendums/:postId/actions`
Add a team action to a referendum.

**Headers**: `Authorization: Bearer <token>`

**Parameters**:
- `postId`: Polkassembly post ID (number)

**Request**:
```typescript
{
  chain: "Polkadot" | "Kusama";  // Required
  action: "agree" | "to_be_discussed" | "no_way" | "recuse";  // Required
  reason?: string;               // Optional
}
```

**Response**:
```typescript
{
  success: true;
  message: "Team action added successfully"
}
```

**Notes**:
- If action already exists, it will be updated with new reason
- May trigger automatic status transitions (e.g., to ReadyToVote)

---

### `DELETE /referendums/:postId/actions`
Delete a team action from a referendum.

**Headers**: `Authorization: Bearer <token>`

**Parameters**:
- `postId`: Polkassembly post ID (number)

**Request**:
```typescript
{
  chain: "Polkadot" | "Kusama";  // Required
  action: "agree" | "to_be_discussed" | "no_way" | "recuse";  // Required
}
```

**Response**:
```typescript
{
  success: true;
  message: "Team action removed successfully"
}
```

---

### `POST /referendums/:postId/assign`
Assign the current user as the responsible person for a referendum.

**Headers**: `Authorization: Bearer <token>`

**Parameters**:
- `postId`: Polkassembly post ID (number)

**Request**:
```typescript
{
  chain: "Polkadot" | "Kusama";  // Required
}
```

**Response**:
```typescript
{
  success: true;
  message: "Assigned successfully"
}
```

**Notes**:
- Only one user can be assigned at a time
- Returns 400 if already assigned to another user

---

### `POST /referendums/:postId/unassign`
Unassign the responsible person from a referendum.

**Headers**: `Authorization: Bearer <token>`

**Parameters**:
- `postId`: Polkassembly post ID (number)

**Request**:
```typescript
{
  chain: "Polkadot" | "Kusama";  // Required
  unassignNote?: string;         // Optional note
}
```

**Response**:
```typescript
{
  success: true;
  message: "Unassigned successfully"
}
```

**Notes**:
- Only the assigned user can unassign themselves
- Resets referendum state

---

### `GET /referendums/:postId/comments`
Get comments for a referendum.

**Headers**: `Authorization: Bearer <token>`

**Parameters**:
- `postId`: Polkassembly post ID (number)

**Query Parameters**:
- `chain`: `Polkadot` | `Kusama` (required)

**Response**:
```typescript
{
  success: true;
  comments: Array<{
    id: number;
    content: string;
    user_address: string;
    user_name: string;
    created_at: string;
    updated_at?: string;
  }>
}
```

---

### `POST /referendums/:postId/comments`
Add a comment to a referendum.

**Headers**: `Authorization: Bearer <token>`

**Parameters**:
- `postId`: Polkassembly post ID (number)

**Request**:
```typescript
{
  chain: "Polkadot" | "Kusama";  // Required
  content: string;               // Required, non-empty
}
```

**Response**:
```typescript
{
  success: true;
  message: "Comment added successfully";
  comment: {
    id: number;
    content: string;
    user_address: string;
    created_at: string;
  }
}
```

---

### `DELETE /comments/:commentId`
Delete a comment (only by the author).

**Headers**: `Authorization: Bearer <token>`

**Parameters**:
- `commentId`: Comment ID (number)

**Response**:
```typescript
{
  success: true;
  message: "Comment deleted successfully"
}
```

**Notes**:
- Only the comment author can delete their own comments

---

### `GET /referendums/:postId/agreement-summary`
Get agreement summary during discussion period.

**Headers**: `Authorization: Bearer <token>`

**Parameters**:
- `postId`: Polkassembly post ID (number)

**Query Parameters**:
- `chain`: `Polkadot` | `Kusama` (required)

**Response**:
```typescript
{
  success: true;
  summary: {
    agreed_members: Array<{ address: string; name: string }>;
    pending_members: Array<{ address: string; name: string }>;
    recused_members: Array<{ address: string; name: string }>;
    to_be_discussed_members: Array<{ address: string; name: string }>;
    vetoed: boolean;
    veto_by: string | null;
    veto_reason: string | null;
  }
}
```

---

## Admin Routes

### `GET /admin/refresh-referendas`
Manually trigger refresh from Polkassembly (refreshes all active DAOs).

**Query Parameters**:
- `limit`: Number of referendums to fetch (default: 30)

**Response**:
```typescript
{
  message: "Referenda refresh started in background with limit {limit}";
  timestamp: string;
  limit: number;
  status: "started";
}
```

**Notes**:
- Runs in background, returns immediately
- Refreshes for all active DAOs

---

### `GET /admin/process-pending-transitions`
Process pending status transitions (failsafe).

**Response**:
```typescript
{
  message: "Pending transitions processed successfully";
  timestamp: string;
  processed: number;
  transitioned: number;
  details: Array<{
    referendumId: number;
    postId: number;
    chain: string;
    oldStatus: string;
    newStatus: string;
  }>
}
```

---

### `GET /admin/cleanup-mimir-transactions`
Clean up stale Mimir transactions.

**Query Parameters**:
- `days`: Optional, cleanup transactions older than N days

**Response**:
```typescript
{
  message: "Mimir transaction cleanup completed successfully";
  timestamp: string;
  mode: string;
  staleTransactionsFound: number;
  transactionsCleaned: number;
}
```

---

## Mimir Routes

### `GET /send-to-mimir`
Send ready-to-vote proposals to Mimir for all active DAOs.

**Response**:
```typescript
{
  success: true;
  message: "Successfully sent referendas to Mimir";
  timestamp: string;
}
```

---

## System Routes

### `GET /health`
Health check endpoint.

**Response**:
```typescript
{
  status: "healthy";
  timestamp: string;
  uptime: number;  // Process uptime in seconds
}
```

---

## Common Types

```typescript
type Chain = 'Polkadot' | 'Kusama';

type InternalStatus = 
  | 'Not started'
  | 'Considering'
  | 'Ready for approval'
  | 'Waiting for agreement'
  | 'Reconsidering'
  | 'Ready to vote'
  | 'Voted Aye'
  | 'Voted Nay'
  | 'Voted Abstain'
  | 'Not Voted';

interface TeamMember {
  address: string;
  name: string;
  network: string;
}

interface ProposalData {
  id: number;
  post_id: number;
  chain: Chain;
  dao_id: number;
  title: string;
  description?: string;
  requested_amount_usd?: number;
  origin?: string;
  referendum_timeline?: string;
  internal_status: string;
  link?: string;
  voting_start_date?: string;
  voting_end_date?: string;
  created_at: string;
  updated_at?: string;
  suggested_vote?: string;
  final_vote?: string;
  vote_executed?: boolean;
}

interface ProposalSummary {
  id: number;
  post_id: number;
  chain: Chain;
  dao_id: number;
  title: string;
  description: string;
  internal_status: string;
  team_actions?: any[];
}
```

---

## Error Responses

All error responses follow this format:

```typescript
{
  success: false;
  error: string;
  details?: any;  // Optional additional error details
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created (new resource)
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

---

## Multi-DAO Query Parameters

Many endpoints support the following query parameters for multi-DAO contexts:

- `multisig`: Multisig address to identify specific DAO
- `chain`: `Polkadot` | `Kusama` (default varies by endpoint)

**Example**:
```
GET /dao/members?chain=Polkadot&multisig=15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5
```

Alternatively, use the `X-Multisig-Address` header:
```
GET /dao/members?chain=Polkadot
X-Multisig-Address: 15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5
```

---

## Rate Limiting

API routes are protected by rate limiting:
- Default: 100 requests per 15 minutes per IP
- Auth routes: 5 requests per 15 minutes per IP
- Admin routes: No rate limiting (consider adding authentication)

---

## Changelog

### Version 2.0.0 (Multi-DAO Support)
- ✅ Added DAO registration endpoint
- ✅ Added DAO-specific member endpoints
- ✅ Added DAO stats endpoint
- ✅ Updated all routes to support multiple DAOs
- ✅ Added multisig query parameter support
- ✅ Removed environment variable dependencies
- ✅ Added on-chain verification for DAO registration
- ✅ Updated authentication to search across all DAOs

### Version 1.0.0 (Initial Release)
- Initial API implementation with single DAO support
