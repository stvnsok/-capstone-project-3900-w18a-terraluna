# COMP3900 w18a-terraluna Project
## Requirements

* `python==3.8.12`
* `node==14.17.3`

## Installation & Setup

### Cloning the Repository

On Lubuntu 20.04.1 LTS VM, the clipboard can be bidirectionally shared by enabling it in Settings > General > Advanced.

```bash
# Generate SSH key
$ ssh-keygen -t ed25519 -a 100

# Display SSH public key
$ cat ~/.ssh/id_ed25519.pub
```

Add SSH key to GitHub.

```bash
# Clone the repository
$ git clone git@github.com:unsw-cse-comp3900-9900-22T2/capstone-project-3900-w18a-terraluna.git

# cd into repository
$ cd capstone-project-3900-w18a-terraluna/
```

### Lubuntu 20.04.1 LTS VM

Run the `setup-lubuntu.sh` script. Enter sudo password `lubuntu` when prompted.

```bash
$ ./setup-lubuntu.sh
```

The script does the following:

```bash
# Install venv and postgres
$ sudo apt update
$ sudo apt install python3-venv postgresql postgresql-contrib -y

# Start postgres service
$ sudo systemctl start postgresql.service

# Create user and database and set DATABASE_URL in .env
$ sudo -u postgres psql -c "CREATE ROLE cs3900 PASSWORD 'cs3900' SUPERUSER CREATEDB CREATEROLE INHERIT LOGIN"
$ sudo -u postgres createdb cs3900-terraluna --owner=cs3900
$ sed -i -e 's#DATABASE_URL=.*#DATABASE_URL=postgresql\+psycopg2://cs3900:cs3900@localhost:5432/cs3900-terraluna#' backend/.env

# Install node using nvm
$ wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
$ exec bash -l
$ nvm install 14.17.3

# Create virtual environment and install requirements
$ cd backend/
$ python3 -m venv venv
$ source venv/bin/activate
$ python3 -m pip install -r requirements.txt

# Run db migrations and seed ingredients and ingredient categories
$ flask db upgrade
$ python3 seed.py basic_categories

# Install node packages
$ cd ../frontend
$ npm install
```

Create a Postgres database and in `.env` set `DATABASE_URL` to `dialect+driver://username:password@host:port/database`.

For example, `postgresql+psycopg2://james:james@localhost:5432/terraluna`.

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
| **/ingredients** | GET | Return up to 10 matching ingredients (based on frequency in recipes). Empty query returns up to 10 most frequently used ingredients. | Arg<pre>?query=wa</pre> | <pre>200<br>{<br>    "ingredients": [<br>        {"id": 1, "name": "water"},<br>        ...<br>    ]<br>}</pre> | |
| **/recipe/ingredient_suggestions** | GET | Suggest ingredients to add to a recipe. An ingredient is suggested if it is not in the current recipe but in another recipe that contains all the current ingredients and more. | Args<pre>?ingredients={"ingredients": ["1", "2", ...]}</pre> | <pre>200<br>{<br>    "ingredients": [<br>        {"id": 1, "name": "water"},<br>        ...<br>    ]<br>}</pre> | |
| **/recipe** | POST | Create a new recipe *draft*. | Form<pre>{<br>    "name": "Pasta",<br>    "description": "Pasta recipe",<br>    "expectedDuration": "1922",<br>    "mealType": {"mealType": ["lunch", "dinner"]},<br>    "dietType": {"dietType": ["vegetarian", "nut-free"]},<br>    "ingredients": {"ingredients": [<br>        {<br>            "id": 1,<br>            "name": "Water",<br>            "quantity": 5,<br>            "units": "ml"<br>        },<br>        ...<br>    ]},<br>    "instructions": {"instructions": ["Step 1", "Step 2", "Step 3", ...]}<br>}</pre>Files<pre>{<br>    "image": (binary),<br>    "video0": (binary),<br>    "video2": (binary), /* video for instruction step 3 */<br>    ...<br>}</pre> | <pre>201<br>{<br>    "recipe": {<br>        "id": 1,<br>        "status": "Draft",<br>        "name": "Pasta",<br>        "cookTime": 50,<br>        "mealType": ["lunch"],<br>        "dietType": ["vegan"],<br>        "description": "Pasta recipe",<br>        "imageUrl": "/home/bob/images/cat.jpg"<br>    }<br>}</post> | |
| **/my_recipes/{id}** | DELETE | Delete a recipe. | | <pre>204 ""</pre> | |
| **/my_recipes** | GET | Get all of the user's recipes with an optional query on the recipe name. | Args<pre>?query=wa</pre> | <pre>200<br>{<br>    "recipes": [<br>        {<br>            "id": 1,<br>            "status": "Draft",<br>            "name": "Pasta",<br>            "cookTime": 50,<br>            "mealType": ["lunch"],<br>            "dietType": ["vegan"],<br>            "description": "Pasta recipe",<br>            "imageUrl": "/home/bob/images/cat.jpg"<br>        }<br>    ]<br>}</pre> | |
| /my_recipes/{id} | GET | | {} | { name, recipePhoto_url, recipeVideo_url, description, mealType, dietType, recipeInstructions, expectedDuration, requiredIngredients } | |
| /my_recipes/{id} | PUT | | { name, recipePhoto_url, recipeVideo_url, description, mealType, dietType, recipeInstructions, expectedDuration, requiredIngredients } | { recipe_id, name, recipePhoto_url, published, description } | |
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
