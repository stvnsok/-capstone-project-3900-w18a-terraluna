from app import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uname = db.Column(db.Text, unique=True, nullable=False)
    email = db.Column(db.Text, unique=True, nullable=False)
    pword = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f"{self.uname} {self.email}"
