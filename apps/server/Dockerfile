# =============================================================================
# Build Stage
# =============================================================================
FROM node:20-alpine AS builder

# Install build essentials for native dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy root package files for workspace setup
COPY package*.json ./
COPY tsconfig*.json ./

# Copy server package files
COPY apps/server/package*.json ./apps/server/
COPY apps/server/tsconfig.json ./apps/server/

# Copy shared types library
COPY libs/shared-types ./libs/shared-types

# Install all dependencies (including devDependencies)
RUN npm ci --frozen-lockfile

# Copy server source code
COPY apps/server/ ./apps/server/

# Change to server directory for build
WORKDIR /app/apps/server

# Build the TypeScript application
RUN npm run build

# =============================================================================
# Production Stage  
# =============================================================================
FROM node:20-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

# Set working directory
WORKDIR /app

# Copy root package files (including package-lock.json)
COPY package*.json ./

# Copy server package files
COPY apps/server/package*.json ./apps/server/

# Install only production dependencies
RUN npm ci --frozen-lockfile --omit=dev && \
    npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/apps/server/dist ./apps/server/dist

# Change ownership to non-root user
RUN chown -R nodeuser:nodejs /app
USER nodeuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:4000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Expose port
EXPOSE 4000

# Set environment to production
ENV NODE_ENV=production

# Start the server
WORKDIR /app/apps/server
CMD ["node", "./dist/server.js"]