from app import jwt, logger
from error import *
from flask import Blueprint, jsonify, request
from flask_jwt_extended.utils import get_jwt_identity
from flask_jwt_extended.view_decorators import jwt_required

from .error import *
from .models import *
from .utils import *

recipe_contributors_bp = Blueprint("recipe_contributors_bp", __name__)
"""Blueprint: A Blueprint for all recipe_contributors routes."""

@recipe_contributors_bp.route("/recipe/new", methods=["POST"])
@jwt_required(fresh=True)
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

@recipe_contributors_bp.route("/recipes", methods=["GET"])
@jwt_required(fresh=True)
def list_recipes(recipe_id):
    pass

@recipe_contributors_bp.route("/recipe/<int:recipe_id>/update", methods=["PUT"])
@jwt_required(fresh=True)
def update_recipe(recipe_id):
    pass

@recipe_contributors_bp.route("/recipe/<int:recipe_id>/delete", methods=["DELETE"])
@jwt_required(fresh=True)
def delete_recipe(recipe_id):
    pass

@recipe_contributors_bp.route("/recipe/<int:recipe_id>/copy", methods=["POST"])
@jwt_required(fresh=True)
def copy_recipe(recipe_id):
    pass

@recipe_contributors_bp.route("/recipe/<int:recipe_id>/publish", methods=["PUT"])
@jwt_required(fresh=True)
def publish_recipe(recipe_id):
    pass









@recipe_contributors_bp.route("/no_match_frequency", methods=["GET"])
@jwt_required(fresh=True)
def no_match_frequency():
    pass




