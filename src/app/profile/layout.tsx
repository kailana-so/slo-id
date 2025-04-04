"use client";

import React from "react";
import { LayoutProps } from "@/types/customTypes";
import MenuItem from "@/components/common/MenuItem";
import { Routes } from "@/constants/routes";
import { useProfile } from "@/providers/ProfileProvider";

const Layout = ({ children }: LayoutProps) => {
    const { userData } = useProfile();
    return (
        <>
            {userData?.username ? (
                <section>
                    <nav className="nav-layout">
                    <MenuItem route={Routes.MAP} item="Maps" />
                    <MenuItem route={Routes.NOTES} item="All Notes" />
                    <MenuItem route={Routes.TAKENOTE} item="Take Note" />
                    </nav>
                    <section className="mt-4">  
                        {children}
                    </section>
                </section>
            ): "Sign up to create a profile"}
        </>
    );
};

export default Layout;
