import { Outlet } from "react-router-dom";
import MenuItem from "@/components/common/MenuItem";
import { Routes } from "@/enums/routes";
import { useProfile } from "@/providers/ProfileProvider";
import NavItem from "@/components/common/NavItem";

export default function ProfileLayout() {
    const { userData, loading } = useProfile();

    // Show loading state while fetching user data
    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="spinner"></div>
                <span className="ml-2">Loading ...</span>
            </div>
        );
    }

    if (!userData?.username) {
        return (
            <div className="flex flex-row items-center gap-2 p-4">
                <p className="text-sm">Log in to view your Profile.</p>
                <MenuItem route={Routes.LOGIN} item="Log In" />
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col md:flex-row mt-4">
            {/* Nav: top on mobile, side on desktop */}
            <nav className="w-full flex-none md:h-48 md:w-48 mr-4 mb-4 card-alt" >
                <div className="flex flex-row md:flex-col gap-2 justify-between">
                    <div>
                        <NavItem route={Routes.NEARBY} item="Nearby" />
                    </div>
                    <div>
                        <NavItem route={Routes.TAKENOTE} item="Note" />
                    </div>
                    <div>
                        <NavItem route={Routes.NOTES} item="Notes" />
                    </div>
                    <div>
                        <NavItem route={Routes.IDS} item="Ids" />
                    </div>
                    <div>
                        <NavItem route={Routes.USERMAP} item="Map" />
                    </div>
                </div>
            </nav>

            <div className="flex-grow overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}
