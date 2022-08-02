
from terraluna.recipe.models import Recipe, RecipeIngredient, Comment

from .error import *
from .models import *


def id_to_valid_recipe(id):
    """
    Check if recipe is valid and returns the Recipe object
    i.e. exists and is published otherwise raise an exception
    """
    recipe = Recipe.query.filter_by(id=id).first()
    if recipe == None or recipe.status != "Published":
        raise RecipeDoesNotExists
    return recipe

def num_ingredients_missing(recipe_id, ingredient_ids):
    """Given a list of ingredient_id, returns number of
        ingredients missing to complete recipe
    Args:
        recipe_id (int): recipe_id
        ingredient_ids (List<int>): ingredients
    Returns:
        int: number of ingredients missing
    """
    ingredientsRequired = [ r.ingredient_id for r in RecipeIngredient.query.filter_by(recipe_id=recipe_id)]
    numMissing = 0
    for ingredient_id in ingredientsRequired:
        if ingredient_id not in ingredient_ids:
            numMissing += 1
    return numMissing


def dict_recipe_comments(recipe_id):
    """Given a recipe_id, 
        returns comments

    Args:
        recipe_id (int): recipe_id of recipe

    Returns:
        list: list of dictionary of comments
    """
    comments = [
        {
            'comment_id': comment.id, 
            'name': comment.name,
            'message': comment.message,
            'time': comment.time,
        } 
        for comment in Comment.query.filter_by(recipe_id=recipe_id).order_by(Comment.time.desc())
    ]
    return comments