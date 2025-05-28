# Deployment Guide - Railway

This guide will help you set up automatic deployment for your F1 Championship application using Railway.

## Overview

Your application consists of:
- **Client**: Next.js frontend application
- **Server**: Express.js API with MongoDB and Redis

## Prerequisites

1. [Railway Account](https://railway.app) (free tier available)
2. GitHub repository connected to Railway
3. MongoDB Atlas account (or use Railway's MongoDB service)
4. Redis instance (or use Railway's Redis service)

## Setup Instructions

### 1. Create Railway Project

1. Go to [Railway](https://railway.app) and sign up/login
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository

### 2. Create Services

You'll need to create two services in Railway:

#### Server Service
1. In your Railway project, click "New Service"
2. Choose "GitHub Repo"
3. Set the **Root Directory** to `apps/server`
4. Set the **Build Command** to `npm install && npm run build` (if you have a build script)
5. Set the **Start Command** to `npm run start`

#### Client Service
1. Click "New Service" again
2. Choose "GitHub Repo" 
3. Set the **Root Directory** to `apps/client`
4. Railway will auto-detect it's a Next.js app

### 3. Add Database Services

#### MongoDB (Option 1: Railway MongoDB)
1. Click "New Service" → "Database" → "MongoDB"
2. Note the connection string from the Variables tab

#### MongoDB (Option 2: MongoDB Atlas)
1. Use your existing MongoDB Atlas connection string
2. Add it as an environment variable

#### Redis
1. Click "New Service" → "Database" → "Redis"
2. Note the connection string from the Variables tab

### 4. Configure Environment Variables

#### Server Environment Variables
```
NODE_ENV=production
PORT=4000
DB_HOST=<your-mongodb-connection-string>
REDIS_URL=<your-redis-connection-string>
```

#### Client Environment Variables
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=<your-server-railway-url>
```

### 5. Set Up GitHub Secrets

In your GitHub repository, go to Settings → Secrets and Variables → Actions, and add:

```
RAILWAY_TOKEN=<your-railway-token>
RAILWAY_SERVER_SERVICE_ID=<server-service-id>
RAILWAY_CLIENT_SERVICE_ID=<client-service-id>
NEXT_PUBLIC_API_URL=<your-server-railway-url>
```

#### Getting Railway Token
1. Go to Railway Dashboard
2. Click on your profile → Account Settings
3. Go to "Tokens" tab
4. Create a new token

#### Getting Service IDs
1. In your Railway project, click on each service
2. Go to Settings tab
3. Copy the Service ID

### 6. Configure Automatic Deployments

The GitHub Actions workflows are already set up in `.github/workflows/`:
- `deploy-server.yml` - Deploys server on changes to `apps/server/`
- `deploy-client.yml` - Deploys client on changes to `apps/client/`

### 7. Manual Deployment (Alternative)

If you prefer manual deployment using Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Deploy server
cd apps/server
railway up

# Deploy client
cd ../client
railway up
```

## Monitoring and Logs

1. **Logs**: View real-time logs in Railway dashboard
2. **Metrics**: Monitor CPU, memory, and network usage
3. **Health Checks**: Server includes `/api/health` endpoint
4. **Alerts**: Set up notifications for deployment failures

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Verify Node.js version compatibility
   - Check build logs in Railway dashboard

2. **Environment Variables**
   - Ensure all required env vars are set
   - Check variable names match exactly
   - Restart services after changing variables

3. **Database Connection**
   - Verify MongoDB connection string
   - Check network access settings
   - Ensure database user has proper permissions

4. **CORS Issues**
   - Update CORS settings in server to allow Railway domains
   - Check `NEXT_PUBLIC_API_URL` points to correct server URL

### Useful Commands

```bash
# Check deployment status
railway status

# View logs
railway logs

# Open service in browser
railway open

# Connect to database
railway connect
```

## Cost Optimization

Railway free tier includes:
- $5 worth of usage per month
- 500 hours of runtime
- 1GB RAM per service
- 1GB disk per service

To optimize costs:
1. Use sleep mode for development environments
2. Monitor usage in Railway dashboard
3. Consider upgrading to paid plan for production

## Security Best Practices

1. **Environment Variables**: Never commit secrets to git
2. **Database**: Use strong passwords and restrict network access
3. **HTTPS**: Railway provides SSL certificates automatically
4. **CORS**: Configure properly for your domain
5. **Rate Limiting**: Implement API rate limiting

## Support

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [GitHub Issues](https://github.com/railwayapp/railway/issues) 