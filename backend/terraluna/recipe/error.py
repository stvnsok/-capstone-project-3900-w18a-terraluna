from error import *


class IncompleteRecipeError(Error422):
    description = "Cannot perform this action until recipe is complete"


class ForbiddenRecipeContributor(Error403):
    description = "Unauthorised Recipe Contributor: You don't have permission to access this recipe"
