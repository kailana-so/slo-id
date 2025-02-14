"use client";

import React, { useEffect, useState } from "react";
import TextLink from "@/components/common/TextLink";
import { Routes } from "@/constants/routes";
import { getUser } from "@/services/userService";
import { useAuth } from "@/providers/AuthProvider";
import MenuItem from "@/components/common/MenuItem";
import TakeNote from "@/components/TakeNote";
import ViewNotes from "@/components/ViewNotes";

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

    return (
        <div>
            <h3>Hi {userData?.username ? userData.username : "there"}</h3> 
        </div>
    );
}
