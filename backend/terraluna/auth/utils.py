import re


def verify_username(username):
    # Acceptance Criteria: username must be at least 2 characters
    # Acceptance Criteria: username must only contain a-z, A-Z, 0-9, _, -, .
    # Acceptance Criteria: username must start with a-z, A-Z, 0-9, _
    if not re.fullmatch(r"[a-zA-Z0-9_][a-zA-Z0-9_.-]+", username):
        return False
    return True


def verify_email(email):
    regex = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"
    if re.fullmatch(regex, email):
        return True
    return False


def verify_password(password):
    # Acceptance Criteria: password must be at least 8 characters
    # Acceptance Criteria: password must contain uppercase and lowercase letters
    # Acceptance Criteria: password must contain numbers
    if (
        len(password) < 8
        or not re.search(r"[a-z]", password)
        or not re.search(r"[A-Z]", password)
        or not re.search(r"[0-9]", password)
    ):
        return False
    return True
