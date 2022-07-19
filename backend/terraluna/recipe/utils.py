import re

from terraluna.auth.models import User

from .error import *
from .models import *


def username_to_user_id(username):
    """Given a username, returns the corresponding user id

    Args:
        username (str): username to process.

    Returns:
        int: user_id
    """
    user = User.query.filter_by(username=username).first()
    return user.id

def recipe_or_403(username, recipe_id):
    """Given a username and recipe_id, 
        check if user is the recipe contributor
        else raises 403 error

    Args:
        username (str): username to check.
        recipe_id (int): recipe_id of recipe

    Returns:
        Recipe: recipe
    """

    # Retrieve user_id and recipe_contributor_id
    user_id = username_to_user_id(username)
    recipe = Recipe.query.filter_by(recipe_id=recipe_id).first()
    contributor_id = recipe.recipe_contributor

    # If the user is not the recipe contributor, raise 403 Forbidden
    if user_id is not contributor_id:
        raise ForbiddenRecipeContributor
    
    return recipe


def verify_recipe_name(name):
    """Verify if a recipe name is of a valid format according to the following
    acceptance criteria:

        Recipe name must be at least 2 characters, excluding trailing whitespaces
        Recipe name must contain at least 1 letter or number

    Args:
        name (str): Username to verify.

    Returns:
        bool: `True` if valid, `False` otherwise.
    """
    if not re.match('.*[a-zA-Z0-9].*', name) and name.strip().len() >= 2:
        return False
    return True