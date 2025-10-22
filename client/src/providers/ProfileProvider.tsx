"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getUser } from "@/services/userService";
import { useAuth } from "@/providers/AuthProvider";
import { ProfileProps } from "@/types/user";
import { retry } from "@/utils/retry"


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
        if (!user) {
          setUserData(null);
          setLoading(false);
          return;
        }
      
        const load = async () => {
          setLoading(true);
          const data = await retry(() => getUser(user.uid));
          setUserData(data);
          setLoading(false);
        };
      
        load();
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