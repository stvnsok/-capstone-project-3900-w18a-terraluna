import React, { useState } from "react";
import { toast } from "react-toastify";
import { resetPassword } from "../../services/auth.service";
import Button from "../global/Button";
import TextInput from "../global/TextInput";
import { getPasswordErrors } from "./helperFunctions";

interface ChangePasswordErrorList {
    password?: string;
    newPassword?: string;
    confirmNewPassword?: string;
}

const ChangePasswordForm = () => {
    const [password, setPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const [errorList, setErrorList] = useState<ChangePasswordErrorList>()

    const submitForm = () => {
        let hasErrors = false;
        let tmpErrorList: ChangePasswordErrorList = {}
        const newPasswordError = getPasswordErrors(newPassword)
        if (newPasswordError) {
            tmpErrorList.newPassword = newPasswordError;
            hasErrors = true;
        }
        const confirmNewPasswordError = getPasswordErrors(confirmNewPassword)
        if (confirmNewPasswordError) {
            tmpErrorList.confirmNewPassword = confirmNewPasswordError;
            hasErrors = true;
        }
        if (confirmNewPassword !== newPassword) {
            tmpErrorList.confirmNewPassword = 'Password and Confirm Password do not match'
            hasErrors = true;
        }
        setErrorList(tmpErrorList);
        if(!hasErrors) {
            resetPassword(password, newPassword)
                .then(() => {
                    toast.success('Successfully Changed Password')
                })
                .catch(err => {
                    toast.error(err.response.data.description);
                })
        }
    }

    return (<React.Fragment>
        <TextInput
            value={password}
            onValueChange={setPassword}
            title={'Password'}
            password={true}
        />
        {errorList?.password && <div className="text-tl-inactive-red">{errorList.password}</div>}
        <div className="mt-4"></div>
        <TextInput
            value={newPassword}
            onValueChange={setNewPassword}
            title={'New Password'}
            password={true}
        />
        {errorList?.newPassword && <div className="text-tl-inactive-red">{errorList.newPassword}</div>}
        <div className="mt-4"></div>
        <TextInput
            value={confirmNewPassword}
            onValueChange={setConfirmNewPassword}
            title={'Confirm New Password'}
            password={true}
        />
        {errorList?.confirmNewPassword && <div className="text-tl-inactive-red">{errorList.confirmNewPassword}</div>}
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

export default ChangePasswordForm