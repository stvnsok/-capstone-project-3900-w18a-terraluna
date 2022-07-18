from app import db, logger


class Recipe(db.Model):
    """A Recipe in the database"""

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    recipe_contributor = db.Column(db.Integer, nullable=False)
    published = db.Column(db.Boolean, nullable=False)
    recipe_photo = db.Column(db.Text)
    recipe_video = db.Column(db.Text)
    description = db.Column(db.Text)
    meal_type = db.Column(db.ARRAY(db.Text))
    diet_type = db.Column(db.ARRAY(db.Text))
    recipe_instructions = db.Column(db.Text)
    timer_duration = db.Column(db.Integer)
    timer_units = db.Column(db.Text)
    required_ingredients = db.relationship("RequiredIngredient", back_populates="recipe")

    @staticmethod
    def create(name, recipe_contributor, recipe_photo, recipe_video, description, meal_type, diet_type, 
        recipe_instructions, timer_duration, timer_units, required_ingredients):
        """Create a new recipe model and add it to the database. 

        Args:
            name (str): Recipe name.
            recipe_contributor (int): user_id of creator
            recipe_photo (str): URL for recipe photo.
            recipe_video (str): URL for recipe video.
            description (str): Description of recipe.
            meal_type (List(str)): Types of meals.
            diet_type (List(str)): Types of diet.
            recipe_instructions (str): Recipe instructions.
            timer_duration (int): Cooking time quantity.
            timer_units (str): Cooking time units.
            required_ingredients (List(Dict)): ingredients required for recipe
                [
                    {
                        'ingredient_id': int
                        'quantity': int
                        'units': str
                    }
                ]
            
        Returns:
            Recipe: The new recipe model.
        """

        # Create a recipe object and add to session
        recipe = Recipe(
            name=name, recipe_contributor=recipe_contributor, published=False,
            recipe_photo=recipe_photo, recipe_video=recipe_video, description=description,
            meal_type=meal_type, diet_type=diet_type, recipe_instructions=recipe_instructions, 
            timer_duration=timer_duration, timer_units=timer_units
        )
        db.session.add(recipe)

        # Add all required ingredients to session
        RequiredIngredient.add_required_ingredients(recipe.id, required_ingredients)

        # Commit changes to database
        db.session.commit()
        logger.debug("Added recipe to DB: %s", recipe)  # type: ignore
        return

    def save(self, name, recipe_photo, recipe_video, description, meal_type, diet_type, 
        recipe_instructions, timer_duration, timer_units, required_ingredients):
        """Save recipe with new data.

        Args:
            name (str): Recipe name.
            recipe_photo (str): URL for recipe photo.
            recipe_video (str): URL for recipe video.
            description (str): Description of recipe.
            meal_type (List(str)): Types of meals.
            diet_type (List(str)): Types of diet.
            recipe_instructions (str): Recipe instructions.
            timer_duration (int): Cooking time quantity.
            timer_units (str): Cooking time units.
            required_ingredients (List(Dict)): ingredients required for recipe
                [
                    {
                        'ingredient_id': int
                        'quantity': int
                        'units': str
                    }
                ]
            
        Returns:
            None
        """
        # Update all attributes to given new ones
        self.name = name
        self.recipe_photo = recipe_photo
        self.recipe_video = recipe_video
        self.description = description
        self.meal_type = meal_type
        self.diet_type = diet_type
        self.recipe_instructions = recipe_instructions
        self.timer_duration = timer_duration
        self.timer_units = timer_units
        # Update required ingredients for the recipe
        RequiredIngredient.update(required_ingredients)

        # Commit changes to database
        db.session.commit()
        logger.debug("Modified recipe in DB: %s", recipe)  # type: ignore
        return True
    
    def publish(self):
        """Publish the recipe.

        Args:
            None
            
        Returns:
            None
        """
        # Set recipe status to published
        self.published = True
        
        # Commit changes to database
        db.session.commit()
        logger.debug("Set recipe to published in DB: %s", recipe)  # type: ignore
        return True

    def __repr__(self):
        return f"<id={self.id}>"
    
class Ingredient(db.Model):
    """A Ingredient in the database"""

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    recipes = db.relationship("RequiredIngredient", back_populates="ingredient")

    @staticmethod
    def create(name):
        """Create a new ingredient model and add it to the database. 

        Args:
            name (str): Ingredient name.

        Returns:
            Recipe: The new ingredient model.
        """
        # Create and add ingredient object to db
        ingredient = Ingredient(name=name)
        db.session.add(ingredient)

        # Commit changes to database
        db.session.commit()
        logger.debug("Added ingredient to DB: %s", ingredient)  # type: ignore
        return ingredient
    
    def __repr__(self):
        return f"<id={self.id}\tingredient_name={self.name}>"

class RequiredIngredient(db.Model):
    """Units and quantity of ingredients required for recipe"""

    recipe_id = db.Column(db.ForeignKey('recipe.id'), primary_key=True)
    ingredient_id = db.Column(db.ForeignKey('ingredient.id'), primary_key=True)

    ingredient = db.relationship("Ingredient", back_populates="recipes")
    recipe = db.relationship("Recipes", back_populates="required_ingredients")

    quantity = db.Column(db.Integer)
    units = db.Column(db.Text)

    @staticmethod
    def add_required_ingredients(recipe_id, required_ingredients):
        """Add required ingredients for a recipe to the database

        Args:
            recipe_id (int): recipe to modified
            required_ingredients (List(Dict)): ingredients required for recipe
                [
                    {
                        'ingredient_id': int
                        'quantity': int
                        'units': str
                    }
                ]

        Returns:
            None
        
        """
        for required_ingredient in required_ingredients:
            ingredient_id = required_ingredient['ingredient_id']
            quantity = required_ingredient['quantity']
            units = required_ingredient['units']
            row = RequiredIngredient(recipe_id=recipe_id, ingredient_id=ingredient_id,
                quantity=quantity, units=units)
            db.session.add(row)

    @staticmethod
    def remove_all_recipe_ingredients(recipe_id):
        """Remove all required ingredients for a recipe in the database

        Args:
            recipe_id (int): recipe to modified

        Returns:
            None
        
        """
        RequiredIngredient.query.filter_by(recipe_id=recipe_id).delete()


    @staticmethod
    def update(recipe_id, required_ingredients):
        """Update required ingredients for a recipe

        Args:
            recipe_id (int): recipe to modified
            required_ingredients (List(Dict)): ingredients required for recipe
                [
                    {
                        'ingredient_id': int
                        'quantity': int
                        'units': str
                    }
                ]

        Returns:
            None
        
        """
        RequiredIngredient.remove_all_recipe_ingredients(recipe_id)
        RequiredIngredient.add_required_ingredients(recipe_id, required_ingredients)