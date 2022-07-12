import React, { useState } from "react";
import { HiOutlinePlusCircle } from 'react-icons/hi'

export default function AddIngredientsForm () {
    const [ingredientsList, setIngredientsList] = useState([
        {ingredientName: '',
         quantity: ''
        },
    ]);
    const handleIngredientsChange = (e, index) => {
        // const { name, value } = e.target;
        const data = [...ingredientsList];
        data[index][e.target.name] = e.target.value;
        setIngredientsList(data);
    };
    const addIngredient = () => {
        let object = {
            ingredientName: '',
            quantity: ''
        }
        setIngredientsList([...ingredientsList, object]);
    };

    return (
        <React.Fragment>
            <div>
                <label htmlFor = 'ingredients'> Ingredients</label>
                {ingredientsList.map((ingredient, index) => (
                    <div key={index} className="ingredients">
                        <div className="ingredient">
                        <input
                            name="ingredient"
                            placeholder="ingredient name"
                            value={ingredient.ingredientName}
                            onChange={(e) => handleIngredientsChange(e, index)}
                            required
                        />
                        <input
                            name = "quantity"
                            placeholder = "quantity"
                            value={ingredient.quantity}
                            onChange={(e) => handleIngredientsChange(e, index)}
                            required
                        />
                        {ingredientsList.length - 1 === index && ingredientsList.length < 15 && (
                            <HiOutlinePlusCircle
                                type="button"
                                onClick={addIngredient}
                                className="add-btn"
                                
                            >
                            Add Ingredient
                            </HiOutlinePlusCircle>
                    )}
                    </div>
            </div>
                ))}

            </div>
        </React.Fragment>
    )
}