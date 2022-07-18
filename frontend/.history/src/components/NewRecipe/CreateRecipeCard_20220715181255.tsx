import React from 'react';
import { BsCloudUpload } from 'react-icons/bs';
import { useForm } from 'react-hook-form'

type recipeForm = {
    recipeName:string
    recipeDescription:string
    recipeInsruction:string

}

export default function CreateRecipe () {

    const { recipeForm, handleSubmit } = useForm<recipeForm>();

    return <React.Fragment>
        <form>
            <div>
                <label htmlFor='recipeName'> Recipe Name</label>
                <input {...recipeForm('recipeName')}></input> 
            </div>
            <div>
                <label htmlFor = 'expectedDuration'> Expected Duration</label>
            </div>
            <div>
                <label htmlFor = 'mealType'> Meal Type</label>
                <select>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                </select>
            </div>
            <div>
                <label htmlFor = 'recipeDescription'> Description</label>
                {/* <input ref = { newRecipe() }></input> */}
            </div>
            <div>
                <label htmlFor = 'dietType'> Diet Type</label>
                <select>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                    <option value="Nut-Free">Nut-Free</option>
                    <option value="Halal">Halal</option>
                    <option value="Dairy-Free">Dairy-Free</option>
                </select>
            </div>
            <div className = "mborder border-dashed border-tl-active-green ">
                <BsCloudUpload
                />
            </div>

            
        </form>
    </React.Fragment>
}