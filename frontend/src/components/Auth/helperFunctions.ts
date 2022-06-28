export const getPasswordErrors = (password: string): string | null => {
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (!/[a-z]/.test(password)) return 'Password must contain a lower case character'
    if (!/[A-Z]/.test(password)) return 'Password must contain an upper case character'
    if (!/[0-9]/.test(password)) return 'Password must contain a number'
    return null;
}

export const getUsernameErrors = (username: string): string | null => {
    if (username.length < 2) return 'Username must be at least 2 characters'
    if (!/[a-zA-Z0-9_][a-zA-Z0-9_.-]+/.test(username)) return 'Username must only contain letters, digits and \'-\', \'.\', \'_\' '
    return null;
}

export const getEmailErrors = (email: string): string | null => {
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) return 'Email is not in a valid format'
    return null;
}