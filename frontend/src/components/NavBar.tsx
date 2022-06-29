import React, { useState } from 'react';
import { HiOutlineUser } from 'react-icons/hi'
import AccountSettingsModal from './Auth/AccountSettingsModal';
import LoginModal from './Auth/LoginModal';

const NavBar = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    const [isAccountSettingsModalOpen, setIsAccountSettingsModalOpen] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [username, setUsername] = useState<string>();

    const triggerSetUsername = (username: string) => {
        setUsername(username);
    }

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
                    className='mr-20 cursor-pointer h-6'
                    onClick={() => {
                        isLoggedIn ? setIsAccountSettingsModalOpen(true) : setIsLoginModalOpen(true);
                    }}
                >
                    { username ?? 'Log in' } <HiOutlineUser size={20} className='text-tl-active-black inline'/>
                </span> 
            </div>
        </React.Fragment>
    )
}

export default NavBar