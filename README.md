# COMP3900 w18a-terraluna Project
## Interface Specifications
### Data Types
| Variable name | Type |
|---|---|
| named exactly **name** | string |
| named exactly **description** | string |
| named exactly **mealType** | [ string ] |
| named exactly **dietType** | [ string ] |
| named exactly **recipeInstructions** | string |
| named exactly **expectedDuration** | integer |
| named exactly **quantity** | integer |
| named exactly **units** | string |
| named exactly **published** | enum |
| named exactly **query** | string |
| named exactly **message** | string |
| (output only) named exactly **time** | integer (unix timestamp) |
| has suffix **_id** | integer |
| has suffix **_url** | string |
| (input only) named exactly **ingredients** | List of dictionaries, where each dictionary contains types { ingredient_id, quantity, units } |
| named exactly **filters** | Dictionary containing { ...different booleans vegetarian, lactose, vegan } |
| (outputs only) named exactly **ingredients** | List of dictionaries, where each dictionary contains types { ingredient_id, name } |
| (outputs only) named exactly **ingredientCategories** | List of dictionaries, where each dictionary contains types { name, ingredients } |
| (outputs only) named exactly **recipes** | List of dictionaries, where each dictionary contains types { recipe_id, name, recipePhoto_url, published, description } |
| (outputs only) named exactly **comments** | List of dictionaries, where each dictionary contains types { comment_id, name, message, time } |

### Interface
| HTTP Route | HTTP Method | Description | Args/Form/JSON | Response | Errors |
|---|---|---|---|---|---|
| **/ingredients** | GET | Return up to 10 matching ingredients (based on frequency in recipes). Empty query returns up to 10 most frequently used ingredients | JSON<pre>{<br>  "query": "wa"<br>}</pre> | <pre>{<br>    "ingredients": [<br>        {"id": 1, "name": "water"},<br>        ...<br>    ]<br>}</pre> | |
| /suggest_ingredients | GET | | { "ingredients": [ingredient_id] } | { ingredients } | |
| **/recipe** | POST | Create a new recipe *draft* | Form<pre>{<br>    "name": "Pasta",<br>    "description": "Pasta recipe",<br>    "expectedDuration": 1922,<br>    "mealType": ["lunch", "dinner"],<br>    "dietType": ["vegetarian", "nut-free"],<br>    "ingredients": [<br>        {<br>            "id": 1,<br>            "quantity": 5,<br>            "units": "ml"<br>        },<br>        ...<br>    ],<br>    "instruction": ["Step 1", "Step 2", "Step 3", ...]<br>}</pre>Files<pre>{<br>    "image": (binary),<br>    "1": (binary),<br>    "3": (binary), /* video for instruction step 3 */<br>    ...<br>}</pre> | `{ }` | |
| /my_recipes | GET | | {} | { recipes } | |
| /my_recipes/{id} | GET | | {} | { name, recipePhoto_url, recipeVideo_url, description, mealType, dietType, recipeInstructions, expectedDuration, requiredIngredients } | |
| /my_recipes/{id} | PUT | | { name, recipePhoto_url, recipeVideo_url, description, mealType, dietType, recipeInstructions, expectedDuration, requiredIngredients } | { recipe_id, name, recipePhoto_url, published, description } | |
| /my_recipes/{id} | DELETE | | {} | { recipe_id } | |
| /my_recipe/{id}/copy | POST | | {} | { recipe_id, name, recipePhoto_url, published, description } | |
| /my_recipe/{id}/publish | PUT | | {} | { recipe_id, name, recipePhoto_url, published, description } | |
| /recipe_explorers/ingredient_categories | GET | | {} | { ingredientCategories } | |
| /recipe_explorers/pantry | GET | | {} | { pantry } | |
| /recipe_explorers/pantry | PUT | | { pantry } | { pantry } | |
| /recipe_explorers/search | GET | | { "ingredients":[ingredient_id], "mealtype":[mealType], "dietType":[dietType], expectedDuration} | { recipes } | |
| /recipe_explorers/recipe/{id} | GET | | {} | { name, recipePhoto_url, recipeVideo_url, description, mealType, dietType, recipeInstructions, expectedDuration, requiredIngredients, comments } | |
| /recipe_explorers/recipe/{id}/comment | POST | | { message } | { comment_id } | |
| /recipe_explorers/savedRecipes | GET | | {} | { recipes } | |
| /recipe_explorers/savedRecipes/{id} | PUT | | {} | { recipe_id } | |
| /recipe_explorers/savedRecipes/{id} | DELETE | | {} | { recipe_id } | |
