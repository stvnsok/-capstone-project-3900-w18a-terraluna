import React from 'react'
import { HiOutlineClock } from 'react-icons/hi';

const RecipeCard = ({
    recipe,
}: {
    recipe: Recipe;
}) => {

    const minutesToHoursPipe = (time: number) => {
        const hours = Math.floor(time/60);
        const minutes = time%60;
        return `${hours < 10 ? '0' : '' }${hours}:${minutes < 10 ? '0' : ''}${minutes} Hours`;
    }

    return <div className=" shadow-md hover:shadow-lg max-w-xs h-[500px] rounded-md bg-tl-inactive-white" style={{
        transition: '0.3s'
    }}>
    <img src={recipe.imageUrl} alt="recipe" style={{
        width: '100%',
        height: '50%',
        borderRadius: '6px 6px 0px 0px'
    }}/>
    <div className="px-0.5 py-4">
      <h4 className='px-4'><b>{recipe.name}</b></h4>
      <div className='px-4 mt-5 flex'><HiOutlineClock size={24}/> <span className='ml-4'>{minutesToHoursPipe(recipe.cookTime)}</span></div>
    </div>
  </div>
}

export default RecipeCard;