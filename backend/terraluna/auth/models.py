from datetime import datetime, timezone

from werkzeug.security import check_password_hash, generate_password_hash

from app import db, logger

from .utils import *


class User(db.Model):
    """A registered user model."""

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True, nullable=False)
    email = db.Column(db.Text, unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)

    @staticmethod
    def create(username, email, password):
        """Create a new user model and add it to the database. The password
        is hashed and salted before being added to the database.

        Args:
            username (str): Unique public username.
            email (str): Unique user email.
            password (str): Plaintext user password.

        Returns:
            User: The new user model.
        """
        user = User(
            username=username, email=email, password=generate_password_hash(password)
        )
        db.session.add(user)
        db.session.commit()
        logger.debug("Added user to DB: %s", user)  # type: ignore
        return user

    def verify_password(self, password):
        """Check a password against the user's hashed and salted password.

        Args:
            password (str): The plaintext password to compare against the hash.

        Returns:
            bool: `True` if the password matched, `False` otherwise.
        """
        return check_password_hash(self.password, password)

    def reset_username(self, new_username):
        """Reset the user's username with a new username. The new username is
        checked for valid formatting.

        Args:
            new_username (str): New updated username.

        Returns:
            bool: `True` if success. `False` otherwise (invalid username format)
        """
        if not verify_username(new_username):
            return False
        old_username = self.username
        self.username = new_username
        db.session.commit()
        logger.debug("Updated user's username: %s <old_username=%s>", self, old_username)  # type: ignore
        return True

    def reset_email(self, new_email):
        """Reset the user's email with a new email. The new email is checked for
        valid formatting.

        Args:
            new_email (str): New updated email.

        Returns:
            bool: `True` if success, `False` otherwise (invalid email format).
        """
        if not verify_email(new_email):
            return False
        old_email = self.email
        self.email = new_email
        db.session.commit()
        logger.debug("Updated user's email: %s <old_email=%s>", self, old_email)  # type: ignore
        return True

    def reset_password(self, new_password):
        """Reset the user's password with a new hashed and salted password and
        update the database record.

        The new password is checked for strength.

        Args:
            new_password (str): New updated plaintext password.

        Returns:
            bool: `True` if success, `False` otherwise (password too weak).
        """
        if not verify_password(new_password):
            return False
        self.password = generate_password_hash(new_password)
        db.session.commit()
        logger.debug("Updated user's password: %s", self)  # type: ignore
        return True

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
