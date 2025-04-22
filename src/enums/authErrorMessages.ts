export enum AuthErrorMessages {
    INVALID_EMAIL = "Invalid email address.",
    INVALID_CRED = "Invalid password or email.",
    WEAK_PASSWORD = "Password should be at least 6 characters.",
    USER_NOT_FOUND = "No user found with this email.",
    WRONG_PASSWORD = "Incorrect password.",
    USER_EXISTS = "User already exists. Sign in.",
    UNKNOWN_ERROR = "An unknown error occurred."
}

export enum AuthErrors {
    INVALID_EMAIL = "auth/invalid-email",
    INVALID_CRED = "auth/invalid-credential",
    WEAK_PASSWORD = "auth/weak-password",
    USER_NOT_FOUND = "auth/user-not-found",
    WRONG_PASSWORD = "auth/wrong-password",
    USER_EXISTS = "auth/email-already-in-use",
    UNKNOWN_ERROR = "auth/unknown-error"
}
