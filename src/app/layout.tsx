"use client";

import React from "react";
import { montserrat, bricolage } from './fonts'
import { AuthProvider } from "@/providers/AuthProvider";
import { LayoutProps } from "@/types/layout";
import "./globals.css";
import MenuItem from "@/components/common/MenuItem";
import { Routes } from "@/enums/routes";
import UserSession from "@/components/common/UserSession";
import Link from "next/link";
import { ProfileProvider } from "@/providers/ProfileProvider";
import GrassIcon from '@mui/icons-material/Grass';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()


const Layout = ({ children }: LayoutProps) => {
    return (
        <html lang="en">
            <body className={`${montserrat.variable} ${bricolage.variable}`}>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <ProfileProvider>
                            <header className="flex items-center justify-between mx-2 mt-4  card-alt">
                                <div className="min-w-40">
                                    <Link href="/">
                                        <h1>
                                            Slo
                                            <GrassIcon className="mt-2"/>
                                            Id
                                        </h1>
                                    </Link>
                                </div>
                                <nav>
                                    <MenuItem route={Routes.MAP} item="Map" />
                                    <MenuItem route={Routes.PROFILE} item="Profile" />
                                    <UserSession/> 
                                </nav>
                            </header>
                            <main className="px-2">  
                                {children}
                            </main>
                        </ProfileProvider>
                    </AuthProvider>
                </QueryClientProvider>
            </body>
        </html>
    );
};

export default Layout;
