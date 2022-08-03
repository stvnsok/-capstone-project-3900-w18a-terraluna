import React, { useEffect, useState } from 'react'
import { HiX } from 'react-icons/hi';
import { getIngredientCategories } from '../services/recipeExplore.service';

const NavBarPantrySlideOut = ({
    isOpen,
    selectedIngredients,
    onAddSelectedIngredient,
    onClose,
}: {
    isOpen: boolean;
    selectedIngredients: Ingredient[];
    onAddSelectedIngredient: (ingredient: Ingredient) => void;
    onClose: () => void
}) => 
{
    const [ingredientCategories, setIngredientCategories] = useState<(Ingredient & {category: string})[]>();
    const getCategories = () => {
        return ingredientCategories?.map(ingredientCategories => ingredientCategories.category).filter((cat, index, self) => self.indexOf(cat) === index)
    }

    useEffect(() => {
        getIngredientCategories().then(res => {
            setIngredientCategories(res.ingredients);
        })
    }, [selectedIngredients])

    return <div className=" bg-tl-inactive-brown min-h-full fixed top-0 right-0 border-l border-solid border-tl-inactive-grey z-50" style={{
        transition: '0.7s',
        width: '30%',
        marginRight: isOpen ? '0' : '-30vw'

    }}>
        <div className='w-full content-center max-h-screen min-h-screen overflow-y-auto'>
            <div className='flex text-3xl'><HiX className='ml-4 cursor-pointer text-tl-inactive-grey' size={50} onClick={onClose}/> <div className='font-semibold mt-2 ml-4'>Pantry</div></div>

                {ingredientCategories && getCategories()?.map(category => { return (<React.Fragment>
                    <div className='border-b-4 flex flex-wrap mt-4 pb-4'>
                        <div className='text-xl font-semibold w-full ml-4'>{category}</div>
                        {ingredientCategories && ingredientCategories.filter(ingredient => ingredient.category === category).map(ingredient => {return <div 
                            className={`${!selectedIngredients.some(selected => selected.name === ingredient.name) ? ' ' : 'bg-tl-active-green '} inline bg-tl-inactive-green text-tl-inactive-black rounded-full px-3 py-2 hover:bg-tl-active-green hover:text-tl-active-grey cursor-pointer ml-2 mt-3`}
                            onClick={() => {
                                onAddSelectedIngredient(ingredient)
                            }}
                            style={{
                                width: 'max-content'
                            }}
                        >
                            {ingredient.name}
                        </div>})}
                    </div>
                </React.Fragment>
                )})}
        </div>
    </div>
    
}

export default NavBarPantrySlideOut;