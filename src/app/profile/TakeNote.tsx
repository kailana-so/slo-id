"use client"; // Marking as a Client Component

import React, { useState } from "react";
import { FormSubmitEvent, UserDataProps } from "@/types/customTypes";

import ActionButton from "@/components/ActionButton";

export default function TakeNote({ userData }: UserDataProps) {
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit =() =>{}
    return (
        <>
            <form onSubmit={handleSubmit} className="columns-1 space-y-2">
                <div>
                    <input
                        type="leaf"
                        placeholder="leaf"
                        // value={email}
                        // onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="flower"
                        placeholder="flower"
                        // value={password}
                        // onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="fruit"
                        placeholder="fruit"
                        // value={password}
                        // onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="bark"
                        placeholder="bark"
                        // value={password}
                        // onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <ActionButton label="Mark" loading={loading}/>
                </div>
            </form>
        </>
    );
};
