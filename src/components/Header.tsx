import React from "react";
import { useAuth } from "@/app/authProvider";
import { Routes } from "@/constants/routes";
import MenuItem from "@/components/MenuItem";
import { logout } from "@/services/userService";

export default function UserSession(){
    const authContext = useAuth(); // Get the auth context
    const user = authContext?.user;

    const handleLogout = async () => {
        try {
            await logout();
            console.log("User logged out");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <>
            {user ? (
                // If user is logged in, show "Log Out"
                <button
                    onClick={handleLogout}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    Log Out
                </button>
            ) : (
                // If not logged in, show "Login" and "Sign Up"
                <>
                    <MenuItem route={Routes.LOGIN} item="Login" />
                    <MenuItem route={Routes.SIGNUP} item="Sign Up" />
                </>
            )}
        </>
    );
};
