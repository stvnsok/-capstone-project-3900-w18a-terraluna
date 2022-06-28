import React from "react";
import Button from "../global/Button";

interface UserProfileProps {
    onLogOut: () => void;

}

const UserProfile = ({
    onLogOut
}: UserProfileProps) => {
    return (<React.Fragment>
        <div className="grid grid-cols-2 p-5">
            <div>Username: David Peng</div>
            <div>User Type: Recipe Contributor</div>
            <Button
                 className='w-1/4 bg-tl-inactive-white border border-solid rounded border-tl-active-black mt-6 p-0.5 mb-4'
                 onClick={() => {
                    onLogOut();
                 }}
                 text="Log Out"
            />
        </div>
    </React.Fragment>)
}

export default UserProfile;