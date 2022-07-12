import React, { useState } from 'react';
import { useForm } from 'react-hook-form'

type Recipe = {
    recipeName:string
    recipeDescription:string
    recipeInsruction:string

}

export default function CreateRecipe () {
    const handleIngredients = (e, index) => {
        const { name, value } = e.target;
        const list = [...ingredientsList];
        list[index][name] = value;
        ingredientsList(list);
      };
    const [newRecipe, handleSave] = useForm<Recipe>();
    const [ingredientsList, setIngredientsList] = useState([
        {ingredient: '', quantity: ''},
    ]);
    const onSubmit = data => console.log(data);

    return <React.Fragment>
        <form onSubmit = {onSubmit}>
            <div>
                <label htmlFor='recipeName'> Recipe Name</label>
                <input ref = { newRecipe() }></input>
            </div>
            <div>
                <label htmlFor = 'expectedDuration'> Expected Duration</label>
            </div>
            <div>
                <label htmlFor = 'mealType'> Meal Type</label>
            </div>
            <div>
                <label htmlFor = 'recipeDescription'> Description</label>
                <input ref = { newRecipe() }></input>
            </div>
            <div>
                <label htmlFor = 'dietType'> Diet Type</label>
            </div>
            <div>
                <label htmlFor = 'ingredients'> Ingredients</label>
                {ingredientsList.map(singleIngredient, index) =>(
                    <div className = "ingredient">
                        <input></input>

                    </div>
                )}

            </div>

            
        </form>
    </React.Fragment>
}