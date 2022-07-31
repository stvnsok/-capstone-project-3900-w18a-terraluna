from app import db, logger


class Ingredient(db.Model):
    """An ingredient model."""

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    recipes = db.relationship("RecipeIngredient", back_populates="ingredient")

    @staticmethod
    def create(name):
        """Create a new ingredient model and add it to the database.

        Args:
            name (str): Ingredient name.

        Returns:
            Ingredient: The new ingredient model.
        """
        ingredient = Ingredient(name=name)
        db.session.add(ingredient)
        db.session.commit()
        logger.debug("Added ingredient to DB: %s", ingredient)  # type: ignore
        return ingredient

    def __repr__(self):
        return f"<id={self.id}\tname={self.name}>"


class Recipe(db.Model):
    """A recipe model."""

    id = db.Column(db.Integer, primary_key=True)
    contributor = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    status = db.Column(db.Text, nullable=False)  # draft, template, published

    name = db.Column(db.Text, nullable=False)
    expected_duration = db.Column(db.Integer)  # minutes
    meal_type = db.Column(db.ARRAY(db.Text))  # breakfast, lunch, dinner, ...
    description = db.Column(db.Text)
    diet_type = db.Column(db.ARRAY(db.Text))  # vegan, vegetarian, ...
    instructions = db.Column(db.Text)
    photo_url = db.Column(db.Text)
    video_url = db.Column(db.Text)

    ingredients = db.relationship("RecipeIngredient", back_populates="recipe")

    @staticmethod
    def create(
        contributor,
        status,
        name,
        expected_duration=None,
        meal_type=None,
        description=None,
        diet_type=None,
        instructions=None,
        photo_url=None,
        video_url=None,
        ingredients=None,
    ):
        """Create a new recipe model and add it to the database.

        Ingredients are also added to the RecipeIngredient association table.

        Args:
            contributor (int): ID of recipe contributor.
            status (str): Status of recipe (draft, template or published).
            name (str): Recipe name.
            expected_duration (int, optional): Estimated cooking time duration
                in minutes. Defaults to None.
            meal_type (list of str, optional): Types of meal this recipe falls under.
                Defaults to None.
            description (str, optional): Description of recipe. Defaults to None.
            diet_type (list of str, optional): Types of diet this recipe satisfies.
                Defaults to None.
            instructions (str, optional): Recipe instructions. Defaults to None.
            photo_url (str, optional): URL for recipe photo. Defaults to None.
            video_url (str, optional): URL for recipe video. Defaults to None.
            ingredients (list of dict, optional): Ingredients required for this recipe.
                Defaults to None.
                    [
                        {
                            "ingredient_id": int
                            "quantity": int
                            "unit": str
                        },
                        ...
                    ]

        Returns:
            Recipe: The new recipe model.
        """
        recipe = Recipe(
            contributor=contributor,
            status=status,
            name=name,
            expected_duration=expected_duration,
            meal_type=meal_type,
            description=description,
            diet_type=diet_type,
            instructions=instructions,
            photo_url=photo_url,
            video_url=video_url,
        )
        db.session.add(recipe)
        db.session.commit()
        logger.debug("Added recipe to DB: %s", recipe)  # type: ignore

        if ingredients is None:
            return recipe

        # Add all required ingredients to session
        for ingredient in ingredients:
            db.session.add(
                RecipeIngredient(
                    recipe_id=recipe.id,
                    # TODO: what if ingredient id does not exist
                    ingredient_id=ingredient["ingredient_id"],
                    quantity=ingredient["quantity"],
                    unit=ingredient["unit"],
                )
            )
            logger.debug("Added ingredient <%s> to recipe <%s>", ingredient["ingredient_id"], recipe.id)  # type: ignore

        db.session.commit()
        return recipe

    def __repr__(self):
        return f"<id={self.id}\tcontributor={self.contributor}\tstatus={self.status}\tname={self.name}\texpected_duration={self.expected_duration}\tmeal_type={self.meal_type}\tdescription={self.description}\tdiet_type={self.diet_type}\tphoto_url={self.photo_url}\tvideo_url={self.video_url}>"


class RecipeIngredient(db.Model):
    """A many-to-many association table between Recipe and Ingredient.

    Contains additional data regarding the quantity and units of the ingredient required for
    the recipe.
    """

    recipe_id = db.Column(db.Integer, db.ForeignKey("recipe.id"), primary_key=True)
    ingredient_id = db.Column(
        db.Integer, db.ForeignKey("ingredient.id"), primary_key=True
    )

    quantity = db.Column(db.Integer)
    unit = db.Column(db.Text)

    recipe = db.relationship("Recipe", back_populates="ingredients")
    ingredient = db.relationship("Ingredient", back_populates="recipes")
