# F1 Champions - Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Data Flow](#data-flow)
6. [Key Components](#key-components)
7. [API Design](#api-design)
8. [Database Schema](#database-schema)
9. [Caching Strategy](#caching-strategy)
10. [Security Architecture](#security-architecture)
11. [Error Handling & Logging](#error-handling--logging)
12. [Performance & Monitoring](#performance--monitoring)
13. [Deployment Architecture](#deployment-architecture)
14. [Development Workflow](#development-workflow)
15. [Troubleshooting](#troubleshooting)

## Overview

F1 Champions is a full-stack web application that displays Formula 1 season champions and race winners. The application is built as a monorepo using Nx workspace, featuring a Next.js frontend and Express.js backend with MongoDB persistence and Redis caching.

### Key Features
- Display F1 season champions from 2005 to present
- Show detailed race winners for each season
- Real-time data synchronization with external F1 API
- Multi-layer caching for optimal performance
- Responsive Material-UI design with dark/light theme support
- Comprehensive error handling and logging
- Production-ready security measures

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          Client (Next.js)                       │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐     │
│  │   React 19  │  │ Redux Toolkit│  │   Material-UI       │     │
│  │ Components  │  │  + RTK Query │  │   + Emotion CSS     │     │
│  └─────────────┘  └──────────────┘  └─────────────────────┘     │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (Express.js)                   │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐     │
│  │   Routes    │  │ Controllers  │  │  Security Layer     │     │
│  │  /api/v1/*  │  │ + Validation │  │ Helmet/Rate Limit   │     │
│  └─────────────┘  └──────────────┘  └─────────────────────┘     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Service Layer                            │
│  ┌─────────────────────┐  ┌────────────────────────────────┐    │
│  │  Business Logic     │  │   External API Integration     │    │
│  │  Data Transformation│  │   Retry Logic & Fallbacks      │    │
│  └─────────────────────┘  └────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        ▼                                       ▼
┌──────────────────┐                   ┌──────────────────┐
│   Redis Cache    │                   │    MongoDB       │
│  Session Data    │                   │ Persistent Data  │
│   (1hr TTL)      │                   │   + Indexes      │
└──────────────────┘                   └──────────────────┘
        │                                       │
        └───────────────────┬───────────────────┘
                            ▼
                    ┌──────────────────┐
                    │ External F1 API  │
                    │ api.jolpi.ca     │
                    └──────────────────┘
```

### Architectural Patterns

#### 1. **Monorepo Architecture with Nx**
- Centralized dependency management
- Shared TypeScript configurations
- Consistent tooling across projects
- Optimized builds with Nx caching

#### 2. **Layered Architecture**
- Presentation Layer (React Components)
- API Layer (Express Routes & Controllers)
- Business Logic Layer (Services)
- Data Access Layer (Models & Database)

#### 3. **Domain-Driven Design**
- Feature-based module organization
- Clear domain boundaries (seasons, races, drivers)
- Rich domain models with business logic

## Technology Stack

### Frontend Technologies
| Technology    | Version | Purpose                      |
|---------------|---------|------------------------------|
| Next.js       | 15.2.4  | React framework with SSR/SSG |
| React         | 19.0.0  | UI library                   |
| Redux Toolkit | 2.8.2   | State management             |
| RTK Query     | -       | Data fetching and caching    |
| Material-UI   | 7.1.0   | Component library            |
| Emotion       | 11.14.0 | CSS-in-JS styling            |
| TypeScript    | 5.7.2   | Type safety                  |
| Axios         | 1.9.0   | HTTP client                  |

### Backend Technologies
| Technology         | Version | Purpose              |
|--------------------|---------|----------------------|
| Express.js         | 5.1.0   | Web framework        |
| MongoDB            | -       | Primary database     |
| Mongoose           | 8.15.0  | MongoDB ODM          |
| Redis              | 5.1.0   | Caching layer        |
| TypeScript         | 5.7.2   | Type safety          |
| Zod                | 3.25.36 | Runtime validation   |
| Winston            | 3.17.0  | Logging              |
| Helmet             | 8.1.0   | Security headers     |
| Express Rate Limit | 7.5.0   | Rate limiting        |
| Morgan             | 1.10.0  | HTTP request logging |
| Swagger            | 6.2.8   | API documentation    |

### DevOps & Infrastructure
| Technology     | Version | Purpose              |
|----------------|---------|----------------------|
| Docker         |         | Containerization     |
| Docker Compose |         | Local development    |
| Nx             | 21.0.3  | Monorepo management  |
| Jest           | 29.7.0  | Testing framework    |
| ESLint         | 9.8.0   | Code quality         |
| Railway        |         | Deployment platform  |

## Project Structure

```
f1-champ/
├── apps/
│   ├── client/                 # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/           # Next.js app router
│   │   │   │   ├── components/    # React components
│   │   │   │   ├── redux/         # State management
│   │   │   │   ├── hooks/         # Custom React hooks
│   │   │   │   └── styles/        # Global styles and themes
│   │   │   ├── tests/             # Frontend tests
│   │   │   ├── public/            # Static assets
│   │   │   ├── Dockerfile         # Client container
│   │   │   └── railway.toml       # Railway deployment config
│   │   ├── server/                # Express.js backend application
│   │   │   ├── controllers/       # Request handlers
│   │   │   ├── services/          # Business logic
│   │   │   ├── models/            # Mongoose schemas
│   │   │   ├── routes/            # API routes
│   │   │   ├── middleware/        # Express middleware
│   │   │   ├── utils/             # Utility functions
│   │   │   ├── config/            # Configuration files
│   │   │   ├── errors/            # Error handling
│   │   │   ├── ___tests___/       # Backend tests
│   │   │   ├── Dockerfile         # Server container
│   │   │   └── railway.toml       # Railway deployment config
│   │   ├── scripts/                   # Deployment and utility scripts
│   │   └── .github/                   # GitHub workflows
│   │
│   └── nx.json                    # Nx workspace configuration
│
├── docker-compose.yml         # Production compose
├── docker-compose.dev.yml     # Development compose
├── package.json              # Root dependencies
└── ARCHITECTURE.md           # This file
```

## Data Flow

### Request Lifecycle

1. **User Interaction**
   - User clicks on a season or navigates to race details
   - React component triggers an action

2. **Client-Side Data Fetching**
   ```typescript
   // RTK Query hook in component
   const { data, isLoading } = useGetRaceWinnersQuery(season);
   ```

3. **API Request Processing**
   ```typescript
   // Security middleware → Route → Controller → Service flow
   app.use(helmet()); // Security headers
   app.use(rateLimit()); // Rate limiting
   router.get('/:season/race-winners', getRaceWinners);
   
   // Controller validates and delegates
   const raceWinners = await raceWinnersService.getRaceWinners(season);
   ```

4. **Multi-Layer Caching Check**
   ```typescript
   // 1. Check Redis cache
   const cached = await redis.get(`race-winners:${season}`);
   if (cached) return JSON.parse(cached);
   
   // 2. Check MongoDB
   const stored = await Driver.find({ season });
   if (stored.length) {
     await redis.setex(key, 3600, JSON.stringify(stored));
     return stored;
   }
   
   // 3. Fetch from external API with retry logic
   const data = await fetchFromF1API(season);
   ```

5. **Data Persistence & Response**
   - Store in MongoDB for long-term persistence
   - Cache in Redis with TTL for performance
   - Transform data and send JSON response
   - RTK Query caches and delivers to component

## Key Components

### Frontend Components

#### 1. **SeasonTable Component**
```typescript
// apps/client/src/components/season/SeasonTable.tsx
- Displays all F1 seasons in a paginated table
- Material-UI DataGrid integration
- Row expansion for race details
- RTK Query data fetching
```

#### 2. **RacesTable Component**
```typescript
// apps/client/src/components/races/RacesTable.tsx
- Shows race winners for selected season
- Driver modal for detailed information
- Responsive design with mobile support
```

#### 3. **Redux Store**
```typescript
// apps/client/src/redux/store.ts
- RTK Query API slice configuration
- Automatic cache management
- DevTools integration
```

### Backend Services

#### 1. **SeasonChampionsService**
```typescript
// apps/server/services/seasonChampionsService.ts
- getSeasonsWithWinners(): Fetch all champions
- refreshSeasonsData(): Update from external API
- Multi-layer caching implementation
```

#### 2. **RaceWinnersService**
```typescript
// apps/server/services/raceWinnersService.ts
- getRaceWinners(season): Get races for a season
- Retry logic for external API calls
- Data transformation and normalization
```

## API Design

### Base URLs
```
Production: https://client-production-adf9.up.railway.app/
Development: http://localhost:4000/api
```

### Core Endpoints

#### 1. **Health Check**
```http
GET /health
Response: 200 OK
{
  "status": "healthy",
  "uptime": 12345,
  "timestamp": "2024-01-30T12:00:00Z"
}
```

#### 2. **Get All Season Champions**
```http
GET /v1/champions
Response: 200 OK
[
  {
    "season": "2023",
    "givenName": "Max",
    "familyName": "Verstappen",
    "isSeasonEnded": true
  }
]
```

#### 3. **Get Race Winners by Season**
```http
GET /v1/{season}/race-winners
Parameters: season (string, required)
Response: 200 OK
[
  {
    "driverId": "verstappen",
    "race": [...],
    "givenName": "Max",
    "familyName": "Verstappen",
    "nationality": "Dutch",
    "teamName": "Red Bull"
  }
]
```

### API Features
- RESTful design principles
- Version included in URL path (`/v1/`)
- Comprehensive error responses
- Rate limiting (100 requests/15min)
- Request/response logging
- Swagger documentation available at `/api-docs`

## Database Schema

### MongoDB Collections

#### 1. **seasonWinner Collection**
```typescript
{
  _id: ObjectId,
  season: String,           // "2023" (indexed)
  givenName: String,        // "Max"
  familyName: String,       // "Verstappen"
  isSeasonEnded: Boolean,   // true
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. **drivers Collection**
```typescript
{
  _id: ObjectId,
  driverId: String,         // "verstappen"
  season: String,           // "2023"
  givenName: String,        // "Max"
  familyName: String,       // "Verstappen"
  nationality: String,      // "Dutch"
  teamName: String,         // "Red Bull"
  race: [{
    raceName: String,       // "Bahrain Grand Prix"
    date: String,           // "2023-03-05"
    circuitName: String,    // Circuit details
    // ... more race fields
  }],
  // ... additional driver fields
}
```

**Indexes:**
- `season`: Unique index
- `{ season: 1, driverId: 1 }`: Compound index
- `createdAt`: Time-based queries

## Caching Strategy

### Multi-Layer Caching

#### 1. **Client-Side (RTK Query)**
- Automatic request deduplication
- Configurable cache lifetime
- Background refetching
- Cache invalidation

#### 2. **Server-Side (Redis)**
```typescript
const CACHE_TTL = {
  SEASON_CHAMPIONS: 3600,    // 1 hour
  RACE_WINNERS: 3600,        // 1 hour
  DRIVER_DETAILS: 7200       // 2 hours
};

// Cache key patterns
'season-champions:all'
'race-winners:${season}'
'driver:${driverId}:${season}'
```

#### 3. **Database (MongoDB)**
- Indexed queries for performance
- Connection pooling
- Query optimization

### Cache Invalidation
- Time-based expiration (TTL)
- Event-based invalidation
- Manual cache clearing endpoints

## Security Architecture

### Application Security

#### 1. **HTTP Security Headers (Helmet)**
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true }
}));
```

#### 2. **Rate Limiting**
```typescript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
```

#### 3. **Input Validation & Sanitization**
- Zod schemas for runtime validation
- Express-mongo-sanitize for NoSQL injection prevention
- CORS configuration for cross-origin requests

#### 4. **Environment Security**
- Environment variables for sensitive data
- Secure cookie configuration
- Database connection security

## Error Handling & Logging

### Error Handling Strategy

#### 1. **Global Error Handler**
```typescript
// apps/server/middleware/errorHandler.ts
app.use((error, req, res, next) => {
  logger.error(error.message, { stack: error.stack, url: req.url });
  res.status(error.status || 500).json({
    error: {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message: error.message,
      timestamp: new Date().toISOString()
    }
  });
});
```

#### 2. **Custom Error Classes**
```typescript
class APIError extends Error {
  constructor(message, statusCode = 500, code = 'API_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}
```

### Logging Configuration

#### 1. **Winston Logger Setup**
```typescript
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console()
  ]
});
```

#### 2. **Request Logging (Morgan)**
```typescript
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
}));
```

## Performance & Monitoring

### Performance Optimizations

#### 1. **Frontend Optimizations**
- Next.js automatic code splitting
- Image optimization
- Static generation for season data
- Component lazy loading

#### 2. **Backend Optimizations**
- Database connection pooling
- Indexed database queries
- Redis caching with appropriate TTLs
- Compression middleware

### Monitoring & Health Checks

#### 1. **Health Endpoint**
```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});
```

#### 2. **Performance Metrics**
- Response time tracking
- Cache hit/miss ratios
- Error rate monitoring
- Database query performance

## Deployment Architecture

### Container Setup

#### 1. **Client Dockerfile**
```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist/apps/client ./
EXPOSE 3000
CMD ["npm", "start"]
```

#### 2. **Server Dockerfile**
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
EXPOSE 4000
CMD ["npm", "start"]
```

### Railway Deployment

#### 1. **Railway Configuration**
```toml
# railway.toml
[build]
builder = "nixpacks"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 30
restartPolicyType = "on-failure"
```

#### 2. **Environment Variables**
```
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb://...
REDIS_URL=redis://...
LOG_LEVEL=info
```

## Development Workflow

### Local Development Setup

#### 1. **Prerequisites**
- Node.js 22+
- Docker & Docker Compose
- Git

#### 2. **Setup Commands**
```bash
# Clone and setup
git clone <repository-url>
cd f1-champ
npm install

# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Run applications
nx run-many --target=dev --projects=client,server --parallel
```

#### 3. **Development URLs**
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

### Nx Commands

#### Development
```bash
nx dev client              # Start client dev server
nx dev server              # Start server dev server
nx run-many --target=dev   # Start both applications
```

#### Building
```bash
nx build client            # Build client for production
nx build server            # Build server for production
nx run-many --target=build # Build both applications
```

#### Testing
```bash
nx test client             # Run client tests
nx test server             # Run server tests
nx test client --watch     # Watch mode
```

#### Code Quality
```bash
nx lint client             # Lint client code
nx lint server             # Lint server code
```

### Testing Strategy

#### 1. **Frontend Testing**
- Unit tests with Jest and React Testing Library
- Component integration tests
- RTK Query mocking for API calls

#### 2. **Backend Testing**
- Unit tests for services and utilities
- Integration tests for API endpoints
- Database tests with in-memory MongoDB

## Troubleshooting

### Common Issues

#### 1. **Redis Connection Issues**
```bash
# Check Redis connectivity
docker exec -it <redis-container> redis-cli ping

# Clear Redis cache
docker exec -it <redis-container> redis-cli FLUSHALL
```

#### 2. **MongoDB Connection Issues**
```bash
# Check MongoDB connectivity
docker exec -it <mongo-container> mongosh --eval "db.adminCommand('ping')"

# View MongoDB logs
docker logs <mongo-container>
```

#### 3. **Build Issues**
```bash
# Clear Nx cache
nx reset

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. **API Issues**
```bash
# Check server logs
docker logs <server-container>

# Test API endpoints
curl http://localhost:4000/api/v1/champions
```

### Performance Issues

#### 1. **Slow API Responses**
- Check Redis cache hit rates
- Verify database indexes
- Monitor external API response times

#### 2. **High Memory Usage**
- Monitor Node.js heap usage
- Check for memory leaks in services
- Optimize database queries

### Debugging Tips

#### 1. **Enable Debug Logging**
```bash
LOG_LEVEL=debug npm run dev
```

#### 2. **Monitor Cache Performance**
```bash
# Redis cache statistics
docker exec -it <redis-container> redis-cli INFO stats
```

#### 3. **Database Query Performance**
```javascript
// Enable MongoDB query logging
mongoose.set('debug', true);
```

---