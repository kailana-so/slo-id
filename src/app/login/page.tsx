"use client"; // Marking as a Client Component

import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import { FormSubmitEvent } from "@/types/form";
import { FirebaseError } from "firebase/app";
import { Routes } from "@/enums/routes";
import AuthForm from "@/components/forms/auth/AuthForm";
import { AuthErrorMessages, AuthErrors } from "@/enums/authErrorMessages";
import { login } from "@/services/userService";
import MenuItem from "@/components/common/MenuItem";
import { commonHeaders } from "@/lib/commonHeaders";

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
            const user = await login(email, password);
            
            const sessionRes = await fetch("/api/session", {
                method: "POST",
                headers: { "Content-Type": "application/json",
                    ...commonHeaders()
                },
                body: JSON.stringify({ userId: user.uid }),
            });
            
            if (!sessionRes.ok) {
                console.warn("Login succeeded, but session setup failed.");
                setError("Session error. You may be logged out unexpectedly.");
                return;
            }
            
            console.log("Session setup successful, redirecting to profile...");
            // Add a small delay to ensure auth state is updated
            setTimeout(() => {
                router.push(Routes.PROFILE);
            }, 100);
            
            // Fallback redirect after a longer delay in case the first one fails
            setTimeout(() => {
                if (window.location.pathname !== Routes.PROFILE) {
                    console.log("Fallback redirect to profile");
                    router.push(Routes.PROFILE);
                }
            }, 1000);
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
                    case AuthErrors.INVALID_CRED:
                        errorMessage = AuthErrorMessages.INVALID_CRED;
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
            <div className="flex flex-row gap-2 pt-4">
                <p className="text-sm">
                    Don&apos;t have an account?
                </p>
                <MenuItem route={Routes.SIGNUP} item="Sign Up"/>
            </div>
            {error && <p className="text-red-500 text-sm pt-4">{error}</p>}
        </>
    );
};

