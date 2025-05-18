import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/adapters/firebase.client"; 
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth"; 
import { LayoutProps } from "@/types/layout";
import Spinner from "@/components/common/Spinner";

interface AuthContextType {
    user: FirebaseUser | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined); // Define context type

export const AuthProvider = ({ children }: LayoutProps) => {
    const [user, setUser] = useState<FirebaseUser | null>(null); // Initialise user state
    const [loading, setLoading] = useState(true); // Initialise loading state

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // Update user state
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

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
