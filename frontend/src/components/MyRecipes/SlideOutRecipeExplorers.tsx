import React, { useEffect, useState } from 'react'
import { HiChevronLeft, HiChevronRight, HiOutlineClock, HiOutlineCreditCard, HiOutlineXCircle, HiX } from 'react-icons/hi';
import { AiFillStar, AiOutlineCheckCircle, AiOutlineCopyrightCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { getRecipe } from '../../services/recipeContributor.service';
import Button from '../global/Button';
import { BsCircleFill } from 'react-icons/bs';
import { favoriteRecipe } from '../../services/recipeExplore.service';

const SlideOutRecipeExplorers = ({
    recipe,
    onClose,
    onPublish,
}: {
    recipe?: Recipe;
    onClose: () => void
    onPublish: () => void
}) => {
    const minutesToHoursPipe = (time: number) => {
        const hours = Math.floor(time/60);
        const minutes = time%60;
        return `${hours < 10 ? '0' : '' }${hours}:${minutes < 10 ? '0' : ''}${minutes} Hours`;
    }

    const getReviewCount = (stars?: [1,2,3,4,5][number]): number => {
        if (!fullRecipe.reviews) return 0;
        if (!stars) return fullRecipe.reviews.length;
        return fullRecipe.reviews.filter(review => review.stars === stars).length
    }

    const [currentStep, setCurrentStep] = useState<number>(1);

    const getAverageReview = () => {
        if (!fullRecipe || !fullRecipe.reviews || fullRecipe.reviews.length === 0) return 0
        let total = 0;
        fullRecipe.reviews?.forEach(review => total += review.stars)
        return (total / fullRecipe.reviews.length).toPrecision(3);
    }

    const [fullRecipe, setFullRecipe] = useState<Partial<RecipeDetails>>({});

    const getStatusIcon = (status: Recipe["status"]) => {
        if (status === 'Draft') return <HiOutlineXCircle size={32}/>    
        if (status === 'Published') return <AiOutlineCheckCircle size={32}/>
        if (status === 'Template') return <AiOutlineCopyrightCircle size={32}/>
    }

    useEffect(() => {
        if (recipe?.id) getRecipe(recipe.id).then(res => {
            setFullRecipe(res.recipe)
        })
    }, [recipe])

    return <div className=" bg-tl-inactive-brown min-h-full fixed top-0 right-0 border-l border-solid border-tl-inactive-grey" style={{
        transition: '0.7s',
        width: '90%',
        marginRight: recipe ? '0' : '-90vw'

    }}>
        <div className='w-full content-center max-h-screen overflow-y-auto'>
            <div><HiX className='ml-4 cursor-pointer text-tl-inactive-grey' size={50} onClick={onClose}/></div>
            <div className='justify-between flex'>
                <h2 className='ml-16 font-semibold text-4xl'>{recipe?.name}</h2>
                <div>
                    
                    <Button
                        onClick={() => {
                            if (recipe) {
                                favoriteRecipe(recipe.id)
                                    .then(_ => {
                                        toast.success('Successfully favorited ' + recipe.name)
                                        onPublish();
                                        onClose();
                                    })
                                    .catch(err => {
                                        toast.error(err)
                                    })
                            }
                        }}
                        text={"Favorite"}
                        className="mr-16 bg-tl-inactive-green px-6 py-3 rounded-md shadow-md"
                    />
                    
                </div>
            </div>
            {recipe && <div className='p-10 grid grid-cols-4 gap-5'>
                <div>
                    <img width={400} height={400} src={recipe.imageUrl ? `http://localhost:5000/uploads?name=${recipe.imageUrl}` : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'} alt="recipeImage"/>
                    {fullRecipe.ingredients && fullRecipe.ingredients.map(ingredient => { return <div className='mt-8 flex'><BsCircleFill size={12} className='my-auto text-tl-active-green'/> <span className='ml-4 text-md'>{ingredient.name} - {ingredient.quantity} {ingredient.units}</span></div>})}
                </div>
                <div className='col-span-3 grid grid-cols-3'>
                    <div>
                        <div className='font-semibold text-3xl'>Details</div>
                        <div className='mt-8 flex'><HiOutlineCreditCard size={32}/> <span className='ml-4 text-xl'>{fullRecipe.name ?? recipe.name}</span></div>
                        <div className='mt-8 flex'><HiOutlineClock size={32}/> <span className='ml-4 text-xl'>{minutesToHoursPipe(fullRecipe.cookTime ?? recipe.cookTime)}</span></div>
                        <div className='mt-8 flex'>{getStatusIcon(fullRecipe.status ?? recipe.status)}<span className='ml-4 text-xl'>{fullRecipe.status ?? recipe.status}</span></div>
                    </div>
                    <div>
                        <div className='font-semibold text-3xl'>Meal Types</div>
                        {(fullRecipe.mealType ?? recipe.mealType).map(mealType => { return <div className='mt-8 flex'><BsCircleFill size={16} className=" text-tl-inactive-red my-auto"/> <span className='ml-4 text-xl'>{mealType}</span></div>})}
                        
                    </div>
                    <div>
                        <div className='font-semibold text-3xl'>Diet Types</div>
                        {(fullRecipe.dietType ?? recipe.dietType).map(dietType => { return <div className='mt-8 flex'><BsCircleFill size={16} className=" text-tl-inactive-blue my-auto"/> <span className='ml-4 text-xl'>{dietType}</span></div>})}
                    </div>
                    {fullRecipe && <React.Fragment>
                        <div className='col-span-2 mt-24'>
                            <div className='text-2xl font-semibold'>Instructions</div>
                            <div className='grid grid-cols-12 mt-10'>
                                <HiChevronLeft size={50} className={`my-auto ${currentStep <= 1 ? 'text-tl-inactive-grey' : 'cursor-pointer'}`} onClick={() => {
                                    if (currentStep <= 1) return;
                                    setCurrentStep(previous => previous -= 1)
                                }}/>
                                <div className='col-span-10 grid grid-cols-2 gap-5'>
                                    <div className={`p-5 shadow-md rounded-md bg-tl-inactive-white ${fullRecipe.steps?.at(currentStep - 1)?.videoUrl ? 'col-span-1' : 'col-span-2'}`}>
                                        {fullRecipe.steps?.at(currentStep - 1)?.instruction}
                                    </div>
                                    {fullRecipe.steps?.at(currentStep - 1)?.videoUrl && <video src={`http://localhost:5000/uploads?name=${fullRecipe.steps.at(currentStep - 1)?.videoUrl}`} controls className='mx-auto shadow-md rounded-md w-full'/>}
                                </div>
                                <HiChevronRight size={50} className={`ml-auto my-auto ${currentStep >= (fullRecipe.steps?.length ?? 0) ? 'text-tl-inactive-grey' : 'cursor-pointer'}`} onClick={() => {
                                    if (currentStep >= (fullRecipe.steps?.length ?? 0)) return;
                                    setCurrentStep(previous => previous += 1)
                                }}/>
                                <div className='col-span-full mx-auto mt-4'>
                                    Step {currentStep} of {fullRecipe.steps?.length ?? 0}
                                </div>
                            </div>
                        </div>
                        <div></div>
                        </React.Fragment>}
                    {(fullRecipe.status ?? recipe.status) === "Published" && <React.Fragment>
                        {getReviewCount() > 0 ? <div className='col-span-2 mt-24'>
                            <div className='text-2xl font-semibold'>Reviews - Average Score {getAverageReview()}/5</div>
                            <div className='grid grid-cols-3'>
                                <div className='col-span-2'>
                                    <div className='h-2 w-full bg-tl-inactive-green rounded-3xl flex mt-2'>
                                        <div className='h-full bg-tl-active-green rounded-3xl' style={{
                                            width: `${(getReviewCount(5)*100)/getReviewCount()}%`
                                        }}></div>
                                    </div>
                                    <div className='h-2 w-full bg-tl-inactive-green rounded-3xl flex mt-2'>
                                        <div className='h-full bg-tl-active-green rounded-3xl' style={{
                                            width: `${(getReviewCount(4)*100)/getReviewCount()}%`
                                        }}></div>
                                    </div>
                                    <div className='h-2 w-full bg-tl-inactive-green rounded-3xl flex mt-2'>
                                        <div className='h-full bg-tl-active-green rounded-3xl' style={{
                                            width: `${(getReviewCount(3)*100)/getReviewCount()}%`
                                        }}></div>
                                    </div>
                                    <div className='h-2 w-full bg-tl-inactive-green rounded-3xl flex mt-2'>
                                        <div className='h-full bg-tl-active-green rounded-3xl' style={{
                                            width: `${(getReviewCount(2)*100)/getReviewCount()}%`
                                        }}></div>
                                    </div>
                                    <div className='h-2 w-full bg-tl-inactive-green rounded-3xl flex mt-2'>
                                        <div className='h-full bg-tl-active-green rounded-3xl' style={{
                                            width: `${(getReviewCount(1)*100)/getReviewCount()}%`
                                        }}></div>
                                    </div>
                                </div>
                                <div></div>
                            </div>
                        </div> : <div className='col-span-2 mt-24'>
                            <div className='text-2xl font-semibold'>Reviews - No Reviews to Show Yet</div>
                            <div className='grid grid-cols-3'>
                                <div className='col-span-2'>
                                    <div className='h-2 w-full bg-tl-inactive-green rounded-3xl flex mt-2'>
                                        <div className='h-full bg-tl-active-green rounded-3xl' style={{
                                            width: `0%`
                                        }}></div>
                                    </div>
                                    <div className='h-2 w-full bg-tl-inactive-green rounded-3xl flex mt-2'>
                                        <div className='h-full bg-tl-active-green rounded-3xl' style={{
                                            width: `0%%`
                                        }}></div>
                                    </div>
                                    <div className='h-2 w-full bg-tl-inactive-green rounded-3xl flex mt-2'>
                                        <div className='h-full bg-tl-active-green rounded-3xl' style={{
                                            width: `0%%`
                                        }}></div>
                                    </div>
                                    <div className='h-2 w-full bg-tl-inactive-green rounded-3xl flex mt-2'>
                                        <div className='h-full bg-tl-active-green rounded-3xl' style={{
                                            width: `0%%`
                                        }}></div>
                                    </div>
                                    <div className='h-2 w-full bg-tl-inactive-green rounded-3xl flex mt-2'>
                                        <div className='h-full bg-tl-active-green rounded-3xl' style={{
                                            width: `0%%`
                                        }}></div>
                                    </div>
                                </div>
                                <div></div>
                            </div>
                        </div>}
                    </React.Fragment>}
                    {fullRecipe.reviews && recipe.status === "Published" && <React.Fragment>
                        <div className='col-span-3 grid grid-cols-2 gap-5 mt-4'>
                            <div>
                                {fullRecipe.reviews.map((review, index) => {
                                    return index % 2 === 0 ? <React.Fragment>
                                        <div className='p-5 shadow-md rounded-md bg-tl-inactive-white mt-2'>
                                            <div className='flex'>
                                                {[1,2,3,4,5].map(star => {
                                                    if (star <= review.stars) return <AiFillStar className=' text-tl-active-yellow'/>
                                                    return <AiFillStar className=' text-tl-inactive-yellow'/>
                                                })}
                                            </div>
                                            {review.review}
                                        </div>
                                    </React.Fragment> : ''
                                })}
                            </div>
                            <div>
                                {fullRecipe.reviews.map((review, index) => {
                                    return index % 2 === 1 ? <React.Fragment>
                                        <div className='p-5 shadow-md rounded-md bg-tl-inactive-white mt-2'>
                                            <div className='flex'>
                                                {[1,2,3,4,5].map(star => {
                                                    if (star <= review.stars) return <AiFillStar className=' text-tl-active-yellow'/>
                                                    return <AiFillStar className=' text-tl-inactive-yellow'/>
                                                })}
                                            </div>
                                            {review.review}
                                        </div>
                                    </React.Fragment> : ''
                                })}
                            </div>
                        </div>
                    </React.Fragment>}
                </div>
            </div>}
        </div>
        
    </div>
}

export default SlideOutRecipeExplorers;