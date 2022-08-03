import React, { useEffect, useState } from 'react';
import { HiLogin, HiLogout, HiOutlineHeart, HiOutlineNewspaper, HiOutlineUser } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginWithToken } from '../services/auth.service';
import { getIngredients, getSuggestedIngredient } from '../services/recipeContributor.service';
import { getPantry, savePantry } from '../services/recipeExplore.service';
import AccountSettingsModal from './Auth/AccountSettingsModal';
import LoginModal from './Auth/LoginModal';
import TLSelect from './global/AsyncSelect';
import Button from './global/Button';
import TextInput from './global/TextInput';
import NavBarPantrySlideOut from './NavBarPantrySlideOut';

const NavBar = ({onIngredientSearch, onMyRecipeSearch, collapsed}: {
    onIngredientSearch?: (ingredients: Ingredient[], mealType: string[], dietType: string[], cookingTime: number) => void;
    onMyRecipeSearch?: (query: string, mealType: string[], dietType: string[], statuses: string[]) => void
    collapsed? :boolean
}) => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    const [isAccountSettingsModalOpen, setIsAccountSettingsModalOpen] = useState<boolean>(false);
    const [isContextMenuOpen, setIsContextMenuOpen] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isPantryOpen, setIsPantryOpen] = useState<boolean>(false);
    const [username, setUsername] = useState<string>();
    const [name, setName] = useState<string>('');
    const navigator = useNavigate()
    const [hasLoaded, setHasLoaded] = useState<boolean>(false);
    
    const [mealType, setMealType] = useState<{ id: number, name: string}[]>([]);
    const [dietType, setDietType] = useState<{ id: number, name: string}[]>([]);
    const [statuses, setStatuses] = useState<{ id: number, name: string}[]>([]);
    const [cookTime, setCookTime] = useState<{ id: number, name: string, value: number}>();
    const triggerSetUsername = (username: string) => {
        setUsername(username);
    }

    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [recommendedIngredients, setRecommendedIngredients] = useState<Ingredient[]>([])

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        if (access_token !== null) loginWithToken(access_token).then(res => {
            setUsername(res.data.username);
            setIsLoggedIn(true);
        }).catch(() => toast.error("Could not log in"))
    }, [])

    useEffect(() => {
        if (onIngredientSearch) onIngredientSearch(ingredients, mealType.map(x => x.name), dietType.map(x => x.name), cookTime?.value ?? -1);
    }, [ingredients, mealType, dietType, cookTime])

    useEffect(() => {
        if (isLoggedIn) getPantry().then(res => {
            setIngredients(res.ingredients)
        }).catch(() => {
            toast.error("Could not retrieve Pantry")
        }) 
    }, [isLoggedIn])

    useEffect(() => {
        if (!hasLoaded) setHasLoaded(true)
        else if (isLoggedIn) savePantry(ingredients.map(x => x.id)).catch(() => {
            toast.error("Could not save Pantry")
        })
        getSuggestedIngredient(ingredients.map(x => x.id)).then(res => {
            setRecommendedIngredients(res.ingredients);
        })
    }, [ingredients])

    useEffect(() => {
        if (onMyRecipeSearch) onMyRecipeSearch(name, mealType.map(x => x.name), dietType.map(x => x.name), statuses.map(x => x.name));
    }, [name, mealType, dietType, statuses])

    const dietTypeOptions = ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free', 'Halal'].map((dietType, index) => { 
        return { id: index, name: dietType }
    })

    const mealTypeOptions = ['breakfast', 'lunch', 'dinner', 'snack'].map((mealType, index) => { 
        return { id: index, name: mealType }
    })

    const statusOptions = ['Draft', 'Published', 'Template'].map((mealType, index) => { 
        return { id: index, name: mealType }
    })

    const cookTimeOptions = [['None Selected', -1], ['<= 20 minutes', 20], ['<= 30 minutes', 30], ['<= 1 hour', 60], ['<= 2 hours', 120], [' >= 2 hours', -1]].map((cookTime, index) => { 
        return { id: index, name: cookTime[0] as string, value: cookTime[1] as number }
    })

    return (
        <React.Fragment>
            <NavBarPantrySlideOut
                selectedIngredients={ingredients}
                onAddSelectedIngredient={(ingredient) => {
                    !ingredients.some(selected => selected.name === ingredient.name) ? setIngredients([...ingredients, ingredient]) : setIngredients([...ingredients].filter(x => x.name !== ingredient.name))
                }}
                isOpen={isPantryOpen}
                onClose={() => {
                    setIsPantryOpen(false)
                }}
            />
            <LoginModal
                isOpen={isLoginModalOpen}
                closeFunction={() => {
                    setIsLoginModalOpen(false);
                }}
                onLogin={(res: LoginApiResponse) => {
                    setIsLoggedIn(true);
                    triggerSetUsername(res.data.username)
                    localStorage.setItem('access_token', res.data.access_token)
                    localStorage.setItem('refresh_token', res.data.refresh_token)
                }}
            />
            { username && <AccountSettingsModal
                isOpen={isAccountSettingsModalOpen}
                closeFunction={() => {
                    setIsAccountSettingsModalOpen(false);
                }}
                onLogOut={() => {
                    setIsLoggedIn(false);
                    setUsername(undefined);
                    localStorage.removeItem('access_token')
                    localStorage.removeItem('refresh_token')
                }}
                username={username}
                onUsernameChange={(username: string) => {
                    setUsername(username)
                }}
            />}
            {onIngredientSearch && <div className="my-logo z-50 -mt-16 ml-4">
                TerraLuna
                <div></div>
            </div>}
            <div 
                className={`w-full bg-tl-inactive-green ${ collapsed ? 'h-[100px]' : 'h-[300px]'} flex justify-between`}
            >   
                
                {!collapsed && onIngredientSearch ? <div className='w-9/12 mx-auto my-10'
                    style={{transform: 'translateX(50px)'}}
                >
                    <div className='flex w-full'>
                        <Button
                            onClick={() => setIsPantryOpen(prev => !prev)}
                            className="w-[37px] h-[37px] shadow-sm bg-tl-inactive-white rounded-md mt-auto mr-4"
                            text={isPantryOpen ? <HiLogout size={22} className="m-auto"/> : <HiLogin size={22} className="m-auto"/>}
                        />
                        <TLSelect
                            name="Ingredient"
                            header="Ingredient"
                            value={ingredients} 
                            onChange={(val: Ingredient[]) => {
                                setIngredients(val);
                            }}
                            apiCall={getIngredients}
                            apiCallKey="ingredients"
                            isAsync
                            multi
                        />
                    </div>
                    <div className='mt-5 grid grid-cols-3 gap-10'>
                        <TLSelect
                            onChange={(e) => {
                                setMealType(e);
                            }}
                            header="Meal Type"
                            multi={true}
                            value={mealType}
                            options={mealTypeOptions}
                            isAsync={false}
                        />
                        <TLSelect
                            onChange={(e) => {
                                setDietType(e);
                            }}
                            header="Diet Type"
                            multi={true}
                            value={dietType}
                            options={dietTypeOptions}
                            isAsync={false}
                        />
                        <TLSelect
                            header={"Cooking Time"}
                            value={cookTime}
                            onChange={(e) => {
                                setCookTime(e);
                            }}
                            options={cookTimeOptions}
                            isAsync={false}
                            multi={false}
                        />
                    </div>
                    <div className='mt-6'>
                        {recommendedIngredients.length > 0 && <span className='ml-2'>Do you have?</span>}
                        {recommendedIngredients && recommendedIngredients.map(ingredient => {return <div 
                            className='inline bg-tl-inactive-brown text-tl-inactive-black rounded-full px-3 py-2 hover:bg-tl-active-green hover:text-tl-active-grey cursor-pointer ml-2'
                            onClick={() => {
                                setIngredients(prev => [...prev, {
                                    id: ingredient.id,
                                    name: ingredient.name
                                }])
                                setRecommendedIngredients([])
                            }}
                        >
                            {ingredient.name}
                        </div>})}
                    </div>
                </div> : <div></div>}
                {!collapsed && onMyRecipeSearch ? <div className='w-9/12 mx-auto my-10'>
                    <div>
                        <label htmlFor='name'> Recipe Name</label>
                        <TextInput
                            value={name}
                            onValueChange={(value) => {
                                setName(value);
                            }}
                            placeholder={"Recipe Name..."}
                        />
                    </div>
                    <div className='mt-5 grid grid-cols-3 gap-10'>
                        <TLSelect
                            onChange={(e) => {
                                setMealType(e);
                            }}
                            header="Meal Type"
                            multi={true}
                            value={mealType}
                            options={mealTypeOptions}
                            isAsync={false}
                        />
                        <TLSelect
                            onChange={(e) => {
                                setDietType(e);
                            }}
                            header="Diet Type"
                            multi={true}
                            value={dietType}
                            options={dietTypeOptions}
                            isAsync={false}
                        />
                        <TLSelect
                            header={"Statuses"}
                            value={statuses}
                            onChange={(e) => {
                                setStatuses(e);
                            }}
                            options={statusOptions}
                            isAsync={false}
                            multi={true}
                        />
                    </div>
                </div> : <div></div>}
                <span 
                    className='mr-20 cursor-pointer h-6 relative'
                    onClick={() => {
                        isLoggedIn ? setIsContextMenuOpen(!isContextMenuOpen) : setIsLoginModalOpen(true);
                    }}
                >
                    { username ?? 'Log in' } <HiOutlineUser size={20} className='text-tl-active-black inline'/>
                    {isContextMenuOpen && <div className='absolute bg-tl-inactive-white right-0'>
                        <div 
                            className='p-3 flex w-40 border-solid border border-tl-inactive-grey'
                            onClick={() => {
                                setIsAccountSettingsModalOpen(true);
                            }}
                        > 
                            <HiOutlineUser size={22}/> 
                            <span className='pl-3'>My Account</span>
                        </div>
                        <div 
                            className='p-3 flex w-40 border-solid border border-tl-inactive-grey'
                            onClick={() => {
                                navigator('/my_recipes')
                            }}
                        > 
                            <HiOutlineNewspaper size={22}/> 
                            <span className='pl-3'>My Recipes</span>
                        </div>
                        <div 
                            className='p-3 flex w-40 border-solid border border-tl-inactive-grey'
                            onClick={() => {
                                navigator('/my_favourites')
                            }}
                        > 
                            <HiOutlineHeart size={22}/> 
                            <span className='pl-3'>My Favorites</span>
                        </div>
                        
                        <div 
                            className='p-3 flex w-40 border-solid border border-tl-inactive-grey'
                            onClick={() => {
                                setIsLoggedIn(false);
                                setUsername(undefined);
                                localStorage.removeItem('access_token')
                                localStorage.removeItem('refresh_token')
                            }}
                        > 
                            <HiLogout size={22}/> 
                            <span className='pl-3'>Sign Out</span>
                        </div>
                    </div>}
                </span>
                
            </div>
        </React.Fragment>
    )
}

export default NavBar