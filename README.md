# OpenGov Voting Tool

## Overview

A helper tool for small DAOs to vote on proposals. This tool automates the process of fetching referendum data from Polkassembly, managing voting workflows in a SQLite database, and executing batch votes through Mimir.

The tool provides:
- Multi-DAO Support: Manage multiple DAOs with separate multisig accounts and voting workflows
- Automated referendum data synchronization from Polkassembly API
- SQLite database for proposal management and voting workflows
- Batch voting execution through Mimir multisig integration
- Secure DAO registration with on-chain verification
- Wallet-based authentication across all DAOs
- Rate limiting and error handling for external API calls
- Comprehensive logging and monitoring

## Prerequisites

- Node.js (v22 or higher)
- npm or yarn
- Docker (optional, for containerized deployment)
- Polkadot/Kusama multisig wallet(s) - for DAO registration
- Subscan API key - for on-chain data fetching
- Master encryption key - for securing sensitive DAO data
- Mimir integration setup - for batch voting execution

## Quick Start

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ZelmaCorp/VotingTool.git
cd VotingTool
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Copy environment variables:
```bash
cp env.example .env
```

4. Configure your environment variables in the `.env` file.

5. **(Optional)** Install the browser extension:
   - Use the pre-built `extension/dist-chrome/` folder for Chrome/Chromium
   - Use the pre-built `extension/dist-firefox/` folder for Firefox
   - **Note**: You'll need ngrok or a public URL for the extension to connect (see [CORS Configuration](#cors-configuration))
   - See [Browser Extension Installation](#browser-extension-installation) for detailed setup instructions

### Running the Application

#### Development Mode

1. Build the project:
```bash
npm run build
```

2. Start the application:
```bash
npm start
```

#### Production Mode

1. Build with versioning:
```bash
npm run build:versioned
```

2. Start with versioning:
```bash
npm run start:versioned
```

The application will start on port 3000 by default (configurable via `PORT` environment variable).

## Browser Extension Installation

The OpenGov Voting Tool includes a browser extension that provides an overlay interface on Polkassembly pages for streamlined voting workflows.

### Pre-built Extension Packages

The extension is pre-built and ready to install:

- **Chrome/Chromium**: Use the [`extension/dist-chrome/`](extension/dist-chrome/) folder
- **Firefox**: Use the [`extension/dist-firefox/`](extension/dist-firefox/) folder

### Installation Instructions

#### Chrome/Chromium Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/ZelmaCorp/VotingTool.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked" button
5. Navigate to and select the `extension/dist-chrome/` folder
6. The extension should now appear in your extensions list

#### Firefox Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/ZelmaCorp/VotingTool.git
   ```
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Navigate to the `extension/dist-firefox/` folder
6. Select the `manifest.json` file
7. The extension should now appear in your temporary extensions

### Building from Source (Optional)

If you want to modify the extension or build it yourself:

```bash
cd extension
npm install
npm run build
```

This will update the `dist-chrome/` and `dist-firefox/` directories with your changes.

### Extension Configuration

After installing the extension, you need to configure it to connect to your backend:

1. **Click the extension icon** in your browser toolbar
2. **Configure DAO Settings**: In the popup, you'll see a "DAO Configuration" section
3. **Backend API Endpoint**: Configure your backend URL (see CORS section below)
4. **Authentication**: The extension will prompt for Web3 wallet authentication when accessing Polkassembly

#### CORS Configuration

⚠️ **Important**: Browser extensions cannot directly connect to `localhost` due to CORS restrictions. You have two options:

**Option 1: Using ngrok (Recommended for Development)**

1. Install ngrok: https://ngrok.com/download
2. Start your backend server:
   ```bash
   cd backend
   npm start
   ```
3. In a new terminal, create a tunnel to your backend:
   ```bash
   ngrok http 3000
   ```
4. Copy the HTTPS URL from ngrok (e.g., `https://abc123.ngrok.io`)
5. In the extension popup, set **Backend API Endpoint** to your ngrok URL

**Option 2: Production Deployment**

Deploy your backend to a cloud service (Heroku, DigitalOcean, AWS, etc.) and use the production URL in the extension configuration.

#### Supported URLs

The extension activates on the following Polkassembly URLs:

- `https://polkadot.polkassembly.io/referenda/*` - Polkadot referenda pages
- `https://kusama.polkassembly.io/referenda/*` - Kusama referenda pages

### Extension Features

- **Overlay Interface**: Adds voting controls directly to Polkassembly referendum pages
- **Web3 Integration**: Connects with Polkadot.js, SubWallet, Talisman, and Nova wallets
- **Team Workflow**: Displays team member assignments and voting status
- **Real-time Updates**: Syncs with the backend for current referendum status
- **Secure Authentication**: Uses Web3 signature-based authentication

### Troubleshooting Extension

- **CORS errors**: Don't use `localhost` - use ngrok or deploy to a public URL
- **Extension not loading**: Ensure the backend is running and accessible via your configured URL
- **Authentication fails**: Check that your Web3 wallet is unlocked and connected
- **No overlay appears**: Verify you're on a supported Polkassembly URL
- **API errors**: Confirm the backend API endpoint is correctly configured in the extension
- **ngrok connection issues**: Ensure ngrok is running and the tunnel is active
- **HTTPS required**: Most browser security features require HTTPS (ngrok provides this automatically)

## Configuration

### Environment Variables

#### Required Variables

- `MASTER_ENCRYPTION_KEY` - 32-byte hex key for encrypting sensitive DAO data (multisig addresses, mnemonics)
- `SUBSCAN_API_KEY` - Your Subscan API key for fetching on-chain data
- `REFRESH_INTERVAL` - How often to check for new referendums (in seconds, default: 900)

#### Optional Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (default: production)
- `LOG_LEVEL` - Logging level (default: info)
- `DATABASE_PATH` - Path to SQLite database (default: ./voting_tool.db)
- `DEEP_SYNC_LIMIT` - Number of posts to fetch during deep sync (default: 100)
- `DEEP_SYNC_HOUR` - Hour for daily deep sync (UTC, default: 3)
- `READY_CHECK_INTERVAL` - How often to check for ready votes (default: 60)

#### Generating Encryption Key

Generate a secure encryption key for `MASTER_ENCRYPTION_KEY`:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

**⚠️ Important**: Keep your encryption key secure and never commit it to version control. All DAO multisig addresses and proposer mnemonics are encrypted at rest using this key.

For a complete list of environment variables, see [env.example](env.example).

## API Endpoints

The OpenGov Voting Tool provides a comprehensive REST API for managing multiple DAOs, referendums, and voting workflows.

**GET** `/health`

Returns the health status of the application.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600
}
```

**Referendums**
- `GET /referendums` - Get all referendums (DAO-scoped)
- `GET /referendums/:postId` - Get specific referendum
- `PUT /referendums/:postId/:chain` - Update referendum
- `POST /referendums/:postId/actions` - Add team action
- `POST /referendums/:postId/assign` - Assign to referendum

**Admin**
- `GET /admin/refresh-referendas` - Refresh from Polkassembly (all DAOs)
- `GET /admin/process-pending-transitions` - Process status transitions

Manually triggers a refresh of referendum data from Polkassembly.

**Query Parameters:**
- `limit` (optional) - Number of posts to fetch (default: 30)

**Response:**
```json
{
  "message": "Referenda refresh started in background with limit 30",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "limit": 30,
  "status": "started"
}
```

### Send to Mimir

If not specified, the system automatically determines the DAO based on the authenticated user's wallet membership.

### Full API Documentation

For complete API documentation including request/response formats, authentication, error handling, and multi-DAO usage, see **[API_ROUTES.md](API_ROUTES.md)**.

## Development

### Code Style

This project uses TypeScript with standard conventions:

- **TypeScript** - Strict type checking enabled
- **JSDoc** - Inline documentation for all public functions
- **Camel case** - Variable and function naming
- **Pascal case** - Class and interface naming

All code should be properly typed and documented with JSDoc comments.

### Testing

#### Run All Tests
```bash
npm test
```

#### Run Unit Tests Only
```bash
npm run test:unit
```

#### Run Integration Tests Only
```bash
npm run test:integration
```

#### Run Tests with Coverage
```bash
npm run test:coverage
```

#### Run Tests in Watch Mode
```bash
npm run test:watch
```

#### Run Specific Test Suites
```bash
# Rate limiting tests
npm run test:unit:rate-limit

# Utils tests
npm run test:unit:utils

# Polkassembly integration tests
npm run test:integration:polkassembly
```

### Building

#### Standard Build
```bash
npm run build
```

#### Versioned Build
```bash
npm run build:versioned
```

The build process compiles TypeScript to JavaScript and outputs the compiled files to the `dist/` directory.

## Multi-DAO Architecture

### Overview

Version 2.0 introduces full multi-DAO support, allowing a single instance of the Voting Tool to manage multiple DAOs with completely isolated data and workflows.

### Key Features

- **Secure Registration**: DAOs are registered via API with on-chain verification
- **Wallet Verification**: Registrants must prove multisig membership via wallet signature
- **Encrypted Storage**: All sensitive data (multisig addresses, mnemonics) encrypted at rest
- **Data Isolation**: Complete separation between DAOs - no cross-DAO data access
- **Automatic Context**: System automatically determines which DAO a user belongs to
- **Multi-Chain Support**: Each DAO can have separate Polkadot and Kusama multisigs

### Registering a DAO

To register a new DAO, use the API endpoint:

```bash
POST /dao/register
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "name": "Hungarian Polkadot DAO",
  "description": "Supporting Polkadot adoption in Hungary",
  "polkadotMultisig": "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5",
  "kusamaMultisig": "HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F",
  "walletAddress": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  "signature": "0x...",
  "message": "Register Hungarian Polkadot DAO"
}
```

**Requirements**:
1. Authenticated user (JWT token)
2. Valid wallet signature proving ownership
3. At least one multisig address (Polkadot or Kusama)
4. Wallet must be a member of the provided multisig(s)
5. Multisig(s) must exist on-chain

The system will:
- Verify the signature
- Check multisig(s) exist on-chain
- Verify wallet is a member of the multisig(s)
- Generate a proposer mnemonic automatically
- Encrypt all sensitive data
- Create the DAO in the database

### Database Migration

If you're upgrading from version 1.x (single-DAO) to 2.0 (multi-DAO), a database migration is required.

#### Migration Steps

1. **Backup your database**:
   ```bash
   cp voting_tool.db voting_tool.db.backup
   ```

2. **Set encryption key** in `.env`:
   ```bash
   MASTER_ENCRYPTION_KEY=<your-32-byte-hex-key>
   ```

3. **Run migration script**:
   ```bash
   cd backend
   chmod +x scripts/migrate-db.sh
   ./scripts/migrate-db.sh
   ```

4. **Verify migration**:
   ```bash
   npm run test-production-features
   ```

The migration will:
- Create the `daos` table
- Add `dao_id` columns to all relevant tables
- Create a "Default DAO" from your existing environment variables
- Migrate all existing referendums to the Default DAO
- Encrypt sensitive data

For Docker deployments, see the manual migration instructions in the deployment section.

### How Multi-DAO Works

1. **Authentication**: Users authenticate with their wallet (Web3 signature)
2. **DAO Discovery**: System checks which DAO(s) the wallet belongs to
3. **Context Setting**: Most endpoints automatically determine the DAO from the authenticated user
4. **Data Scoping**: All database queries are scoped by `dao_id` for complete isolation
5. **Explicit Selection**: Users can specify a DAO via `?multisig=` query parameter if they belong to multiple DAOs

## Deployment

### Docker

#### Quick Start with Docker Compose
```bash
# Build and run in foreground
docker-compose up --build

# Build and run in background
docker-compose up --build -d

# View logs
docker-compose logs -f polkadot-voting-tool
```

#### Manual Docker Build
```bash
# Build the image
docker build -t polkadot-voting-tool .

# Run the container
docker run -d \
  --name polkadot-voting-tool \
  --env-file .env \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  polkadot-voting-tool
```

#### Verify Installation
```bash
curl http://localhost:3000/health
```

For detailed Docker setup instructions, see [DOCKER_SETUP.md](DOCKER_SETUP.md).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Ensure all tests pass before submitting
- Add tests for new functionality
- Follow the existing code style and conventions
- Update documentation for any API changes
- Include JSDoc comments for new functions

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details. 