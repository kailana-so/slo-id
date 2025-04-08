"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getUser } from "@/services/userService";
import { useAuth } from "@/providers/AuthProvider";
import { ProfileProps } from "@/types/types";


type ProfileContextType = {
    userData: ProfileProps |  null;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
    const [userData, setUserData] = useState<ProfileProps | null>(null);

    const authContext = useAuth();
    const user = authContext?.user;

    useEffect(() => {
        if (user) {
            getUser(user.uid).then(setUserData);
        }
    }, [user]);

    return (
        <ProfileContext.Provider value={{ userData }}>
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