interface RegisterApiRepsonse {
    username: string, 
    email: string,
    password: string 
}

interface LoginApiResponse {
    username_or_email: string,
    password: string
}

interface LogoutApiResponse {
    //TODO
}

interface ResetPasswordApiResponse {
    //TODO
}

interface ResetUsernameApiResponse {
    new_username: string
}

interface ResetEmailApiResponse {
    new_email: string
}