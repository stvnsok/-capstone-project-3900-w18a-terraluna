import React, { useState } from "react";
import { HiChevronDown, HiChevronRight } from "react-icons/hi";
import ChangeEmailForm from "./ChangeEmailForm";
import ChangePasswordForm from "./ChangePasswordForm";
import ChangeUsernameForm from "./ChangeUsernameForm";

type ChangeAccountDetailsMenus = 'changePassword' | 'changeUsername' | 'changeEmail';

const ChangeAccountDetails = ({
    onUsernameChange
}: {
    onUsernameChange: (username: string) => void;
}) => {
    const [expanded, setExpanded] = useState<ChangeAccountDetailsMenus>();

    return (
        <React.Fragment>
            <div 
                className={`w-full h-6 bg-tl-active-green flex ${expanded !== 'changeEmail' ? 'cursor-pointer' : ''}`}
                onClick={() => {
                    setExpanded('changeEmail')
                }}
            >
                <div className="w-1/2 ml-3"> Change Email </div>
                <div className="flex w-full justify-end mr-3">
                {expanded !== 'changeEmail' ? <HiChevronRight
                        className="my-auto text-xl"
                    /> : <HiChevronDown
                        className="my-auto text-xl"
                    />}
                </div>
            </div>
            {expanded === 'changeEmail' && (<div className="px-5 w-2/3 mt-4">
                <ChangeEmailForm/>
            </div>)}
            <div 
                className={`w-full h-6 bg-tl-active-green flex ${expanded !== 'changeUsername' ? 'cursor-pointer' : ''}`}
                onClick={() => {
                    setExpanded('changeUsername')
                }}
            >
                <div className="w-1/2 ml-3"> Change Username </div>
                <div className="flex w-full justify-end mr-3">
                {expanded !== 'changeUsername' ? <HiChevronRight
                        className="my-auto text-xl"
                    /> : <HiChevronDown
                        className="my-auto text-xl"
                    />}
                </div>
            </div>
            {expanded === 'changeUsername' && (<div className="px-5 w-2/3 mt-4">
                <ChangeUsernameForm
                    onUsernameChange={onUsernameChange}
                />
            </div>)}
            <div 
                className={`w-full h-6 bg-tl-active-green flex ${expanded !== 'changePassword' ? 'cursor-pointer' : ''}`}
                onClick={() => {
                    setExpanded('changePassword')
                }}
            >
                <div className="w-1/2 ml-3"> Change Password</div>
                <div className="flex w-full justify-end mr-3">
                    {expanded !== 'changePassword' ? <HiChevronRight
                        className="my-auto text-xl"
                    /> : <HiChevronDown
                        className="my-auto text-xl"
                    />}
                </div>
            </div>
            {expanded === 'changePassword' && (<div className="px-5 w-1/2 mt-4">
                <ChangePasswordForm/>
            </div>)}
        </React.Fragment>
    )
}

export default ChangeAccountDetails