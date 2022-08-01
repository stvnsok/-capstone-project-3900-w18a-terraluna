import json
import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended.jwt_manager import JWTManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from werkzeug.exceptions import HTTPException
from werkzeug.local import LocalProxy

load_dotenv()  # Load ".env" file into environment variables

app = Flask(__name__)
app.config.from_object(os.getenv("FLASK_CONFIG", "config.DevelopmentConfig"))
CORS(app)  # Enable CORS for all domains on all routes

db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
logger = LocalProxy(lambda: app.logger)
CORS(app)


@app.errorhandler(HTTPException)
def handle_exception(e):
    """Return JSON instead of HTML for HTTP errors."""
    logger.error(e)  # type: ignore

    # Start with the correct headers and status code from the error
    response = e.get_response()

    # Replace HTML body with JSON
    response.data = json.dumps(
        {
            "code": e.code,
            "name": e.name,
            "description": e.description,
        }
    )

    response.content_type = "application/json"
    return response


from terraluna.auth.views import auth_bp
from terraluna.recipe.recipe_contributors_views import recipe_contributors_bp
from terraluna.explorers.views import recipe_explorers_bp

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(recipe_contributors_bp, url_prefix="/recipe_contributors")
app.register_blueprint(recipe_explorers_bp, url_prefix="/recipe_explorers")

