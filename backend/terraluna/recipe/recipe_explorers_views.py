#####################


#####################


## IGNORE THIS FILE FOR NOW ##

from flask import Blueprint


recipe_explorers_bp = Blueprint("recipe_explorers_bp", __name__)
"""Blueprint: A Blueprint for all recipe_explorers routes."""

def comment():
    pass

def view_recipe():
    # ONLY PUBLISHED RECIPES
    pass



def search_recipes():
    """Search for matching recipes given a list of ingredients
    modified by filters

    Modifies most searched ingredients/combinations (TODO)

    ONLY PUBLISHED RECIPES
    """
    data = request.get_json()

    # Check for Malformed Requests
    if not data:
        raise Error400

    ingredients = data.get("ingredients")
    