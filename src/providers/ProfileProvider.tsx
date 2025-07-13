"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getUser } from "@/services/userService";
import { useAuth } from "@/providers/AuthProvider";
import { ProfileProps } from "@/types/user";


type ProfileContextType = {
    userData: ProfileProps | null;
    loading: boolean;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
    const [userData, setUserData] = useState<ProfileProps | null>(null);
    const [loading, setLoading] = useState(false);

    const authContext = useAuth();
    const user = authContext?.user;

    useEffect(() => {
        if (user) {
            console.log("ProfileProvider: User authenticated, fetching user data for:", user.uid);
            setLoading(true);
            getUser(user.uid)
                .then((data) => {
                    console.log("ProfileProvider: User data fetched:", data);
                    setUserData(data);
                })
                .catch((error) => {
                    console.error("ProfileProvider: Error fetching user data:", error);
                    setUserData(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            console.log("ProfileProvider: No user, clearing user data");
            setUserData(null);
            setLoading(false);
        }
    }, [user]);

    return (
        <ProfileContext.Provider value={{ userData, loading }}>
            {children}
        </ProfileContext.Provider>
    );
}

// Hook to use the context
export function useProfile() {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }
    return context;
}