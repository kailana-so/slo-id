// app/authProvider.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/firebase/firebaseConfig"; // Import Firebase Auth
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth"; // Import Firebase User type
import { User } from "@/types/customTypes"; // Import your User type
import { LayoutProps } from "@/types/customTypes";
import Spinner from "@/components/Spinner"; // Import your Spinner component

interface AuthContextType {
    user: FirebaseUser | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined); // Define context type

export const AuthProvider = ({ children }: LayoutProps) => {
    const [user, setUser] = useState<FirebaseUser | null>(null); // Initialize user state
    const [loading, setLoading] = useState(true); // Initialize loading state

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // Update user state
            setLoading(false);
        });
        return () => unsubscribe();
    }, [auth]);

    if (loading) {
        return <Spinner/>; 
    }

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        console.log("useAuth must be used within an AuthProvider");
    }
    return context;
};