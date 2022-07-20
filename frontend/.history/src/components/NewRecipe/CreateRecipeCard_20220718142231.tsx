import React, { useState, useEffect } from 'react';
import { BsCloudUpload } from 'react-icons/bs';
import { useForm, UseFormRegisterReturn } from 'react-hook-form'
import Button from '../global/Button';

type recipeForm = {
    name:string
    cookTime:number
    description:string
    Instruction:string[];
    mealType:string
    dietType:string
    // recipePhoto:File
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
    const [image, setImage] = useState<File>();
    const [preview, setPreview] = useState<string>();
    // const inputFileRef = useRef<HTMLInputElement | null>(null);

    const onSubmit = async (data: recipeForm) => {
        console.log(data);
        //TODO: API REQUEST TO BACKEND
    }

    useEffect(() => {
        if (image) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result as string);
          };
          reader.readAsDataURL(image);
        } else {
          setPreview('');
        }
      }, [image]);

    return <React.Fragment>
        <form>
            <div>
                <label htmlFor='name'> Recipe Name</label>
                <input 
                    {...register('name')} 
                    placeholder = "Recipe Name..."
                />
            </div>
            <div>
                <label htmlFor = 'cookTime'> Expected Duration</label>
                <input
                    {...register('cookTime')}
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
                <label htmlFor = 'description'> Description</label>
                <input {...register('description')}/>
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
                {preview ? <img src = {preview} alt = 'recipe'/> 
                : (
                <div className = 'flex justify-center items-center'>
                    <BsCloudUpload 
                        className = 'icon-large'
                    />
                </div>
                )}
                <input 
                    type = 'file'
                    accept = "image/*"
                    // {...register('recipePhoto')}
                    onChange = {(e) => {
                        e.preventDefault();
                        setImage(e.target.files?.[0]);
                    }}
                />
                {/* <Button
                        onClick = {() => {
                            inputFileRef.current.click();
                        }}
                       text={('Upload Photo')}
                 /> */}
            </div>
            
            <div>
                <Button
                    onClick = {handleSubmit(onSubmit)}
                />
                    
            </div>

            
        </form>
    </React.Fragment>
}