import datetime

from app import db, logger


class IngredientCategory(db.Model):
    """An Ingredient Category"""

    name = db.Column(db.Text, primary_key=True)
    ingredient_id = db.Column(
        db.Integer, db.ForeignKey("ingredient.id"), primary_key=True
    )


class UserPantry(db.Model):
    """An explorer's pantry"""

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key=True)
    ingredient_id = db.Column(
        db.Integer, db.ForeignKey("ingredient.id"), primary_key=True
    )


class UserSavedRecipes(db.Model):
    """An explorer's saved recipe"""

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipe.id"), primary_key=True)


"""
class IngredientFrequency(db.Model):
    pass

class SearchFrequency(db.Model):
    pass
"""
