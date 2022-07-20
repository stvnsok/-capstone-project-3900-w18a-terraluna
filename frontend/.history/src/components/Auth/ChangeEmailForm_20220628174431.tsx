import React, { useState } from "react";
import { toast } from "react-toastify";
import { resetEmail } from "../../services/auth.service";
import Button from "../global/Button";
import TextInput from "../global/TextInput";
import { getEmailErrors } from "./helperFunctions";

interface ChangeEmailErrorList {
    email?: string;
}

const ChangeEmailForm = () => {
    const [email, setEmail] = useState<string>('');
    const [errorList, setErrorList] = useState<ChangeEmailErrorList>()

    const submitForm = () => {
        let tmpErrorList: ChangeEmailErrorList = {}
        const emailError = getEmailErrors(email)
        if (emailError) tmpErrorList.email = emailError;
        setErrorList(tmpErrorList);
        //TODO API CALL
        if(tmpErrorList === {}) {
            resetEmail(email)
                .then(() => {
                    toast.success('Successfully Changed Email')
                })
                .catch(err => {
                    toast.error(toast.error(`Email could not be changed, error: ${err} `));//TODO MAY NEED EDITING
                })
        }
    }

    return (<React.Fragment>
        <TextInput
            value={email}
            onValueChange={setEmail}
            title={'New Email'}
        />
        {errorList?.email && <div className="text-tl-inactive-red">{errorList.email}</div>}
        <div className="mt-2">Note: You can only change your email once every 30 days.</div>
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

export default ChangeEmailForm