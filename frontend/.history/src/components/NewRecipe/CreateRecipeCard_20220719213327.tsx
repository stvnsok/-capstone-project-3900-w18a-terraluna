import React, { useState, useEffect } from 'react';
import { BsCloudUpload } from 'react-icons/bs';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { useForm, UseFormRegisterReturn } from 'react-hook-form'
import Button from '../global/Button';

type recipeForm = {
    name:string
    cookTime:number
    description:string
    recipeInstructions:string[];
    mealType:string
    dietType:string
    timerDuration:number[];
    timerUnits:string;
    requiredIngredients:string[];
    recipePhoto_url: string;
    recipeVideo_url: string;
}

type Option = {
    value: string | string[] | number;
};

type SelectProps = UseFormRegisterReturn & { options: Option[] };

const Select = ({ options, ...props }: SelectProps) => (
    <select {...props}>
        {options.map(({ value }) => (
        <option value={value}></option>
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
        <div className = 'w-full max-w-xs'>

            <form>
                <div>
                    <label htmlFor='name' className = 'block text-gray-700 text-sm font-bold mb-2'> Recipe Name</label>
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
                            { value: 'breakfast' },
                            { value: 'lunch' },
                            { value: 'dinner' },
                            { value: 'snack' },
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
                            { value: 'vegan'},
                            { value: 'vegetarian'},
                            { value: 'gluten-free'},
                            { value: 'dairy-free'},
                            { value: 'nut-free'},
                            { value: 'Halal'},
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
                        {...register('recipePhoto_url')}
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
                    <label htmlFor = 'Instruction'> Instructions</label>
                    <textarea 
                        {...register('recipeInstructions')}
                        placeholder = 'Step Description...'
                        
                    />

                    <input
                        {...register('timerDuration')}
                        placeholder = 'Timer Duration...'
                    />
                    <Select
                        {...register('timerUnits')}
                        options={[
                            { value: 'minute'},
                            { value: 'hour'},
                        ]}
                    />
                    <HiOutlinePlusCircle
                        onClick = {() => {
                            console.log('Todo:add step'); 
                        }}
                    />
                    Add Step
                    <HiOutlinePlusCircle
                        onClick = {() => {
                            console.log('Todo:add timer'); 
                        }}               
                    />
                    Add Timer
                    <HiOutlinePlusCircle
                        onClick = {() => {
                            console.log('Todo:add video'); 
                        }}
                    />
                    Add Video
                </div>
                
                <div>
                    <Button
                        onClick = {handleSubmit(onSubmit)}
                    />
                        
                </div>

                
            </form>
        </div>
    </React.Fragment>
}