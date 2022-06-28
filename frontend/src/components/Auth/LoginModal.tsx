import React from "react";
import { useState } from "react";
import GoogleLogin from "react-google-login";
import { HiOutlineSparkles } from "react-icons/hi";
import TextInput from "../global/TextInput";
import { Modal } from "../global/Modal";
import Button from "../global/Button";
import { getEmailErrors, getPasswordErrors, getUsernameErrors } from "./helperFunctions";
import { login, register } from "../../services/auth.service";
import { toast } from "react-toastify";

interface LoginModalProps {
    isOpen: boolean;
    closeFunction: () => void;
    onLogin: () => void;
}

interface SignupErrorList {
    username?: string;
    email?: string;
    password?: string;
}

const LoginModal = ({
    isOpen,
    closeFunction,
    onLogin
}: LoginModalProps) => {
    const [usernameOrEmail, setUsernameOrEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
    const [errorList, setErrorList] = useState<SignupErrorList>()

    const handlePrimaryButtonPress = () => {
        if (isSigningUp) {
            let tmpErrorList: SignupErrorList = {}
            const usernameError = getUsernameErrors(usernameOrEmail)
            if (usernameError) tmpErrorList.username = usernameError
            const emailError = getEmailErrors(email)
            if (emailError) tmpErrorList.email = emailError
            const passwordError = getPasswordErrors(password)
            if (passwordError) tmpErrorList.password = passwordError
            setErrorList(tmpErrorList);
            return
        }
        closeFunction();
        clearInputFields();
        if (isSigningUp) {
            login(usernameOrEmail, password)
                .then(_ => {
                    //TODO (MAYBE)
                    onLogin();
                })
                .catch(err => {
                    toast.error(err); //TODO
                })
        } else {
            register(usernameOrEmail, email, password)
            .then(_ => {
                //TODO (MAYBE)
                onLogin();
            })
            .catch(err => {
                toast.error(err); //TODO
            })
        }
    }

    const handleSecondaryButtonPress = () => {
        setIsSigningUp(!isSigningUp);
        clearInputFields();
    }

    const clearInputFields = () => {
        setPassword('')
        setEmail('')
        setUsernameOrEmail('')
    }

    return  (<React.Fragment>
         <Modal
            isOpen={isOpen}
            closeFunction={() => {
                clearInputFields();
                closeFunction();
            }}
         >
            <div className="min-w-[400px] h-[500px]">
                <div className="w-full h-24 bg-tl-inactive-green flex align-middle justify-center">
                    <span className="text-3xl my-auto">
                        <HiOutlineSparkles className="inline"/> TerraLuna - {isSigningUp ? 'Sign Up' : 'Login'}
                    </span>
                </div>
                
                <div className="grid grid-cols-1 mt-2 px-5">
                    <TextInput
                        value={usernameOrEmail}
                        onValueChange={(value) => {
                            setUsernameOrEmail(value);
                        }}
                        title={isSigningUp ? 'Username' : 'Username or Email'}
                        addClassName={'mb-4'}
                    />
                    {errorList?.username && <div className="text-tl-inactive-red">{errorList.username}</div>}
                    {isSigningUp && <TextInput
                        value={email}
                        onValueChange={(value) => {
                            setEmail(value);
                        }}
                        title={'Email'}
                        addClassName={'mb-[3px]'}
                    />}
                    {isSigningUp && errorList?.email && <div className="text-tl-inactive-red">{errorList.email}</div>}
                    <div className="mt-2"></div>
                    <TextInput
                        value={password}
                        onValueChange={(value) => {
                            setPassword(value);
                        }}
                        title={'Password'}
                        password={true}
                        addClassName={'mb-2'}
                    />
                    {errorList?.password && <div className="text-tl-inactive-red">{errorList.password}</div>}
                    {!isSigningUp && <div className="mx-auto mb-2">
                        <div className="border-b-2 w-36 inline-block border-tl-inactive-grey"></div> OR <div className="border-b-2 w-36 inline-block border-tl-inactive-grey"></div>
                    </div>}

                    {!isSigningUp && <div className="w-full">
                        <GoogleLogin
                            clientId=""
                            buttonText="Login with Google"
                            className="w-full"
                        >
                            {/* TODO */}
                        </GoogleLogin>
                    </div>}

                    <Button
                        className='w-full bg-tl-inactive-green border border-solid rounded border-tl-active-green mt-6 p-0.5'
                        onClick={() => {
                            setErrorList(undefined);
                            handlePrimaryButtonPress();
                        }}
                        text={isSigningUp ? "Sign Up" : "Log In"}
                    ></Button>
                    <Button
                        className='w-full bg-tl-active-white border border-solid rounded border-tl-inactive-black mt-4 p-0.5'
                        onClick={() => {
                            handleSecondaryButtonPress();
                        }}
                        text={isSigningUp ? "Back to Login" : "Sign Up"}
                    ></Button>
                </div>
            </div>
         </Modal>
    </React.Fragment>)
}

export default LoginModal