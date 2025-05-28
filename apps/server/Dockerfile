# Use Node.js 20 LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy workspace package-lock and server package files first for better caching
COPY package-lock.json ./
COPY apps/server/package*.json ./

# Install all dependencies (including devDependencies for TypeScript compilation)
RUN npm install --frozen-lockfile

# Copy server TypeScript configuration
COPY apps/server/tsconfig.json ./

# Copy all server source code
COPY apps/server/ .

# Compile TypeScript to JavaScript
RUN npm run build

# Remove devDependencies to reduce image size
RUN npm prune --production

# Expose port
EXPOSE 4000

# Set environment to production
ENV NODE_ENV=production

# Start the server using compiled JavaScript
CMD ["node", "dist/server.js"] 