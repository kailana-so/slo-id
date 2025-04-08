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

    const renderPage = () => {
        if (userData?.username) {
            return (
                <section>
                    <div className="card">
                        <h3>Hi {userData.username}</h3> 
                        <p>Ref code: <b>{userData.friendly_id}</b></p>
                    </div>
                    <div className="card">
                        <h3>Trends</h3> 
                        <section className="grid grid-cols-3 gap-2 justify-items-stretch">
                            <div className="card"> notes </div>
                            <div className="card"> ids </div>
                            <div className="card"> distance </div>
                        </section>
                    </div>
                </section>
            );
        }
        return (
            <div>
                <p>Create a profile to start noticing.</p>
            </div>
        )
    }

    return (
        <div>
            {renderPage()}
        </div>
    );
}
