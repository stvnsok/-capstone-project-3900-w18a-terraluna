import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import NavBar from '../NavBar';
import RecipeCard from '../MyRecipes/RecipeCard';
import { getRecipesFavourites } from '../../services/recipeExplore.service';
import SlideOutRecipeExplorers from '../MyRecipes/SlideOutRecipeExplorers';
import Button from '../global/Button';
import { useNavigate } from 'react-router-dom';

const FavouriteRecipes = () => {
    const [slideOutRecipe, setSlideOutRecipe] = useState<Recipe>();
    const [recipes, setRecipes] = useState<Recipe[]>();
    const navigator = useNavigate();

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
        <Button
            onClick={() => {
                navigator('/')
            }}
            text={"Continue Exploring"}
            className=" bg-tl-inactive-white px-6 py-3 rounded-md shadow-md mt-5 ml-16"
        />
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
            allowFav={false}
        />
    </React.Fragment> 
)}

export default FavouriteRecipes;