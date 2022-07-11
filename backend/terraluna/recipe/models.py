from app import db, logger


class Recipe(db.Model):
    """A Recipe in the database"""
    """Developing to be stored as text, will integrate ingredient IDs later for matching"""

    id = db.Column(db.Integer, primary_key=True)
    ingredients_text = db.Column(db.Text, nullable=False)
    method_text = db.Column(db.Text, nullable=False)

    @staticmethod
    def create(ingredients_text, method_text):
        """Create a new recipe model and add it to the database. 
        Storing ingredients and method as text

        Args:
            ingredients_text (str): Required Ingredients.
            method_text (str): Recipe Method.\

        Returns:
            Recipe: The new recipe model.
        """
        highest_recipe_id = db.session.query(func.max(Recipe.id))
        recipe = Recipe(
            id=highest_recipe_id+1, ingredients_text=ingredients_text, method_text=method_text
        )
        db.session.add(recipe)
        db.session.commit()
        logger.debug("Added recipe to DB: %s", recipe)  # type: ignore
        return recipe

class Ingredient(db.Model):
    """A Ingredient in the database"""

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)

    @staticmethod
    def create(ingredient_name):
        """Create a new ingredient model and add it to the database. 

        Args:
            ingredients_text (str): Required Ingredients.
            method_text (str): Recipe Method.\

        Returns:
            Recipe: The new recipe model.
        """
        highest_ingredient_id = db.session.query(func.max(Ingredient.id))
        ingredient = Recipe(
            id=highest_ingredient_id+1, name=ingredient_name
        )
        db.session.add(ingredient)
        db.session.commit()
        logger.debug("Added ingredient to DB: %s", ingredient)  # type: ignore
        return ingredient
    
class IngredientsRequired(db.model):
    """Ingredients required in a recipe"""

    recipe_id = db.Column(db.Integer, db.ForeignKey('Recipe.id'), primary_key=True)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('Ingredient.id'), primary_key=True)