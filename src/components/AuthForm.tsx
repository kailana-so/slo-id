import React from "react";
import ActionButton from "@/components/ActionButton";
import { AuthFormProps } from "@/types/customTypes";


export default function AuthForm({ 
    title, email, setEmail, password, setPassword, handleSubmit, error, loading, isSignUp, name, setName}: AuthFormProps
) {
    return (
        <>
            <h2 className="pb-2">{title}</h2>
            <form onSubmit={handleSubmit} className="columns-1 space-y-2">
                {isSignUp && (
                    <div>
                    <input
                        type="name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName && setName(e.target.value)}
                        required
                    />
                </div>
            )}
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <ActionButton label={title} loading={loading}/>
                </div>
            </form>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </>
    );
};

