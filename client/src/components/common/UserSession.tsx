import { useAuth } from "@/providers/AuthProvider";
import { Routes } from "@/enums/routes";
import MenuItem from "@/components/common/MenuItem";
import { logout } from "@/services/userService";
import { useNavigate } from "react-router-dom";

export default function UserSession(){
    const authContext = useAuth(); // Get the auth context
    const user = authContext?.user;
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            console.log("User logged out");
            navigate("/")
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
            ) : (
                // If not logged in, show "Login" and "Sign Up"
                <MenuItem route={Routes.LOGIN} item="Log In" />
            )}
        </>
    );
};
