"use client";

import React from "react";
import { AuthProvider } from "@/app/authProvider";
import { LayoutProps } from "@/types/customTypes";
import "./globals.css";
import Header from "@/components/Header";
import MenuItem from "@/components/MenuItem";
import { Routes } from "@/constants/routes";
import UserSession from "@/components/Header";

// Main Layout component
const Layout = ({ children }: LayoutProps) => {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <header>
                        <h1>Slo-Id</h1>
                        <nav className="space-x-5">
                            <MenuItem route={Routes.HOME} item="Map" />
                            <MenuItem route={Routes.PROFILE} item="Profile" />
                            <UserSession></UserSession>
                        </nav>
                    </header>
                    <main>{children}</main>
                </AuthProvider>
            </body>
        </html>
    );
};

export default Layout;
