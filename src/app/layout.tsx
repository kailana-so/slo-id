"use client";

import React from "react";
import { AuthProvider } from "@/providers/AuthProvider";
import { LayoutProps } from "@/types/customTypes";
import "./globals.css";
import MenuItem from "@/components/common/MenuItem";
import { Routes } from "@/constants/routes";
import UserSession from "@/components/common/Header";
import Link from "next/link";
import { ProfileProvider } from "@/providers/ProfileProvider";
import GrassIcon from '@mui/icons-material/Grass';

// Main Layout component
const Layout = ({ children }: LayoutProps) => {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                <ProfileProvider>
                    <header className="flex items-center justify-between mx-2 mt-4">
                        <div className="min-w-40">
                            <Link href="/">
                                <h1>
                                    Slo
                                    <GrassIcon className="mt-2"></GrassIcon>
                                    Id
                                </h1>
                            </Link>
                        </div>
                        <nav>
                            <MenuItem route={Routes.PROFILE} item="Profile" />
                            <UserSession></UserSession> 
                        </nav>
                    </header>
                    <main className="px-2">  
                        {children}
                    </main>
                </ProfileProvider>
                </AuthProvider>
            </body>
        </html>
    );
};

export default Layout;
