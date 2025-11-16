from flask import Flask
from config.database import Base, engine
from controllers.usuarios_controller import usuarios_bp, register_jwt_error_handlers
from controllers.peliculas_controller import peliculas_bp
try:
    from controllers.auth_controller import auth_bp
except ImportError:
    auth_bp = None

from config.jwt import *
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Crear tablas si no existen
Base.metadata.create_all(bind=engine)

app = Flask(__name__)
# Configurar JWT
app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY
app.config['JWT_TOKEN_LOCATION'] = JWT_TOKEN_LOCATION
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = JWT_ACCESS_TOKEN_EXPIRES
app.config['JWT_HEADER_NAME'] = JWT_HEADER_NAME
app.config['JWT_HEADER_TYPE'] = JWT_HEADER_TYPE

jwt = JWTManager(app)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}}, allow_headers=["Authorization", "Content-Type"])

# Registrar blueprints
app.register_blueprint(usuarios_bp)
app.register_blueprint(peliculas_bp)
if auth_bp:
    app.register_blueprint(auth_bp)

# Registrar manejadores de error JWT
register_jwt_error_handlers(app)

if __name__ == "__main__":
    app.run(debug=True)
