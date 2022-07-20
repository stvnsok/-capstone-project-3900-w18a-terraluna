import React, { useState } from 'react'
import { HiChevronRight } from 'react-icons/hi';

const NoMatchRecipeMenuItem = ({
    noMatchIngredients
}: {
    noMatchIngredients: NoMatchIngredients
}) => {
    const [showIngredients, setShowIngredients] = useState<boolean>(false);

    return  <React.Fragment>
            <div 
                className='mt-2 ml-4 rounded-md p-2 w-60 bg-tl-inactive-white border border-solid border-tl-inactive-grey relative pl-5 flex justify-between'
                onMouseEnter={() => setShowIngredients(true)}
                onMouseLeave={() => setShowIngredients(false)}
            >
                {noMatchIngredients.ingredients.length} Ingredients <HiChevronRight size={24}/>
                {showIngredients && <div 
                    className='absolute rounded-md p-2 w-auto bg-tl-inactive-white border border-solid border-tl-inactive-grey left-0 ml-60 top-0'
                    style={{
                        backgroundImage: "linear-gradient(#A8F59B, #4BB03A)"
                    }}
                >
                    {noMatchIngredients.ingredients.map(ingredient => <div className='p-0.5 block'>
                        {ingredient.name}
                    </div>)}    
                </div>}
            </div>
        </React.Fragment>
}

export default NoMatchRecipeMenuItem;