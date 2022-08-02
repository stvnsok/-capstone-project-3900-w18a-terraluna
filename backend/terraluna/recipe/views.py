import collections
import json
import os

from flask import Blueprint, jsonify, request, send_file
from flask_jwt_extended.utils import get_jwt_identity
from flask_jwt_extended.view_decorators import jwt_required
from werkzeug.utils import secure_filename

from app import app
from terraluna.explorer.models import UserPantry
from utils import *

from .error import *
from .models import *
from .utils import *

recipe_bp = Blueprint("recipe_bp", __name__)
"""Blueprint: A Blueprint for all recipe and ingredient routes."""


@recipe_bp.route("/uploads", methods=["GET"])
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


@recipe_bp.route("/my_recipes", methods=["POST"])
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


@recipe_bp.route("/my_recipes/<id>", methods=["GET"])
@jwt_required()
def get_recipe(id):
    """Get the full details of a single recipe."""
    recipe = Recipe.query.filter_by(id=id).first()
    return jsonify(recipe=recipe.jsonify_extended())


@recipe_bp.route("/my_recipes/<id>", methods=["PUT", "PATCH"])
@jwt_required()
def edit_recipe(id):
    """Edit a recipe."""
    # TODO: refactor this
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
    # TODO: improvement delete old files
    files = request.files

    photo_url = Recipe.query.filter_by(id=id).first().photo_url
    video_urls = Recipe.query.filter_by(id=id).first().video_urls
    if instructions and video_urls:
        video_urls.extend([""] * (len(instructions) - len(video_urls)))
    elif instructions and video_urls is None:
        video_urls = [""] * len(instructions)
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

    recipe = Recipe.edit(
        id,
        name,
        expected_duration_mins,
        meal_types,
        diet_types,
        description,
        instructions,
        photo_url,
        video_urls,
        ingredients,
    )
    return jsonify(recipe=recipe.jsonify()), 201


@recipe_bp.route("/my_recipes/<id>", methods=["DELETE"])
@jwt_required()
def delete_recipe(id):
    """Delete a recipe."""
    Recipe.delete(id)
    return "", 204


@recipe_bp.route("/my_recipes/<id>/publish", methods=["PUT"])
@jwt_required()
def publish_recipe(id):
    """Publish a recipe. Recipes cannot be published unless all entries are completed,
    except videos per instruction are optional."""
    recipe = Recipe.publish(id)
    return jsonify(recipe=recipe.jsonify_extended())


@recipe_bp.route("/my_recipes/<id>/copy", methods=["POST"])
@jwt_required()
def copy_recipe(id):
    """Copy a recipe."""
    recipe = Recipe.copy(id)
    return jsonify(recipe=recipe.jsonify()), 201


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


@recipe_bp.route("/ingredients/no_match_frequency", methods=["GET"])
@jwt_required()
def no_match_frequency():
    """Find the ingredients in explorers' pantry with no recipes that use
    those ingredients so that contributors know what recipes to add next.
    """
    recipe_ingredients = list(
        {ingredient.ingredient_id for ingredient in RecipeIngredient.query.all()}
    )

    unused_pantry_ingredients = [
        ingredient.ingredient_id
        for ingredient in UserPantry.query.all()
        if ingredient.ingredient_id not in recipe_ingredients
    ]

    counts = collections.Counter(unused_pantry_ingredients)
    most_frequent_unused = [
        Ingredient.query.filter_by(id=ingredient[0]).first()
        for ingredient in counts.most_common(5)
    ]

    return jsonify(
        ingredients=[
            {"id": ingredient.id, "name": ingredient.name}
            for ingredient in most_frequent_unused
        ]
    )
