#!/bin/bash

# SVlentes Landing Page Deployment Script
# This script handles deployment to Vercel with proper checks and monitoring

set -e  # Exit on any error

echo "🚀 Starting SVlentes Landing Page Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="svlentes-landing-page"
VERCEL_ORG="your-vercel-org"
PRODUCTION_DOMAIN="svlentes-landing.vercel.app"

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        log_error "Vercel CLI is not installed. Please install it with: npm i -g vercel"
        exit 1
    fi
    
    # Check if we're logged in to Vercel
    if ! vercel whoami &> /dev/null; then
        log_error "Not logged in to Vercel. Please run: vercel login"
        exit 1
    fi
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Run tests
run_tests() {
    log_info "Running tests..."
    
    # Install dependencies
    npm ci
    
    # Run unit tests
    if npm run test -- --watchAll=false --coverage; then
        log_success "Unit tests passed"
    else
        log_error "Unit tests failed"
        exit 1
    fi
    
    # Run integration tests
    if npm run test -- --testPathPattern=integration --watchAll=false; then
        log_success "Integration tests passed"
    else
        log_error "Integration tests failed"
        exit 1
    fi
    
    # Build the project
    if npm run build; then
        log_success "Build successful"
    else
        log_error "Build failed"
        exit 1
    fi
}

# Run E2E tests (optional, requires running server)
run_e2e_tests() {
    log_info "Running E2E tests..."
    
    # Start the development server in background
    npm run dev &
    DEV_SERVER_PID=$!
    
    # Wait for server to start
    sleep 10
    
    # Run E2E tests
    if npx playwright test --reporter=line; then
        log_success "E2E tests passed"
    else
        log_warning "E2E tests failed (continuing with deployment)"
    fi
    
    # Kill the development server
    kill $DEV_SERVER_PID 2>/dev/null || true
}

# Deploy to staging
deploy_staging() {
    log_info "Deploying to staging..."
    
    # Deploy to Vercel (preview)
    STAGING_URL=$(vercel --yes --token=$VERCEL_TOKEN 2>&1 | grep -o 'https://[^[:space:]]*')
    
    if [ -n "$STAGING_URL" ]; then
        log_success "Staging deployment successful: $STAGING_URL"
        
        # Run smoke tests against staging
        run_smoke_tests "$STAGING_URL"
        
        echo "$STAGING_URL" > .staging-url
    else
        log_error "Staging deployment failed"
        exit 1
    fi
}

# Deploy to production
deploy_production() {
    log_info "Deploying to production..."
    
    # Deploy to production
    if vercel --prod --yes --token=$VERCEL_TOKEN; then
        log_success "Production deployment successful: https://$PRODUCTION_DOMAIN"
        
        # Run smoke tests against production
        run_smoke_tests "https://$PRODUCTION_DOMAIN"
        
        # Send deployment notification
        send_deployment_notification "success" "https://$PRODUCTION_DOMAIN"
    else
        log_error "Production deployment failed"
        send_deployment_notification "failure" ""
        exit 1
    fi
}

# Run smoke tests
run_smoke_tests() {
    local url=$1
    log_info "Running smoke tests against $url..."
    
    # Wait for deployment to be ready
    sleep 30
    
    # Test health check endpoint
    if curl -f "$url/api/health-check" > /dev/null 2>&1; then
        log_success "Health check passed"
    else
        log_warning "Health check failed"
    fi
    
    # Test main page
    if curl -f "$url" > /dev/null 2>&1; then
        log_success "Main page accessible"
    else
        log_error "Main page not accessible"
        return 1
    fi
    
    # Test API endpoints
    if curl -f "$url/api/create-checkout" -X POST -H "Content-Type: application/json" -d '{}' > /dev/null 2>&1; then
        log_info "API endpoints responding (expected error for empty request)"
    else
        log_warning "API endpoints may have issues"
    fi
}

# Send deployment notification
send_deployment_notification() {
    local status=$1
    local url=$2
    
    if [ "$status" = "success" ]; then
        local message="🚀 SVlentes Landing Page deployed successfully to production: $url"
        local color="good"
    else
        local message="❌ SVlentes Landing Page deployment failed"
        local color="danger"
    fi
    
    # Send Slack notification if webhook is configured
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$message\", \"color\":\"$color\"}" \
            "$SLACK_WEBHOOK_URL" || log_warning "Failed to send Slack notification"
    fi
    
    # Send email notification if configured
    if [ -n "$NOTIFICATION_EMAIL" ]; then
        echo "$message" | mail -s "SVlentes Deployment $status" "$NOTIFICATION_EMAIL" || log_warning "Failed to send email notification"
    fi
}

# Rollback function
rollback() {
    log_warning "Rolling back deployment..."
    
    # Get previous deployment
    PREVIOUS_DEPLOYMENT=$(vercel ls --token=$VERCEL_TOKEN | grep "$PRODUCTION_DOMAIN" | head -2 | tail -1 | awk '{print $1}')
    
    if [ -n "$PREVIOUS_DEPLOYMENT" ]; then
        vercel promote "$PREVIOUS_DEPLOYMENT" --token=$VERCEL_TOKEN
        log_success "Rollback completed to $PREVIOUS_DEPLOYMENT"
    else
        log_error "No previous deployment found for rollback"
    fi
}

# Main deployment flow
main() {
    local environment=${1:-staging}
    
    echo "🏗️  Deploying to: $environment"
    
    # Check prerequisites
    check_prerequisites
    
    # Run tests
    run_tests
    
    # Deploy based on environment
    case $environment in
        "staging")
            deploy_staging
            ;;
        "production")
            # Run E2E tests before production deployment
            if [ "$SKIP_E2E" != "true" ]; then
                run_e2e_tests
            fi
            deploy_production
            ;;
        "rollback")
            rollback
            ;;
        *)
            log_error "Invalid environment: $environment. Use 'staging', 'production', or 'rollback'"
            exit 1
            ;;
    esac
    
    log_success "Deployment completed successfully! 🎉"
}

# Handle script arguments
case "${1:-staging}" in
    "staging"|"production"|"rollback")
        main "$1"
        ;;
    "--help"|"-h")
        echo "Usage: $0 [staging|production|rollback]"
        echo ""
        echo "Options:"
        echo "  staging     Deploy to staging environment (default)"
        echo "  production  Deploy to production environment"
        echo "  rollback    Rollback to previous production deployment"
        echo "  --help, -h  Show this help message"
        echo ""
        echo "Environment variables:"
        echo "  VERCEL_TOKEN          Vercel authentication token"
        echo "  SLACK_WEBHOOK_URL     Slack webhook for notifications"
        echo "  NOTIFICATION_EMAIL    Email for deployment notifications"
        echo "  SKIP_E2E             Skip E2E tests (set to 'true')"
        ;;
    *)
        log_error "Invalid argument: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac