# OpenGov Voting Tool

## Overview

A helper tool for small DAOs to vote on proposals. This tool automates the process of fetching referendum data from Polkassembly, managing voting workflows in a SQLite database, and executing batch votes through Mimir.

The tool provides:
- Automated referendum data synchronization from Polkassembly API
- SQLite database for proposal management and voting workflows
- Batch voting execution through Mimir multisig integration
- Rate limiting and error handling for external API calls
- Comprehensive logging and monitoring

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker (optional, for containerized deployment)
- Polkadot/Kusama multisig wallets
- Subscan API key
- Mimir integration setup

## Quick Start

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ZelmaCorp/VotingTool.git
cd VotingTool
```

2. Install dependencies:
```bash
cd backend
npm install
```

3. Copy environment variables:
```bash
cp env.example .env
```

4. Configure your environment variables in the `.env` file.

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

## Configuration

### Environment Variables

#### Required Variables

- `REFRESH_INTERVAL` - How often to check for new referendums (in seconds, default: 900)
- `POLKADOT_MULTISIG` - Your Polkadot multisig address
- `KUSAMA_MULTISIG` - Your Kusama multisig address
- `PROPOSER_MNEMONIC` - 12-word mnemonic phrase for the proposer account
- `SUBSCAN_API_KEY` - Your Subscan API key

#### Optional Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (default: production)
- `LOG_LEVEL` - Logging level (default: info)
- `DEEP_SYNC_LIMIT` - Number of posts to fetch during deep sync (default: 100)
- `DEEP_SYNC_HOUR` - Hour for daily deep sync (UTC, default: 3)
- `READY_CHECK_INTERVAL` - How often to check for ready votes (default: 60)

For a complete list of environment variables, see [env.example](env.example).

## API Endpoints

### Health Check

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

### Refresh Referendums

**GET** `/refresh-referendas?limit=30`

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

**GET** `/send-to-mimir`

Sends ready proposals to Mimir for batch voting execution.

**Response:**
Returns a success page or error message.

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