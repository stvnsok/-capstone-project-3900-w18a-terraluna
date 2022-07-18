from app import jwt, logger
from error import *
from flask import Blueprint, jsonify, request
from flask_jwt_extended.utils import get_jwt_identity
from flask_jwt_extended.view_decorators import jwt_required
from terraluna.recipe.models import Recipe

from .error import *
from .recipe_contributors_views import *
from .utils import *

recipe_contributors_bp = Blueprint("recipe_contributors_bp", __name__)
"""Blueprint: A Blueprint for all recipe_contributors routes."""

@recipe_contributors_bp.route("/recipe/new", methods=["POST"])
@jwt_required(fresh=True)
def new_recipe():
    """Add a new recipe"""

    # Get dict of input from front end 
    data = request.get_json()

    # Check for Malformed Requests
    if not data:
        raise Error400

    name = data.get("name")
    recipe_photo = data.get("recipePhoto_url")
    recipe_video = data.get("recipeVideo_url")
    description = data.get("description")
    meal_type = data.get("mealType")
    diet_type = data.get("dietType")
    recipe_instructions = data.get("recipeInstructions")
    timer_duration = data.get("timerDuration")
    timer_units = data.get("timerUnits")
    required_ingredients = data.get("requiredIngredients")

    # Check for Well-formed Requests that cannot be processed
    if not verify_recipe_name(name):
        raise InvalidRecipeNameFormatError
    else:
        name = name.strip()

    recipe_contributor = username_to_user_id(get_jwt_identity())
    
    recipe = Recipe.create(name=name, recipe_contributor=recipe_contributor, published=False,
            recipe_photo=recipe_photo, recipe_video=recipe_video, description=description,
            meal_type=meal_type, diet_type=diet_type, recipe_instructions=recipe_instructions, 
            timer_duration=timer_duration, timer_units=timer_units, required_ingredients=required_ingredients)
    
    return recipe.id


@recipe_contributors_bp.route("/recipes", methods=["GET"])
@jwt_required(fresh=True)
def list_recipes():
    """Return a list of all recipes"""
    recipe_contributor = username_to_user_id(get_jwt_identity())

    pass

@recipe_contributors_bp.route("/recipe/<int:recipe_id>", methods=["GET"])
@jwt_required(fresh=True)
def view_recipe():
    
    recipe_contributor = username_to_user_id(get_jwt_identity())
    
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




