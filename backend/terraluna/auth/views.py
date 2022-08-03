from flask import Blueprint, jsonify, request
from flask_jwt_extended.utils import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_jwt,
    get_jwt_identity,
)
from flask_jwt_extended.view_decorators import jwt_required

from app import jwt, logger
from utils import *

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
        bool: True if the token has been revoked, False otherwise.
    """
    return RevokedToken.query.filter_by(jti=jwt_payload["jti"]).first() is not None


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """Generate a new stale (not fresh) access token using a valid refresh token."""
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=user_id, fresh=False)
    logger.debug("Refreshed access token for: %s", user_id)  # type: ignore
    return jsonify(access_token=access_token)


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user with a username, email and password.

    Generates a new access/refresh token pair.
    """
    data = request.get_json()
    username, email, password = get_data(data, "username", "email", "password")

    # Register user
    user = User.register(username, email, password)

    # Return JWT Access & Refresh Token
    access_token = create_access_token(identity=user.id, fresh=True)
    refresh_token = create_refresh_token(identity=user.id)
    return (
        jsonify(
            access_token=access_token,
            refresh_token=refresh_token,
            username=user.username,
        ),
        201,
    )


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    """Log in a user with valid credentials.

    Generates a new access/refresh token pair.
    """
    if request.method == "GET":
        data = request.args
        (access_token,) = get_data(data, "access_token")
        return jsonify(username=user_id_to_username(decode_token(access_token)["sub"]))

    data = request.get_json()
    username_or_email, password = get_data(data, "username_or_email", "password")

    # Login user
    user = User.login(username_or_email, password)

    # Return JWT Access & Refresh Token
    access_token = create_access_token(identity=user.id, fresh=True)
    refresh_token = create_refresh_token(identity=user.id)
    return jsonify(
        access_token=access_token, refresh_token=refresh_token, username=user.username
    )


@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required(verify_type=False)
def logout():
    """Log out a user by revoking their access token.

    This route should be called twice with both the access token and
    refresh token in order to revoke both of them.
    """
    user_id = get_jwt_identity()
    token = get_jwt()
    jti = token["jti"]
    type = token["type"]
    RevokedToken.create(jti, type)
    logger.debug("User logged out (%s): %s", type, user_id)  # type: ignore
    return "", 204


@auth_bp.route("/reset/username", methods=["PUT"])
@jwt_required(fresh=True)
def reset_username():
    """Reset a user's username to a valid unique username. Fresh access token required."""
    data = request.get_json()
    (new_username,) = get_data(data, "new_username")

    # Reset username
    user = User.reset_username(get_jwt_identity(), new_username)
    return jsonify(username=user.username)


@auth_bp.route("/reset/email", methods=["PUT"])
@jwt_required(fresh=True)
def reset_email():
    """Reset a user's email to a valid unique email. Fresh access token required."""
    data = request.get_json()
    (new_email,) = get_data(data, "new_email")

    # Reset email
    User.reset_email(get_jwt_identity(), new_email)
    return "", 204


@auth_bp.route("/reset/password", methods=["PUT"])
@jwt_required(fresh=True)
def reset_password():
    """Reset a user's password to a valid password. Fresh access token required."""
    data = request.get_json()
    old_password, new_password = get_data(data, "old_password", "new_password")

    # Reset password
    User.reset_password(get_jwt_identity(), old_password, new_password)
    return "", 204
