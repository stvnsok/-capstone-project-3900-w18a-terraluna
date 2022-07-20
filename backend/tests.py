from app import db, logger
from flask import Blueprint
from terraluna.auth.models import *
from terraluna.recipe.models import *

testing_bp = Blueprint("testing_bp", __name__)
"""Blueprint: A Blueprint for all testing routes."""

@testing_bp.route("/")
def test1():
    db.drop_all()
    db.create_all()
    User.create("michael", "michael@gmail.com", "12345")
    
    return "hello"
