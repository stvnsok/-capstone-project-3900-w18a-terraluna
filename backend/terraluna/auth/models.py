from datetime import datetime, timezone

from werkzeug.security import check_password_hash, generate_password_hash

from app import db, logger

from .error import *
from .utils import *


class User(db.Model):
    """A registered user model."""

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True, nullable=False)
    email = db.Column(db.Text, unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)

    @staticmethod
    def register(username, email, password):
        """Register a new user model and add it to the database. The password
        is hashed and salted before being added to the database.

        Args:
            username (str): Unique public username.
            email (str): Unique user email.
            password (str): Plaintext user password.

        Returns:
            User: The new user model.

        Raises:
            InvalidUsernameFormatError: If username is formatted incorrectly.
            InvalidEmailFormatError: If email is formatted incorrectly.
            WeakPasswordError: If password is too weak.
            UsernameInUseError: If username is already in use.
            EmailInUseError: If email is already in use.
        """
        # Check username, email, password are all formatted correctly
        raiseif(not verify_username(username), InvalidUsernameFormatError)
        raiseif(not verify_email(email), InvalidEmailFormatError)
        raiseif(not verify_password(password), WeakPasswordError)

        # Check if username or email is taken
        raiseif(
            User.query.filter_by(username=username).first() is not None,
            UsernameInUseError,
        )
        raiseif(User.query.filter_by(email=email).first() is not None, EmailInUseError)

        user = User(
            username=username, email=email, password=generate_password_hash(password)
        )
        db.session.add(user)
        db.session.commit()
        logger.debug("Registered user: %s", user)  # type: ignore
        return user

    @staticmethod
    def login(username_or_email, password):
        """Log in an existing user.

        Args:
            username_or_email (str): User's username or email.
            password (str): Password attempt.

        Returns:
            User: The existing user model.

        Raises:
            IncorrectLoginError: If username or email does not exist or if
                password is incorrect.
        """
        # Find User
        if "@" in username_or_email:
            user = User.query.filter_by(email=username_or_email).first()
        else:
            user = User.query.filter_by(username=username_or_email).first()

        if not user or not user.verify_password(password):
            raise IncorrectLoginError

        logger.debug("Logged in user: %s", user)  # type: ignore
        return user

    @staticmethod
    def reset_username(id, new_username):
        """Reset the user's username with a new username. The new username is
        checked for valid formatting.

        Args:
            id (int): User's id.
            new_username (str): New updated username.

        Returns:
            User: The user model of user with changed username.

        Raises:
            InvalidUsernameFormatError: If new username is formatted incorrectly.
            UsernameInUseError: If new username is already in use.
        """
        raiseif(not verify_username(new_username), InvalidUsernameFormatError)
        raiseif(
            User.query.filter_by(username=new_username).first() is not None,
            UsernameInUseError,
        )

        user = User.query.filter_by(id=id).first()
        user.username = new_username
        db.session.commit()
        return user

    @staticmethod
    def reset_email(id, new_email):
        """Reset the user's email with a new email. The new email is checked for
        valid formatting.

        Args:
            id (int): User's id.
            new_email (str): New updated email.

        Returns:
            User: The user model of user with changed email.

        Raises:
            InvalidEmailFormatError: If new email is formatted incorrectly.
            EmailInUseError: If new email is already in use.
        """
        raiseif(not verify_email(new_email), InvalidEmailFormatError)
        raiseif(
            User.query.filter_by(email=new_email).first() is not None, EmailInUseError
        )

        user = User.query.filter_by(id=id).first()
        user.email = new_email
        db.session.commit()
        return user

    @staticmethod
    def reset_password(id, old_password, new_password):
        """Reset the user's password with a new hashed and salted password and
        update the database record.

        The new password is checked for strength.

        Args:
            id (int): User's id.
            old_password (str): Old plaintext password.
            new_password (str): New updated plaintext password.

        Returns:
            User: The user model of user with changed password.

        Raises:
            IncorrectPasswordError: If old password is not correct.
            WeakPasswordError: If new password is too weak.
        """
        user = User.query.filter_by(id=id).first()
        raiseif(not user.verify_password(old_password), IncorrectPasswordError)
        raiseif(not verify_password(new_password), WeakPasswordError)

        user.password = generate_password_hash(new_password)
        db.session.commit()
        logger.debug("Updated user's password: %s", self)  # type: ignore
        return user

    def verify_password(self, password):
        """Check a password against the user's hashed and salted password.

        Args:
            password (str): The plaintext password to compare against the hash.

        Returns:
            bool: `True` if the password matched, `False` otherwise.
        """
        return check_password_hash(self.password, password)

    def __repr__(self):
        return f"<id={self.id}\tusername={self.username}\temail={self.email}>"


class RevokedToken(db.Model):
    """A revoked/blocklisted access or refresh token."""

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    type = db.Column(db.String(16), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)

    @staticmethod
    def create(jti, type):
        """Create a new revoked token model and add it to the database.

        Args:
            jti (str): JTI (unique identifier) of the JWT to revoke.
            type (str): Type of JWT (`access` or `refresh`) being revoked.

        Returns:
            RevokedToken: The new revoked token model.
        """
        now = datetime.now(timezone.utc)
        revoked_token = RevokedToken(jti=jti, type=type, created_at=now)
        db.session.add(revoked_token)
        db.session.commit()
        logger.debug("Added revoked token to DB: %s", revoked_token)  # type: ignore
        return revoked_token

    def __repr__(self):
        return f"<jti={self.jti}\ttype={self.type}\tcreated_at={self.created_at}>"
