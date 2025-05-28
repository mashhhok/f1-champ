# F1 Championship Application

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

A full-stack F1 Championship application built with Next.js, Express.js, MongoDB, and Redis.

## 🏎️ Project Overview

This is an Nx monorepo containing:
- **Client**: Next.js frontend application with Material-UI
- **Server**: Express.js API with MongoDB and Redis integration
- **Deployment**: Automated deployment to Railway

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- MongoDB (local or Atlas)
- Redis (local or cloud)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd f1-champ

# Install dependencies
npm ci --legacy-peer-deps
```

### Development

```bash
# Start the server (development mode)
cd apps/server
npm run dev

# Start the client (development mode)
npx nx dev client

# Run tests
npm test
npx nx test client
```

### Production Build

```bash
# Build both applications
npx nx build client
cd apps/server && npm run start
```

## 📦 Deployment

This application is configured for automatic deployment to Railway. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Quick Deploy

```bash
# Deploy both client and server
./scripts/deploy.sh

# Deploy only server
./scripts/deploy.sh server

# Deploy only client
./scripts/deploy.sh client
```

### Environment Variables

#### Server (.env)
```
NODE_ENV=production
PORT=4000
DB_HOST=your-mongodb-connection-string
REDIS_URL=your-redis-connection-string
```

#### Client
```
NEXT_PUBLIC_API_URL=your-server-url
```

## 🛠️ Development Commands

```bash
# Run the dev server for client
npx nx dev client

# Create a production bundle for client
npx nx build client

# Run server in development mode
cd apps/server && npm run dev

# Run tests
npm test
npx nx test client

# Lint code
npx nx lint client

# See all available targets
npx nx show project client
```

## 📁 Project Structure

```
f1-champ/
├── apps/
│   ├── client/          # Next.js frontend
│   └── server/          # Express.js API
├── .github/
│   └── workflows/       # GitHub Actions for CI/CD
├── scripts/
│   └── deploy.sh        # Deployment script
├── DEPLOYMENT.md        # Deployment guide
└── README.md
```

## 🔧 Tech Stack

- **Frontend**: Next.js 15, React 19, Material-UI, Redux Toolkit
- **Backend**: Express.js, TypeScript, MongoDB, Redis
- **Testing**: Jest, Testing Library
- **Deployment**: Railway, GitHub Actions
- **Monorepo**: Nx

## 📚 API Documentation

The server includes Swagger documentation available at `/api-docs` when running in development mode.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

## Nx Workspace Information

✨ Your new, shiny [Nx workspace](https://nx.dev) is ready! ✨

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/next?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created.

### Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/next:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/react:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/next?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
