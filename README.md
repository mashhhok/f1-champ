# F1 Championship Application

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

A full-stack F1 Championship application built with Next.js, Express.js, MongoDB, and Redis in an Nx monorepo.

Client: https://client-production-adf9.up.railway.app/

Server (as example): https://server-production-9fd8.up.railway.app/api/v1/champions

## 🏎️ Project Overview

This is an Nx monorepo containing:
- **Client**: Next.js 15 frontend application with Material-UI v7 and React 19
- **Server**: Express.js API with MongoDB and Redis integration
- **Docker**: Containerized development and production environments
- **CI/CD**: Automated deployment with GitHub Actions and Railway

For detailed architecture information, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- MongoDB (local or Atlas)
- Redis (local or cloud)
- Docker (optional, for containerized development)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd f1-champ

# Install dependencies
npm ci --legacy-peer-deps
```

### Development

#### Standard Development
```bash
# Start the server (development mode)
cd apps/server
npm run dev

# Start the client (development mode)
cd apps/client
npx next dev

# Run tests
npm test
npx nx test client
```

#### Docker Development
```bash
# Start all services with Docker Compose
docker-compose -f docker-compose.dev.yml up

# Start only specific services
docker-compose -f docker-compose.dev.yml up client
docker-compose -f docker-compose.dev.yml up server
```

### Production

#### Local Production Build
```bash
# Build both applications
npx nx build client
cd apps/server && npm run start
```

#### Docker Production
```bash
# Build and start production containers
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

## 📦 Deployment

This application supports multiple deployment strategies:

### Railway Deployment
```bash
# Deploy both client and server
./scripts/deploy.sh

# Deploy with Railway-specific script
./scripts/railway-deploy.sh

# Deploy only server
./scripts/deploy.sh server

# Deploy only client
./scripts/deploy.sh client
```

### Docker Deployment
```bash
# Build production images
docker-compose build

# Deploy to your container registry
docker-compose push
```

### Environment Variables

#### Server (.env)
```env
NODE_ENV=production
PORT=4000
DB_HOST=your-mongodb-connection-string
REDIS_URL=your-redis-connection-string
CORS_ORIGIN=your-client-url
```

#### Client (.env.local)
```env
NEXT_PUBLIC_API_URL=your-server-url
NEXT_PUBLIC_APP_ENV=production
```

## 🛠️ Development Commands

### Client Commands
```bash
# Development server
npx nx dev client

# Production build
npx nx build client

# Run tests
npx nx test client

# Run tests in watch mode
npm run test:watch

# Lint code
npx nx lint client

# Analyze bundle
npx nx build client --analyze
```

### Server Commands
```bash
# Development with hot reload
cd apps/server && npm run dev

# Production start
cd apps/server && npm run start

# Run tests
cd apps/server && npm test
```

### Docker Commands
```bash
# Development environment
docker-compose -f docker-compose.dev.yml up

# Production environment
docker-compose up

# Build without cache
docker-compose build --no-cache

# View logs
docker-compose logs -f [service-name]
```

## 📁 Project Structure

```
f1-champ/
├── apps/
│   ├── client/              # Next.js frontend
│   └── server/              # Express.js API
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI/CD
├── scripts/
│   ├── deploy.sh            # General deployment script
│   └── railway-deploy.sh    # Railway-specific deployment
├── docker-compose.yml       # Production Docker setup
├── docker-compose.dev.yml   # Development Docker setup
├── ARCHITECTURE.md          # Detailed architecture documentation
└── README.md
```

## 🔧 Tech Stack

### Frontend
- **Framework**: Next.js 15 with React 19
- **UI Library**: Material-UI v7 with Emotion
- **State Management**: Redux Toolkit
- **Theming**: next-themes for dark/light mode
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js with Express.js 5
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Documentation**: Swagger (available at `/api-docs`)
- **CORS**: Configurable cross-origin resource sharing

### Development & Deployment
- **Monorepo**: Nx 21
- **Testing**: Jest with Testing Library
- **Type Safety**: TypeScript 5.7
- **Linting**: ESLint 9 with Prettier
- **Containerization**: Docker with multi-stage builds
- **CI/CD**: GitHub Actions
- **Deployment**: Railway platform

## 📚 API Documentation

When running the server in development mode, Swagger documentation is available at:
```
http://localhost:4000/api-docs
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run client tests
npx nx test client

# Run client tests in watch mode
npm run test:watch

# Run tests with coverage
npx nx test client --coverage
```

## 🐳 Docker Support

### Development
The development setup includes hot reloading and volume mounts:
```bash
docker-compose -f docker-compose.dev.yml up
```

### Production
Optimized multi-stage builds for production:
```bash
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm test && npx nx lint client`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 🚨 Troubleshooting

### Common Issues

#### Dependencies
If you encounter peer dependency warnings:
```bash
npm ci --legacy-peer-deps
```

#### Docker Issues
If containers fail to start:
```bash
# Clean up containers and volumes
docker-compose down -v
docker system prune -f
```

#### Port Conflicts
Default ports:
- Client: 3000
- Server: 4000
- MongoDB: 27017
- Redis: 6379

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
