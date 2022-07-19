import React, { useState } from 'react';
import { useForm } from 'react-hook-form'
import { HiOutlinePlusCircle } from 'react-icons/hi'

type Recipe = {
    recipeName:string
    recipeDescription:string
    recipeInsruction:string

}

export default function CreateRecipe () {
    const [newRecipe, handleSave] = useForm<Recipe>();
    const [ingredientsList, setIngredientsList] = useState([
        {ingredient: '', quantity: ''},
    ]);
    const handleIngredientsChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...ingredientsList];
        list[index][name] = value;
        ingredientsList(list);
    };
    const handleIngredientsAdd = () => {
        setIngredientsList([...ingredientsList, {ingredient: '', quantity: ''}]);
    };
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
                {ingredientsList.map((i, index) => (
                    <div key={index} className="ingredients">
                        <div className="ingredient">
                        <input
                            name="ingredient"
                            type="text"
                            id="ingredient"
                            value={i.ingredient}
                            onChange={(e) => handleIngredientsChange(e, index)}
                            required
                        />
                        <input
                            name = "quantity"
                            type = "text"
                            value={i.quantity}
                            onChange={(e) => handleIngredientsChange(e, index)}
                            required
                        />
                        {ingredientsList.length - 1 === index && ingredientsList.length < 15 && (
                            <HiOutlinePlusCircle
                                type="button"
                                onClick={handleIngredientsAdd}
                                className="add-btn"
                                
                            >
                            Add Ingredient
                            </HiOutlinePlusCircle>
                    )}
                    </div>
            </div>
                ))}

            </div>

            
        </form>
    </React.Fragment>
}