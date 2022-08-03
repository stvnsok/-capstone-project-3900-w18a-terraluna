from sqlalchemy import or_

from terraluna.recipe.models import *

from .models import *


def ingredient_search(query):
    """Search for ingredients based on a query. Whitespace and case is ignored.
    # TODO: improvement is to only count on published recipes

    Args:
        query (str): Substring query to search with.

    Returns:
        list of Ingredient: List of matched ingredients.
    """
    return Ingredient.query.filter(
        Ingredient.name.ilike(f"%{''.join(query.split())}%")
    ).all()


def get_ingredient_counts(ingredients):
    """Get a count of how many times each ingredient is used in a recipe.

    Args:
        ingredients (list of Ingredient): List of ingredients to count.

    Returns:
        dict: Of an ingredient to its count.
    """
    return {
        ingredient: RecipeIngredient.query.join(Recipe)
        .filter(Recipe.status == "Published")
        .filter(RecipeIngredient.ingredient_id == ingredient.id)
        .count()
        for ingredient in ingredients
    }


def most_popular_n_ingredients(n):
    """Find the most popular n ingredients. Popularity is based on how many
    times an ingredient is used in a recipe.

    Args:
        n (int): Up to how many popular ingredients to find.

    Returns:
        list of dict: List of most popular n ingredients.
    """
    ingredient_counts = get_ingredient_counts(ingredient_search(""))
    return [
        {"id": ingredient.id, "name": ingredient.name}
        for ingredient in sorted(
            ingredient_counts, key=ingredient_counts.get, reverse=True  # type: ignore
        )
    ][:n]


def get_ingredient_suggestions(ingredients):
    """Suggest ingredients to add to a recipe. An ingredient is suggested
    if it is not in the current recipe but in another recipe that contains all
    the current ingredients and more.

    If there are no ingredients, the 5 most popular ingredients are suggested.

    Args:
        ingredients (list of int): List of ingredient ids in current recipe.

    Returns:
        list of dict: List of suggested ingredients.
    """
    if not ingredients:
        return most_popular_n_ingredients(5)

    filter_list = [RecipeIngredient.ingredient_id == id for id in ingredients]
    recipes_with_current_ingredients = (
        RecipeIngredient.query.join(Recipe)
        .filter(Recipe.status == "Published")
        .filter(or_(*filter_list))
        .all()
    )

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
        return []

    filter_list = [RecipeIngredient.recipe_id == id for id in suggested_recipes]
    suggested_recipe_ingredients = {
        recipe_ingredient.ingredient
        for recipe_ingredient in RecipeIngredient.query.join(Recipe)
        .filter(Recipe.status == "Published")
        .filter(or_(*filter_list))
        .all()
    }

    return [
        {"id": ingredient.id, "name": ingredient.name}
        for ingredient in suggested_recipe_ingredients
        if ingredient.id not in ingredients
    ][
        :5
    ]  # TODO: improvement would be to select the 5 most popular out of these
