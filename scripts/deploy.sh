
#!/bin/bash

# Main deployment script for Baseball Analytics System

set -e  # Exit on any error
set -u  # Error on undefined variables

# Load environment variables
source ./scripts/load-env.sh

# Configuration
DEPLOY_ENV=${1:-production}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="./logs/deploy_${TIMESTAMP}.log"

# Create logs directory if it doesn't exist
mkdir -p ./logs

# Logging function
log() {
    local message=$1
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $message" | tee -a "$LOG_FILE"
}

# Error handling
handle_error() {
    local exit_code=$?
    log "ERROR: Deployment failed with exit code $exit_code"
    ./scripts/notify-team.sh "Deployment to $DEPLOY_ENV failed with exit code $exit_code"
    exit $exit_code
}

trap handle_error ERR

# Main deployment process
main() {
    log "Starting deployment to $DEPLOY_ENV environment"

    # Pre-deployment checks
    log "Running pre-deployment checks..."
    ./scripts/pre-deploy-check.sh "$DEPLOY_ENV" || exit 1

    # Backup current state
    log "Creating backup..."
    ./scripts/backup.sh "$DEPLOY_ENV" || exit 1

    # Stop services gracefully
    log "Stopping services..."
    ./scripts/stop-services.sh "$DEPLOY_ENV" || exit 1

    # Deploy application and model
    log "Deploying application and model..."
    case "$DEPLOY_ENV" in
        production)
            # Build and tag images
            log "Building and tagging Docker images..."
            docker build -t baseball-analytics:$TIMESTAMP .
            docker tag baseball-analytics:$TIMESTAMP baseball-analytics:latest
            
            # Build model image
            log "Building model Docker image..."
            docker build -t baseball-analytics-model:$TIMESTAMP ./model
            docker tag baseball-analytics-model:$TIMESTAMP baseball-analytics-model:latest
            
            # Deploy with docker-compose
            log "Deploying with docker-compose..."
            TAG=$TIMESTAMP docker-compose -f docker-compose.prod.yml up -d
            ;;
        staging)
            # Build and tag images
            log "Building and tagging Docker images for staging..."
            docker build -t baseball-analytics:staging-$TIMESTAMP .
            docker tag baseball-analytics:staging-$TIMESTAMP baseball-analytics:staging
            
            # Build model image
            log "Building model Docker image for staging..."
            docker build -t baseball-analytics-model:staging-$TIMESTAMP ./model
            docker tag baseball-analytics-model:staging-$TIMESTAMP baseball-analytics-model:staging
            
            # Deploy with docker-compose
            log "Deploying staging environment..."
            TAG=staging-$TIMESTAMP docker-compose -f docker-compose.staging.yml up -d
            ;;
        *)
            log "Invalid environment: $DEPLOY_ENV"
            exit 1
            ;;
    esac

    # Run database migrations
    log "Running database migrations..."
    ./scripts/run-migrations.sh "$DEPLOY_ENV" || exit 1

    # Download model weights if not present
    log "Checking model weights..."
    ./scripts/download-model-weights.sh "$DEPLOY_ENV" || log "Warning: Model weights may be outdated"

    # Verify deployment
    log "Verifying deployment..."
    ./scripts/verify-deployment.sh "$DEPLOY_ENV" || exit 1

    # Cache warmup
    log "Warming up cache..."
    ./scripts/cache-warmup.sh "$DEPLOY_ENV" || log "Warning: Cache warmup incomplete"

    # Health check
    log "Running health checks..."
    ./scripts/health-check.sh "$DEPLOY_ENV" || exit 1

    # Cleanup
    log "Performing cleanup..."
    ./scripts/cleanup.sh "$DEPLOY_ENV" || log "Warning: Cleanup incomplete"

    log "Deployment completed successfully"
    ./scripts/notify-team.sh "Deployment to $DEPLOY_ENV completed successfully"
}

# Execute main function
main 

# Set environment variables
export NODE_ENV=production
export PORT=3000
export DB_DRIVER=pgsql
export DB_HOST=postgres
export DB_PORT=5432
export DB_NAME=baseball_analytics
export DB_USER=baseball_user
export DB_PASSWORD=strong_password_here
export REDIS_HOST=redis
export REDIS_PORT=6379
export REDIS_PASSWORD=strong_redis_password_here
export JWT_SECRET=your_jwt_secret_here
export JWT_EXPIRATION=24h
export PROMETHEUS_ENABLED=true
export GRAFANA_PASSWORD=strong_grafana_password_here
export BACKUP_ENABLED=true
export AWS_ACCESS_KEY_ID=your_aws_access_key
export AWS_SECRET_ACCESS_KEY=your_aws_secret_key
export BACKUP_S3_BUCKET=baseball-analytics-backups-prod
export LOG_LEVEL=info
export LOG_FORMAT=json
export MODEL_ENABLED=true
export MODEL_VERSION=1.0.0

# Build and start containers
echo "Starting services..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Check service health
echo "Checking service health..."
docker-compose -f docker-compose.prod.yml ps

# Show logs
echo "Recent logs:"
docker-compose -f docker-compose.prod.yml logs --tail=100 
