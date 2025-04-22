"use client";

import React from "react";
import { LayoutProps } from "@/types/layout";
import MenuItem from "@/components/common/MenuItem";
import { Routes } from "@/enums/routes";
import { useProfile } from "@/providers/ProfileProvider";
import NavItem from "@/components/common/NavItem";
import { usePathname } from "next/navigation";

const Layout = ({ children }: LayoutProps) => {
    const { userData } = useProfile();
    const pathname = usePathname();

    if (!userData?.username) {
        return (
            <div className="flex flex-row items-center gap-2 p-4">
                <p className="text-sm">Log in to view your Profile.</p>
                <MenuItem route={Routes.LOGIN} item="Log In" />
            </div>
        );
    }

    const isNoteDraft = /^\/profile\/notes\/[^/]+$/.test(pathname);

    return (
        <div className="flex h-screen flex-col md:flex-row mt-4">
            {/* Nav: top on mobile, side on desktop */}
            <nav className="w-full flex-none md:h-48 md:w-48 mr-4 mb-4 card-alt" >
                <div className="flex flex-row md:flex-col gap-2 justify-between">
                    <div>
                        <NavItem route={Routes.TAKENOTE} item="Note" />
                    </div>
                    <div>
                        <NavItem route={Routes.NOTES} item="Notes" />
                    </div>
                    <div>
                        <NavItem route={Routes.IDS} item="Identifications" />
                    </div>
                    <div>
                        <NavItem route={Routes.USERMAP} item="Map" />
                    </div>
                </div>
            </nav>

            <div className="flex-grow overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

export default Layout;
