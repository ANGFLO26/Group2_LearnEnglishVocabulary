from flask import Flask
from flask_cors import CORS
from flask_session import Session
from backend.api.auth import auth_bp
from backend.api.learning import learning_bp
import os

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for all routes with credentials support
    CORS(app, supports_credentials=True, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],  # Add your frontend URL
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    # Configure session
    app.secret_key = os.getenv('FLASK_SECRET_KEY', 'your-secret-key-here')
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['PERMANENT_SESSION_LIFETIME'] = 1800  # 30 minutes
    app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_NAME'] = 'vocabulary_session'
    app.config['SESSION_COOKIE_DOMAIN'] = None  # Allow all domains in development
    
    # Initialize Flask-Session
    Session(app)
    
    # URL handling
    app.url_map.strict_slashes = False  # Allow URLs with or without trailing slash
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(learning_bp, url_prefix='/api/learning')
    
    return app 

# This file makes the directory a Python package 