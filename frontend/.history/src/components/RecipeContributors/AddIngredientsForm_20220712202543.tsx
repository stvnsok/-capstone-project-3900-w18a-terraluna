import React, { useState } from "react";
import { HiOutlinePlusCircle } from 'react-icons/hi'

export default function AddIngredientsForm () {
    const [ingredientsList, setIngredientsList] = useState([
        {   ingredient: '', quantity: ''},
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

    return (
        <React.Fragment>
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
        </React.Fragment>
    )
}