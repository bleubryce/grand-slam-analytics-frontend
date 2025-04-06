
import os
import json
import time
import logging
from logging.handlers import RotatingFileHandler
from flask import Flask, request, jsonify
from flask_cors import CORS
import redis
import jwt
from functools import wraps

# Configure logging
log_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
log_handler = RotatingFileHandler('model_api.log', maxBytes=10485760, backupCount=10)
log_handler.setFormatter(log_formatter)

logger = logging.getLogger('model_api')
logger.setLevel(logging.getLevelName(os.getenv('LOG_LEVEL', 'INFO')))
logger.addHandler(log_handler)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
PORT = int(os.getenv('PORT', 5000))
JWT_SECRET = os.getenv('JWT_SECRET', 'default_jwt_secret')
API_TOKEN_REQUIRED = os.getenv('API_TOKEN_REQUIRED', 'true').lower() == 'true'
MODEL_VERSION = os.getenv('MODEL_VERSION', '1.0.0')
WEIGHTS_PATH = os.getenv('MODEL_WEIGHTS_PATH', '/data/weights')
CACHE_ENABLED = os.getenv('CACHE_ENABLED', 'true').lower() == 'true'
CACHE_TTL = int(os.getenv('CACHE_TTL', 3600))

# Redis connection for caching
redis_url = os.getenv('REDIS_URL')
redis_client = None
if CACHE_ENABLED and redis_url:
    try:
        redis_client = redis.from_url(redis_url)
        redis_client.ping()
        logger.info(f"Connected to Redis at {redis_url}")
    except Exception as e:
        logger.error(f"Redis connection error: {e}")
        redis_client = None

# Authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not API_TOKEN_REQUIRED:
            return f(*args, **kwargs)
            
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header:
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
            
        try:
            jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        except Exception as e:
            logger.error(f"Token validation error: {e}")
            return jsonify({'message': 'Token is invalid'}), 401
            
        return f(*args, **kwargs)
    return decorated

# Load model 
def load_model():
    logger.info(f"Loading model version {MODEL_VERSION} from {WEIGHTS_PATH}")
    # This is a placeholder for actual model loading
    # In a real app, you would load your ML model here
    time.sleep(1)  # Simulate loading
    return {
        "name": "baseball-analytics-model",
        "version": MODEL_VERSION,
        "loaded": True
    }

model = load_model()
logger.info(f"Model loaded: {model}")

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model': {
            'version': MODEL_VERSION,
            'loaded': True
        },
        'timestamp': time.time()
    })

# Detailed health check endpoint
@app.route('/health/detailed', methods=['GET'])
def detailed_health_check():
    # Get system stats
    import psutil
    cpu_percent = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage('/')
    
    return jsonify({
        'status': 'healthy',
        'model': {
            'version': MODEL_VERSION,
            'loaded': True,
            'weights_path': WEIGHTS_PATH
        },
        'system': {
            'cpu_percent': cpu_percent,
            'memory_percent': memory.percent,
            'memory_available_mb': memory.available / (1024 * 1024),
            'disk_percent': disk.percent,
            'disk_free_gb': disk.free / (1024 * 1024 * 1024)
        },
        'cache': {
            'enabled': CACHE_ENABLED,
            'connected': redis_client is not None if CACHE_ENABLED else False,
            'ttl': CACHE_TTL
        },
        'timestamp': time.time()
    })

# Model information endpoint
@app.route('/models/<model_type>/info', methods=['GET'])
@token_required
def model_info(model_type):
    return jsonify({
        'name': f"baseball-analytics-{model_type}-model",
        'version': MODEL_VERSION,
        'description': f"Baseball Analytics {model_type.upper()} model for predictions",
        'features': ['team_performance', 'player_stats', 'game_predictions'],
        'metrics': {
            'accuracy': 0.92,
            'precision': 0.89,
            'recall': 0.91
        },
        'timestamp': time.time()
    })

# Model metrics endpoint
@app.route('/models/<model_type>/metrics', methods=['GET'])
@token_required
def model_metrics(model_type):
    return jsonify({
        'model_version': MODEL_VERSION,
        'training_data': {
            'start_date': '2015-01-01',
            'end_date': '2024-12-31',
            'samples': 150000
        },
        'performance': {
            'accuracy': 0.92,
            'precision': 0.89,
            'recall': 0.91,
            'f1_score': 0.90
        },
        'inference_time': {
            'average_ms': 45.3,
            'p95_ms': 87.2,
            'p99_ms': 112.8
        },
        'last_evaluation': '2025-01-15T00:00:00Z',
        'timestamp': time.time()
    })

# Model prediction endpoint
@app.route('/models/<model_type>/predict', methods=['POST'])
@token_required
def predict(model_type):
    start_time = time.time()
    
    # Get input data
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No input data provided'}), 400
    
    # Check if result is in cache
    cache_key = None
    if CACHE_ENABLED and redis_client:
        cache_key = f"model:{model_type}:predict:{hash(json.dumps(data, sort_keys=True))}"
        cached_result = redis_client.get(cache_key)
        if cached_result:
            logger.info(f"Cache hit for {cache_key}")
            return jsonify(json.loads(cached_result))
    
    # This would be replaced with your actual prediction logic
    logger.info(f"Running prediction for {model_type} model with data: {data}")
    
    # Simulate prediction - replace with your actual model prediction
    if model_type == 'team':
        result = {
            'team_id': data.get('team_id', 0),
            'win_probability': 0.65,
            'run_expectancy': 4.2,
            'projected_stats': {
                'batting_avg': 0.275,
                'on_base_pct': 0.350,
                'slugging_pct': 0.450
            }
        }
    elif model_type == 'player':
        result = {
            'player_id': data.get('player_id', 0),
            'projection': {
                'batting_avg': 0.302,
                'home_runs': 28,
                'rbis': 95,
                'war': 4.5
            },
            'comparable_players': [
                {'id': 123, 'name': 'Player A', 'similarity': 0.92},
                {'id': 456, 'name': 'Player B', 'similarity': 0.87}
            ]
        }
    elif model_type == 'game':
        result = {
            'game_id': data.get('game_id', 0),
            'home_win_probability': 0.58,
            'predicted_score': {
                'home': 5,
                'away': 3
            },
            'key_factors': [
                {'factor': 'home_field_advantage', 'impact': 0.12},
                {'factor': 'pitcher_matchup', 'impact': 0.23},
                {'factor': 'recent_performance', 'impact': 0.18}
            ]
        }
    else:
        result = {
            'predictions': [
                {'category': 'win_pct', 'value': 0.602},
                {'category': 'playoffs_pct', 'value': 0.78},
                {'category': 'championship_pct', 'value': 0.15}
            ]
        }
    
    # Add metadata to result
    prediction_time = time.time() - start_time
    result['metadata'] = {
        'model_version': MODEL_VERSION,
        'prediction_time': prediction_time,
        'timestamp': time.time()
    }
    
    # Cache result
    if CACHE_ENABLED and redis_client and cache_key:
        try:
            redis_client.setex(cache_key, CACHE_TTL, json.dumps(result))
            logger.debug(f"Cached result for {cache_key}")
        except Exception as e:
            logger.error(f"Failed to cache result: {e}")
    
    return jsonify(result)

# Training endpoint - placeholder
@app.route('/models/<model_type>/train', methods=['POST'])
@token_required
def train(model_type):
    return jsonify({
        'status': 'training_started',
        'model_type': model_type,
        'job_id': 'train_' + str(int(time.time())),
        'estimated_completion': time.time() + 3600,
        'message': 'Training job has been queued'
    })

if __name__ == '__main__':
    logger.info(f"Starting model API server on port {PORT}")
    app.run(host='0.0.0.0', port=PORT)
