from flask import Blueprint, jsonify, request
from flask_jwt_extended.utils import (
    create_access_token,
    create_refresh_token,
    get_jwt,
    get_jwt_identity,
)
from flask_jwt_extended.view_decorators import jwt_required

from app import jwt, logger
from error import *

from .error import *
from .models import *
from .utils import *

auth_bp = Blueprint("auth_bp", __name__)
"""Blueprint: A Blueprint for all authentication and authorization routes."""


@jwt.token_in_blocklist_loader
def token_revoked_callback(jwt_header, jwt_payload):
    """A callback function that is called on an attempt to access a JWT protected
    route. The callback verifies that a JWT has been revoked (added to the blocklist).

    Args:
        jwt_header (dict): Header data of the JWT.
        jwt_payload (dict): Payload data of the JWT.

    Returns:
        bool: `True` if the token has been revoked, `False` otherwise.
    """
    jti = jwt_payload["jti"]
    token = RevokedToken.query.filter_by(jti=jti).first()
    return token is not None


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """Generate a new stale (not fresh) access token using a valid refresh token."""
    username = get_jwt_identity()
    access_token = create_access_token(identity=username, fresh=False)
    logger.debug("Refreshed access token for: %s", username)  # type: ignore
    return jsonify(access_token=access_token)


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user with a username, email and password.

    Generates a new access/refresh token pair.
    """
    data = request.get_json()

    # Check for Malformed Requests
    if not data:
        raise Error400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

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
    return jsonify(access_token=access_token, refresh_token=refresh_token), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """Log in a user with valid credentials.

    Generates a new access/refresh token pair.
    """
    data = request.get_json()

    # Check for Malformed Requests
    if not data:
        raise Error400

    username_or_email = data.get("username_or_email")
    password = data.get("password")

    if not username_or_email or not password:
        raise Error400

    # Find User
    if "@" in username_or_email:
        user = User.query.filter_by(email=username_or_email).first()
    else:
        user = User.query.filter_by(username=username_or_email).first()

    if not user:
        raise IncorrectLoginError

    if not user.verify_password(password):
        raise IncorrectLoginError

    # Return JWT Access & Refresh Token
    access_token = create_access_token(identity=user.username, fresh=True)
    refresh_token = create_refresh_token(identity=user.username)
    logger.debug("User logged in: %s", user)  # type: ignore
    return jsonify(access_token=access_token, refresh_token=refresh_token)


@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required(verify_type=False)
def logout():
    """Log out a user by revoking their access token.

    This route should be called twice with both the access token and
    refresh token in order to revoke both of them.
    """
    username = get_jwt_identity()
    token = get_jwt()
    jti = token["jti"]
    type = token["type"]
    RevokedToken.create(jti, type)
    logger.debug("User logged out (%s): %s", type, username)  # type: ignore
    return {}


@auth_bp.route("/reset/username", methods=["PUT"])
@jwt_required(fresh=True)
def reset_username():
    """Reset a user's username to a valid unique username. Fresh access token required."""
    data = request.get_json()

    # Check for Malformed Requests
    if not data:
        raise Error400

    new_username = data.get("new_username")

    if not new_username:
        raise Error400

    # Check if new_username is in use
    if User.query.filter_by(username=new_username).first():
        raise UsernameInUseError

    # Reset username
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()
    if not user.reset_username(new_username):
        raise InvalidUsernameFormatError

    return {}


@auth_bp.route("/reset/email", methods=["PUT"])
@jwt_required(fresh=True)
def reset_email():
    """Reset a user's email to a valid unique email. Fresh access token required."""
    data = request.get_json()

    # Check for Malformed Requests
    if not data:
        raise Error400

    new_email = data.get("new_email")

    if not new_email:
        raise Error400

    # Check if new_email is in use
    if User.query.filter_by(email=new_email).first():
        raise EmailInUseError

    # Reset email
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()
    if not user.reset_email(new_email):
        raise InvalidEmailFormatError

    return {}


@auth_bp.route("/reset/password", methods=["PUT"])
@jwt_required(fresh=True)
def reset_password():
    """Reset a user's password to a valid password. Fresh access token required."""
    data = request.get_json()

    # Check for Malformed Requests
    if not data:
        raise Error400

    old_password = data.get("old_password")
    new_password = data.get("new_password")

    if not old_password or not new_password:
        raise Error400

    # Check if old_password is correct
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()
    if not user.verify_password(old_password):
        raise IncorrectPasswordError

    # Reset password
    if not user.reset_password(new_password):
        raise WeakPasswordError

    return {}


# TODO: This is a test route, delete later
@auth_bp.route("/protected")
@jwt_required()
def protected():
    identity = get_jwt_identity()
    return f"Hello, {identity}!"
