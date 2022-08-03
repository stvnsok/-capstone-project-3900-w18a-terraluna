import React, { useState } from 'react'
import { toast } from 'react-toastify';
import NavBar from '../NavBar';
import RecipeCard from '../MyRecipes/RecipeCard';
import { getRecipes } from '../../services/recipeExplore.service';
import SlideOutRecipeExplorers from '../MyRecipes/SlideOutRecipeExplorers';

const ExploreRecipes = () => {
    const [slideOutRecipe, setSlideOutRecipe] = useState<Recipe>();
    const [recipes, setRecipes] = useState<Recipe[]>();

    return (
    <React.Fragment>
        <NavBar onIngredientSearch={(ingredients, mealType, dietType, cookingTime) => {
            getRecipes(ingredients.map(x => x.id), mealType, dietType, cookingTime)
                .then(res => {
                    setRecipes(res.recipes);
                })
                .catch(err => {
                    toast.error(err);
                })
        }}/>
        <div className={`grid grid-cols-7 gap-6 pl-10 mt-10`}>
            {recipes && recipes.length > 0 ? recipes.map(recipe => { return (
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
            )}) : <div className=' text-3xl col-span-full mx-auto'>No Recipes Found... Enter more ingredients!</div>}
        </div>
        
        <SlideOutRecipeExplorers
            recipe={slideOutRecipe}
            onClose={() => {
                setSlideOutRecipe(undefined)
            }}
            onPublish={() => {
                console.log("TODO")
            }}
        />
    </React.Fragment> 
)}

export default ExploreRecipes;