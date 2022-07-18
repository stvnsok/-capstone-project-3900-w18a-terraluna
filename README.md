# COMP3900 w18a-terraluna Project

### Data Types
| Variable name                         | Type                                                     |
|---------------------------------------|----------------------------------------------------------|
| named exactly **name**                | string                                                   |
| named exactly **description**         | string                                                   |
| named exactly **mealType**            | string                                                   |
| named exactly **dietType**            | string                                                   |
| named exactly **recipeInstructions**  | string                                                   |
| named exactly **timerDuration**       | integer                                                  |
| named exactly **timerUnits**          | string                                                   |
| named exactly **quantity**            | integer                                                  |
| named exactly **units**               | string                                                   |
| has suffix **_id**                    | integer                                                  |
| has suffix **_url**                   | string                                                   |
| named exactly **requiredIngredients** | Dictionary containing { ingredient_id, quantity, units } |

### Interface
| HTTP Route                  | HTTP Method | Parameters                                                                                                                     | Return type | Exceptions | Description |
|-----------------------------|-------------|--------------------------------------------------------------------------------------------------------------------------------|-------------|------------|-------------|
| recipe/new                  | POST        | { name, recipePhoto_url, description, mealType, dietType, recipeInstructions, timerDuration, timerUnits, requiredIngredients } |             |            |             |
| recipes                     | GET         | {}                                                                                                                             |             |            |             |
| /recipe/{recipe_id}/update  | PUT         | { name, recipePhoto_url, description, mealType, dietType, recipeInstructions, timerDuration, timerUnits, requiredIngredients } |             |            |             |
| /recipe/{recipe_id}/delete  | DELETE      | {}                                                                                                                             |             |            |             |
| /recipe/{recipe_id}/copy    | POST        | {}                                                                                                                             |             |            |             |
| /recipe/{recipe_id}/publish | PUT         | {}                                                                                                                             |             |            |             |
