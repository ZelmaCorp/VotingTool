# API Routes

### Auth Routes (`/auth`)
- `POST /auth/web3-login` - Authenticate user with Web3 wallet signature
  ```typescript
  Request: { 
    address: string;    // Wallet address
    signature: string;  // Web3 signature
    message: string;    // Message that was signed
    timestamp: number;  // Timestamp when message was signed
  }
  Response: { 
    success: true; 
    token: string; 
    user: { 
      address: string;
      name: string;
      network: string;
    }
  } | { 
    success: false; 
    error: string;
    details?: {        // Only for 403 errors
      address: string;
      reason: string;
      configured_multisigs: {
        polkadot: string;
        kusama: string;
      };
      suggestion: string;
    }
  }
  ```
- `GET /auth/verify` - Verify authentication token
  ```typescript
  Response: { 
    success: true; 
    valid: true; 
    user: {
      address: string;
      name: string;
      network: string;
    }
  } | { 
    success: false; 
    error: string 
  }
  ```
- `POST /auth/logout` - Logout user (client should discard token)
  ```typescript
  Response: { success: true; message: string } | { success: false; error: string }
  ```
- `GET /auth/profile` - Get current user profile
  ```typescript
  Response: { 
    success: true; 
    user: {
      address: string;
      name: string;
      network: string;
    }
  } | { 
    success: false; 
    error: string 
  }
  ```

### Referendum Routes (`/referendums`)
- `GET /referendums` - Get all referendums
  ```typescript
  Query: { chain?: Chain; sort?: string; limit?: number }
  Response: { success: true; referendums: ProposalData[] } | { success: false; error: string }
  ```
- `GET /referendums/:postId` - Get specific referendum
  ```typescript
  Query: { chain: Chain }  // Required: 'Polkadot' or 'Kusama'
  Response: { 
    success: true; 
    referendum: ProposalData 
  } | { 
    success: false; 
    error: string;  // e.g. "Referendum {postId} not found on {chain} network"
  }
  ```
- `PUT /referendums/:postId/:chain` - Update referendum
  ```typescript
  // Fields are split between referendum and voting tables
  Body: {
    // Referendum fields
    title?: string;
    description?: string;
    requested_amount_usd?: number;
    origin?: string;
    referendum_timeline?: string;
    internal_status?: InternalStatus;  // Status transitions are validated
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
    suggested_vote?: string;
    final_vote?: string;
    vote_executed?: boolean;
    vote_executed_date?: string;
  }
  Response: { 
    success: true; 
    message: string 
  } | { 
    success: false; 
    error: string;
    details?: {
      currentStatus?: string;
      newStatus?: string;
      allowedTransitions?: string[];
    }
  }
  ```

  Notes:
  - Status transitions are validated (e.g., can't go from "Needs Agreement" to "Executed")
  - Only assigned users can change status (except for special statuses)
  - Suggested vote updates may trigger automatic status changes
  - Fields are split between referendum and voting tables internally
- `GET /referendums/:postId/actions` - Get team actions
  ```typescript
  Query: { chain: Chain }  // Required: 'Polkadot' or 'Kusama'
  Response: { 
    success: true; 
    actions: Array<{
      id: number;
      team_member_id: string;      // Wallet address
      team_member_name: string;    // From multisig cache
      role_type: string;           // Action type
      reason?: string;             // Optional reason
      created_at: string;
      updated_at?: string;
      wallet_address: string;      // Same as team_member_id
      network: string;             // From multisig cache
    }> 
  } | { 
    success: false; 
    error: string 
  }
  ```
- `POST /referendums/:postId/actions` - Add team action
  ```typescript
  Body: { 
    chain: Chain;                  // Required: 'Polkadot' or 'Kusama'
    action: string;                // One of: 'agree', 'to_be_discussed', 'no_way', 'recuse'
    reason?: string;               // Optional reason for the action
  }
  Response: { 
    success: true; 
    message: string 
  } | { 
    success: false; 
    error: string;
    valid_actions?: string[];      // Only when action is invalid
  }
  ```

  Notes:
  - If action already exists for the user, it will be updated with new reason
  - Actions are stored in `referendum_team_roles` table
  - Action strings are mapped to internal enum values
  - Requires team member authentication

- `DELETE /referendums/:postId/actions` - Delete team action
  ```typescript
  Body: { 
    chain: Chain;                  // Required: 'Polkadot' or 'Kusama'
    action: string;                // One of: 'agree', 'to_be_discussed', 'no_way', 'recuse'
  }
  Response: { 
    success: true; 
    message: string 
  } | { 
    success: false; 
    error: string;
    valid_actions?: string[];      // Only when action is invalid
  }
  ```

  Notes:
  - Only deletes the specific action type for the user
  - Returns 404 if action doesn't exist
  - Requires team member authentication

- `POST /referendums/:postId/unassign` - Unassign from referendum
  ```typescript
  Body: { 
    chain: Chain;                  // Required: 'Polkadot' or 'Kusama'
    unassignNote?: string;         // Optional note explaining unassignment
  }
  Response: { 
    success: true; 
    message: string 
  } | { 
    success: false; 
    error: string 
  }
  ```

  Notes:
  - Only the assigned user (RESPONSIBLE_PERSON) can unassign themselves
  - Resets referendum state and removes all team actions
  - Requires team member authentication

- `GET /referendums/:postId/comments` - Get comments
  ```typescript
  Query: { chain: Chain }  // Required: 'Polkadot' or 'Kusama'
  Response: { 
    success: true; 
    comments: Array<{
      id: number;
      content: string;
      user_address: string;      // Wallet address
      user_name: string;         // From multisig cache
      created_at: string;
      updated_at?: string;
    }> 
  } | { 
    success: false; 
    error: string 
  }
  ```
- `POST /referendums/:postId/comments` - Add comment
  ```typescript
  Body: { 
    chain: Chain;                // Required: 'Polkadot' or 'Kusama'
    content: string;             // Non-empty comment text
  }
  Response: { 
    success: true; 
    message: string;
    comment: {
      id: number;
      content: string;
      user_address: string;
      created_at: string;
    }
  } | { 
    success: false; 
    error: string 
  }
  ```
- `DELETE /comments/:commentId` - Delete comment (only by author)
  ```typescript
  Response: { 
    success: true; 
    message: string 
  } | { 
    success: false; 
    error: string 
  }
  ```

  Notes:
  - Comments are stored in `referendum_comments` table
  - User names are enriched from multisig cache
  - Only the comment author can delete their comments
  - Comments are ordered by creation date ascending
  - Requires team member authentication (only by author)
  ```typescript
  Response: { success: true; message: string } | { success: false; error: string }
  ```
- `POST /referendums/:postId/unassign` - Unassign from referendum
  ```typescript
  Body: { chain: Chain; unassignNote?: string }
  Response: { success: true; message: string } | { success: false; error: string }
  ```

### Team/DAO Routes
- `GET /dao/members` - Get team members
  ```typescript
  Response: { 
    success: true; 
    members: TeamMember[] 
  } | { 
    success: false; 
    error: string 
  }
  ```
- `GET /dao/my-assignments` - Get user's assignments
  ```typescript
  Response: { 
    success: true; 
    referendums: Array<{
      id: number;
      post_id: number;
      chain: Chain;
      title: string;
      description: string;
      internal_status: string;
      link: string;
      voting_start_date?: string;
      voting_end_date?: string;
      created_at: string;
      updated_at: string;
    }> 
  } | { 
    success: false; 
    error: string 
  }
  ```

  Notes:
  - Returns referendums where user is assigned as RESPONSIBLE_PERSON
  - Requires team member authentication

- `GET /dao/my-activity` - Get user's recent activity
  ```typescript
  Response: { 
    success: true; 
    data: Activity[] 
  } | { 
    success: false; 
    error: string 
  }
  ```

### Workflow Routes
- `GET /workflow` - Get all workflow data
  ```typescript
  Response: {
    success: true;
    data: {
      needsAgreement: Array<{
        id: number;
        post_id: number;
        chain: Chain;
        title: string;
        description: string;
        internal_status: string;
        agreement_count: number;      // Number of team members who agreed
        required_agreements: number;   // Total team members needed to agree
      }>;
      readyToVote: Array<{
        id: number;
        post_id: number;
        chain: Chain;
        title: string;
        description: string;
        internal_status: string;
        suggested_vote?: string;
        final_vote?: string;
      }>;
      forDiscussion: Array<{
        id: number;
        post_id: number;
        chain: Chain;
        title: string;
        description: string;
        internal_status: string;
        discussion_count: number;     // Number of TO_BE_DISCUSSED actions
      }>;
      vetoedProposals: Array<{
        id: number;
        post_id: number;
        chain: Chain;
        title: string;
        description: string;
        internal_status: string;
        veto_count: number;          // Number of NO_WAY actions
      }>;
    }
  } | { 
    success: false; 
    error: string 
  }
  ```

  Notes:
  - `needsAgreement`: Proposals in Considering/ReadyForApproval status needing more agreements
  - `readyToVote`: Proposals ready for voting (has enough agreements)
  - `forDiscussion`: Proposals marked for discussion by team members
  - `vetoedProposals`: Proposals with NO_WAY actions
  - All arrays are sorted by creation date descending
  - Requires team member authentication

### Legacy Routes (Deprecated)
The following routes are deprecated and will be removed in a future version:
- `POST /dao/referendum/:referendumId/action` - Use `/referendums/:postId/actions` instead
- `DELETE /dao/referendum/:referendumId/action` - Use `/referendums/:postId/actions` instead
- `POST /dao/referendum/:referendumId/unassign` - Use `/referendums/:postId/unassign` instead

### Admin Routes
- `GET /admin/refresh-referendas` - Refresh referendums from Polkassembly
  ```typescript
  Response: { success: true; message: string } | { success: false; error: string }
  ```

### System Routes
- `GET /health` - Health check
  ```typescript
  Response: { status: string; timestamp: string }
  ```

### Common Types
```typescript
type Chain = 'Polkadot' | 'Kusama';

interface TeamMember {
  address: string;
  name: string;
  network: string;
}

interface ProposalAction {
  team_member_id: string;
  team_member_name: string;
  role_type: string;
  reason?: string;
  created_at: string;
}

interface ProposalComment {
  id: number;
  content: string;
  user_address: string;
  user_name: string;
  created_at: string;
  updated_at: string;
}
```

### Authentication
- All routes require authentication via Bearer token except for `/auth/authenticate` and `/health`
- Token format: `Authorization: Bearer <token>`
- Invalid/expired tokens return 401 Unauthorized

### Error Handling
- 400 Bad Request - Invalid parameters or request body
- 401 Unauthorized - Missing or invalid token
- 403 Forbidden - Valid token but insufficient permissions
- 404 Not Found - Resource not found
- 409 Conflict - Resource conflict (e.g., duplicate team action)
- 500 Internal Server Error - Server-side error

### Query Parameters
Common query parameters supported by GET endpoints:
- `chain` - Filter by chain (Polkadot or Kusama)
- `limit` - Number of items per page (default: 50)
- `offset` - Number of items to skip (default: 0)
- `sort` - Sort field (default varies by endpoint)
- `order` - Sort order: 'asc' or 'desc' (default: 'desc')

### Response Format
All routes return responses in the following format:
```typescript
{
  success: boolean;
  data?: any;        // For GET requests
  error?: string;    // When success is false
  message?: string;  // Optional success message
}
```

### Authentication
- All routes require authentication via Bearer token except for `/auth/authenticate` and `/health`
- Token format: `Authorization: Bearer <token>`
- Invalid/expired tokens return 401 Unauthorized

### Error Handling
- 400 Bad Request - Invalid parameters or request body
- 401 Unauthorized - Missing or invalid token
- 403 Forbidden - Valid token but insufficient permissions
- 404 Not Found - Resource not found
- 500 Internal Server Error - Server-side error

### Pagination
Some GET endpoints support pagination via query parameters:
- `limit` - Number of items per page (default: 50)
- `offset` - Number of items to skip (default: 0)
- `sort` - Sort field (default varies by endpoint)
- `order` - Sort order: 'asc' or 'desc' (default: 'desc')
