# API Routes

### Auth Routes (`/auth`)
- `POST /auth/authenticate` - Authenticate user
- `GET /auth/verify` - Verify token

### Referendum Routes (`/referendums`)
- `GET /referendums` - Get all referendums
- `GET /referendums/:postId` - Get specific referendum
- `PUT /referendums/:postId/:chain` - Update referendum
- `GET /referendums/:postId/actions` - Get team actions
- `GET /referendums/:postId/comments` - Get comments
- `POST /referendums/:postId/comments` - Add comment
- `DELETE /comments/:commentId` - Delete comment

### Team/DAO Routes
- `GET /workflow` - Get all workflow data
- `GET /my-assignments` - Get user's assignments
- `GET /my-activity` - Get user's recent activity
- `GET /members` - Get team members
- `GET /config` - Get DAO config
- `PUT /config` - Update DAO config

### Admin Routes
- `GET /admin/refresh-referendas` - Refresh referendums from Polkassembly

### System Routes
- `GET /health` - Health check
- `GET /sync` - Trigger data sync

Each route requires authentication via Bearer token except for `/auth/authenticate` and `/health`.
