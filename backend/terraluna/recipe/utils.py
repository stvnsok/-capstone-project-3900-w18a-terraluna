import re

from terraluna.auth.models import User
from terraluna.recipe.models import *

from .error import *
from .models import *


def ingredient_search(query):
    return Ingredient.query.filter(
        Ingredient.name.ilike(f"%{''.join(query.split())}%")
    ).all()


def get_ingredient_counts(ingredients):
    return {
        ingredient: RecipeIngredient.query.filter_by(
            ingredient_id=ingredient.id
        ).count()
        for ingredient in ingredients
    }


def username_to_user_id(username):
    """Given a username, returns the corresponding user id.

    Args:
        username (str): Username to convert.

    Returns:
        int: Corresponding id of given username.
    """
    return User.query.filter_by(username=username).first().id


# def recipe_or_403(username, recipe_id):
#     """Given a username and recipe_id,
#         check if user is the recipe contributor
#         else raises 403 error

#     Args:
#         username (str): username to check.
#         recipe_id (int): recipe_id of recipe

#     Returns:
#         Recipe: recipe
#     """

#     # Retrieve user_id and recipe_contributor_id
#     user_id = username_to_user_id(username)
#     recipe = Recipe.query.filter_by(recipe_id=recipe_id).first()
#     contributor_id = recipe.recipe_contributor

#     # If the user is not the recipe contributor, raise 403 Forbidden
#     if user_id is not contributor_id:
#         raise ForbiddenRecipeContributor

#     return recipe


# def dict_required_ingredients(recipe_id):
#     """Given a recipe_id,
#         extracts required ingredients

#     Args:
#         recipe_id (int): recipe_id of recipe

#     Returns:
#         list: list of dictionary of required ingredients
#     """
#     required_ingredients = [
#         {
#             "ingredient_id": ingredient.ingredient_id,
#             "quantity": ingredient.quantity,
#             "units": ingredient.units,
#         }
#         for ingredient in RequiredIngredient.query.filter_by(recipe_id=recipe_id)
#     ]
#     return required_ingredients
