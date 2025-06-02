# Use Node.js 20 LTS
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy workspace package-lock and client package files
COPY package-lock.json ./
COPY package.json ./
COPY apps/client/package*.json ./apps/client/
RUN npm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Copy shared types library
COPY libs/shared-types ./libs/shared-types

# Copy all client source code
COPY apps/client/ ./apps/client/

# Copy workspace TypeScript config
COPY tsconfig.base.json ./tsconfig.base.json

# Accept build arguments
ARG NEXT_PUBLIC_API_URL=https://server-production-9fd8.up.railway.app

# Set environment variables for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Change to client directory for build
WORKDIR /app/apps/client

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built application and dependencies
COPY --from=builder /app/apps/client/.next/standalone ./
COPY --from=builder /app/apps/client/.next/static ./.next/static
COPY --from=builder /app/apps/client/public ./public
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"] 