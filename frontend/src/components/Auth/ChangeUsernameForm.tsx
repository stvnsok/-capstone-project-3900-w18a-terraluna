import React, { useState } from "react";
import { toast } from "react-toastify";
import { resetUsername } from "../../services/auth.service";
import Button from "../global/Button";
import TextInput from "../global/TextInput";
import { getUsernameErrors } from "./helperFunctions";

interface ChangeUsernameErrorList {
    username?: string;
}

const ChangeUsernameForm = ({
    onUsernameChange
}: {
    onUsernameChange: (username: string) => void;
}) => {
    const [username, setUsername] = useState<string>('');
    const [errorList, setErrorList] = useState<ChangeUsernameErrorList>()

    const submitForm = () => {
        let hasErrors = false;
        let tmpErrorList: ChangeUsernameErrorList = {}
        const usernameError = getUsernameErrors(username)
        if (usernameError) {
            tmpErrorList.username = usernameError;
            hasErrors = true;
        }
        setErrorList(tmpErrorList);
        if(!hasErrors) {
            resetUsername(username)
                .then((res) => {
                    toast.success('Successfully Changed Username')
                    onUsernameChange(res.data.username);
                })
                .catch(err => {
                    toast.error(err.response.data.description);
                })
        }
    }

    return (<React.Fragment>
        <TextInput
            value={username}
            onValueChange={setUsername}
            title={'New Username'}
        />
        {errorList?.username && <div className="text-tl-inactive-red">{errorList.username}</div>}
        <div className="mt-2">Note: You can only change your username once every 30 days.</div>
        <Button
            className='w-1/4 bg-tl-inactive-green border border-solid rounded border-tl-active-green mt-6 p-0.5 mb-4'
            onClick={() => {
                setErrorList({})
                submitForm();
            }}
            text="Save"
        ></Button>
    </React.Fragment>)
}

export default ChangeUsernameForm