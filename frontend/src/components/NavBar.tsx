import React, { useEffect, useState } from 'react';
import { HiLogout, HiOutlineHeart, HiOutlineNewspaper, HiOutlineUser } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginWithToken } from '../services/auth.service';
import AccountSettingsModal from './Auth/AccountSettingsModal';
import LoginModal from './Auth/LoginModal';

const NavBar = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    const [isAccountSettingsModalOpen, setIsAccountSettingsModalOpen] = useState<boolean>(false);
    const [isContextMenuOpen, setIsContextMenuOpen] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [username, setUsername] = useState<string>();
    const navigator = useNavigate()

    const triggerSetUsername = (username: string) => {
        setUsername(username);
    }

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        if (access_token) loginWithToken(access_token).then(res => {
            setUsername(res.data.username)
        }).catch(() => toast.error("Could not log in"))
    }, [])

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
                }}
                username={username}
                onUsernameChange={(username: string) => {
                    setUsername(username)
                }}
            />}
            <div 
                className='w-full bg-tl-inactive-green h-[300px] flex justify-end'
            >
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