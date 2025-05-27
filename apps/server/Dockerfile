# Use Node.js 20 LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/server/package*.json ./apps/server/

# Install dependencies
RUN npm ci --legacy-peer-deps --only=production

# Copy server source code
COPY apps/server/ ./apps/server/
COPY tsconfig.base.json ./

# Install TypeScript globally for compilation
RUN npm install -g typescript ts-node

# Expose port
EXPOSE 4000

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD ["npm", "run", "start", "--prefix", "apps/server"] 