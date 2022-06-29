import React, { useState } from "react";
import { HiOutlineSparkles } from "react-icons/hi";
import { toast } from "react-toastify";
import { logout } from "../../services/auth.service";
import { Modal } from "../global/Modal";
import ChangeAccountDetails from "./ChangeAccountDetails";
import UserProfile from "./UserProfile";

interface AccountSettingsModalProps {
    isOpen: boolean;
    closeFunction: () => void;
    onLogOut: () => void;
    onUsernameChange: (username: string) => void
    username: string;
}

type AccountSettingsMenus = 'accountDetails' | 'changeLoginDetails'

const AccountSettingsModal = ({
    isOpen,
    closeFunction,
    onLogOut,
    username,
    onUsernameChange
}: AccountSettingsModalProps) => {
    const [menuSelected, setMenuSelected] = useState<AccountSettingsMenus>('accountDetails');

    const getMenuComponent = (menu: AccountSettingsMenus): JSX.Element => {
        switch (menu) {
            case 'accountDetails':
                return (
                    <UserProfile
                        username={username}
                        onLogOut={() => {
                            closeFunction()
                            logout()
                                .then(() => {
                                    toast.success("Successfully Logged Out")
                                    onLogOut()
                                })
                                .catch(() => {
                                    toast.error("Couldn't Log Out")
                                })
                        }}
                    />
                )
            case 'changeLoginDetails':
                return (
                    <ChangeAccountDetails
                        onUsernameChange={onUsernameChange}
                    />
                )
        }
    }

    return  (<React.Fragment>
         <Modal
            isOpen={isOpen}
            closeFunction={() => {
                closeFunction();
            }}
         >
            <div className="min-w-[1000px] h-[800px]">
                <div className="w-full h-24 bg-tl-inactive-green flex align-middle">
                    <span className="text-3xl my-auto">
                        <HiOutlineSparkles className="inline ml-8"/> TerraLuna - My Account
                    </span>
                </div>
                
                <div className="grid grid-cols-5">
                    <div className="col-span-1 h-[704px] border-r border-solid border-tl-active-black">
                        <div className={`border-b border-solid border-tl-active-black flex align-middle ${menuSelected !== 'accountDetails' ? 'cursor-pointer' : 'text-tl-active-green'}`} onClick={() => setMenuSelected('accountDetails')}><span className="ml-2">Account Details</span></div>
                        <div className={`border-b border-solid border-tl-active-black flex align-middle ${menuSelected !== 'changeLoginDetails' ? 'cursor-pointer' : 'text-tl-active-green'}`} onClick={() => setMenuSelected('changeLoginDetails')}><span className="ml-2">Change Account Settings</span></div>
                    </div>
                    <div className="col-span-4 h-[704px]">
                        {getMenuComponent(menuSelected)}
                    </div>
                </div>
            </div>
         </Modal>
    </React.Fragment>)
}

export default AccountSettingsModal