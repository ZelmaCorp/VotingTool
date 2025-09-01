# Docker Setup Guide - Polkadot Voting Tool

This guide explains how to build and run the Polkadot Voting Tool using Docker.

## Prerequisites

- Docker (20.10.0 or higher)
- Docker Compose (1.29.0 or higher)
- Polkadot/Kusama multisig wallets
- Subscan API key

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

4. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

5. **Verify the application is running**
   ```bash
   curl http://localhost:3000/health
   ```



## Configuration

### Required Environment Variables

You must set these variables in your `.env` file:

| Variable | Description | Example |
|----------|-------------|---------|
| `REFRESH_INTERVAL` | How often to check for new referendas (seconds) | `300` |
| `POLKADOT_MULTISIG` | Your Polkadot multisig address | `15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5` |
| `KUSAMA_MULTISIG` | Your Kusama multisig address | `HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F` |
| `PROPOSER_MNEMONIC` | 12-word mnemonic for proposer account | `word1 word2 word3 ...` |
| `SUBSCAN_API_KEY` | API key from Subscan | `your_api_key_here` |

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
  polkadot-voting-tool
```

## Docker Image Details

The Dockerfile uses a multi-stage build process:

1. **Build Stage:** Compiles TypeScript to JavaScript
2. **Production Stage:** Creates a minimal runtime image with only production dependencies

### Image Features:
- Based on Node.js 18 Alpine (lightweight)
- Non-root user for security
- Health checks included
- Proper signal handling with dumb-init
- Optimized layer caching

## Available Endpoints

Once running, the application exposes these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check endpoint |
| `/refresh-referendas` | GET | Manually trigger referenda refresh |
| `/send-to-mimir` | GET | Send ready proposals to Mimir |

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

2. **Environment variable errors:**
   - Ensure all required variables are set in `.env`
   - Check for typos in variable names
   - Verify multisig addresses and API keys

3. **Permission errors:**
   - Ensure the Docker daemon is running
   - Check user permissions for Docker

### Testing the Setup

1. **Run a quick test:**
   ```bash
   # Test referendum refresh
   curl "http://localhost:3000/refresh-referendas?limit=1"
   
   # Check health
   curl http://localhost:3000/health
   ```

2. **Run the test suite:**
   ```bash
   # Build test image
   docker build --target builder -t polkadot-voting-tool:test .
   
   # Run tests
   docker run --rm polkadot-voting-tool:test npm test
   ```

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
   ```

3. **Deploy:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

## Security Considerations

- Store sensitive environment variables securely
- Use secrets management in production
- Keep the Docker image updated
- Monitor logs for security issues
- Use HTTPS in production
- Regularly rotate API keys and mnemonics

## Support

If you encounter issues:

1. Check the logs for error messages
2. Verify all environment variables are correctly set
3. Ensure all external services (Subscan) are accessible
4. Test endpoints manually to isolate issues

For additional help, refer to the project documentation or create an issue in the repository. 