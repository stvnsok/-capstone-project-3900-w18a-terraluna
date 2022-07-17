def verify_recipe_name(name):
    """Verify if a name is of a valid format according to the following
    acceptance criteria:

        Username must be at least 2 characters.
        Username must only contain `a-z`, `A-Z`, `0-9`, `_`, `-`, `.`.
        Username must start with `a-z`, `A-Z`, `0-9`, `_`.

    Args:
        name (str): Username to verify.

    Returns:
        bool: `True` if valid, `False` otherwise.
    """
    if not re.fullmatch(r"[a-zA-Z0-9_][a-zA-Z0-9_.-]+", name):
        return False
    return True