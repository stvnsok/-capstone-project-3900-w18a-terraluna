import React, { useState, useEffect } from 'react';
import { BsCloudUpload } from 'react-icons/bs';
import { HiOutlinePlusCircle, HiOutlineTrash } from 'react-icons/hi';
import { useForm } from 'react-hook-form'
import TLSelect from '../global/AsyncSelect';
import TextInput from '../global/TextInput';
import { getIngredients } from '../../services/recipeContributor.service';

interface recipeForm {
    name?: string,
    cookTime?:number
    description?:string
    recipeInstructions?:string[];
    mealType?:string[];
    dietType?:string[];
    timerDuration?:number[];
    timerUnits?:string;
    requiredIngredients?:Ingredient[];
    recipePhoto_url?: string;
    recipeVideo_url?: string;
}

type IngredientInput = Partial<Ingredient> & {
    quantity?: number;
    units?: string;
}

export default function CreateRecipe () {

    const { register } = useForm<recipeForm>();
    const [image, setImage] = useState<File>();
    const [preview, setPreview] = useState<string>();
    const [mealType, setMealType] = useState<{ id: number, name: string}[]>([]);
    const [dietType, setDietType] = useState<{ id: number, name: string}[]>([]);
    const [ingredients, setIngredients] = useState<IngredientInput[]>([{
        name: undefined,
        id: -1
    }]);
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [expectedDuration, setExpectedDuration] = useState<number | ''>('')
    // const [recommendedIngredients, setRecommendedIngredients] = useState<Ingredient[]>([]);
    
    useEffect(() => {

    }, [ingredients])

    
    // const inputFileRef = useRef<HTMLInputElement | null>(null);

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
        <h2 className='px-10 pt-5 font-semibold text-2xl'> Create Recipe</h2>
        <div className = 'w-full grid grid-cols-2 p-10 gap-x-10 gap-y-5'>
            <div>
                <div className=''>
                    {preview ? 
                        <React.Fragment>
                            <div className='mt-10 relative mx-auto'>
                                <img src = {preview} alt = 'recipeImage' height={400} width={400} className='mx-auto relative border border-solid p-5 rounded-md bg-tl-active-white'
                                    style={{
                                        transform: 'rotate(5deg)',
                                        animation: "2075.86ms ease 0ms 1 normal forwards running rockBackAndForth",
                                        transformOrigin: '50% 10%',
                                        transition: 'transform 1s'
                                    }}
                                />
                                <img
                                    src={"pushpns-clipart-204578.png"}
                                    className='top-0 absolute cursor-pointer w-10'
                                    style={{
                                        transform: 'translateX(calc(50% - 13px))',
                                        left: 'calc(50% - 20px)'
                                    }}
                                    onClick={() => {
                                        setPreview(undefined);
                                    }}
                                    alt="removeImagePin"
                                /> 
                            </div>
                        </React.Fragment>
                    : (
                    <label htmlFor='fileInput' className = 'flex justify-center items-center cursor-pointer border-tl-inactive-green border-dashed border-4 rounded-lg p-28 mt-10 h-[400px] w-[400px] mx-auto' >
                        <div className='relative'>
                            <BsCloudUpload 
                                color = '#A8F59B'
                                size = {50}
                                className="mx-auto"
                            />
                            <div className='mx-auto mt-4 text-tl-inactive-green text-lg font-medium'>Upload Photo</div>
                        </div>
                    </label>
                    )}
                    <input 
                        type = 'file'
                        accept = "image/*"
                        {...register('recipePhoto_url')}
                        onChange = {(e) => {
                            e.preventDefault();
                            setImage(e.target.files?.[0]);
                        }}
                        className="hidden"
                        name="fileInput"
                        id="fileInput"
                    />
                    {/* <Button
                            onClick = {() => {
                                inputFileRef.current.click();
                            }}
                        text={('Upload Photo')}
                    /> */}
                </div>
                <div className='mt-5'>
                    <label htmlFor='name'> Recipe Name</label>
                    <TextInput
                        value={name}
                        onValueChange={(value) => {
                            setName(value);
                        }}
                        placeholder={"Recipe Name..."}
                    />
                </div>
                <div className='mt-5'>
                    <label htmlFor = 'cookTime'> Expected Duration</label>
                    <TextInput
                        value={expectedDuration.toString()}
                        onValueChange={(value) => {
                            setExpectedDuration(Number(value));
                        }}
                        placeholder={"Expected Duration..."}
                        numeric
                    />
                </div>
                <div className='mt-5'>
                    <TLSelect
                        onChange={(e) => {
                            setMealType(e);
                        }}
                        header="Meal Type"
                        multi={true}
                        value={mealType}
                        options={['breakfast', 'lunch', 'dinner', 'snack'].map((mealType, index) => { 
                            return { id: index, name: mealType }
                        })}
                        isAsync={false}
                    />
                </div>
                <div className='mt-5'>
                    <TLSelect
                        onChange={(e) => {
                            setDietType(e);
                        }}
                        header="Diet Type"
                        multi={true}
                        value={dietType}
                        options={['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free', 'Halal'].map((dietType, index) => { 
                            return { id: index, name: dietType }
                        })}
                        isAsync={false}
                    />
                </div>
                
                <div>
                <label htmlFor = 'description'> Description</label>
                    <textarea 
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                        value={description}
                        placeholder = 'Description...'
                        className = 'shadow appearance-none rounded w-full p-2 text-gray-700 leading-tight focus:outline-none focus:shadow-lg border-opacity-0 h-40'
                        
                    />
                </div>
            </div>
            

            

            
            {/* Ingredients will be changed to accomodate quantities*/ }
            <div >
                {ingredients && ingredients.map((ingredient, index) => {
                    return <div className='grid grid-cols-8 gap-5 mt-2'>
                        <div className='col-span-5'>
                            <TLSelect
                                header="Ingredient"
                                name={index.toString()}
                                value={ingredient.name && ingredient.id ? {
                                    name: ingredient.name,
                                    id: ingredient.id
                                } : undefined} 
                                onChange={(val: Ingredient) => {
                                    let tmp = [...ingredients];
                                    setIngredients(tmp.map((ingredient, ingredientIndex) => index === ingredientIndex ? val : ingredient));
                                }}
                                apiCall={getIngredients}
                                                       
                            />
                        </div>
                        <div>
                            <TextInput 
                                name={index.toString()}
                                title="Qty"
                                value={ingredients[index].quantity?.toString() ?? ''} 
                                onValueChange={(val: string) => {
                                    let tmp = [...ingredients];
                                    tmp[index].quantity = Number(val);
                                    setIngredients(tmp);
                                }}
                                numeric               
                            />
                        </div>
                        <div>
                            <TextInput 
                                name={index.toString()}
                                title="Unit"
                                value={ingredients[index].units ?? ''} 
                                onValueChange={(val: string) => {
                                    let tmp = [...ingredients];
                                    tmp[index].units = val;
                                    setIngredients(tmp);
                                }}                       
                            />
                        </div>
                        <div>
                            <HiOutlineTrash 
                                className=' text-tl-inactive-red cursor-pointer mt-8' 
                                size={30}
                                onClick={() => {
                                    let tmp = [...ingredients];
                                    tmp = tmp.filter((ingredientInput, ingredientIndex) => ingredient !== ingredientInput && index !== ingredientIndex);
                                    setIngredients([...tmp]);
                                }}
                            />
                        </div>
                    </div>
                })}
                
                <div 
                    className='mt-4'
                >
                    <span
                        className=' cursor-pointer'
                        onClick={() => {
                            setIngredients(prev => [...prev, {
                                id: -1,
                                name: undefined
                            }])
                        }}
                    >
                        <HiOutlinePlusCircle className='text-tl-active-green inline' size={40}/>
                        <span className=' text-lg ml-2 text-tl-active-green'>Add Ingredient!</span>
                    </span>
                </div>
                <label htmlFor = 'Instruction'> Recipe Instructions</label>
                <textarea 
                    {...register('recipeInstructions')}
                    placeholder = 'Step Description...'
                    className='shadow appearance-none py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-lg border-opacity-0'
                    
                />
                <div className = 'grid grid-cols-2 gap-1'>
                    <input
                        {...register('timerDuration')}
                        placeholder = 'Timer Duration'
                        className='shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-lg border-opacity-0'
                    />
                    <select
                        placeholder='Timer Units'
                        {...register('timerUnits')}
                    >
                        <option value = 'minutes'>Minutes</option>
                        <option value = 'hours'>Hours</option>
                    </select>
                </div>
                <div className = 'grid grid-cols-3' >
                    <div className='flex flex-row'>
                        <HiOutlinePlusCircle
                            onClick = {() => {
                                console.log('Todo:add step'); 
                            }}
                            color = '#A8F59B'
                            className = 'icon-large'
                            size={22}
                        />
                        Add Step
                    </div>
                    <div className='flex flex-row'>
                        <HiOutlinePlusCircle
                            onClick = {() => {
                                console.log('Todo:add timer'); 
                            }}
                            color = '#A8F59B'
                            className = 'icon-large'
                            size={22}
                        />
                        Add Timer
                    </div>
                    <div className='flex flex-row'>
                        <HiOutlinePlusCircle
                            onClick = {() => {
                                console.log('Todo:add Video'); 
                            }}
                            color = '#A8F59B'
                            className = 'icon-large'
                            size={22}
                        />
                        Add Video
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
}