from error import *


class IncompleteRecipeError(Error422):
    description = "Cannot perform this action until recipe is complete"


class CannotPublishATemplateRecipe(Error422):
    description = "You cannot publish a copied recipe"
