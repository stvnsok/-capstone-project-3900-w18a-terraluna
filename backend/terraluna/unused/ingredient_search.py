import json

from error import *
from flask import Blueprint, Response, request
from terraluna.recipe.models import Ingredient



#########################################################
# Up to you if you want to use this, looks like you already implemented it
#########################################################

ingredient_search_bp = Blueprint("ingredient_search_bp", __name__)
"""Blueprint: A Blueprint for the ingredient_search route."""

@ingredient_search_bp.route("/ingredients", methods=["GET"])
def query_ingredients():
    """Given a query string, returns list of top 10 matching ingredients
        If given no input, returns all ingredients"""

    # Get dict of input from front end 
    data = request.get_json()

    # Check for Malformed Requests
    if not data:
        raise Error400

    # Get the query string
    query = data.get("query").strip().lower()

    # If there is no query or the query is empty, return list of all ingredients
    if query == None or query == "":
        result = [
            {
                'ingredient_id': ingredient.id, 
                'name': ingredient.name
            } 
            for ingredient in Ingredient.query.all() 
        ]
    else:
        result = [
            {
                'ingredient_id': ingredient.id, 
                'name': ingredient.name
            } 
            for ingredient in Ingredient.query.all() 
            if query in ingredient.name
        ]
        # Truncate result if > 10
        if len(result) > 10:
            result = result[:10]

    return Response(json.dumps(result), mimetype='application/json')

@ingredient_search_bp.route("/suggested_ingredient", methods=["GET"])
def suggested_ingredient():
    """Given a list of ingredient_id, 
        returns list of top 5 matching ingredients"""
    pass
    