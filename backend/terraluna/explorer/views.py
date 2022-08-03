import json

from flask import Blueprint, jsonify, request
from flask_jwt_extended.utils import get_jwt_identity
from flask_jwt_extended.view_decorators import jwt_required

from terraluna.auth.utils import *
from terraluna.recipe.models import *
from terraluna.recipe.utils import *
from utils import *

from .error import *
from .models import *
from .utils import *

explorer_bp = Blueprint("explorer_bp", __name__)
"""Blueprint: A Blueprint for all recipe explorer routes."""


@explorer_bp.route("/recipes", methods=["GET"])
@jwt_required()
def get_ready_recipes():
    """Get list of published recipes that can be made based on the given list on ingredients.

    Optional filters can be applied to the search results. Can filter by a maximum cooking
    time, meal types and diet types.

    Returned recipes match *any* given meal type and match *all* given diet types.
    """
    data = request.args
    (pantry_ingredients, meal_types, diet_types, cook_time) = get_data(
        data, "ingredients", "mealType", "dietType", "cookTime"
    )
    pantry_ingredients = json.loads(pantry_ingredients)["ingredients"]
    pantry_ingredients = [int(id) for id in pantry_ingredients]
    meal_types = json.loads(meal_types)["mealType"]
    diet_types = json.loads(diet_types)["dietType"]
    cook_time = int(cook_time) if cook_time else None
    cook_time = cook_time if cook_time != -1 else None  # -1 => 3 hours+ => no filter

    ready_recipes = []
    for recipe in Recipe.query.all():
        # Check recipe is published
        if recipe.status != "Published":
            continue

        # Check if recipe takes too long to make
        if cook_time and recipe.expected_duration_mins > cook_time:
            continue

        # Check if recipe has any correct meal type
        if meal_types and not any(
            meal_type in recipe.meal_types for meal_type in meal_types
        ):
            continue

        # Check if recipe has all correct diet types
        if diet_types and not all(
            diet_type in recipe.diet_types for diet_type in diet_types
        ):
            continue

        # Check recipe's necessary ingredients
        necessary_ingredients = [
            ingredient.ingredient_id for ingredient in recipe.ingredients
        ]

        # Check recipe's necessary ingredients that are not in pantry
        absent_necessary_ingredients = [
            ingredient
            for ingredient in necessary_ingredients
            if ingredient not in pantry_ingredients
        ]

        # If there are no missing necessary ingredients, we can make this recipe
        if not absent_necessary_ingredients:
            ready_recipes.append(recipe)

    return jsonify(recipes=[recipe.jsonify() for recipe in ready_recipes])


# @explorer_bp.route("/ingredient_categories", methods=["GET"])
# def ingredient_categories():
#     """Return a list of all ingredients in categories"""

#     result = []
#     category_names = db.session.query(IngredientCategory.name).distinct()
#     for category_name in category_names:
#         ingredients = []
#         query = (
#             db.session.query(IngredientCategory, Ingredient)
#             .filter(IngredientCategory.ingredient_id == Ingredient.id)
#             .filter(IngredientCategory.name == category_name)
#         )
#         for row in query:
#             ingredients.append(
#                 {"ingredient_id": row.Ingredient.id, "name": row.Ingredient.name}
#             )
#         result.append({"name": category_name, "ingredients": ingredients})

#     return jsonify(ingredientCategories=result)


@explorer_bp.route("/pantry", methods=["GET", "POST"])
@jwt_required()
def pantry():
    """Get or update a user's saved pantry.

    GET: Return ingredients from the user's saved pantry.
    POST: Given a list of ingredients, updates ingredients in user's pantry.
    """
    user_id = get_jwt_identity()

    # GET: Return ingredients from the user's saved pantry.
    if request.method == "GET":
        ingredients = [
            Ingredient.query.filter_by(id=ingredient.ingredient_id).first()
            for ingredient in UserPantry.query.filter_by(user_id=user_id).all()
        ]
        return jsonify(
            ingredients=[
                {"id": ingredient.id, "name": ingredient.name}
                for ingredient in ingredients
            ]
        )

    # POST: Given a list of ingredients, updates ingredients in user's pantry.
    elif request.method == "POST":
        data = request.get_json()
        (ingredients,) = get_data(data, "ingredients")

        # Clear pantry
        UserPantry.query.filter_by(user_id=user_id).delete()
        db.session.commit()

        # Add new ingredients
        for ingredient_id in ingredients:
            db.session.add(UserPantry(user_id=user_id, ingredient_id=ingredient_id))
        db.session.commit()
        return "", 204


@explorer_bp.route("/recipes/<int:id>/review", methods=["POST"])
@jwt_required()
def add_recipe_review(id):
    """Add a comment/review to a recipe."""
    data = request.get_json()
    message, stars = get_data(data, "review", "stars")

    user_id = get_jwt_identity()
    comment = Comment.create(
        recipe_id=id, user_id=user_id, stars=stars, message=message
    )
    return jsonify(comment_id=comment.id)


@explorer_bp.route("/recipes/favourite", methods=["GET"])
@jwt_required()
def get_recipe_favourites():
    """Return a list of all recipes saved by the user."""
    user_id = get_jwt_identity()

    saved_recipes = [
        Recipe.query.filter_by(id=saved_recipe.recipe_id).first()
        for saved_recipe in UserSavedRecipes.query.filter_by(user_id=user_id).all()
    ]
    return jsonify(recipes=[recipe.jsonify() for recipe in saved_recipes])


@explorer_bp.route("/recipes/<int:id>/favourite", methods=["PUT", "DELETE"])
@jwt_required()
def update_recipe_favourites(id):
    """Update a user's favourited recipes.

    PUT: Add recipe to user's favourited recipes.
    DELETE: Remove recipe from user's favourited recipes.
    """
    user_id = get_jwt_identity()

    # PUT: Add recipe to user's favourited recipes.
    if request.method == "PUT":
        if (
            UserSavedRecipes.query.filter_by(user_id=user_id, recipe_id=id).first()
            is None
        ):
            db.session.add(UserSavedRecipes(user_id=user_id, recipe_id=id))
            db.session.commit()
        return "", 204

    # DELETE: Remove recipe from user's favourited recipes.
    elif request.method == "DELETE":
        UserSavedRecipes.query.filter_by(user_id=user_id, recipe_id=id).delete()
        db.session.commit()
        return "", 204
