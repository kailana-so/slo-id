import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormSubmitEvent } from "@/types/form";
import { Routes } from "@/enums/routes";
import AuthForm from "@/components/forms/auth/AuthForm";
import { AuthErrorMessages } from "@/enums/authErrorMessages";
import { login } from "@/services/userService";
import MenuItem from "@/components/common/MenuItem";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (event: FormSubmitEvent) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            await login(email, password);
            navigate(Routes.PROFILE);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "";
            if (message.includes("Invalid login credentials")) {
                setError(AuthErrorMessages.INVALID_CRED);
            } else if (message.includes("invalid email")) {
                setError(AuthErrorMessages.INVALID_EMAIL);
            } else {
                setError(AuthErrorMessages.UNKNOWN_ERROR);
            }
            console.error("Login error:", err);
        }

        setLoading(false);
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
                <p className="text-sm">Don&apos;t have an account?</p>
                <MenuItem route={Routes.SIGNUP} item="Sign Up" />
            </div>
            {error && <p className="text-red-500 text-sm pt-4">{error}</p>}
        </>
    );
}
