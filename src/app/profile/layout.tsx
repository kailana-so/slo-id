"use client";

import React from "react";
import { LayoutProps } from "@/types/types";
import MenuItem from "@/components/common/MenuItem";
import { Routes } from "@/constants/routes";
import { useProfile } from "@/providers/ProfileProvider";
import Link from "next/link";
import NavItem from "@/components/common/NavItem";

const Layout = ({ children }: LayoutProps) => {
    const { userData } = useProfile();
    return (
        <>
            {userData?.username ? (
                <section>
                    <nav className="nav-layout">  
                        <NavItem route={Routes.TAKENOTE} item="Note" />
                        <NavItem route={Routes.NOTES} item="Notes" />
                        <NavItem route={Routes.IDS} item="Identifications" />
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
