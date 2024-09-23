"use client"; // Marking as a Client Component

import React from 'react';
import Link from 'next/link';
import { LayoutProps } from "@/types/customTypes";
import './globals.css';
import { Routes } from '@/constants/routes';
import MenuItem from '@/components/MenuItem';

export default function Layout({ children }: LayoutProps) {

  return (
    <html lang="en">
      <body> 
        <header>
          <h1>Slo-Id</h1>
          <nav>
            <MenuItem route={Routes.HOME} item="Map"/>
            <MenuItem route={Routes.PROFILE} item="Profile"/>
            <MenuItem route={Routes.LOGIN} item="Login"/>
            <MenuItem route={Routes.SIGNUP} item="Sign Up"/>
          </nav>
        </header>
        <main>{children}</main> 
      </body>
    </html>
  );
}
