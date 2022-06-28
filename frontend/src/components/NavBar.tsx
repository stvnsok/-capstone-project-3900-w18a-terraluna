import React, { useState } from 'react';
import { HiOutlineUser } from 'react-icons/hi'
import AccountSettingsModal from './Auth/AccountSettingsModal';
import LoginModal from './Auth/LoginModal';

const NavBar = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    const [isAccountSettingsModalOpen, setIsAccountSettingsModalOpen] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    return (
        <React.Fragment>
            <LoginModal
                isOpen={isLoginModalOpen}
                closeFunction={() => {
                    setIsLoginModalOpen(false);
                }}
                onLogin={() => {
                    setIsLoggedIn(true);
                }}
            />
            <AccountSettingsModal
                isOpen={isAccountSettingsModalOpen}
                closeFunction={() => {
                    setIsAccountSettingsModalOpen(false);
                }}
                onLogOut={() => {
                    setIsLoggedIn(false);
                }}
            />
            <div 
                className='w-full bg-tl-inactive-green h-[300px] flex justify-end'
            >
                <span 
                    className='mr-20 cursor-pointer h-6'
                    onClick={() => {
                        isLoggedIn ? setIsAccountSettingsModalOpen(true) : setIsLoginModalOpen(true);
                    }}
                >
                    {isLoggedIn ? 'David Peng' : 'Log in'} <HiOutlineUser size={20} className='text-tl-active-black inline'/>
                </span> 
            </div>
        </React.Fragment>
    )
}

export default NavBar