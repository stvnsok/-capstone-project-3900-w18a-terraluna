import React from 'react'
import { HiX } from 'react-icons/hi';

const RecipeForm = ({
    recipe,
    onClose
}: {
    recipe?: Recipe;
    onClose: () => void
}) => {

    return <div className=" bg-tl-inactive-white min-h-full absolute top-0 right-0 border-l border-solid border-tl-inactive-grey" style={{
        transition: '0.7s',
        width: '90%',
        marginRight: recipe ? '0' : '-90vw'

    }}>
        <div><HiX className='ml-4 cursor-pointer text-tl-inactive-grey' size={50} onClick={onClose}/></div>
        <div className='justify-between flex'>
            <h2 className='ml-16 font-semibold text-4xl'>{recipe?.name}</h2>
        </div>
    </div>
}

export default RecipeForm;