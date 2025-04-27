import React from "react";
import ActionButton from "@/components/common/ActionButton";
import { AuthFormProps } from "@/types/form";


export default function AuthForm({ 
    title, email, setEmail, password, setPassword, handleSubmit, loading, isSignUp, name, setName}: AuthFormProps
) {
    return (
        <div>
            <form onSubmit={handleSubmit} className="columns-1 space-y-4 py-4">
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
        </div>
    );
};

