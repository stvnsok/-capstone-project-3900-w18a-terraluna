from app import db


class IngredientCategory(db.Model):
    """An ingredient category."""

    name = db.Column(db.Text, primary_key=True)
    ingredient_id = db.Column(
        db.Integer, db.ForeignKey("ingredient.id"), primary_key=True
    )

    @staticmethod
    def create(name, ingredient_id):
        db.session.add(IngredientCategory(name=name, ingredient_id=ingredient_id))
        db.session.commit()


class UserPantry(db.Model):
    """An explorer's pantry."""

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key=True)
    ingredient_id = db.Column(
        db.Integer, db.ForeignKey("ingredient.id"), primary_key=True
    )


class UserSavedRecipes(db.Model):
    """An explorer's saved recipes."""

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipe.id"), primary_key=True)
