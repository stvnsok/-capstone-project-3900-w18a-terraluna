import React from 'react';
import { BsCloudUpload } from 'react-icons/bs';
import { useForm, UseFormRegisterReturn } from 'react-hook-form'

type recipeForm = {
    recipeName:string
    recipeDescription:string
    recipeInsruction:string
    mealType:string
    dietType:string

}

type Option = {
    label: React.ReactNode;
    value: string | number | string[];
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

    return <React.Fragment>
        <form>
            <div>
                <label htmlFor='recipeName'> Recipe Name</label>
                <input {...register('recipeName')}/>
            </div>
            <div>
                <label htmlFor = 'expectedDuration'> Expected Duration</label>
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
                <select
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
            <div className = "mborder border-dashed border-tl-active-green ">
                <BsCloudUpload
                />
            </div>

            
        </form>
    </React.Fragment>
}