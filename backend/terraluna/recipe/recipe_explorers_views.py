#####################


#####################


## IGNORE THIS FILE FOR NOW ##

def search_recipes():
    """Search for matching recipes given a list of ingredients
    modified by filters

    Modifies most searched ingredients/combinations (TODO)
    """
    data = request.get_json()

    # Check for Malformed Requests
    if not data:
        raise Error400

    ingredients = data.get("ingredients")
    filters = data.get("email")

    if not username or not email or not password:
        raise Error400

    # Check for Well-formed Requests that cannot be processed
    if not verify_username(username):
        raise InvalidUsernameFormatError

    if not verify_email(email):
        raise InvalidEmailFormatError

    if not verify_password(password):
        raise WeakPasswordError

    # Check if username or email is taken
    if User.query.filter_by(username=username).first():
        raise UsernameInUseError

    if User.query.filter_by(email=email).first():
        raise EmailInUseError

    # Create User model and add it to DB
    user = User.create(username, email, password)

    # Return JWT Access & Refresh Token
    access_token = create_access_token(identity=user.username, fresh=True)
    refresh_token = create_refresh_token(identity=user.username)
    logger.debug("Registered user: %s", user)  # type: ignore
    return jsonify(access_token=access_token, refresh_token=refresh_token, username=user.username), 201