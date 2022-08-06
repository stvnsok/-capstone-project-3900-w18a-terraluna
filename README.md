# COMP3900 w18a-terraluna Project
## Requirements

* `python==3.8.12`
* `node==14.17.3`

## Installation & Setup: Lubuntu 20.04.1 LTS VM

### Cloning the Repository

The application is best viewed on high resolutions. On the Lubuntu 20.04.1 LTS VM, click the icon in the bottom left and in `Preferences > LXQt settings > Monitor settings` set the resolution to 1920 x 1080 (or higher).

You may need to reduce the scaling in `View > Virtual Screen 1 > Scale to 100%`.

On a fresh Lubuntu 20.04.1 LTS VM, navigate to the home `~` directory.

```bash
# Generate SSH key
$ ssh-keygen -t ed25519 -a 100

# Display SSH public key
$ cat ~/.ssh/id_ed25519.pub
```

Add SSH key to GitHub under `Settings > SSH and GPG keys`.

```bash
# Clone the repository
$ git clone git@github.com:unsw-cse-comp3900-9900-22T2/capstone-project-3900-w18a-terraluna.git

# cd into repository
$ cd capstone-project-3900-w18a-terraluna/
```

### Setup Script

Run the `setup-lubuntu.sh` script. Enter sudo password `lubuntu` when prompted. The "dot space dot slash" notation here is important.

```bash
$ . ./setup-lubuntu.sh
```

### Start Script

Run the `start.sh` script. The "dot space dot slash" notation here is important. Make the browser window fullscreen when opened.

```bash
$ . ./start.sh
```

If the script fails, re-running it may also fail due to the addresses already being used. The default port for the frontend is 3000 and the default port for the backend is 5000. To kill the process, find the PIDs for `node` and `flask` with these commands:

```bash
$ sudo lsof -i :3000
$ sudo lsof -i :5000
```

Then run `kill` on these PIDS. For example,

```bash
$ kill 8221 8049
```

If the start script continues to fail, see Manual Setup instructions below.

### Manual Setup

Install `node==14.17.3`. The setup script uses `nvm` to install this version. `nvm` can be installed via

```bash
$ wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

After installing `nvm` you may need to restart your terminal or `source ~/.bashrc` to be able to use the command. The correct node version can then be installed via

```bash
$ nvm install 14.17.3
$ nvm use 14.17.3
```

Install `postgresql`, `postgresql-contrib` and `python3-venv` with `apt`.

Create a Postgres database and in `.env` set `DATABASE_URL` to `dialect+driver://username:password@host:port/database`.

For example, `postgresql+psycopg2://james:james@localhost:5432/terraluna`. The lubuntu setup script contains commands to setup a basic user and database.

Navigate to the `backend/` directory, create a virtual environment, install the requirements, run the database migrations and seed the database with the commands:

```bash
$ python3 -m venv venv
$ source venv/bin/activate
$ python3 -m pip install -r requirements.txt
$ flask db upgrade
$ python3 seed.py basic_categories
```

Navigate to the `frontend/` directory and install the required node packages via

```bash
$ npm install
```

At this point we are ready to start the backend and frontend. Open two terminal windows and run the following commands in each:

```bash
$ cd backend/
$ flask run
```

```bash
$ cd frontend/
$ npm start
```

## Usage

### Without Registration

Without a user account, users can only add ingredients to their non-persistent pantry and search for recipes made by recipe contributors. Search filters can be applied accordingly.

### With Registration

With a user account, users can navigate to the `My Recipes` page and create recipes. You would probably want to do this first to add some recipes so that the recipe exploring functionality can be tested.

To create a recipe, use the `+` button, fill in the form and press `Create`. This creates a recipe `Draft`. To publish it, you must edit the recipe, fill in all form details and press `Publish`.

**Note:** For every ingredient added, you must specify a quantity and a unit otherwise the recipe draft cannot be created. Also, instruction videos are optional even when publishing.

After creating and publishing some recipes, these recipes can be explored on the home page. The user must add the required ingredients for this recipe to their pantry in order to view it.

With an account, the user's pantry is persisted and saved even after reloading the page.

## API Specification

### Authentication and Authorisation

| HTTP Route | HTTP Method | Description | Args/Form/JSON | Response | Errors |
|---|---|---|---|---|---|
| **/auth/refresh** | POST | Generate a new stale (not fresh) access token using a valid refresh token. | | <pre>200<br>{"access_token": <access_token>}</pre> | |
| **/auth/register** | POST | Register a new user with a username, email and password. Generates a new access/refresh token pair. | JSON<pre>{<br>    "username": "James",<br>    "email": "james@test.com",<br>    "password": "Password123"<br>}</pre> | <pre>201<br>{<br>    "access_token": <access_token>,<br>    "refresh_token": <refresh_token>,<br>    "username": "James"<br>}</pre> | |
| **/auth/login** | GET | Get username of logged in user. | Args<pre>{"access_token": <access_token>}</pre> | <pre>200<br>{"username": "James"}</pre> | |
| **/auth/login** | POST | Log in a user with valid credentials. | JSON<pre>{<br>    "username_or_email": "james@test.com",<br>    "password": "Password123"<br>}</pre> | <pre>200<br>{<br>    "access_token": <access_token>,<br>    "refresh_token": <refresh_token>,<br>    "username": "James"<br>}</pre> | |
| **/auth/logout** | DELETE | Log out a user by revoking their access token. | | <pre>204<br>""</pre> | |


| HTTP Route | HTTP Method | Description | Args/Form/JSON | Response | Errors |
|---|---|---|---|---|---|
| **/ingredients** | GET | Return up to 10 matching ingredients (based on frequency in recipes). Empty query returns up to 10 most frequently used ingredients. | Args<pre>?query=wa</pre> | <pre>200<br>{<br>    "ingredients": [<br>        {"id": 1, "name": "water"},<br>        ...<br>    ]<br>}</pre> | |
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
