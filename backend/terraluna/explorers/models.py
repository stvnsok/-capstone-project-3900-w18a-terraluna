import datetime

from app import db, logger

category_association_table = db.Table(
    "category_association",
    db.Base.metadata,
    db.Column("ingredient_category_name", db.ForeignKey("ingredientcategory.name")),
    db.Column("ingredient_id", db.ForeignKey("ingredient.id")),
)

class IngredientCategory(db.Model):
    """An Ingredient Category"""
    
    name = db.Column(db.Text, primary_key=True)
    ingredients = db.relationship("Ingredient", secondary=category_association_table)

class UserPantry(db.model):
    """An explorer's pantry"""

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key=True)
    ingredient_id = db.Column(
        db.Integer, db.ForeignKey("ingredient.id"), primary_key=True
    )

class UserSavedRecipes(db.Model):
    """An explorer's saved recipe"""
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipe.id"), primary_key=True)

class Comment(db.Model):
    """A comment on a recipe"""

    id = db.column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipe.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    message = db.Column(db.Text)
    time = db.Column(db.Time)
    recipe = db.relationship("Recipe", backref="comments")

    @staticmethod
    def create(recipe_id, user_id, message):
        """Create a new comment model and add it to the database. 

        Args:
            recipe_id (int): recipe id.
            user_id (int): user id.
            comment (str): comment.

        Returns:
            Comment: The new comment model.
        """
        # Create and add comment object to db
        comment = Comment(recipe_id=recipe_id, user_id=user_id, message=message, time=datetime.datetime.now())
        db.session.add(comment)

        # Commit changes to database
        db.session.commit()
        logger.debug("Added comment to DB: comment_id: {comment.id}")  # type: ignore
        return comment

class IngredientFrequency(db.Model):
    pass

class SearchFrequency(db.Model):
    pass