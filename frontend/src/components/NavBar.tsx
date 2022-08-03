import React, { useEffect, useState } from 'react';
import { HiLogout, HiOutlineHeart, HiOutlineNewspaper, HiOutlineUser } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginWithToken } from '../services/auth.service';
import { getIngredients } from '../services/recipeContributor.service';
import AccountSettingsModal from './Auth/AccountSettingsModal';
import LoginModal from './Auth/LoginModal';
import TLSelect from './global/AsyncSelect';
import TextInput from './global/TextInput';

const NavBar = ({onIngredientSearch, onMyRecipeSearch, collapsed}: {
    onIngredientSearch?: (ingredients: Ingredient[], mealType: string[], dietType: string[], cookingTime: number) => void;
    onMyRecipeSearch?: (query: string, mealType: string[], dietType: string[], statuses: string[]) => void
    collapsed? :boolean
}) => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    const [isAccountSettingsModalOpen, setIsAccountSettingsModalOpen] = useState<boolean>(false);
    const [isContextMenuOpen, setIsContextMenuOpen] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [username, setUsername] = useState<string>();
    const [name, setName] = useState<string>('');
    const navigator = useNavigate()
    
    const [mealType, setMealType] = useState<{ id: number, name: string}[]>([]);
    const [dietType, setDietType] = useState<{ id: number, name: string}[]>([]);
    const [statuses, setStatuses] = useState<{ id: number, name: string}[]>([]);
    const [cookTime, setCookTime] = useState<{ id: number, name: string, value: number}>();
    const triggerSetUsername = (username: string) => {
        setUsername(username);
    }

    const [ingredients, setIngredients] = useState<Ingredient[]>([])

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
            <div 
                className={`w-full bg-tl-inactive-green ${ collapsed ? 'h-[100px]' : 'h-[300px]'} flex justify-between`}
            >   
                {!collapsed && onIngredientSearch ? <div className='w-9/12 mx-auto my-10'>
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