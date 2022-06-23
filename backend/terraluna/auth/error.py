from error import *


class InvalidUsernameError(Error422):
    description = "Invalid username format"


class InvalidEmailError(Error422):
    description = "Invalid email format"


class InvalidPasswordError(Error422):
    description = "Password too weak"


class UsernameInUseError(Error409):
    description = "Username is in use"


class EmailInUseError(Error409):
    description = "Email is in use"


class InvalidUsernameEmailOrPassword(Error401):
    description = "Invalid username/email and/or password"
