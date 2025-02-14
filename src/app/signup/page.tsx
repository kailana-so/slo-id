"use client"; // Marking as a Client Component

import React, { useState } from "react";
import { FormSubmitEvent } from "@/types/customTypes";
import { FirebaseError } from "firebase/app";
import { Routes } from "@/constants/routes";
import AuthForm from "@/components/forms/auth/AuthForm";
import { AuthErrorMessages, AuthErrors } from "@/constants/authErrorMessages";
import TextLink from "@/components/common/TextLink";
import { useRouter } from "next/navigation";
import { generateFriendlyId } from "@/utils/helpers";
import { addUser, signUp } from "@/services/userService";


export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [name, setName]  = useState("");
    const router = useRouter()


    const handleSignUp = async (event: FormSubmitEvent) => {
        event.preventDefault();
        setLoading(true)
        try {
            const user = await signUp(email, password, name)
            // user payload
            const userData = {
                user_id: user?.uid,
                username: name,
                email: user?.email,
                friendly_id: generateFriendlyId(name),
                created_at: new Date(),
                updated_at: new Date(),
            };
            
            //  user service
            await addUser(userData);
            router.push(Routes.PROFILE);

        } catch (error) {
            let errorMessage = AuthErrorMessages.UNKNOWN_ERROR; 
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case AuthErrors.INVALID_EMAIL:
                        errorMessage = AuthErrorMessages.INVALID_EMAIL;
                        break;
                    case AuthErrors.WEAK_PASSWORD:
                        errorMessage = AuthErrorMessages.WEAK_PASSWORD;
                        break;
                    case AuthErrors.USER_EXISTS:
                        errorMessage = AuthErrorMessages.USER_EXISTS;
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
                title="Sign up"
                handleSubmit={handleSignUp}
                setEmail={setEmail}
                email={email}
                setPassword={setPassword}
                password={password}
                error={error}
                loading={loading}
                isSignUp={true}
                name={name}
                setName={setName}
            />
            <p className="pt-6 text-sm">
                Already have an account?
                <TextLink route={Routes.LOGIN} linkText="Log In"/>
            </p>
        </>
    );
};
