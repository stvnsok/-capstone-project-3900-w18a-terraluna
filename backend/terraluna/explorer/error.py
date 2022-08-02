from error import *


class RecipeDoesNotExists(Error404):
    description = "recipe_id does not exists"


class InvalidComment(Error422):
    description = "message is not valid"
