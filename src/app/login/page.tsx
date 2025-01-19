"use client"; // Marking as a Client Component

import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import { FormSubmitEvent } from "@/types/customTypes";
import { FirebaseError } from "firebase/app";
import { Routes } from "@/constants/routes";
import AuthForm from "@/components/forms/AuthForm";
import { AuthErrorMessages, AuthErrors } from "@/constants/authErrorMessages";
import TextLink from "@/components/TextLink";
import { login } from "@/services/userService";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter()


    const handleLogin = async (event: FormSubmitEvent) => {
        event.preventDefault();
        setLoading(true)
        try {
            await login(email, password);
            router.push(Routes.PROFILE);
        } catch (error) {
            let errorMessage = AuthErrorMessages.UNKNOWN_ERROR; 

            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case AuthErrors.INVALID_EMAIL:
                        errorMessage = AuthErrorMessages.INVALID_EMAIL;
                        break;
                    case AuthErrors.USER_NOT_FOUND:
                        errorMessage = AuthErrorMessages.USER_NOT_FOUND;
                        break;
                    case AuthErrors.WRONG_PASSWORD:
                        errorMessage = AuthErrorMessages.WRONG_PASSWORD;
                        break;
                    default:
                        errorMessage = AuthErrorMessages.UNKNOWN_ERROR;
                }
            }
            setError(errorMessage)
            console.error("Error logging in:", error);
        }
        setLoading(false)
    };

    return (
        <>
            <AuthForm
                title="Log In"
                handleSubmit={handleLogin}
                setEmail={setEmail}
                email={email}
                setPassword={setPassword}
                password={password}
                error={error}
                loading={loading}
            />
            <p className="pt-6 text-sm">
                Don't have an account?
                <TextLink route={Routes.SIGNUP} linkText="Sign Up"/>
            </p>
        </>
    );
};

