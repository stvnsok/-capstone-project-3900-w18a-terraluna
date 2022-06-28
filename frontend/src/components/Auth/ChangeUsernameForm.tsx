import React, { useState } from "react";
import Button from "../global/Button";
import TextInput from "../global/TextInput";
import { getUsernameErrors } from "./helperFunctions";

interface ChangeUsernameErrorList {
    username?: string;
}

const ChangeUsernameForm = () => {
    const [username, setUsername] = useState<string>('');
    const [errorList, setErrorList] = useState<ChangeUsernameErrorList>()

    const submitForm = () => {
        let tmpErrorList: ChangeUsernameErrorList = {}
        const usernameError = getUsernameErrors(username)
        if (usernameError) tmpErrorList.username = usernameError;
        setErrorList(tmpErrorList);
        //TODO API CALL
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