import sys

from app import db
from data import data_utils
from terraluna.auth.models import *
from terraluna.recipe.models import *


def reset_db():
    db.reflect()
    db.drop_all()
    db.create_all()

def load_basic_ingredients():
    for name in data_utils.data_file_to_lines("basicIngredients.txt"):
        Ingredient.create(name)

def load_users():
    User.create()
    User.create()

def load_basic_categories():
    pass

def load_users(test_recipes=False):
    pass

if len(sys.argv) < 2:
    inputString = input("Are you sure you want to reset the whole database? (Y/N)")
    if inputString == "Y":
        reset_db()
elif sys.argv[1] == "reset":
    reset_db()
elif sys.argv[1] == "basic_ingredients":
    reset_db()
    load_basic_ingredients()
elif sys.argv[1] == "basic_ingredients_users":
    reset_db()
    load_basic_ingredients()
elif sys.argv[1] == "basic_ingredients_users_recipes":
    reset_db()
    pass
elif sys.argv[1] == "basic_categories":
    reset_db()
    pass
elif sys.argv[1] == "basic_categories_users":
    reset_db()
    pass
elif sys.argv[1] == "basic_categories_users_recipes":
    reset_db()
    pass
