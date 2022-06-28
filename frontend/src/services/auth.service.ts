import { api } from "../api"

export const login = (
    username_or_email: string,
    password: string
): Promise<LoginApiResponse> => {
    return (api.post('TODO/login', {
        username_or_email, password
    }))
}

export const register = (
    username: string, 
    email: string,
    password: string 
): Promise<RegisterApiRepsonse> => {
    return (api.post('auth/register', {
        username, password, email
    }))
}

export const logout = (
): Promise<LogoutApiResponse> => {
    return (api.delete('TODO/logout'))
}

export const resetUsername = (
        new_username: string
    ): Promise<ResetUsernameApiResponse> => {
    return (api.put('TODO/reset/username', {
        new_username
    }))
}

export const resetEmail = (
    new_email: string
): Promise<ResetEmailApiResponse> => {
return (api.put('TODO/reset/email', {
    new_email
}))
}

export const resetPassword = (
    old_password: string,
    new_password: string
): Promise<ResetPasswordApiResponse> => {
    return (api.put('TODO/reset/password', {
        new_password, old_password
    }))
}