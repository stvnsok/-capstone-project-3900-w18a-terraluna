# COMP3900 w18a-terraluna Project
## Interface Specifications
### Data Types
| Variable name | Type |  |
|---|---|---|
| named exactly **name** | string |  |
| named exactly **description** | string |  |
| named exactly **mealType** | string |  |
| named exactly **dietType** | string |  |
| named exactly **recipeInstructions** | string |  |
| named exactly **timerDuration** | integer |  |
| named exactly **timerUnits** | string |  |
| named exactly **quantity** | integer |  |
| named exactly **units** | string |  |
| named exactly **published** | bool |  |
| has suffix **_id** | integer |  |
| has suffix **_url** | string |  |
| named exactly **requiredIngredients** | Dictionary containing { ingredient_id, quantity, units } |  |
| (outputs only) named exactly **recipes** | List of dictionaries, where each dictionary contains types { recipe_id, name, recipePhoto_url, published, description } |  |

### Interface
| HTTP Route | HTTP Method | Parameters | Return type | Exceptions | Description |
|---|---|---|---|---|---|
| recipe/new | POST | { name, recipePhoto_url, recipeVideo_url, description, mealType, dietType, recipeInstructions, timerDuration, timerUnits, requiredIngredients } | { recipe_id } |  |  |
| recipes | GET | {} | { recipes } |  |  |
| recipe/details | GET | { recipe_id } | { name, recipePhoto_url, recipeVideo_url, description, mealType, dietType, recipeInstructions, timerDuration, timerUnits, requiredIngredients } |  |  |
| recipe/update | PUT | { recipe_id, name, recipePhoto_url, recipeVideo_url, description, mealType, dietType, recipeInstructions, timerDuration, timerUnits, requiredIngredients } | {} |  |  |
| recipe/delete | DELETE | { recipe_id } | {} |  |  |
| recipe/copy | POST | { recipe_id } | { recipe_id } |  |  |
| recipe/publish | PUT | { recipe_id } | {} |  |  |
