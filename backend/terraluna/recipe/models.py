from setuptools import Require
from app import db, logger


class Recipe(db.Model):
    """A Recipe in the database"""

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.text, nullable=False)
    recipe_contributor = db.Column(db.Integer, nullable=False)
    published = db.Column(db.Boolean, nullable=False)
    recipe_photo = db.Column(db.text)
    description = db.Column(db.Text)
    meal_type = db.Column(db.ARRAY(db.text))
    diet_type = db.Column(db.ARRAY(db.text))
    recipe_instructions = db.Column(db.Text)
    timer_duration = db.Column(db.Integer)
    timer_units = db.Column(db.Text)

    @staticmethod
    def create(name, recipe_contributor, recipe_photo, description, meal_type, diet_type, 
        recipe_instructions, timer_duration, timer_units, required_ingredients):
        """Create a new recipe model and add it to the database. 

        Args:
            name (str): Recipe name.
            recipe_contributor (int): user_id of creator
            recipe_photo (str): URL for recipe photo.
            description (str): Description of recipe.
            meal_type (List(str)): Types of meals.
            diet_type (List(str)): Types of diet.
            recipe_instructions (str): Recipe instructions.
            timer_duration (int): Cooking time quantity.
            timer_units (str): Cooking time units.
            required_ingredients (dict): dictionary of ingredient_id and quantity
            
        Returns:
            Recipe: The new recipe model.
        """
        recipe = Recipe(
            name, recipe_contributor, published=False,
            recipe_photo=recipe_photo, description=description,
            meal_type=meal_type, diet_type=diet_type, 
            recipe_instructions=recipe_instructions, 
            timer_duration=timer_duration, timer_units=timer_units
        )
        db.session.add(recipe)
        # TODO: add/modify required_ingredients table
        #
        #
        #
        RequiredIngredient.add_required_ingredients(recipe.id, required_ingredients)
        db.session.commit()
        logger.debug("Added recipe to DB: %s", recipe)  # type: ignore
        return

    def save(self, name, recipe_photo, description, meal_type, diet_type, 
        recipe_instructions, timer_duration, timer_units, required_ingredients):
        """Save recipe with new data.

        Args:
            name (str): Recipe name.
            recipe_photo (str): URL for recipe photo.
            description (str): Description of recipe.
            meal_type (List(str)): Types of meals.
            diet_type (List(str)): Types of diet.
            recipe_instructions (str): Recipe instructions.
            timer_duration (int): Cooking time quantity.
            timer_units (str): Cooking time units.
            required_ingredients (List(Dict)): list of (ingredient_id and quantity) required for recipe
            
        Returns:
            None
        """
        self.name = name
        self.recipe_photo = recipe_photo
        self.description = description
        self.meal_type = meal_type
        self.diet_type = diet_type
        self.recipe_instructions = recipe_instructions
        self.timer_duration = timer_duration
        self.timer_units = timer_units

        # TODO: add/modify required_ingredients table
        #
        #
        #
        RequiredIngredient.update(required_ingredients)

        return True
    
    def publish(self):
        """Publish the recipe.

        Args:
            None
            
        Returns:
            None
        """

        self.publish = True

        return True
    
class Ingredient(db.Model):
    """A Ingredient in the database"""

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)

    @staticmethod
    def create(name):
        """Create a new ingredient model and add it to the database. 

        Args:
            name (str): Ingredient name.

        Returns:
            Recipe: The new ingredient model.
        """
        ingredient = Ingredient(name=name)
        db.session.add(ingredient)
        db.session.commit()
        logger.debug("Added ingredient to DB: %s", ingredient)  # type: ignore
        return ingredient

class RequiredIngredient(db.Model):
    """Units and quantity of ingredients required for recipe"""

    recipe_id = db.Column(db.ForeignKey('recipe.id'), primary_key=True)
    ingredient_id = db.Column(db.ForeignKey('ingredient.id'), primary_key=True)

    ingredient = db.relationship("Ingredient", back_populates="recipes")
    recipe = db.relationship("Recipes", back_populates="required_ingredients")

    required_quantity = db.Column(db.Integer)
    required_units = db.Column(db.Text)

    @staticmethod
    def add_required_ingredients(recipe_id, required_ingredients):
        """Add required ingredients for a recipe to the database

        Args:
            required_ingredients (List(Dict)): list of Dict(ingredient_id and quantity) required for recipe.

        Returns:
            None
        
        """
        for required_ingredient in required_ingredients:
            ingredient_id = required_ingredient['ingredient_id']
            required_quantity = required_ingredient['required_quantity']
            required_units = required_ingredient['required_units']
            row = RequiredIngredient(recipe_id=recipe_id, ingredient_id=ingredient_id,
                required_quantity=required_quantity, required_units=required_units)
            db.session.add(row)

    @staticmethod
    def remove_all_recipe_ingredients(recipe_id):
        """Remove all required ingredients for a recipe in the database

        Args:
            recipe_id (int): recipe to modified

        Returns:
            None
        
        """

    @staticmethod
    def update(recipe_id, required_ingredients):
        """Update required ingredients for a recipe

        Args:
            required_ingredients (List(Dict)): list of Dict(ingredient_id and quantity) required for recipe.

        Returns:
            None
        
        """
        # TODO: amend RequiredIngredients table to reflect accordingly
        #
        #
        #       - Delete all records matching (recipe_id, ingredient_id)
        #       - Add new records
        #
        #
        requiredIngredientIDs = [requiredIngredient['ingredient_id'] for requiredIngredient in required_ingredients]
        for ingredient_id in requiredIngredientIDs:
            link = 
            db.session.

        RequiredIngredient.remove_all_recipe_ingredients(recipe_id)
        RequiredIngredients.add_required_ingredients(recipe_id, required_ingredients)