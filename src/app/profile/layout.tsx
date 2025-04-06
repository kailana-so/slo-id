"use client";

import React from "react";
import { LayoutProps } from "@/types/types";
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
                        {/* <MenuItem route={Routes.MAP} item="Map" /> */}
                        <MenuItem route={Routes.TAKENOTE} item="Note" />
                        <MenuItem route={Routes.NOTES} item="Notes" />
                        <MenuItem route={Routes.ID} item="Identifications" />
                    </nav>
                    <section className="mt-4">  
                        {children}
                    </section>
                </section>
            ): (
                <p>
					Sign up to create a profile
				</p>
            )}
        </>
    );
};

export default Layout;
