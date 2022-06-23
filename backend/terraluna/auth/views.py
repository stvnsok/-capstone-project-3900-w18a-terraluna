from flask import Blueprint, jsonify, request
from flask_jwt_extended.utils import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
)
from flask_jwt_extended.view_decorators import jwt_required

from app import logger
from error import *

from .error import *
from .models import *
from .utils import *

auth_bp = Blueprint("auth_bp", __name__)


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity, fresh=False)
    logger.debug("Refreshed token for: %s", identity)  # type: ignore
    return jsonify(access_token=access_token)


@auth_bp.route("/register", methods=["POST"])
def register():
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
        raise InvalidUsernameError

    if not verify_email(email):
        raise InvalidEmailError

    if not verify_password(password):
        raise InvalidPasswordError

    # Check if username or email is taken
    if User.query.filter_by(username=username).one_or_none():
        raise UsernameInUseError

    if User.query.filter_by(email=email).one_or_none():
        raise EmailInUseError

    # Create User model and add it to db
    user = User.create(username, email, password)

    # Return JWT Access & Refresh Token
    access_token = create_access_token(identity=user.username, fresh=True)
    refresh_token = create_refresh_token(identity=user.username)
    logger.debug("Registered user: %s", user)  # type: ignore
    return jsonify(access_token=access_token, refresh_token=refresh_token), 201


@auth_bp.route("/login", methods=["POST"])
def login():
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
        user = User.query.filter_by(email=username_or_email).one_or_none()
    else:
        user = User.query.filter_by(username=username_or_email).one_or_none()

    if not user:
        raise InvalidUsernameEmailOrPassword

    if not user.verify_password(password):
        raise InvalidUsernameEmailOrPassword

    # Return JWT Access & Refresh Token
    access_token = create_access_token(identity=user.username, fresh=True)
    refresh_token = create_refresh_token(identity=user.username)
    logger.debug("User logged in: %s", user)  # type: ignore
    return jsonify(access_token=access_token, refresh_token=refresh_token)


# TODO: This is a test route, delete later
@auth_bp.route("/protected")
@jwt_required(fresh=True)
def protected():
    identity = get_jwt_identity()
    return f"Hello, {identity}!"
