import json

from flask import Blueprint, jsonify, request
from flask.wrappers import Response
from flask_jwt_extended.utils import get_jwt_identity
from flask_jwt_extended.view_decorators import jwt_required

from terraluna.explorer.error import *
from terraluna.explorer.models import *
from terraluna.explorer.utils import *
from terraluna.recipe.models import Ingredient, Recipe
from terraluna.recipe.utils import username_to_user_id
from utils import get_data

explorer_bp = Blueprint("explorer_bp", __name__)
"""Blueprint: A Blueprint for all recipe explorer routes."""


@explorer_bp.route("/recipes", methods=["GET"])
@jwt_required()
def get_ready_recipes():
    """Get list of published recipes that can be made based on the given list on ingredients."""
    data = request.args
    (pantry_ingredients,) = get_data(data, "ingredients")
    pantry_ingredients = json.loads(pantry_ingredients)["ingredients"]
    pantry_ingredients = [int(id) for id in pantry_ingredients]

    ready_recipes = []
    for recipe in Recipe.query.all():
        if recipe.status != "Published":
            continue

        necessary_ingredients = [
            ingredient.ingredient_id for ingredient in recipe.ingredients
        ]

        absent_necessary_ingredients = [
            ingredient
            for ingredient in necessary_ingredients
            if ingredient not in pantry_ingredients
        ]

        if not absent_necessary_ingredients:
            ready_recipes.append(recipe)

    return jsonify(recipes=[recipe.jsonify() for recipe in ready_recipes])


###############################################################################


@explorer_bp.route("/ingredient_categories", methods=["GET"])
def ingredient_categories():
    """Return a list of all ingredients in categories"""

    result = []
    category_names = db.session.query(IngredientCategory.name).distinct()
    for category_name in category_names:
        ingredients = []
        query = (
            db.session.query(IngredientCategory, Ingredient)
            .filter(IngredientCategory.ingredient_id == Ingredient.id)
            .filter(IngredientCategory.name == category_name)
        )
        for row in query:
            ingredients.append(
                {"ingredient_id": row.Ingredient.id, "name": row.Ingredient.name}
            )
        result.append({"name": category_name, "ingredients": ingredients})

    return jsonify(ingredientCategories=result)


@explorer_bp.route("/pantry", methods=["GET", "PUT"])
@jwt_required(fresh=True)
def pantry():
    """
    GET: return ingredients from the user's saved pantry
    PUT: given a list of ingredients, updates ingredients in user's pantry
    """

    # Retrieve current user from token
    user_id = username_to_user_id(get_jwt_identity())

    # GET: Return list of all ingredients in the user's pantry
    if request.method == "GET":
        pantry = []
        query = (
            db.session.query(UserPantry, Ingredient)
            .filter_by(UserPantry.ingredient_id == Ingredient.id)
            .filter_by(UserPantry.user_id == user_id)
        )
        for row in query:
            pantry.append({"id": row.Ingredient.id, "name": row.Ingredient.name})
        return jsonify(pantry=pantry)

    # PUT: Given a list of ingredient_id, updates the UserPantry Table
    elif request.method == "PUT":

        data = request.get_json()
        (ingredients,) = get_data(data, "ingredients")

        # Clear pantry
        UserPantry.query.filter_by(user_id=user_id).delete()

        # Add new ingredients
        for ingredient_id in ingredients:
            db.session.add(UserPantry(user_id, ingredient_id))
        db.commit()


@explorer_bp.route("/search", methods=["GET"])
def search():
    ##################################################
    ##################################################
    ##################################################
    # TODO:
    pass


@explorer_bp.route("/recipe/<int:id>", methods=["GET"])
def recipe_view(id):
    """Return details of the recipe"""

    # Check that recipe_id exists and is published and get the Recipe object
    recipe = id_to_valid_recipe(id)

    ########################
    # TODO: Change this to fit new recipe model
    # You can copy directly from "/my_recipes/{id}" GET route and add 'comments' key
    ########################
    response = {
        "name": recipe.name,
        "recipePhoto_url": recipe.photo_url,
        "recipeVideo_url": recipe.video_url,
        "description": recipe.description,
        "mealType": recipe.meal_type,
        "dietType": recipe.diet_type,
        "recipeInstructions": recipe.instructions,
        "expectedDuration": recipe.expectedDuration,
        "required_ingredients": {},  # dict_required_ingredients(id),
        "comments": dict_recipe_comments(id),
    }

    logger.debug("Recipe details returned: %s", recipe)  # type: ignore
    return Response(json.dumps(response), mimetype="application/json")


@explorer_bp.route("/recipe/<int:id>/comment", methods=["POST"])
@jwt_required(fresh=True)
def recipe_comment(id):
    """Comment on the recipe"""

    data = request.get_json()
    (message,) = get_data(data, "message")

    # Retrieve current user from token
    user_id = username_to_user_id(get_jwt_identity())

    # Check that the message is not empty
    if message == None or message.strip() == "":
        raise InvalidComment

    # Create a comment entry in the database
    comment = Comment.create(recipe_id=id, user_id=user_id, message=message)
    ####################################
    # NEED TO CHANGE TO ADD STARS TO CREATIONS FUNCTION

    return jsonify(comment_id=comment.id)


@explorer_bp.route("/recipes/favourite", methods=["GET"])
@jwt_required(fresh=True)
def list_savedRecipes():
    """Return a list of all recipes saved by the user"""

    # Retrieve current user from token
    user_id = username_to_user_id(get_jwt_identity())

    recipes = []
    query = (
        db.session.query(UserSavedRecipes, Recipe)
        .filter_by(UserSavedRecipes.recipe_id == Recipe.id)
        .filter_by(UserSavedRecipes.user_id == user_id)
    )
    for row in query:
        recipe = Recipe.query.filter_by(id=row.recipe_id).one()
        recipes.append(
            {
                ######################################## NEED TO CHANGE
                "id": recipe.id,
                "name": recipe.name,
                "recipePhoto_url": recipe.recipe_photo,
                "status": recipe.status,
                "description": recipe.description,
            }
        )

    return jsonify


@explorer_bp.route("/recipes/<int:id>/favourite", methods=["PUT", "DELETE"])
@jwt_required()
def update_recipe_favourites(id):
    """Update a user's favourited recipes.

    PUT: Add recipe to user's favourited recipes.
    DELETE: Remove recipe from user's favourited recipes.
    """

    # Check that recipe_id exists and is published and get the Recipe object
    recipe = id_to_valid_recipe(id)

    # Retrieve current user from token
    user_id = username_to_user_id(get_jwt_identity())

    # PUT: add recipe to user's saved recipes
    if request.method == "PUT":
        # If the user has not the recipe is not saved, save the recipe
        if (
            UserSavedRecipes.query.filter_by(user_id=user_id)
            .filter_by(recipe_id=id)
            .first()
            is None
        ):
            db.session.add(UserSavedRecipes(user_id=user_id, recipe_id=id))
            db.session.commit()

        return "", 204

    # DELETE: remove recipe from user's saved recipes
    elif request.method == "DELETE":
        # DELETE FROM SAVED RECIPES TABLE
        pass
        if (
            UserSavedRecipes.query.filter_by(user_id=user_id)
            .filter_by(recipe_id=id)
            .delete()
        ):
            logger.debug("Recipe " + id + " unsaved")  # type: ignore
        else:
            logger.debug("Recipe " + id + " not in saved recipes")  # type: ignore
        db.commit()

        return "", 204
