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

# Copy server package files - FLAT STRUCTURE
COPY apps/server/package*.json ./
COPY apps/server/tsconfig.json ./

# Install all dependencies (including devDependencies)
RUN npm ci --frozen-lockfile

# Copy server source code - FLAT STRUCTURE  
COPY apps/server/ ./

# Build the TypeScript application (we're already in the right directory)
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

# Copy server package files - FLAT STRUCTURE
COPY apps/server/package*.json ./

# Install only production dependencies
RUN npm ci --frozen-lockfile --omit=dev && \
    npm cache clean --force

# Copy built application from builder stage - FLAT STRUCTURE
COPY --from=builder /app/dist ./dist

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
CMD ["node", "dist/server.js"]