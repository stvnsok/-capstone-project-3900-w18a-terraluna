from werkzeug.security import check_password_hash, generate_password_hash

from app import db, logger


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True, nullable=False)
    email = db.Column(db.Text, unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = generate_password_hash(password)

    @staticmethod
    def create(username, email, password):
        user = User(username, email, password)
        db.session.add(user)
        db.session.commit()
        logger.debug("Added user to DB: %s", user)  # type: ignore
        return user

    def verify_password(self, password):
        return check_password_hash(self.password, password)

    def __repr__(self):
        return f"<id={self.id}\tusername={self.username}\temail={self.email}>"
