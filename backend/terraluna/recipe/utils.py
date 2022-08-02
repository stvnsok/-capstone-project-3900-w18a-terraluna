import re

from sqlalchemy import or_

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


def most_popular_n_ingredients(n):
    ingredient_counts = get_ingredient_counts(ingredient_search(""))
    return [
        {"id": ingredient.id, "name": ingredient.name}
        for ingredient in sorted(
            ingredient_counts, key=ingredient_counts.get, reverse=True  # type: ignore
        )
    ][:n]


def username_to_user_id(username):
    """Given a username, returns the corresponding user id.

    Args:
        username (str): Username to convert.

    Returns:
        int: Corresponding id of given username.
    """
    return User.query.filter_by(username=username).first().id


def get_ingredient_suggestions(ingredients):
    """Suggest ingredients to add to a recipe. An ingredient is suggested
    if it is not in the current recipe but in another recipe that contains all
    the current ingredients and more.

    Args:
        ingredients (list of int): List of ingredient ids in current recipe.
    """
    if not ingredients:
        return most_popular_n_ingredients(5)

    filter_list = [RecipeIngredient.ingredient_id == id for id in ingredients]
    recipes_with_current_ingredients = RecipeIngredient.query.filter(
        or_(*filter_list)
    ).all()

    ingredient_counts = {}
    for recipe in recipes_with_current_ingredients:
        ingredient_counts[recipe.recipe_id] = (
            1
            if ingredient_counts.get(recipe.recipe_id) is None
            else ingredient_counts[recipe.recipe_id] + 1
        )

    suggested_recipes = [
        recipe
        for recipe in ingredient_counts
        if ingredient_counts[recipe]
        >= len(ingredients)  # TODO: bug if ingredient repeated
    ]

    if not suggested_recipes:
        return most_popular_n_ingredients(5)

    filter_list = [RecipeIngredient.recipe_id == id for id in suggested_recipes]
    suggested_recipe_ingredients = {
        recipe_ingredient.ingredient
        for recipe_ingredient in RecipeIngredient.query.filter(or_(*filter_list)).all()
    }

    if not suggested_recipe_ingredients:
        return most_popular_n_ingredients(5)

    return [
        {"id": ingredient.id, "name": ingredient.name}
        for ingredient in suggested_recipe_ingredients
        if ingredient.id not in ingredients
    ][
        :5
    ]  # TODO: improvement would be to select the 5 most popular out of these


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
