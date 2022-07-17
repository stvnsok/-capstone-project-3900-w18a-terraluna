from app import jwt, logger
from error import *
from flask import Blueprint, jsonify, request
from flask_jwt_extended.utils import (create_access_token,
                                      create_refresh_token, get_jwt,
                                      get_jwt_identity)
from flask_jwt_extended.view_decorators import jwt_required

from .error import *
from .models import *
from .utils import *

auth_bp = Blueprint("recipe_bp", __name__)
"""Blueprint: A Blueprint for all recipe routes."""

def new_recipe():
    """Add a new recipe
    
    """
    data = request.get_json()

    # Check for Malformed Requests
    if not data:
        raise Error400

    ingredients_text = data.get("ingredients")
    method = data.get("method")

    ingredient_ids= parse_ingredients(ingredients_text)

    recipe = Recipe.create(ingredients_text, method)
    """Also add relations table"""



def search_recipes():
    """Search for matching recipes given a list of ingredients
    modified by filters

    Modifies most searched ingredients/combinations (TODO)
    """
    data = request.get_json()

    # Check for Malformed Requests
    if not data:
        raise Error400

    ingredients = data.get("ingredients")
    filters = data.get("email")

    if not username or not email or not password:
        raise Error400

    # Check for Well-formed Requests that cannot be processed
    if not verify_username(username):
        raise InvalidUsernameFormatError

    if not verify_email(email):
        raise InvalidEmailFormatError

    if not verify_password(password):
        raise WeakPasswordError

    # Check if username or email is taken
    if User.query.filter_by(username=username).first():
        raise UsernameInUseError

    if User.query.filter_by(email=email).first():
        raise EmailInUseError

    # Create User model and add it to DB
    user = User.create(username, email, password)

    # Return JWT Access & Refresh Token
    access_token = create_access_token(identity=user.username, fresh=True)
    refresh_token = create_refresh_token(identity=user.username)
    logger.debug("Registered user: %s", user)  # type: ignore
    return jsonify(access_token=access_token, refresh_token=refresh_token, username=user.username), 201
