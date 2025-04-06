
#!/bin/bash

# Script to download model weights if not present

set -e  # Exit on any error
set -u  # Error on undefined variables

DEPLOY_ENV=$1

# Source environment variables
source ./scripts/load-env.sh

# Configuration
MODEL_WEIGHTS_DIR="./model/weights"
MODEL_WEIGHTS_S3_BUCKET=${MODEL_WEIGHTS_S3_BUCKET:-"baseball-analytics-models"}
MODEL_VERSION=${MODEL_VERSION:-"1.0.0"}

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Create weights directory if it doesn't exist
mkdir -p "$MODEL_WEIGHTS_DIR"

# Check if weights already exist
if [ -f "$MODEL_WEIGHTS_DIR/model-${MODEL_VERSION}.h5" ]; then
    log "Model weights already exist for version ${MODEL_VERSION}"
    exit 0
fi

log "Downloading model weights for version ${MODEL_VERSION}"

# Check for aws-cli
if ! command -v aws &> /dev/null; then
    log "aws-cli not found. Installing..."
    pip install awscli
fi

# Determine bucket path based on environment
BUCKET_PATH="${DEPLOY_ENV}/models/${MODEL_VERSION}"

# Download weights from S3
log "Downloading from s3://${MODEL_WEIGHTS_S3_BUCKET}/${BUCKET_PATH}/"
if aws s3 cp "s3://${MODEL_WEIGHTS_S3_BUCKET}/${BUCKET_PATH}/model.h5" "${MODEL_WEIGHTS_DIR}/model-${MODEL_VERSION}.h5"; then
    log "Successfully downloaded model weights"
    
    # Verify download
    if [ -f "${MODEL_WEIGHTS_DIR}/model-${MODEL_VERSION}.h5" ]; then
        SIZE=$(du -h "${MODEL_WEIGHTS_DIR}/model-${MODEL_VERSION}.h5" | cut -f1)
        log "Downloaded model size: ${SIZE}"
        exit 0
    else
        log "ERROR: Downloaded file not found"
        exit 1
    fi
else
    log "ERROR: Failed to download model weights"
    
    # Fallback to default model if available
    if [ -f "${MODEL_WEIGHTS_DIR}/model-default.h5" ]; then
        log "Using default model weights"
        cp "${MODEL_WEIGHTS_DIR}/model-default.h5" "${MODEL_WEIGHTS_DIR}/model-${MODEL_VERSION}.h5"
        exit 0
    fi
    
    exit 1
fi
