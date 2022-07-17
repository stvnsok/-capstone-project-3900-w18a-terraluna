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
        recipe_instructions, timer_duration, timer_units, recipe2ingredient):
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
            recipe2ingredient (dict): dictionary of ingredient_id and quantity
            
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
        # TODO: add/modify recipe2ingredients table
        #
        #
        #
        db.session.commit()
        logger.debug("Added recipe to DB: %s", recipe)  # type: ignore
        return

    def save(self, name, recipe_photo, description, meal_type, diet_type, 
        recipe_instructions, timer_duration, timer_units, recipe2ingredient):
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
            recipe2ingredient (List(int)): List of required ingredients (id).
            
        Returns:
            bool: `True` if success, `False` otherwise.
        """

        return True
    
    def publish(self):
        """Publish the recipe.

        Args:
            None
            
        Returns:
            bool: `True` if success, `False` otherwise.
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