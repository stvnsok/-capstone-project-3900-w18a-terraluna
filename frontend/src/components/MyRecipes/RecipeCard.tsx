import React from 'react'
import { HiNewspaper, HiOutlineClock } from 'react-icons/hi';

const RecipeCard = ({
    recipe,
    onClick,
    view = "contributor"
}: {
    recipe: Recipe;
    onClick: () => void;
    view?: string;
}) => {

    const minutesToHoursPipe = (time: number) => {
        const hours = Math.floor(time/60);
        const minutes = time%60;
        return `${hours < 10 ? '0' : '' }${hours}:${minutes < 10 ? '0' : ''}${minutes} Hours`;
    }

    const getRecipeStatusChip = (status: string) => {
        if (status === "Draft") return <div className='inline bg-tl-inactive-grey text-tl-active-grey rounded-sm px-2 py-1 ml-4'>{recipe.status}</div>
        if (status === "Published") return <div className='inline bg-tl-inactive-green text-tl-active-green rounded-sm px-2 py-1 ml-4'>{recipe.status}</div>
        if (status === "Template") return <div className='inline bg-tl-inactive-red text-tl-active-red rounded-sm px-2 py-1 ml-4'>{recipe.status}</div>
    }

    return <div className=" shadow-md hover:shadow-lg max-w-xs h-[500px] rounded-md bg-tl-inactive-white cursor-pointer" style={{
        transition: '0.3s'
    }}
        onClick={onClick}
    >
    <img src={recipe.imageUrl ? `http://localhost:5000/uploads?name=${recipe.imageUrl}` : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'} className="border-b border-solid" alt="recipe" style={{
        width: '100%',
        height: '50%',
        borderRadius: '6px 6px 0px 0px',
    }}/>
    <div className="px-0.5 py-4">
      <h4 className='px-4'><b>{recipe.name}</b>{view === "contributor" && getRecipeStatusChip(recipe.status)}</h4>
      <div className='px-4 mt-5 flex'><HiOutlineClock size={24}/> <span className='ml-4'>{minutesToHoursPipe(recipe.cookTime)}</span></div>
      <div className='px-4 flex line-clamp mt-5'> <span className=''><HiNewspaper size={24} className="inline"/><span className='ml-4'></span>{recipe.description}</span></div>
    </div>
  </div>
}

export default RecipeCard;