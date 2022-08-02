from datetime import datetime

from sqlalchemy import func

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
    expected_duration_mins = db.Column(db.Integer)  # minutes
    meal_types = db.Column(db.ARRAY(db.Text))  # breakfast, lunch, dinner, ...
    diet_types = db.Column(db.ARRAY(db.Text))  # vegan, vegetarian, ...
    description = db.Column(db.Text)
    instructions = db.Column(db.ARRAY(db.Text))
    photo_url = db.Column(db.Text)
    video_urls = db.Column(db.ARRAY(db.Text))  # one per instruction

    ingredients = db.relationship("RecipeIngredient", back_populates="recipe")
    comments = db.relationship("Comment", back_populates="recipe")

    @staticmethod
    def create(
        contributor,
        status,
        name,
        expected_duration_mins=None,
        meal_types=None,
        diet_types=None,
        description=None,
        instructions=None,
        photo_url=None,
        video_urls=None,
        ingredients=None,
    ):
        """Create a new recipe model and add it to the database.

        Ingredients are also added to the RecipeIngredient association table.

        Args:
            contributor (int): ID of recipe contributor.
            status (str): Status of recipe (Draft, Template or Published).
            name (str): Recipe name.
            expected_duration_mins (int, optional): Estimated cooking time duration
                in minutes. Defaults to None.
            meal_types (list of str, optional): Types of meal this recipe falls under.
                Defaults to None.
            diet_type (list of str, optional): Types of diet this recipe satisfies.
                Defaults to None.
            description (str, optional): Description of recipe. Defaults to None.
            instructions (list of str, optional): Recipe instructions. Defaults to None.
            photo_url (str, optional): URL for recipe photo. Defaults to None.
            video_urls (list of str, optional): URL for recipe instruction videos. Defaults to None.
            ingredients (list of dict, optional): Ingredients required for this recipe.
                Defaults to None.
                    [
                        {
                            "id": int,
                            "name": str,
                            "quantity": int,
                            "units": str
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
            expected_duration_mins=expected_duration_mins,
            meal_types=meal_types,
            diet_types=diet_types,
            description=description,
            instructions=instructions,
            photo_url=photo_url,
            video_urls=video_urls,
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
                    ingredient_id=ingredient["id"],
                    quantity=ingredient["quantity"],
                    unit=ingredient["units"],
                )
            )
            logger.debug("Added ingredient <%s> to recipe <%s>", ingredient["id"], recipe.id)  # type: ignore

        db.session.commit()
        return recipe

    @staticmethod
    def delete(id):
        """Delete a recipe from the database.

        Args:
            id (int): Id of recipe to delete
        """
        db.session.query(RecipeIngredient).filter(
            RecipeIngredient.recipe_id == id
        ).delete()
        db.session.query(Recipe).filter(Recipe.id == id).delete()
        db.session.commit()

    @staticmethod
    def publish(id):
        """Publish a draft recipe.

        Args:
            id (int): Id of recipe draft to publish.
        """
        Recipe.query.filter_by(id=id).first().status = "Published"
        db.session.commit()

    def jsonify(self):
        return {
            "id": self.id,
            "status": self.status,
            "name": self.name,
            "cookTime": self.expected_duration_mins,
            "mealType": self.meal_types,
            "dietType": self.diet_types,
            "description": self.description,
            "imageUrl": self.photo_url,
        }

    def jsonify_extended(self):
        ingredients = [
            {
                "id": recipe_ingredient.ingredient_id,
                "name": recipe_ingredient.ingredient.name,
                "units": recipe_ingredient.unit,
                "quantity": recipe_ingredient.quantity,
            }
            for recipe_ingredient in self.ingredients
        ]

        steps = [
            {"instruction": self.instructions[i], "videoUrl": self.video_urls[i]}
            for i in range(len(self.instructions))
        ]

        reviews = [
            {"stars": comment.stars, "review": comment.message}
            for comment in self.comments
        ]

        return {
            "id": self.id,
            "status": self.status,
            "name": self.name,
            "cookTime": self.expected_duration_mins,
            "mealType": self.meal_types,
            "dietType": self.diet_types,
            "description": self.description,
            "imageUrl": self.photo_url,
            "ingredients": ingredients,
            "steps": steps,
            "reviews": reviews,
        }

    def __repr__(self):
        return f"<id={self.id}\tcontributor={self.contributor}\tstatus={self.status}\tname={self.name}\texpected_duration_mins={self.expected_duration_mins}\tmeal_types={self.meal_types}\tdescription={self.description}\tdiet_types={self.diet_types}\tphoto_url={self.photo_url}\tvideo_urls={self.video_urls}>"


class RecipeIngredient(db.Model):
    """A many-to-many association table between Recipe and Ingredient.

    Contains additional data regarding the quantity and units of the ingredient required for
    the recipe.
    """

    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipe.id"), nullable=False)
    ingredient_id = db.Column(
        db.Integer, db.ForeignKey("ingredient.id"), nullable=False
    )

    quantity = db.Column(db.Integer)
    unit = db.Column(db.Text)

    recipe = db.relationship("Recipe", back_populates="ingredients")
    ingredient = db.relationship("Ingredient", back_populates="recipes")


class Comment(db.Model):
    """A comment/review on a recipe."""

    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipe.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    stars = db.Column(db.Integer)
    message = db.Column(db.Text)
    time = db.Column(db.Time)

    recipe = db.relationship("Recipe", back_populates="comments")

    @staticmethod
    def create(recipe_id, user_id, stars, message):
        """Create a new comment model and add it to the database.

        Args:
            recipe_id (int): Id of recipe being reviewed.
            user_id (int): User id of reviewer.
            stars (int): Star rating given (1 to 5).
            message (str): Review message.

        Returns:
            Comment: The new comment model.
        """
        # Create and add comment object to db
        comment = Comment(
            recipe_id=recipe_id,
            user_id=user_id,
            stars=stars,
            message=message,
            time=datetime.now(),
        )
        db.session.add(comment)
        db.session.commit()
        logger.debug("Added comment to DB: <%s>", comment.id)  # type: ignore
        return comment
