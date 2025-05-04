from flask import Blueprint, request, jsonify, session, make_response
from functools import wraps
from backend.business_layer.services.user_service import UserService
from backend.dao.users.user_dao import UserDAO
from backend.utils.validation import validate_required_fields
from backend.utils.exceptions import ValidationError, AuthenticationError, DatabaseError
from backend.utils.logger import setup_logger
from backend.database.database import get_db

logger = setup_logger(__name__)
user_service = UserService(UserDAO())

auth_bp = Blueprint('auth', __name__)

def login_required(f):
    """Decorator to check if user is logged in"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            raise AuthenticationError('Authentication required')
        return f(*args, **kwargs)
    return decorated_function

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        # Get and validate request data
        data = request.get_json()
        if not data:
            raise ValidationError('No data provided')
            
        # Validate required fields
        required_fields = ['username', 'email', 'password']
        errors = validate_required_fields(data, required_fields)
        if errors:
            raise ValidationError(errors[0])
            
        # Register user
        user = user_service.register(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        
        if not user:
            raise ValidationError('Username or email already exists')
            
        logger.info(f"User registered successfully: {data['username']}")
        return jsonify(user.to_dict()), 201
        
    except ValidationError as e:
        logger.warning(f"Registration validation failed: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Registration failed: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        # Get and validate request data
        data = request.get_json()
        if not data:
            raise ValidationError('No data provided')
            
        # Validate required fields
        required_fields = ['username', 'password']
        errors = validate_required_fields(data, required_fields)
        if errors:
            raise ValidationError(errors[0])
            
        # Login user
        result = user_service.login(
            username=data['username'],
            password=data['password']
        )
        
        if not result:
            raise AuthenticationError('Invalid username or password')
            
        # Set session data
        user = result['user']
        session['user_id'] = user['id']
        session['username'] = user['username']
        
        logger.info(f"User logged in successfully: {data['username']}")
        response = make_response(jsonify(result), 200)
        return response
        
    except ValidationError as e:
        logger.warning(f"Login validation failed: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except AuthenticationError as e:
        logger.warning(f"Login authentication failed: {str(e)}")
        return jsonify({'error': str(e)}), 401
    except Exception as e:
        logger.error(f"Login failed: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout user"""
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200

@auth_bp.route('/debug/db', methods=['GET'])
def debug_db():
    """Debug endpoint to check database connection"""
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT COUNT(*) FROM users")
        count = cursor.fetchone()[0]
        cursor.execute("SELECT id, username, email FROM users LIMIT 1")
        user = cursor.fetchone()
        return jsonify({
            'status': 'success',
            'user_count': count,
            'sample_user': {
                'id': user[0],
                'username': user[1],
                'email': user[2]
            } if user else None
        })
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500 