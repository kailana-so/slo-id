import React from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Routes } from "@/constants/routes";
import MenuItem from "@/components/common/MenuItem";
import { logout } from "@/services/userService";
import { useRouter } from "next/navigation";

export default function UserSession(){
    const authContext = useAuth(); // Get the auth context
    const user = authContext?.user;
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            console.log("User logged out");
            router.push("/")
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <>
            {user ? (
                // If user is logged in, show "Log Out"
                <MenuItem
                    handler={handleLogout}
                    item="Log Out"
                >

                </MenuItem>
                // <MenuItem route={Routes.LOGOUT} item="Log out" />
            ) : (
                // If not logged in, show "Login" and "Sign Up"
                <>
                    <MenuItem route={Routes.LOGIN} item="Login" />
                </>
            )}
        </>
    );
};
