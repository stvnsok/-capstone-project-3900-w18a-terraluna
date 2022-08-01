import json

from error import *
from flask import Blueprint, request

suggest_ingredient_bp = Blueprint("suggest_ingredient_bp", __name__)
"""Blueprint: A Blueprint for the suggest_ingredient route."""

@suggest_ingredient_bp.route("/suggest_ingredient", methods=["PUT"])
def suggest_ingredient():
    """Given a suggested ingredients, appends it to the suggested_ingredients"""

    # Get dict of input from front end 
    data = request.get_json()

    # Check for Malformed Requests
    if not data:
        raise Error400

    # Get the query string
    suggested = data.get("suggested").strip().lower()

    # Load JSON file
    with open("suggested_ingredients.json") as file:
        suggestedJSON = json.load(file)
    
    if suggested in suggestedJSON:
        suggestedJSON[suggested] += 1
    else:
        suggestedJSON[suggested] = 1

    with open("suggested_ingredients.json") as file:
        json.dump(suggestedJSON, file)
        

