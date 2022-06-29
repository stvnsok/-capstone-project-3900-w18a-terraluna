interface EmptyApiResponse {
    data: {}
}

interface ResetEmailApiResponse extends EmptyApiResponse {}

interface LogoutApiResponse extends EmptyApiResponse {}

interface ResetPasswordApiResponse extends EmptyApiResponse {}

interface LoginApiResponse {
    data: {
        access_token: string;
        refresh_token: string;
        username: string;
    }
}

interface RegisterApiRepsonse extends LoginApiResponse {}

interface ResetUsernameApiResponse {
    data: {
        username: string;
    }
}