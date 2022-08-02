from error import *


class IncompleteRecipeError(Error422):
    description = "Cannot perform this action until recipe is complete"


class CannotPublishATemplateRecipe(Error422):
    description = "You cannot publish a copied recipe"


class ForbiddenRecipeContributor(Error403):
    description = "Unauthorised Recipe Contributor: You don't have permission to access this recipe"
