import React from 'react'
import { HiOutlineClock, HiOutlineCreditCard, HiOutlineXCircle, HiX } from 'react-icons/hi';
import { AiOutlineCheckCircle, AiOutlineCopyrightCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { createRecipeFromTemplate, deleteRecipe, publishRecipe } from '../../services/recipeContributor.service';
import Button from '../global/Button';

const SlideOutRecipe = ({
    recipe,
    onClose
}: {
    recipe?: Recipe;
    onClose: () => void
}) => {

    const minutesToHoursPipe = (time: number) => {
        const hours = Math.floor(time/60);
        const minutes = time%60;
        return `${hours < 10 ? '0' : '' }${hours}:${minutes < 10 ? '0' : ''}${minutes} Hours`;
    }

    const getStatusIcon = (status: Recipe["status"]) => {
        if (status === 'Draft') return <HiOutlineXCircle size={32}/>    
        if (status === 'Published') return <AiOutlineCheckCircle size={32}/>
        if (status === 'Template') return <AiOutlineCopyrightCircle size={32}/>
    }

    return <div className=" bg-tl-inactive-brown min-h-full absolute top-0 right-0 border-l border-solid border-tl-inactive-grey" style={{
        transition: '0.7s',
        width: '90%',
        marginRight: recipe ? '0' : '-90vw'

    }}>
        <div><HiX className='ml-4 cursor-pointer text-tl-inactive-grey' size={50} onClick={onClose}/></div>
        <div className='justify-between flex'>
            <h2 className='ml-16 font-semibold text-4xl'>{recipe?.name}</h2>
            <div>
                <Button
                    onClick={() => {
                        if (recipe) {
                            publishRecipe(recipe.id)
                                .then(_ => {
                                    toast.success('Successfully published ' + recipe.name);
                                })
                                .catch(err => {
                                    toast.error(err);
                                })
                        }
                    }}
                    text={"Publish"}
                    className="mr-4 bg-tl-inactive-green px-6 py-3 rounded-md shadow-md"
                />
                <Button
                    onClick={() => {
                        if (recipe) {
                            createRecipeFromTemplate(recipe.id)
                                .then(_ => {
                                    toast.success('Successfully created a copy of ' + recipe.name);
                                })
                                .catch(err => {
                                    toast.error(err);
                                })
                        }
                    }}
                    text={"Use As Template"}
                    className="mr-4 bg-tl-inactive-white px-6 py-3 rounded-md shadow-md"
                />
                <Button
                    onClick={() => {
                        if (recipe) {
                            deleteRecipe(recipe.id)
                                .then(_ => {
                                    toast.success('Successfully deleted ' + recipe.name)
                                    onClose();
                                })
                                .catch(err => {
                                    toast.error(err)
                                })
                        }
                    }}
                    text={"Delete"}
                    className="mr-16 bg-tl-inactive-red px-6 py-3 rounded-md shadow-md"
                />
                
            </div>
        </div>
        {recipe && <div className='p-10 grid grid-cols-5 gap-5'>
            <div>
                <img width={400} height={400} src={recipe.imageUrl} alt="recipeImage"/>
            </div>
            <div className='col-span-1'>
                <div>
                    <div className='font-semibold text-3xl'>Details</div>
                    <div className='mt-8 flex'><HiOutlineCreditCard size={32}/> <span className='ml-4 text-xl'>{recipe.name}</span></div>
                    <div className='mt-8 flex'><HiOutlineClock size={32}/> <span className='ml-4 text-xl'>{minutesToHoursPipe(recipe.cookTime)}</span></div>
                    <div className='mt-8 flex'>{getStatusIcon(recipe.status)}<span className='ml-4 text-xl'>{recipe.status}</span></div>
                </div>
            </div>
            <div className='col-span-1'>
                <div>
                    <div className='font-semibold text-3xl'>Meal Types</div>
                    <div className='mt-8 flex'><HiOutlineCreditCard size={32}/> <span className='ml-4 text-xl'>{recipe.name}</span></div>
                    <div className='mt-8 flex'><HiOutlineClock size={32}/> <span className='ml-4 text-xl'>{minutesToHoursPipe(recipe.cookTime)}</span></div>
                    <div className='mt-8 flex'>{getStatusIcon(recipe.status)}<span className='ml-4 text-xl'>{recipe.status}</span></div>
                </div>
            </div>
            <div className='col-span-1'>
                <div>
                    <div className='font-semibold text-3xl'>Diet Types</div>
                    <div className='mt-8 flex'><HiOutlineCreditCard size={32}/> <span className='ml-4 text-xl'>{recipe.name}</span></div>
                    <div className='mt-8 flex'><HiOutlineClock size={32}/> <span className='ml-4 text-xl'>{minutesToHoursPipe(recipe.cookTime)}</span></div>
                    <div className='mt-8 flex'>{getStatusIcon(recipe.status)}<span className='ml-4 text-xl'>{recipe.status}</span></div>
                </div>
            </div>
        </div>}
    </div>
}

export default SlideOutRecipe;