import sys

from app import db
from terraluna.explorers.models import *
from data import data_utils
from terraluna.auth.models import *
from terraluna.recipe.models import *


def reset_db():
    db.reflect()
    db.drop_all()
    db.create_all()

def load_basic_ingredients(test_users=False, test_recipes=False):
    for name in data_utils.data_file_to_lines("basicIngredients.txt"):
        Ingredient.create(name)
    if test_users == True:
        User.create("username1", "one@unsw.com.au", "username1PASSWORD")
        User.create("username2", "two@unsw.com.au", "username2PASSWORD")
    if test_recipes == True:
        Recipe.create(2, "draft", "first recipe", 60, ["breakfast", "lunch"], "descrip first",
            ["vegetarian"], "dont do anything", "www.photo.com.au", 
            "www.video.com.au", 
            [
                {
                    'ingredient_id': 4, #bread
                    'quantity': 999,
                    'units': "this is a unit"
                },
                {
                    'ingredient_id': 2, #butter
                    'quantity': 111,
                    'units': "this is a unit recipe1 ing 2"
                }
            ]
        )
        Recipe.create(2, "draft", "second recipe", 60, ["dinner"], "descrip 2",
            [], "dont do 2anything", "www.photo.com.au", 
            "www.video.com.au", 
            [
                {
                    'ingredient_id': 2, #butter
                    'quantity': 888,
                    'units': "this is a unit2"
                }
            ]
        )
        Recipe.create(1, "draft", "3 recipe", 120, ["lunch"], "descrip 2",
            [], "dont do 3anything", "www.photo.com.au", 
            "www.video.com.au", 
            [
                {
                    'ingredient_id': 8, #vegetable oil
                    'quantity': 777,
                    'units': "this is a unit3"
                }
            ]
        )


def load_basic_categories(test_users=False, test_recipes=False):
    for file_name in data_utils.list_ingredient_category_files():
        lines = data_utils.data_file_to_lines("ingredient_categories/"+file_name)
        category_name = lines.pop(0)
        for name in lines:
            ingredient = Ingredient.create(name)
            db.session.add(IngredientCategory(name=category_name, ingredient_id=ingredient.id))
    db.session.commit()
    if test_users == True:
        User.create("username1", "one@unsw.com.au", "username1PASSWORD")
        User.create("username2", "two@unsw.com.au", "username2PASSWORD")
    if test_recipes == True:
        Recipe.create(2, "draft", "first recipe", 60, ["breakfast", "lunch"], "descrip first",
            ["vegetarian"], "dont do anything", "www.photo.com.au", 
            "www.video.com.au", 
            [
                {
                    'ingredient_id': 4, #bread
                    'quantity': 999,
                    'units': "this is a unit"
                },
                {
                    'ingredient_id': 2, #butter
                    'quantity': 111,
                    'units': "this is a unit recipe1 ing 2"
                }
            ]
        )
        Recipe.create(2, "draft", "second recipe", 60, ["dinner"], "descrip 2",
            [], "dont do 2anything", "www.photo.com.au", 
            "www.video.com.au", 
            [
                {
                    'ingredient_id': 2, #butter
                    'quantity': 888,
                    'units': "this is a unit2"
                }
            ]
        )
        Recipe.create(1, "draft", "3 recipe", 120, ["lunch"], "descrip 2",
            [], "dont do 3anything", "www.photo.com.au", 
            "www.video.com.au", 
            [
                {
                    'ingredient_id': 8, #vegetable oil
                    'quantitys': 777,
                    'unit': "this is a unit3"
                }
            ]
        )
        Comment.create(1,2,"hello")


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
    load_basic_ingredients(test_users=True)
elif sys.argv[1] == "basic_ingredients_users_recipes":
    reset_db()
    load_basic_ingredients(test_users=True, test_recipes=True)
    pass
elif sys.argv[1] == "basic_categories":
    reset_db()
    load_basic_categories()
    pass
elif sys.argv[1] == "basic_categories_users":
    reset_db()
    load_basic_categories(test_users=True)
    pass
elif sys.argv[1] == "basic_categories_users_recipes":
    reset_db()
    load_basic_categories(test_users=True, test_recipes=True)
    pass
elif sys.argv[1] == "test":
    print(data_utils.list_ingredient_category_files())
