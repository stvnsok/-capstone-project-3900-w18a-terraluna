import re

from .models import User


def user_id_to_username(user_id):
    """Given a user id, returns the corresponding username.

    Args:
        user_id (int): User id to convert.

    Returns:
        str: Corresponding username of given user id.
    """
    return User.query.filter_by(id=user_id).first().username


def verify_username(username):
    """Verify if a username is of a valid format according to the following
    acceptance criteria:

        Username must be at least 2 characters.
        Username must only contain `a-z`, `A-Z`, `0-9`, `_`, `-`, `.`.
        Username must start with `a-z`, `A-Z`, `0-9`, `_`.

    Args:
        username (str): Username to verify.

    Returns:
        bool: True if valid, False otherwise.
    """
    regex = r"[a-zA-Z0-9_][a-zA-Z0-9_.-]+"
    return re.fullmatch(regex, username) is not None


def verify_email(email):
    """Verify if an email is of a valid format according to `emailregex.com`_.

    Args:
        email (str): Email to verify.

    Returns:
        bool: True if valid, False otherwise.

    .. _emailregex.com:
        http://emailregex.com/
    """
    # TODO: make consistent with frontend
    regex = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"
    return re.fullmatch(regex, email) is not None


def verify_password(password):
    """Verify if a password is of a valid format according to the following
    acceptance criteria:

        Password must be at least 8 characters.
        Password must contain uppercase and lowercase letters.
        Password must contain numbers.

    Args:
        password (str): Password to verify.

    Returns:
        bool: True if valid, False otherwise.
    """
    return (
        len(password) >= 8
        and re.search(r"[a-z]", password)
        and re.search(r"[A-Z]", password)
        and re.search(r"[0-9]", password)
    )
