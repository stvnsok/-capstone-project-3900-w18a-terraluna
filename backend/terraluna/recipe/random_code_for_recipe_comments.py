from app import db, logger


class IngredientCategory(db.Model):
    """An Ingredient Category"""

    

class Comment(db.Model):
    """A comment on a recipe"""

    id = db.column(db.Integer, primary_key=True)
    recipe_id = db.column(db.Integer, db.ForeignKey("recipe.id"))
    user_id = db.column(db.Integer, db.ForeignKey("user.id"))
    message = db.column(db.Text)
    recipe = db.relationship("Recipe", backref="comments")

    @staticmethod
    def create(recipe_id, user_id, comment):
        """Create a new comment model and add it to the database. 

        Args:
            recipe_id (int): recipe id.
            user_id (int): user id.
            comment (str): comment.

        Returns:
            Comment: The new comment model.
        """
        # Create and add comment object to db
        comment = Comment(recipe_id=recipe_id, user_id=user_id, message=message)
        db.session.add(comment)

        # Commit changes to database
        db.session.commit()
        logger.debug("Added comment to DB: comment_id: {comment.id}")  # type: ignore
        return comment
