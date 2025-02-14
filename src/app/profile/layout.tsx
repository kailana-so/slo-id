"use client";

import React from "react";
import { LayoutProps } from "@/types/customTypes";
import MenuItem from "@/components/common/MenuItem";
import { Routes } from "@/constants/routes";
import { ProfileProvider } from "@/providers/ProfileProviders";

// Main Layout component
const Layout = ({ children }: LayoutProps) => {
    return (
            <>
                <ProfileProvider>
                        <nav className="space-x-3">
                            <MenuItem route={Routes.MAP} item="My Maps" />
                            <MenuItem route={Routes.NOTES} item="View Notes" />
                            <MenuItem route={Routes.TAKENOTE} item="Take Note" />
                        </nav>
                        <hr></hr>
                    <section className="bg-stone-50 p-4 mt-4">  
                        {children}
                    </section>
                </ProfileProvider>
            </>
    );
};

export default Layout;
