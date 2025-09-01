from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import JWT_SECRET_KEY, JWT_ACCESS_TOKEN_EXPIRES, JWT_REFRESH_TOKEN_EXPIRES

blacklisted_tokens = set()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Importa e registra blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.dashboard_routes import dashboard_bp
    from app.routes.recurso_routes import resource_bp

    app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = JWT_ACCESS_TOKEN_EXPIRES
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = JWT_REFRESH_TOKEN_EXPIRES

    jwt = JWTManager(app)

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        return jwt_payload['jti'] in blacklisted_tokens
    
    @jwt.expired_token_loader
    def expired_token_loader(jwt_header, jwt_payload):
        return {
            'message': 'token expirado',
            'error': 'token_expired'
        }, 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {
            'message': 'Token invalido',
            'error': 'invalid_token'
        }, 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return {
            'message': 'Token de acesso necessario',
            'error': 'authorization_required'
        }, 401

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(resource_bp, url_prefix="/api/recurso")

    return app