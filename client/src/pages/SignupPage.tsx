import { useEffect, useState } from "react";
import { FormSubmitEvent } from "@/types/form";
import { Routes } from "@/enums/routes";
import AuthForm from "@/components/forms/auth/AuthForm";
import { AuthErrorMessages } from "@/enums/authErrorMessages";
import { useNavigate } from "react-router-dom";
import { signUp } from "@/services/userService";
import MenuItem from "@/components/common/MenuItem";
import { useProfile } from "@/providers/ProfileProvider";

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const [userCreated, setUserCreated] = useState(false);

    const { userData, loading: profileLoading } = useProfile();

    const handleSignUp = async (event: FormSubmitEvent) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            await signUp(email, password, name);
            setUserCreated(true);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "";
            if (message.includes("already registered")) {
                setError(AuthErrorMessages.USER_EXISTS);
            } else if (message.includes("invalid email")) {
                setError(AuthErrorMessages.INVALID_EMAIL);
            } else if (message.includes("Password should be")) {
                setError(AuthErrorMessages.WEAK_PASSWORD);
            } else {
                setError(AuthErrorMessages.UNKNOWN_ERROR);
            }
            console.error("Sign up error:", err);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (userCreated && userData) navigate(Routes.PROFILE);
    }, [userCreated, userData, navigate]);

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
            />
            <div className="flex flex-row gap-2 pt-4">
                <p className="text-sm">Already have an account?</p>
                <MenuItem route={Routes.LOGIN} item="Log In" />
            </div>
            {error && <p className="text-red-500 text-sm pt-4">{error}</p>}
        </>
    );
}
