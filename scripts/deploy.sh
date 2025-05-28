#!/bin/bash

# F1 Championship Deployment Script
# Usage: ./scripts/deploy.sh [client|server|both]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Railway CLI is installed
check_railway_cli() {
    if ! command -v railway &> /dev/null; then
        print_error "Railway CLI is not installed. Installing..."
        npm install -g @railway/cli
    fi
}

# Deploy server
deploy_server() {
    print_status "Deploying server to Railway..."
    cd apps/server
    
    # Run tests first
    print_status "Running server tests..."
    npm test
    
    # Deploy to Railway
    railway up
    
    cd ../..
    print_status "Server deployment completed!"
}

# Deploy client
deploy_client() {
    print_status "Deploying client to Railway..."
    cd apps/client
    
    # Install client dependencies
    print_status "Installing client dependencies..."
    npm install
    
    # Build the application
    print_status "Building client application..."
    npm run build
    
    # Deploy to Railway
    railway up
    
    cd ../..
    print_status "Client deployment completed!"
}

# Main deployment logic
main() {
    print_status "F1 Championship Deployment Script"
    print_status "================================="
    
    # Check prerequisites
    check_railway_cli
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi
    
    # Install dependencies
    print_status "Installing dependencies..."
    npm ci --legacy-peer-deps
    
    # Determine what to deploy
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
    
    print_status "Deployment completed successfully! 🚀"
    print_status "Check your Railway dashboard for deployment status."
}

# Run main function with all arguments
main "$@" 