import React from 'react'
import { HiX } from 'react-icons/hi';
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
                    className="mr-4 border border-solid border-tl-active-black bg-tl-inactive-brown px-6 py-3 rounded-md"
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
                    className="mr-4 border border-solid border-tl-active-black bg-tl-inactive-brown px-6 py-3 rounded-md"
                />
                <Button
                    onClick={() => {
                        if (recipe) {
                            deleteRecipe(recipe.id)
                                .then(_ => {
                                    toast.success('Successfully deleted ' + recipe.name)
                                })
                                .catch(err => {
                                    toast.error(err)
                                })
                        }
                    }}
                    text={"Delete"}
                    className="mr-16 border border-solid border-tl-active-red bg-tl-inactive-red px-6 py-3 rounded-md"
                />
                
            </div>
        </div>
        {minutesToHoursPipe(100)}
    </div>
}

export default SlideOutRecipe;