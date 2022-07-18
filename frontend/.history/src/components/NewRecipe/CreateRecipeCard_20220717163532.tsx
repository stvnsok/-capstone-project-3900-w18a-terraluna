import React, { useState } from 'react';
import { BsCloudUpload } from 'react-icons/bs';
import { useForm, UseFormRegisterReturn } from 'react-hook-form'
import { FileUpload } from '../global/FileUpload';

type recipeForm = {
    recipeName:string
    expectedDuration:number
    recipeDescription:string
    recipeInsruction:string
    mealType:string
    dietType:string
    recipePhoto:File
}

type Option = {
    label: React.ReactNode;
    value: string | string[];
};

type SelectProps = UseFormRegisterReturn & { options: Option[] };

const Select = ({ options, ...props }: SelectProps) => (
    <select {...props}>
        {options.map(({ label, value }) => (
        <option value={value}>{label}</option>
        ))}
    </select>
);


export default function CreateRecipe () {

    const { register, handleSubmit } = useForm<recipeForm>();
    const [image, setImage] = useState();

    const onSubmit = async (data: recipeForm) => {
        console.log(data);
        //TODO: API REQUEST TO BACKEND
    }

    return <React.Fragment>
        <form>
            <div>
                <label htmlFor='recipeName'> Recipe Name</label>
                <input 
                    {...register('recipeName')} 
                    placeholder = "Recipe Name..."
                />
            </div>
            <div>
                <label htmlFor = 'expectedDuration'> Expected Duration</label>
                <input
                    {...register('expectedDuration')}
                    placeholder = "Expected Duration..."
                />
            </div>
            <div>
                <label htmlFor = 'mealType'> Meal Type</label>
                <Select
                    {...register('mealType')}
                    options={[
                        { label: 'Breakfast', value: 'breakfast' },
                        { label: 'Lunch', value: 'lunch' },
                        { label: 'Dinner', value: 'dinner' },
                        { label: 'Snack', value: 'snack' },
                    ]}
                    
            />
            </div>
            <div>
                <label htmlFor = 'recipeDescription'> Description</label>
                <input {...register('recipeDescription')}/>
            </div>
            <div>
                <label htmlFor = 'dietType'> Diet Type</label>
                <Select
                    {...register('dietType')}
                    options={[
                        {label: 'Vegan', value: 'vegan'},
                        {label: 'Vegetarian', value: 'vegetarian'},
                        {label: 'Gluten Free', value: 'gluten-free'},
                        {label: 'Dairy Free', value: 'dairy-free'},
                        {label: 'Nut Free', value: 'nut-free'},
                        {label: 'Halal', value: 'Halal'},
                    ]}
                />
            </div>
            <div className = 'mborder border-dashed border-tl-active-green '>
                {image ? <img src = {image} alt = 'recipe image'/> : <BsCloudUpload className = 'icon-large'/>}
                <input 
                    type = 'file'
                    {...register('recipePhoto')}
                />
            </div>

            
        </form>
    </React.Fragment>
}