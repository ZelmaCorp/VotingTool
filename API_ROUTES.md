# API Routes

### Auth Routes (`/auth`)
- `POST /auth/authenticate` - Authenticate user
- `GET /auth/verify` - Verify token

### Referendum Routes (`/referendums`)
- `GET /referendums` - Get all referendums
- `GET /referendums/:postId` - Get specific referendum
- `PUT /referendums/:postId/:chain` - Update referendum
- `GET /referendums/:postId/actions` - Get team actions
- `POST /referendums/:postId/actions` - Add team action
- `DELETE /referendums/:postId/actions` - Delete team action
- `GET /referendums/:postId/comments` - Get comments
- `POST /referendums/:postId/comments` - Add comment
- `DELETE /comments/:commentId` - Delete comment
- `POST /referendums/:postId/unassign` - Unassign from referendum

### Team/DAO Routes (`/dao`)
- `GET /dao/members` - Get team members
- `GET /dao/workflow` - Get all workflow data
- `GET /dao/my-assignments` - Get user's assignments
- `GET /dao/my-activity` - Get user's recent activity

### Legacy Routes (Deprecated)
The following routes are deprecated and will be removed in a future version:
- `POST /dao/referendum/:referendumId/action` - Use `/referendums/:postId/actions` instead
- `DELETE /dao/referendum/:referendumId/action` - Use `/referendums/:postId/actions` instead
- `POST /dao/referendum/:referendumId/unassign` - Use `/referendums/:postId/unassign` instead

### Admin Routes
- `GET /admin/refresh-referendas` - Refresh referendums from Polkassembly

### System Routes
- `GET /health` - Health check

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
