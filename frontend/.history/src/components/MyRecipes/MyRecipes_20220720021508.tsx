import React, { useEffect, useState } from 'react'
import { HiFire, HiPlus } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { getRecipesRecipeContributors } from '../../services/recipeContributor.service';
import Button from '../global/Button';
import NavBar from '../NavBar';
import RecipeCard from './RecipeCard';
import SlideOutRecipe from './SlideOutRecipe';
// import CreateRecipeForm from '../NewRecipe/CreateRecipeForm';

const MyRecipes = () => {
    const [slideOutRecipe, setSlideOutRecipe] = useState<Recipe>();
    const [pageNumber, setPageNumber] = useState<number>(0)
    const [openNoMatchContextMenu, setOpenNoMatchContextMenu] = useState< boolean>(false);
    // const [CreateRecipeFormOpen, setCreateRecipeFormOpen] = useState<boolean>(false);
    // const [noMatchIngredientSets, setNoMatchIngredientSets] = useState<NoMatchIngredients[]>([])
    const [recipes, setRecipes] = useState<Recipe[]>([{
        imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXxLY0tYQVBsb3FBb3x8ZW58MHx8fHw%3D&w=1000&q=80',
        name: 'Vegetarian Pizza',
        id: 1,
        cookTime: 300,
        mealType: 'Dinner',
        dietType: 'Vegetarian'
    },{
        imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXxLY0tYQVBsb3FBb3x8ZW58MHx8fHw%3D&w=1000&q=80',
        name: 'Vegetarian Pizza',
        id: 1,
        cookTime: 300,
        mealType: 'Dinner',
        dietType: 'Vegetarian'
    },{
        imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXxLY0tYQVBsb3FBb3x8ZW58MHx8fHw%3D&w=1000&q=80',
        name: 'Vegetarian Pizza',
        id: 1,
        cookTime: 300,
        mealType: 'Dinner',
        dietType: 'Vegetarian'
    },{
        imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXxLY0tYQVBsb3FBb3x8ZW58MHx8fHw%3D&w=1000&q=80',
        name: 'Vegetarian Pizza',
        id: 1,
        cookTime: 300,
        mealType: 'Dinner',
        dietType: 'Vegetarian'
    },{
        imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXxLY0tYQVBsb3FBb3x8ZW58MHx8fHw%3D&w=1000&q=80',
        name: 'Vegetarian Pizza',
        id: 1,
        cookTime: 300,
        mealType: 'Dinner',
        dietType: 'Vegetarian'
    },{
        imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXxLY0tYQVBsb3FBb3x8ZW58MHx8fHw%3D&w=1000&q=80',
        name: 'Vegetarian Pizza',
        id: 1,
        cookTime: 300,
        mealType: 'Dinner',
        dietType: 'Vegetarian'
    }]);

    useEffect(() => {
        getRecipesRecipeContributors(pageNumber)
            .then(res => {
                setRecipes(res.data.recipes);
            })
            .catch(err => {
                toast.error(err);
            })
    }, [pageNumber])


    window.onscroll = function(_) {
        if ((window.innerHeight + window.scrollY) + 1000 >= document.body.offsetHeight) {
            setPageNumber(pageNumber + 1);
        }
    };

    return (
    <React.Fragment>
        <NavBar/>
        <div className='flex justify-between p-10' id="main-page">
            <div className='flex'>
                <Button
                    onClick={() => {
                        // setCreateRecipeFormOpen(true);

                        /* Currently opens to new route for creating recipe but want to make it open a sliding window later*/
                        window.location.href = '/new_recipe';
                    }}
                    className="w-10 h-10 border border-solid border-tl-inactive-black rounded-md"
                    text={<HiPlus size={22} className="m-auto"/>}
                />
                <div className='relative'>
                    <Button
                        onClick={() => {
                            setOpenNoMatchContextMenu(!openNoMatchContextMenu);
                        }}
                        className="w-60 h-10 border border-solid border-tl-active-red rounded-md ml-4"
                        text={<React.Fragment><HiFire size={22} className="m-auto text-tl-active-red inline"/>Hottest Recipes Needed</React.Fragment>}
                    />
                    {openNoMatchContextMenu && <div className='absolute right-0 top-12 rounded-md p-2 w-60 bg-tl-inactive-green'>hello</div>}
                </div>
            </div>
            <div>

            </div>
        </div>
        <div className={`grid grid-flow-col gap-6 pl-10`}>
            {recipes && recipes.map(recipe => { return (
                <div
                    className='cursor-pointer'
                    onClick={() =>
                        setSlideOutRecipe(recipe)
                    }
                >
                    <RecipeCard 
                        recipe={recipe}
                    />
                </div>
            )})}
        </div>
        
        <SlideOutRecipe
            recipe={slideOutRecipe}
            onClose={() => {
                setSlideOutRecipe(undefined)
            }}
        />

        {/* <CreateRecipeForm
            //open={CreateRecipeFormOpen}
            onClose={() => {
                setCreateRecipeFormOpen(false)
            }}
        /> */}
    </React.Fragment> 
)}

export default MyRecipes;