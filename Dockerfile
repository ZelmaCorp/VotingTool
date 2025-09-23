# Multi-stage Dockerfile for Polkadot Voting Tool
# Stage 1: Build stage
FROM node:20-alpine AS builder

# Install build dependencies for native modules (sqlite3)
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies (including devDependencies for building)
RUN npm install

# Copy TypeScript source code
COPY backend/src ./src
COPY backend/tsconfig.json ./

# Build TypeScript to JavaScript
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling and sqlite3 runtime dependencies
RUN apk add --no-cache dumb-init sqlite

# Set working directory
WORKDIR /app

# Create data directory for SQLite database
RUN mkdir -p /app/data

# Copy built application and node_modules from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copy other necessary files
COPY backend/public ./public
COPY backend/database ./database

# Expose port
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/app.js"] 