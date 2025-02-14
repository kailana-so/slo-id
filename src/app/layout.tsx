"use client";

import React from "react";
import { AuthProvider } from "@/providers/AuthProvider";
import { LayoutProps } from "@/types/customTypes";
import "./globals.css";
import MenuItem from "@/components/common/MenuItem";
import { Routes } from "@/constants/routes";
import UserSession from "@/components/common/Header";
import Link from "next/link";

// Main Layout component
const Layout = ({ children }: LayoutProps) => {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <header className="flex items-center justify-between px-4 py-2">
                        <Link href="/">
                            <h1>
                                Slo-Id
                            </h1>
                        </Link>
                        <nav>
                            <MenuItem route={Routes.PROFILE} item="Profile" />
                            <UserSession></UserSession>
                            <hr></hr>
                        </nav>
                    </header>
                    <main className="pt-4 ml-4">  
                        {children}
                    </main>
                </AuthProvider>
            </body>
        </html>
    );
};

export default Layout;
