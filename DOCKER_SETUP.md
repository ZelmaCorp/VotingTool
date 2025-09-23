# Docker Setup Guide - Polkadot Voting Tool

This guide explains how to build and run the Polkadot Voting Tool backend using Docker. The backend provides APIs for the browser extension to manage DAO proposal discussions.

## Architecture Overview

- **Backend**: Node.js/TypeScript API server with SQLite database (this Docker setup)
- **Frontend**: Chrome/Firefox browser extension (installed separately, not dockerized)
- **Database**: SQLite database file (`voting_tool.db`) persisted via Docker volume mount

## Prerequisites

- Docker (20.10.0 or higher)
- Docker Compose (1.29.0 or higher)
- Polkadot/Kusama multisig wallets
- Subscan API key
- Chrome or Firefox browser for the extension

## Quick Start

1. **Clone the repository and navigate to the project directory**
   ```bash
   cd /path/to/VotingTool
   ```

2. **Copy the example environment file**
   ```bash
   cp env.example .env
   ```

3. **Edit the `.env` file with your configuration**
   ```bash
   nano .env  # or use your preferred editor
   ```
   
   **Required configuration:**
   - Set your `POLKADOT_MULTISIG` and `KUSAMA_MULTISIG` addresses
   - Add your `PROPOSER_MNEMONIC` (12-word phrase)
   - Get and add your `SUBSCAN_API_KEY` from https://subscan.io/
   - Set a strong `JWT_SECRET` for production
   - Adjust `REFRESH_INTERVAL` if needed (default: 900 seconds)

4. **Create data directory for database persistence**
   ```bash
   mkdir -p data logs
   ```

5. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

6. **Verify the application is running**
   ```bash
   curl http://localhost:3000/health
   ```

7. **Install the browser extension**
   - Install from Chrome Web Store or Firefox Add-ons (when available)
   - Configure it to connect to `http://localhost:3000`

## Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REFRESH_INTERVAL` | How often to check for new referendas (seconds) | `900` |
| `POLKADOT_MULTISIG` | Your Polkadot multisig address | `15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5` |
| `KUSAMA_MULTISIG` | Your Kusama multisig address | `HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F` |
| `PROPOSER_MNEMONIC` | 12-word mnemonic for proposer account | `word1 word2 word3 ...` |
| `SUBSCAN_API_KEY` | API key from Subscan | `your_api_key_here` |
| `JWT_SECRET` | JWT secret for authentication | `your-strong-secret-here` |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `production` |
| `LOG_LEVEL` | Logging level | `info` |
| `DATABASE_PATH` | SQLite database file path | `/app/data/voting_tool.db` |
| `DEEP_SYNC_LIMIT` | Daily deep sync limit | `100` |
| `DEEP_SYNC_HOUR` | Daily deep sync hour (UTC) | `3` |
| `READY_CHECK_INTERVAL` | Vote check interval (seconds) | `60` |

## Building the Docker Image

### Option 1: Using Docker Compose (Recommended)
```bash
# Build and run in foreground
docker-compose up --build

# Build and run in background
docker-compose up --build -d

# View logs
docker-compose logs -f polkadot-voting-tool
```

### Option 2: Using Docker directly
```bash
# Build the image
docker build -t polkadot-voting-tool .

# Run the container
docker run -d \
  --name polkadot-voting-tool \
  --env-file .env \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/logs:/app/logs \
  polkadot-voting-tool
```

## Docker Image Details

The Dockerfile uses a multi-stage build process:

1. **Build Stage:** Compiles TypeScript to JavaScript with native module support
2. **Production Stage:** Creates a minimal runtime image with SQLite support

### Image Features:
- Based on Node.js 20 Alpine (lightweight)
- SQLite3 native module support
- Non-root user for security
- Health checks included
- Proper signal handling with dumb-init
- Volume mount for SQLite database file persistence
- Optimized layer caching

## Data Persistence

### SQLite Database
- **Container path**: `/app/data/voting_tool.db` (inside container)
- **Host path**: `./data/voting_tool.db` (in your project directory)
- **Creation**: Database file is created automatically on first run

### Logs
- **Location**: `/app/logs/` inside container (optional)
- **Host Mount**: `./logs/` on host

## Available Endpoints

Once running, the backend exposes these endpoints for the browser extension:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check endpoint |
| `/api/proposals` | GET | Get proposals data |
| `/api/teams` | GET/POST | Team management |
| `/api/auth` | POST | Authentication |

*Note: Full API documentation should be referenced from the backend source code.*

## Browser Extension Setup

1. **Install the extension**:
   - **Chrome**: Install from Chrome Web Store (when available)
   - **Firefox**: Install from Firefox Add-ons (when available)

2. **Configure extension**:
   - Set backend URL to `http://localhost:3000`
   - Configure any other extension-specific settings

## Monitoring and Logs

### Health Checks
```bash
# Check container health
docker-compose ps

# Manual health check
curl http://localhost:3000/health
```

### Viewing Logs
```bash
# View logs with Docker Compose
docker-compose logs -f polkadot-voting-tool

# View logs with Docker
docker logs -f polkadot-voting-tool
```

### Log Levels
Set `LOG_LEVEL` in your `.env` file:
- `debug`: Detailed debugging information
- `info`: General information (default)
- `warn`: Warning messages
- `error`: Error messages only

## Troubleshooting

### Common Issues

1. **Container won't start:**
   ```bash
   # Check configuration
   docker-compose config
   
   # View detailed logs
   docker-compose logs polkadot-voting-tool
   ```

2. **Database issues:**
   - Ensure `./data` directory exists and is writable
   - Check database file permissions
   - Verify SQLite is working: `docker exec -it polkadot-voting-tool sqlite3 /app/data/voting_tool.db ".tables"`

3. **Extension can't connect:**
   - Verify backend is running on expected port
   - Check CORS configuration in backend
   - Ensure extension is configured with correct backend URL

4. **Permission errors:**
   - Ensure the Docker daemon is running
   - Check user permissions for Docker
   - Verify data directory permissions

### Testing the Setup

1. **Test backend endpoints:**
   ```bash
   # Health check
   curl http://localhost:3000/health
   
   # Check if API responds (may require authentication)
   curl http://localhost:3000/api/proposals
   ```

2. **Test database:**
   ```bash
   # Connect to database
   docker exec -it polkadot-voting-tool sqlite3 /app/data/voting_tool.db
   
   # List tables
   .tables
   
   # Exit
   .quit
   ```

3. **Test extension connection:**
   - Install extension in browser
   - Open browser developer tools
   - Check for connection errors in console

## Production Deployment

For production deployment:

1. **Use environment-specific configurations:**
   ```bash
   cp env.example .env.production
   # Edit .env.production with production values
   ```

2. **Use production Docker Compose override:**
   ```yaml
   # docker-compose.prod.yml
   version: '3.8'
   services:
     polkadot-voting-tool:
       restart: always
       env_file:
         - .env.production
       logging:
         driver: "json-file"
         options:
           max-size: "10m"
           max-file: "3"
       environment:
         - NODE_ENV=production
         - LOG_LEVEL=warn
   ```

3. **Deploy:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

4. **Set up reverse proxy (recommended):**
   - Use nginx or similar to handle HTTPS
   - Configure proper CORS headers
   - Set up domain name and SSL certificates

## Security Considerations

- **Change JWT_SECRET**: Use a strong, unique secret in production
- **Use HTTPS**: Set up SSL/TLS in production
- **Database security**: Ensure database files are properly secured
- **Keep updated**: Regularly update Docker images and dependencies
- **Monitor logs**: Watch for suspicious activity
- **Backup database**: Regularly backup the SQLite database file

## Backup and Recovery

### Backup
```bash
# Backup database
cp data/voting_tool.db backup/voting_tool_$(date +%Y%m%d).db

# Backup with Docker
docker exec polkadot-voting-tool sqlite3 /app/data/voting_tool.db ".backup /app/data/backup.db"
```

### Recovery
```bash
# Restore database
cp backup/voting_tool_20240101.db data/voting_tool.db

# Restart container
docker-compose restart polkadot-voting-tool
```

## Support

If you encounter issues:

1. Check the logs for error messages
2. Verify all environment variables are correctly set
3. Ensure database directory is writable
4. Test endpoints manually to isolate issues
5. Check extension configuration and browser console

For additional help, refer to the project documentation or create an issue in the repository. 