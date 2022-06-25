import re


def verify_username(username):
    """Verify if a username is of a valid format according to the following
    acceptance criteria:

        Username must be at least 2 characters.
        Username must only contain `a-z`, `A-Z`, `0-9`, `_`, `-`, `.`.
        Username must start with `a-z`, `A-Z`, `0-9`, `_`.

    Args:
        username (str): Username to verify.

    Returns:
        bool: `True` if valid, `False` otherwise.
    """
    if not re.fullmatch(r"[a-zA-Z0-9_][a-zA-Z0-9_.-]+", username):
        return False
    return True


def verify_email(email):
    """Verify if an email is of a valid format according to `emailregex.com`_.

    Args:
        email (str): Email to verify.

    Returns:
        bool: `True` if valid, `False` otherwise.

    .. _emailregex.com:
        http://emailregex.com/
    """
    regex = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"
    if re.fullmatch(regex, email):
        return True
    return False


def verify_password(password):
    """Verify if a password is of a valid format according to the following
    acceptance criteria:

        Password must be at least 8 characters.
        Password must contain uppercase and lowercase letters.
        Password must contain numbers.

    Args:
        password (str): Password to verify.

    Returns:
        bool: `True` if valid, `False` otherwise.
    """
    if (
        len(password) < 8
        or not re.search(r"[a-z]", password)
        or not re.search(r"[A-Z]", password)
        or not re.search(r"[0-9]", password)
    ):
        return False
    return True
