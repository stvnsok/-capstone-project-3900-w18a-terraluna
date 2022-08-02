import React, { useState, useEffect } from 'react';
import { BsCloudUpload } from 'react-icons/bs';
import { HiOutlinePlusCircle, HiOutlineTrash, HiXCircle } from 'react-icons/hi';
import TLSelect from '../global/AsyncSelect';
import TextInput from '../global/TextInput';
import { createRecipe, getIngredients, getSuggestedIngredient, updateRecipe } from '../../services/recipeContributor.service';
import Button from '../global/Button';
import { toast } from 'react-toastify';

export type IngredientDetails = Partial<Ingredient> & {
    quantity?: number;
    units?: string;
}

export interface Step {
    instruction: string;
    video?: File;
    videoUrl?: string
}

export default function CreateRecipe ({closeFunction, fullRecipe}: {
    closeFunction: () => void
    fullRecipe?: Partial<RecipeDetails>
}) {

    const [image, setImage] = useState<File>();
    const [preview, setPreview] = useState<string>();
    const [imageUrl, setImageUrl] = useState<string>();
    const [mealType, setMealType] = useState<{ id: number, name: string}[]>([]);
    const [dietType, setDietType] = useState<{ id: number, name: string}[]>([]);
    const [ingredients, setIngredients] = useState<IngredientDetails[]>([{
        name: undefined,
        id: -1
    }]);
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [hours, setHours] = useState<number | ''>('')
    const [minutes, setMinutes] = useState<number | ''>('')
    const [steps, setSteps] = useState<Step[]>([])
    const [recommendedIngredients, setRecommendedIngredients] = useState<Ingredient[]>([{
        id: 1,
        name: "Water"
    }, {
        id: 2, 
        name: "Chicken"
    }]);

    const payload = () => {
        const formData = new FormData();
        formData.append('name', name);
        if (image) formData.append('image', image);
        formData.append('description', description);
        formData.append('expectedDuration', hours === "" && minutes === "" ? "" : (((hours === "" ? 0 : hours) * 60) + (minutes === "" ? 0 : minutes)).toString());
        formData.append('mealType', JSON.stringify({mealType: mealType.map(meal => { return meal.name })}));
        formData.append('dietType', JSON.stringify({dietType: dietType.map(diet => { return diet.name })}));

        formData.append('ingredients', JSON.stringify({ingredients: ingredients.filter(ingredient => ingredient.id !== -1)}));
        const validSteps = steps.filter(step => step.instruction !== '')

        formData.append('instructions', JSON.stringify({instructions: validSteps.map(x => x.instruction)}))
        validSteps.forEach((step, index) => {
            if (step.video) formData.append('video'+index, step.video)
        })
        return formData 
    }
    
    // const inputFileRef = useRef<HTMLInputElement | null>(null);

    const dietTypeOptions = ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free', 'Halal'].map((dietType, index) => { 
        return { id: index, name: dietType }
    })

    const mealTypeOptions = ['breakfast', 'lunch', 'dinner', 'snack'].map((mealType, index) => { 
        return { id: index, name: mealType }
    })

    const clear = () => {
        setImage(undefined);
        setName('');
        setHours('');
        setMinutes('');
        setDescription('');
        setPreview('');
        setSteps([]);
        setDietType([]);
        setMealType([]);
        setIngredients([]);
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

    useEffect(() => {
        const validIngredients = ingredients.filter(ingredients => !!ingredients.id && ingredients.id !== -1 )
        getSuggestedIngredient(validIngredients.map(ingredient => { return ingredient.id! }))
            .then(res => setRecommendedIngredients(res.ingredients))
            .catch(() => console.error("Couldn't get suggested ingredient"))
    }, [ingredients])

    useEffect(() => {
        if (fullRecipe !== undefined) {
            if (fullRecipe.name) setName(fullRecipe.name)
            if (fullRecipe.cookTime) setHours(Math.floor(fullRecipe.cookTime/60));
            if (fullRecipe.cookTime) setMinutes(fullRecipe.cookTime % 60);
            if (fullRecipe.description) setDescription(fullRecipe.description);
            if (fullRecipe.imageUrl) setImageUrl(fullRecipe.imageUrl);
            if (fullRecipe.steps) setSteps(fullRecipe.steps.map(step => { return {
                instruction: step.instruction,
                videoUrl: step.videoUrl
            }}));
            if (fullRecipe.dietType) setDietType(dietTypeOptions.filter(x => fullRecipe.dietType?.includes(x.name)));
            if (fullRecipe.mealType) setMealType(mealTypeOptions.filter(x => fullRecipe.mealType?.includes(x.name)));
            if (fullRecipe.ingredients) setIngredients(fullRecipe.ingredients);
        }
    }, [fullRecipe, dietTypeOptions, mealTypeOptions])


    return <React.Fragment>
        <div className='fixed flex justify-between z-[100] border-b border-solid p-3 bg-tl-inactive-green'
            style={{
                width: 'calc(90vw)'
            }}
        >
            <h2 className='px-10 pt-5 font-semibold text-2xl'> {fullRecipe ? "Edit" : "Create"} Recipe</h2>
            <div className='my-auto'>
                <Button
                    onClick={() => {
                        clear();
                        closeFunction();
                    }}
                    text={"Go Back"}
                    className="mr-8 border border-solid border-tl-active-black bg-tl-inactive-white px-6 py-3 rounded-md"
                />

                <Button
                    onClick={() => {
                        if (!fullRecipe) {
                            createRecipe(payload()).then(() => {
                                clear();
                                closeFunction();
                            }).catch(() => {
                                toast.error("Failed to create Recipe")
                            });
                        } else {
                            const formData = payload();
                            if (fullRecipe.id) {
                                formData.append('id', fullRecipe.id.toString())
                                updateRecipe(fullRecipe.id, formData).then(() => {
                                    clear();
                                    closeFunction();
                                }).catch(() => {
                                    toast.error("Failed to save Recipe")
                                })
                            }

                        }
                    }}
                    text={fullRecipe ? "Save" : "Create"}
                    className="mr-18 border border-solid  bg-tl-inactive-green px-6 py-3 rounded-md"
                />
            </div>
            
        </div>
        
        <div className = 'w-full grid grid-cols-2 p-10 gap-x-10 gap-y-5 mt-16'>
            <div>
                <div className=''>
                    {preview || imageUrl ? 
                        <React.Fragment>
                            <div className='mt-10 relative mx-auto'>
                                <img src = {imageUrl ? `http://localhost:5000/uploads?name=${imageUrl}` : preview} alt = 'recipeImage' height={400} width={400} className='mx-auto relative border border-solid p-5 rounded-md bg-tl-active-white'
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
                                        setImageUrl(undefined)
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
                        onChange = {(e) => {
                            e.preventDefault();
                            setImage(e.target.files?.[0]);
                        }}
                        className="hidden"
                        name="fileInput"
                        id="fileInput"
                    />
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
                    <div className='flex '>
                        <div>
                            <TextInput
                                value={hours.toString()}
                                onValueChange={(value) => {
                                    setHours(Number(value));
                                }}
                                placeholder={"Hours..."}
                                numeric
                            />
                            
                        </div>
                        <div className='ml-2 my-auto'>Hours</div>
                        <div className='ml-2'>
                            <TextInput
                                value={minutes.toString()}
                                onValueChange={(value) => {
                                    setMinutes(Number(value));
                                }}
                                placeholder={"Minutes..."}
                                numeric
                            />
                            
                        </div>
                        <div className='ml-2 my-auto'>Minutes</div>
                    </div>
                </div>
                <div className='mt-5'>
                    <TLSelect
                        onChange={(e) => {
                            setMealType(e);
                        }}
                        header="Meal Type"
                        multi={true}
                        value={mealType}
                        options={mealTypeOptions}
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
                        options={dietTypeOptions}
                        isAsync={false}
                    />
                </div>
                
                <div className='mt-5'>
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
                <div className='font-medium'>Ingredients</div>
                {ingredients && ingredients.map((ingredient, index) => {
                    return <div className='grid grid-cols-8 gap-5 mt-2'>
                        <div className='col-span-5'>
                            <TLSelect
                                name={index.toString()}
                                value={(ingredient.name !== undefined && ingredient.id) ? {
                                    name: ingredient.name,
                                    id: ingredient.id
                                } : null!} 
                                onChange={(val: Ingredient) => {
                                    let tmp = [...ingredients];
                                    setIngredients(tmp.map((ingredient, ingredientIndex) => index === ingredientIndex ? val : ingredient));
                                }}
                                apiCall={getIngredients}
                                apiCallKey="ingredients"
                                isAsync
                                                       
                            />
                        </div>
                        <div className='mt-2'>
                            <TextInput 
                                name={index.toString()}
                                value={ingredients[index].quantity?.toString() ?? ''} 
                                onValueChange={(val: string) => {
                                    let tmp = [...ingredients];
                                    tmp[index].quantity = Number(val);
                                    setIngredients(tmp);
                                }}
                                numeric       
                                placeholder="Qty..."        
                            />
                        </div>
                        <div className='mt-2'>
                            <TextInput 
                                name={index.toString()}
                                value={ingredients[index].units ?? ''} 
                                onValueChange={(val: string) => {
                                    let tmp = [...ingredients];
                                    tmp[index].units = val;
                                    setIngredients(tmp);
                                }}         
                                placeholder="Units..."              
                            />
                        </div>
                        <div>
                            <HiOutlineTrash 
                                className=' text-tl-inactive-red cursor-pointer mt-2.5' 
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
                        <span className=' text-lg ml-2 text-tl-active-green'>Add Ingredient! </span>
                    </span>
                    {recommendedIngredients.length > 0 && <span className='ml-2'>Do you want to add? -</span>}
                    {recommendedIngredients && recommendedIngredients.map(ingredient => {return <div 
                        className='inline bg-tl-inactive-green text-tl-inactive-black rounded-sm px-2 py-1 hover:bg-tl-active-green hover:text-tl-active-grey cursor-pointer ml-2'
                        onClick={() => {
                            setIngredients(prev => [...prev, {
                                id: ingredient.id,
                                name: ingredient.name
                            }])
                            setRecommendedIngredients([])
                        }}
                    >
                        {ingredient.name}
                    </div>})}
                </div>
                <label htmlFor = 'Instruction'> Recipe Instructions</label>
                {steps && steps.map((step, index) => {
                    return (
                        <div className='grid grid-cols-2 mt-2'>
                            <textarea className='p-2 rounded-md focus:shadow-lg border-opacity-0 focus:outline-none' rows={9}
                                value={step.instruction}
                                onChange={(e) => {
                                    let tmp = [...steps];
                                    tmp[index].instruction = e.target.value;
                                    setSteps(tmp);
                                }}
                            />
                            {step.video || step.videoUrl ? 
                                <React.Fragment>
                                    <div className='relative ml-0'>
                                        <video controls src = {step.videoUrl ? `http://localhost:5000/uploads?name=${step.videoUrl}` : URL.createObjectURL(step.video!)} height={232} width={410} className='ml-4 relative border border-solid rounded-md bg-tl-active-white'/>
                                        <HiXCircle
                                            className='top-0 left-4 absolute cursor-pointer text-tl-inactive-red bg-tl-active-black rounded-full'
                                            onClick={() => {
                                                let tmp = [...steps];
                                                tmp[index].video = undefined;
                                                tmp[index].videoUrl = undefined;
                                                setSteps(tmp);
                                            }}
                                            size={20}
                                        /> 
                                    </div>
                                </React.Fragment>
                            :
                            <React.Fragment>
                                <label htmlFor={`videoInput-${index}`} className = 'flex justify-center items-center cursor-pointer border-tl-inactive-green border-dashed border-4 rounded-lg p-28 h-[200px] w-[200px] ml-4 mt-0.5' >
                                    <div className='relative'>
                                        <BsCloudUpload 
                                            color = '#A8F59B'
                                            size = {50}
                                            className="mx-auto"
                                        />
                                        <div className='mx-auto mt-4 text-tl-inactive-green text-lg font-medium'>Upload Video</div>
                                    </div>
                                </label>
                                <input 
                                    type = 'file'
                                    accept = "video/*"
                                    onChange = {(e) => {
                                        e.preventDefault();
                                        let tmp = [...steps];
                                        tmp[index].video = e.target.files?.[0];
                                        setSteps(tmp);
                                    }}
                                    className="hidden"
                                    name={`videoInput-${index}`}
                                    id={`videoInput-${index}`}
                                />
                            </React.Fragment>
                             
                        }</div>)}
                )}
                <div 
                    className='mt-2'
                >
                     <span
                        className=' cursor-pointer'
                        onClick={() => {
                            setSteps(prev => [...prev, {
                                instruction: ''
                            }])
                        }}
                    >
                        <HiOutlinePlusCircle className='text-tl-active-green inline' size={40}/>
                        <span className=' text-lg ml-2 text-tl-active-green'>Add Step!</span>
                    </span>
                </div>
            </div>
            <div className='px-10 mb-5'>
                
            </div>
        </div>
    </React.Fragment>
}