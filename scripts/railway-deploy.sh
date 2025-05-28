#!/bin/bash

# Railway Deployment Troubleshooting Script
# Usage: ./scripts/railway-deploy.sh [client|server|both]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check Railway CLI
check_railway_cli() {
    if ! command -v railway &> /dev/null; then
        print_error "Railway CLI not found. Installing..."
        npm install -g @railway/cli
    fi
    
    print_status "Railway CLI version: $(railway --version)"
}

# Check Railway login
check_railway_login() {
    if ! railway whoami &> /dev/null; then
        print_error "Not logged into Railway. Please run: railway login"
        exit 1
    fi
    
    print_status "Logged in as: $(railway whoami)"
}

# Deploy server
deploy_server() {
    print_status "Deploying server..."
    cd apps/server
    
    # Check if we're linked to a Railway project
    if [ ! -f ".railway" ]; then
        print_warning "No Railway project linked. Please run: railway link"
        cd ../..
        return 1
    fi
    
    # Build TypeScript
    print_status "Building TypeScript..."
    npm run build
    
    # Deploy
    print_status "Deploying to Railway..."
    railway up
    
    cd ../..
    print_status "Server deployment completed!"
}

# Deploy client
deploy_client() {
    print_status "Deploying client..."
    cd apps/client
    
    # Check if we're linked to a Railway project
    if [ ! -f ".railway" ]; then
        print_warning "No Railway project linked. Please run: railway link"
        cd ../..
        return 1
    fi
    
    # Deploy
    print_status "Deploying to Railway..."
    railway up
    
    cd ../..
    print_status "Client deployment completed!"
}

# Main function
main() {
    print_status "Railway Deployment Script"
    print_status "========================="
    
    check_railway_cli
    check_railway_login
    
    case "${1:-both}" in
        "server")
            deploy_server
            ;;
        "client")
            deploy_client
            ;;
        "both")
            deploy_server
            deploy_client
            ;;
        *)
            print_error "Invalid argument. Use: client, server, or both"
            exit 1
            ;;
    esac
    
    print_status "Deployment completed! 🚀"
}

main "$@" 