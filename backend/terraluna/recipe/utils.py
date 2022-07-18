import re

from terraluna.auth.models import User


def username_to_user_id(username):
    """Given a username, returns the corresponding user id

    Args:
        username (str): username to process.

    Returns:
        int: user_id
    """
    user = User.query.filter_by(username=username).first()
    return user.id

def verify_recipe_name(name):
    """Verify if a recipe name is of a valid format according to the following
    acceptance criteria:

        Recipe name must be at least 2 characters, excluding trailing whitespaces
        Recipe name must contain at least 1 letter or number

    Args:
        name (str): Username to verify.

    Returns:
        bool: `True` if valid, `False` otherwise.
    """
    if not re.match('.*[a-zA-Z0-9].*', name) and name.strip().len() >= 2:
        return False
    return True