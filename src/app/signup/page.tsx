"use client"

import React, { useEffect, useState } from "react";
import { FormSubmitEvent } from "@/types/form";
import { FirebaseError } from "firebase/app";
import { Routes } from "@/enums/routes";
import AuthForm from "@/components/forms/auth/AuthForm";
import { AuthErrorMessages, AuthErrors } from "@/enums/authErrorMessages";
import { useRouter } from "next/navigation";
import { generateFriendlyId } from "@/utils/helpers";
import { addUser, signUp, validateRefCode } from "@/services/userService";
import MenuItem from "@/components/common/MenuItem";
import { useProfile } from '@/providers/ProfileProvider';


export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [name, setName]  = useState("");
    const [refCode, setRefCode] = useState("")
    const router = useRouter()
    const [userCreated, setUserCreated] = useState(false)
 
    const { userData, loading: profileLoading } = useProfile();

    const handleSignUp = async (event: FormSubmitEvent) => {
        event.preventDefault();
        setLoading(true)
        try {

            const hasValidRefCode =  await validateRefCode(refCode)
            
            if (hasValidRefCode) {
                const user = await signUp(email, password, name)
                // user payload
                const userData = {
                    userId: user?.uid,
                    username: name,
                    email: user?.email,
                    friendlyId: generateFriendlyId(name),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                
                //  user service
                const userStatus = await addUser(userData);
                setUserCreated(userStatus)
            } else {
                setError("Referrer code not found")
            }

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

    useEffect(() => {
        if (userCreated && userData) return router.push(Routes.PROFILE);
    }, [
        userCreated, 
        userData, 
        profileLoading, 
        router,
    ])

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
                loading={loading || profileLoading}
                isSignUp={true}
                name={name}
                setName={setName}
                refCode={refCode}
                setRefCode={setRefCode}
            />
            <div className="flex flex-row gap-2 pt-4">
                <p className="text-sm">
                    Already have an account?
                </p>
                <MenuItem route={Routes.LOGIN} item="Log In"/>
            </div>
            {error && <p className="text-red-500 text-sm pt-4">{error}</p>}
        </>
    );
};
