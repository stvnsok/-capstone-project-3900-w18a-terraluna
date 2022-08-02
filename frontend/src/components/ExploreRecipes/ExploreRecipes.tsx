import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import NavBar from '../NavBar';
import RecipeCard from '../MyRecipes/RecipeCard';
import { getRecipes } from '../../services/recipeExplore.service';
import SlideOutRecipeExplorers from '../MyRecipes/SlideOutRecipeExplorers';

const ExploreRecipes = () => {
    const [slideOutRecipe, setSlideOutRecipe] = useState<Recipe>();
    const [recipes, setRecipes] = useState<Recipe[]>();
    const [ingredients, setIngredients] = useState<Ingredient[]>();

    useEffect(() => {
        triggerGetRecipes(ingredients?.map(x => x.id) ?? [])
    }, [ingredients])

    const triggerGetRecipes = (ids: number[]) => {
        getRecipes(ids)
            .then(res => {
                setRecipes(res.recipes);
            })
            .catch(err => {
                toast.error(err);
            })
    }

    return (
    <React.Fragment>
        <NavBar onIngredientSearch={(ingredients) => {
            setIngredients(ingredients)
        }}/>
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
                triggerGetRecipes(ingredients?.map(x => x.id) ?? [])
            }}
        />
    </React.Fragment> 
)}

export default ExploreRecipes;