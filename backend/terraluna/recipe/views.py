import json
import os

from flask import Blueprint, jsonify, request, send_file
from flask_jwt_extended.utils import get_jwt_identity
from flask_jwt_extended.view_decorators import jwt_required
from werkzeug.utils import secure_filename

from app import app, db, logger
from error import *
from utils import *

from .error import *
from .models import *
from .utils import *

recipe_bp = Blueprint("recipe_bp", __name__)
"""Blueprint: A Blueprint for all recipe and ingredient routes."""


@recipe_bp.route("/uploads", methods=["GET"])
@jwt_required()
def get_upload():
    data = request.args
    (name,) = get_data(data, "name")
    return send_file(name)


@recipe_bp.route("/ingredients", methods=["GET"])
# @jwt_required()
def ingredients():
    """Return a list of suggested ingredients based on a search query.

    Up to 10 ingredients are returned that contain the search query as a
    substring. Whitespace is ignored.

    Ingredients are returned in descending order of most frequently used
    in a recipe.

    The empty search query returns the most frequently used ingredients,
    up to 10 in descending order.
    """
    data = request.args
    (query,) = get_data(data, "query")

    ingredient_counts = get_ingredient_counts(ingredient_search(query))
    return jsonify(
        ingredients=[
            {"id": ingredient.id, "name": ingredient.name}
            for ingredient in sorted(
                ingredient_counts, key=ingredient_counts.get, reverse=True  # type: ignore
            )
        ][: app.config["SEARCH_RESULT_COUNT"]]
    )


@recipe_bp.route("/recipe/ingredient_suggestions", methods=["GET"])
def ingredient_suggestions():
    """Suggest ingredients to add to a recipe. An ingredient is suggested
    if it is not in the current recipe but in another recipe that contains all
    the current ingredients and more.
    """
    data = request.args
    (ingredients,) = get_data(data, "ingredients")
    ingredients = json.loads(ingredients)["ingredients"]
    ingredients = [int(id) for id in ingredients]
    return jsonify(ingredients=get_ingredient_suggestions(ingredients))


@recipe_bp.route("/recipe", methods=["POST"])
@jwt_required()
def create_recipe():
    """Create a new recipe draft.

    Recipe image and instruction videos are saved on the filesystem if given.
    """
    data = request.form
    (
        name,
        expected_duration_mins,
        meal_types,
        diet_types,
        description,
        instructions,
        ingredients,
    ) = get_data(
        data,
        "name",
        "expectedDuration",  # "182" or ""
        "mealType",  # "{"mealType": ['lunch', 'dinner']}"
        "dietType",  # "{"dietType": ['vegetarian', 'nut-free']}"
        "description",
        "instructions",  # "{"instructions": ['step 1', 'step 2']}"
        "ingredients",  # "{"ingredients": [{"id": 1, "name": "Water", "quantity": 1, "units": "L"}]}"
    )

    # Type changes
    name = name or None
    expected_duration_mins = (
        int(expected_duration_mins) if expected_duration_mins else None
    )
    meal_types = json.loads(meal_types)["mealType"]
    diet_types = json.loads(diet_types)["dietType"]
    description = description or None
    instructions = json.loads(instructions)["instructions"] or None
    ingredients = json.loads(ingredients)["ingredients"] or None

    # Save files
    files = request.files

    photo_url = None
    video_urls = [""] * len(instructions) if instructions else []
    for input_name in files:
        # Input tag name: "image", "video0"
        # FileStorage.filename: original filenames
        file = files[input_name]
        if not file.filename:
            continue  # TODO

        filename = secure_filename(file.filename)
        if input_name == "image":
            photo_url = os.path.join(app.config["PHOTO_UPLOAD_FOLDER"], filename)
            file.save(photo_url)
        else:
            video_url = os.path.join(app.config["VIDEO_UPLOAD_FOLDER"], filename)
            video_urls[int(input_name[-1])] = video_url
            file.save(video_url)

    # Create recipe
    recipe = Recipe.create(
        contributor=username_to_user_id(get_jwt_identity()),
        status="Draft",
        name=name,
        expected_duration_mins=expected_duration_mins,
        meal_types=meal_types,
        diet_types=diet_types,
        description=description,
        instructions=instructions,
        photo_url=photo_url,
        video_urls=video_urls or None,
        ingredients=ingredients,
    )

    return jsonify(recipe=recipe.jsonify()), 201


@recipe_bp.route("/my_recipes/<id>", methods=["DELETE"])
@jwt_required()
def delete_recipe(id):
    """Delete a recipe."""
    Recipe.delete(id)
    return ("", 204)


@recipe_bp.route("/my_recipes/<id>", methods=["PUT"])
@jwt_required()
def publish_recipe(id):
    """Publish a recipe. Recipes cannot be published unless all entries are completed,
    except videos per instruction are optional."""
    pass


@recipe_bp.route("/my_recipes", methods=["GET"])
@jwt_required()
def my_recipes():
    """Get all of the user's recipes with an optional query on the recipe name."""
    data = request.args
    (query,) = get_data(data, "query")

    recipes = (
        Recipe.query.filter_by(contributor=username_to_user_id(get_jwt_identity()))
        .filter(Recipe.name.ilike(f"%{''.join(query.split())}%"))
        .all()
    )

    recipe_details = [recipe.jsonify() for recipe in recipes]
    return jsonify(recipes=recipe_details)


###############################################################################


# @recipe_bp.route("/recipes", methods=["GET"])
# @jwt_required(fresh=True)
# def recipes_list():
#     """Return a list of all recipes created by the recipe contributor"""

#     username = get_jwt_identity()
#     recipe_contributor_id = username_to_user_id(username)

#     recipes = []
#     for recipe in Recipe.query.filter_by(recipe_contributor=recipe_contributor_id):
#         recipes.append(
#             {
#                 "recipe_id": recipe.id,
#                 "name": recipe.name,
#                 "recipePhoto_url": recipe.recipe_photo,
#                 "published": recipe.published,
#                 "description": recipe.description,
#             }
#         )

#     return Response(json.dumps(recipes), mimetype="application/json")


# @recipe_bp.route("/recipe/details", methods=["GET"])
# @jwt_required(fresh=True)
# def recipe_details():

#     # Get dict of input from front end
#     data = request.get_json()

#     # Check for Malformed Requests
#     if not data:
#         raise Error400

#     # Verify user is the creator of the recipe
#     recipe_id = data.get("recipe_id")
#     username = get_jwt_identity()
#     recipe = recipe_or_403(username, recipe_id)

#     details = {
#         "name": recipe.name,
#         "recipePhoto_url": recipe.recipePhoto_url,
#         "recipeVideo_url": recipe.recipeVideo_url,
#         "description": recipe.description,
#         "mealType": recipe.meal_type,
#         "dietType": recipe.diet_type,
#         "recipeInstructions": recipe.recipe_instructions,
#         "timerDuration": recipe.timer_duration,
#         "timerUnits": recipe.timer_units,
#         "required_ingredients": dict_required_ingredients(recipe_id),
#     }

#     logger.debug("Recipe details returned: %s", recipe)  # type: ignore
#     return Response(json.dumps(details), mimetype="application/json")


# @recipe_bp.route("/recipe/update", methods=["PUT"])
# @jwt_required(fresh=True)
# def recipe_update():

#     # Get dict of input from front end
#     data = request.get_json()

#     # Check for Malformed Requests
#     if not data:
#         raise Error400

#     # Verify user is the creator of the recipe
#     username = get_jwt_identity()
#     recipe_id = data.get("recipe_id")
#     recipe = recipe_or_403(username, recipe_id)

#     logger.debug("Data payload retrieved")  # type: ignore

#     name = data.get("name")
#     recipe_photo = data.get("recipePhoto_url")
#     recipe_video = data.get("recipeVideo_url")
#     description = data.get("description")
#     meal_type = data.get("mealType")
#     diet_type = data.get("dietType")
#     recipe_instructions = data.get("recipeInstructions")
#     timer_duration = data.get("timerDuration")
#     timer_units = data.get("timerUnits")
#     required_ingredients = data.get("requiredIngredients")

#     # Check for valid recipe name
#     if not verify_recipe_name(name):
#         raise InvalidRecipeNameFormatError
#     else:
#         name = name.strip()

#     recipe.update(
#         name=name,
#         recipe_photo=recipe_photo,
#         recipe_video=recipe_video,
#         description=description,
#         meal_type=meal_type,
#         diet_type=diet_type,
#         recipe_instructions=recipe_instructions,
#         timer_duration=timer_duration,
#         timer_units=timer_units,
#         required_ingredients=required_ingredients,
#     )

#     logger.debug("Recipe updated: %s", recipe)  # type: ignore
#     return jsonify()


# @recipe_bp.route("/recipe/delete", methods=["DELETE"])
# @jwt_required(fresh=True)
# def recipe_delete():

#     # Get dict of input from front end
#     data = request.get_json()

#     # Check for Malformed Requests
#     if not data:
#         raise Error400

#     # Verify user is the creator of the recipe
#     recipe_id = data.get("recipe_id")
#     username = get_jwt_identity()
#     recipe = recipe_or_403(username, recipe_id)

#     # Delete the recipe
#     db.session.delete(recipe)

#     logger.debug("Recipe deleted: %s", recipe)  # type: ignore
#     return jsonify()


# @recipe_bp.route("/recipe/copy", methods=["POST"])
# @jwt_required(fresh=True)
# def recipe_copy():

#     # Get dict of input from front end
#     data = request.get_json()

#     # Check for Malformed Requests
#     if not data:
#         raise Error400

#     # Verify user is the creator of the recipe
#     recipe_id = data.get("recipe_id")
#     username = get_jwt_identity()
#     original_recipe = recipe_or_403(username, recipe_id)

#     # Copy the orignal recipe
#     name = original_recipe.name
#     recipe_contributor = original_recipe.recipe_contributor
#     recipe_photo = original_recipe.recipe_photo
#     recipe_video = original_recipe.recipe_video
#     description = original_recipe.description
#     meal_type = original_recipe.meal_type
#     diet_type = original_recipe.diet_type
#     recipe_instructions = original_recipe.recipe_instructions
#     timer_duration = original_recipe.timer_duration
#     timer_units = original_recipe.timer_units
#     required_ingredients = dict_required_ingredients(recipe_id)

#     # Create a new recipe
#     recipe = Recipe.create(
#         name=name,
#         recipe_contributor=recipe_contributor,
#         recipe_photo=recipe_photo,
#         recipe_video=recipe_video,
#         description=description,
#         meal_type=meal_type,
#         diet_type=diet_type,
#         recipe_instructions=recipe_instructions,
#         timer_duration=timer_duration,
#         timer_units=timer_units,
#         required_ingredients=required_ingredients,
#     )

#     logger.debug("Recipe to be copied: %s", original_recipe)  # type: ignore

#     logger.debug("Recipe copied: %s", recipe)  # type: ignore
#     return jsonify(recipe_id=recipe.id)


# @recipe_bp.route("/recipe/publish", methods=["PUT"])
# @jwt_required(fresh=True)
# def recipe_publish():

#     # Get dict of input from front end
#     data = request.get_json()

#     # Check for Malformed Requests
#     if not data:
#         raise Error400

#     # Verify user is the creator of the recipe
#     recipe_id = data.get("recipe_id")
#     username = get_jwt_identity()
#     recipe = recipe_or_403(username, recipe_id)

#     recipe.publish()

#     logger.debug("Recipe published: %s", recipe)  # type: ignore
#     return {}


# @recipe_bp.route("/no_match_frequency", methods=["GET"])
# @jwt_required(fresh=True)
# def no_match_frequency():
#     pass
