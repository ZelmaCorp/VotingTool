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
RUN npm ci

# Copy TypeScript source code
COPY backend/src ./src
COPY backend/tsconfig.json ./
COPY backend/jest.config.js ./

# Build TypeScript to JavaScript
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling and sqlite3 runtime dependencies
RUN apk add --no-cache dumb-init sqlite

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Create data directory for SQLite database
RUN mkdir -p /app/data && chown nodejs:nodejs /app/data

# Copy package files
COPY backend/package*.json ./

# Install only production dependencies (including native modules)
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy other necessary files
COPY backend/public ./public

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/app.js"] 