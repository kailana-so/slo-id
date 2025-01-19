"use client"; // Marking as a Client Component

import React, { useEffect, useState } from "react";
import TextLink from "@/components/TextLink";
import { Routes } from "@/constants/routes";
import { getUser } from "@/services/userService";
import MenuItem from "@/components/MenuItem";
import TakeNote from "./TakeNote";
import UserMap from "./UserMap";
import { useAuth } from "../authProvider";

export default function Layout() {
    const [userData, setUserData] = useState<any>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    
    const authContext = useAuth(); // Get the auth context
    const user = authContext?.user;

    const userDetails = async (userId: string) => {
        const data = await getUser(userId);
        setUserData(data);
    };

    useEffect(() => {
        if (user) {
            userDetails(user.uid);
        }
    }, [user]);

    const handleMenuClick = (menu: string) => {
        setActiveMenu(menu);
    };

    return (
        <div>
            <h3>Hi {userData?.username ? userData.username : "there"}</h3> 
            {userData && userData?.username ? (
                <div className="columns-1 space-y-2">
                    <nav>
                        <MenuItem route={Routes.IDS} item="Ids"/>
                        <MenuItem route={Routes.NOTES} item="Notes"/>
                    </nav>   
                    <div>                 
                        <button className={activeMenu === "TakeNote" ? "menuItem": ""} onClick={() => handleMenuClick("TakeNote")}>Take Note</button>
                        <button className={activeMenu === "FindGenus" ? "menuItem": ""} onClick={() => handleMenuClick("FindGenus")}>Find Genus</button>
                        <button className={activeMenu === "FindGenus" ? "menuItem": ""} onClick={() => handleMenuClick("Map")}>Map</button>
                    </div>
                    <div className="border-2 border-blue-300 shadow-md space-y-4 p-4">
                    {(activeMenu === null || activeMenu === "Map") && <UserMap userData={userData}/>}
                    {activeMenu === "TakeNote" && <TakeNote userData={userData}/>}
                    </div>
                </div>
            ) : (
                <div className="columns-1 space-y-2">
                    <p> 
                        Profile and maps are private, helping you track your identifications. 
                    </p>
                    <p className="pt-6 text-sm">
                        Enable maps?
                        <TextLink route={Routes.SIGNUP} linkText="Sign Up"/>
                    </p>
                </div>
            )}
        </div>
    );
}
