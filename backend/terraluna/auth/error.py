from error import *


class InvalidUsernameFormatError(Error422):
    description = "Invalid username format"


class InvalidEmailFormatError(Error422):
    description = "Invalid email format"


class WeakPasswordError(Error422):
    description = "Password too weak"


class UsernameInUseError(Error409):
    description = "Username is in use"


class EmailInUseError(Error409):
    description = "Email is in use"


class IncorrectLoginError(Error401):
    description = "Incorrect username/email and/or password"


class IncorrectPasswordError(Error401):
    description = "Incorrect password"
