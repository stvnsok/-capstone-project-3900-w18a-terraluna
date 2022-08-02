import json

from flask import Blueprint, Response, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from terraluna.explorers.error import *
from terraluna.explorers.models import *
from terraluna.explorers.utils import *
from terraluna.recipe.models import Recipe, Ingredient
from terraluna.recipe.utils import (dict_required_ingredients,
                                    username_to_user_id)

recipe_explorers_bp = Blueprint("recipe_explorers_bp", __name__)
"""Blueprint: A Blueprint for all recipe_explorers routes."""


@recipe_explorers_bp.route("/ingredient_categories", methods=["GET"])
def ingredient_categories():
    """Return a list of all ingredients in categories"""
    
    result = []
    category_names = db.session.query(IngredientCategory.name).distinct()
    for category_name in category_names:
        ingredients = []
        query = db.session.query(
            IngredientCategory,
            Ingredient
        ).filter(IngredientCategory.ingredient_id==Ingredient.id
        ).filter(IngredientCategory.name==category_name)
        for row in query:
            ingredients.append(
                {
                    'ingredient_id': row.Ingredient.id,
                    'name': row.Ingredient.name
                }
            )
        result.append({
            'name': category_name,
            'ingredients': ingredients
            }
        )
        
    return jsonify(ingredientCategories=result)

@recipe_explorers_bp.route("/pantry", methods=["GET", "PUT"])
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
        query = db.session.query(
            UserPantry, Ingredient
        ).filter_by(UserPantry.ingredient_id == Ingredient.id
        ).filter_by(UserPantry.user_id==user_id)
        for row in query:
            pantry.append({
                'ingredient_id': row.Ingredient.id, 
                'name': row.Ingredient.name
            })
        return jsonify(pantry=pantry)

    # PUT: Given a list of ingredient_id, updates the UserPantry Table
    elif request.method == "PUT":
        pass
        ##################################################
        ##################################################
        ##################################################
        # TODO:
    
@recipe_explorers_bp.route("/search", methods=["GET"])
def search():
    ##################################################
    ##################################################
    ##################################################
    # TODO:
    pass

@recipe_explorers_bp.route("/recipe/<int:id>", methods=["GET"])
def recipe_view(id):
    """Return details of the recipe"""
    
    # Check that recipe_id exists and is published and get the Recipe object
    recipe = id_to_valid_recipe(id)

    ########################
    # TODO: Change this to fit new recipe model
    # You can copy directly from "/my_recipes/{id}" GET route and add 'comments' key
    ########################
    response = {
        'name': recipe.name,
        'recipePhoto_url': recipe.photo_url,
        'recipeVideo_url': recipe.video_url,
        'description': recipe.description,
        'mealType': recipe.meal_type,
        'dietType': recipe.diet_type,
        'recipeInstructions': recipe.instructions,
        'expectedDuration': recipe.expectedDuration,
        'required_ingredients': dict_required_ingredients(id),
        'comments': dict_recipe_comments(id)
    }
    
    logger.debug("Recipe details returned: %s", recipe)  # type: ignore
    return Response(json.dumps(response), mimetype='application/json')


@recipe_explorers_bp.route("/recipe/<int:id>/comment", methods=["POST"])
@jwt_required(fresh=True)
def recipe_comment(id):
    """Comment on the recipe"""
    
    # Check that recipe_id exists and is published and get the Recipe object
    recipe = validate_recipe_id(id)

    # Retrieve current user from token
    user_id = username_to_user_id(get_jwt_identity())

    # Get dict of input from front end 
    data = request.get_json()

    # Check for Malformed Requests
    if not data:
        raise Error400

    message = data.get("message")

    # Check that the message is not empty
    if message == None or message.strip() == "":
        raise InvalidComment

    Comment.create(recipe__id=id, user_id=user_id, message=message)

@recipe_explorers_bp.route("/savedRecipes", methods=["GET"])
@jwt_required(fresh=True)
def list_savedRecipes():
    """Return a list of all recipes saved by the user"""

    # Retrieve current user from token
    user_id = username_to_user_id(get_jwt_identity())

    recipes = []
    for row in UserSavedRecipes.query.filter_by(user_id=user_id):
        recipe = Recipe.query.filter_by(id=row.recipe_id).one()
        recipes.append({
            'recipe_id': recipe.id,
            'name': recipe.name,
            'recipePhoto_url': recipe.recipe_photo,
            'status': recipe.status,
            'description': recipe.description,
        })
    
    return Response(json.dumps(recipes), mimetype='application/json')

@recipe_explorers_bp.route("/savedRecipes/<int:id>", methods=["PUT", "DELETE"])
@jwt_required(fresh=True)
def func():
    """
    PUT: add recipe to user's saved recipes
    DELETE: remove recipe from user's saved recipes
    """
    ##################################################
    ##################################################
    ##################################################
    # TODO:
    if request.method = "PUT":
        # Check that recipe_id exists and is published
        validate_recipe_id(id)
    pass


    