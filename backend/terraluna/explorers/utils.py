
from terraluna.recipe.models import Recipe

from .error import *
from .models import *


def validate_recipe_id(recipe_id):
    """Check if recipe is valid and returns the Recipe object
            i.e. exists and is published
        otherwise raise an exception
    Args:
        recipe_id (int): recipe_id

    Returns:
        Recipe object of recipe_id
    """
    # Check that recipe_id exists and is published
    try:
        recipe = Recipe.query.filter_by(recipe_id=id).one()
    except:
        raise RecipeDoesNotExists
    if recipe.status != "published":
        raise RecipeDoesNotExists
    return recipe

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