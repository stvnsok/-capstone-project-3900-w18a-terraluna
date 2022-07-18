from error import *


class InvalidRecipeNameFormatError(Error422):
    description = "Invalid recipe name format"


class ForbiddenRecipeContributor(Error403):
    description = "Unauthorised Recipe Contributor: You don't have permission to access this recipe"


