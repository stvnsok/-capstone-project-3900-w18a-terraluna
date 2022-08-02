import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import CreateRecipeForm from '../NewRecipe/CreateRecipeForm';
import NavBar from '../NavBar';
import RecipeCard from '../MyRecipes/RecipeCard';
import SlideOutRecipe from '../MyRecipes/SlideOutRecipe';
import { getRecipes } from '../../services/recipeExplore.service';

const ExploreRecipes = () => {
    const [slideOutRecipe, setSlideOutRecipe] = useState<Recipe>();
    const [isCreateRecipeOpen, setIsCreateRecipeOpen] = useState<boolean>(false);
    const [fullRecipe, setFullRecipe] = useState<Partial<RecipeDetails>>();
    const [recipes, setRecipes] = useState<Recipe[]>();

    useEffect(() => {
        triggerGetRecipes([])
    }, [])

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
            triggerGetRecipes(ingredients.map(x => x.id))
            console.log(ingredients.map(x => x.id))
        }}/>
        <div className={`grid grid-cols-7 gap-6 pl-10`}>
            {recipes && recipes.map(recipe => { return (
                <div>
                    <div >
                        <RecipeCard
                            recipe={recipe}
                            onClick={() => {
                                setSlideOutRecipe(recipe)
                                setIsCreateRecipeOpen(false)
                            }}
                            view="explorer"
                        />
                        
                    </div>
                </div>
            )})}
        </div>
        
        <SlideOutRecipe
            recipe={slideOutRecipe}
            onClose={() => {
                setSlideOutRecipe(undefined)
            }}
            onEdit={(recipe) => {
                setIsCreateRecipeOpen(true);
                setFullRecipe(recipe)
                setSlideOutRecipe(undefined)
            }}
            onPublish={() => {
                triggerGetRecipes([])
            }}
        />

        <CreateRecipeForm
            isOpen={isCreateRecipeOpen}
            onClose={() => {
                setIsCreateRecipeOpen(false)
                triggerGetRecipes([])
            }}
            fullRecipe={fullRecipe}
        />
    </React.Fragment> 
)}

export default ExploreRecipes;