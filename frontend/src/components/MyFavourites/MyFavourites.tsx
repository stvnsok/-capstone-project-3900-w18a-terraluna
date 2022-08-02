import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import NavBar from '../NavBar';
import RecipeCard from '../MyRecipes/RecipeCard';
import { getRecipesFavourites } from '../../services/recipeExplore.service';
import SlideOutRecipeExplorers from '../MyRecipes/SlideOutRecipeExplorers';

const FavouriteRecipes = () => {
    const [slideOutRecipe, setSlideOutRecipe] = useState<Recipe>();
    const [recipes, setRecipes] = useState<Recipe[]>();

    useEffect(() => {
        triggerGetRecipes()
    }, [])

    const triggerGetRecipes = () => {
        getRecipesFavourites()
            .then(res => {
                setRecipes(res.recipes);
            })
            .catch(err => {
                toast.error(err);
            })
    }

    return (
    <React.Fragment>
        <NavBar collapsed/>
        <div className={`grid grid-cols-7 gap-6 pl-10 mt-10`}>
            {recipes && recipes.map(recipe => { return (
                <div>
                    <div >
                        <RecipeCard
                            recipe={recipe}
                            onClick={() => {
                                setSlideOutRecipe(recipe)
                            }}
                            view="explorer"
                        />
                        
                    </div>
                </div>
            )})}
        </div>
        
        <SlideOutRecipeExplorers
            recipe={slideOutRecipe}
            onClose={() => {
                setSlideOutRecipe(undefined)
            }}
            onPublish={() => {
                triggerGetRecipes()
            }}
        />
    </React.Fragment> 
)}

export default FavouriteRecipes;