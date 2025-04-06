"use client";

import React, { useEffect, useState } from "react";
import { getUser } from "@/services/userService";
import { useAuth } from "@/providers/AuthProvider";

export default function Page({ children }: { children: React.ReactNode }) {
    const [userData, setUserData] = useState<any>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    
    const authContext = useAuth();
    const user = authContext?.user;

    useEffect(() => {
        if (user) {
            getUser(user.uid).then(setUserData);
        }
    }, [user]);

    const handleMenuClick = (menu: string) => {
        setActiveMenu(menu);
    };

    console.log(userData, "userData - layout");

    const renderPage = () => {
        if (userData?.username) {
            return (
                <div>
                    <h3>Hi {userData.username}</h3> 
                    <p>Your referrer code is: <b>{userData.friendly_id}</b></p>
                </div>
            );
        }
        return (
            <div>
                <p>Create a profile to start noticing.</p>
            </div>
        )
    }

    return (
        <div className="card">
            {renderPage()}
        </div>
    );
}
