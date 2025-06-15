// app/components/Navbar.tsx
"use client";

import { LogOut } from "lucide-react";
import { logoutUser } from "../auth/actions/logout";
import { ModeToggle } from "@/components/ModeToggle";

const Navbar = () => {
    const handleLogout = async () => {
        try {
            // Call the Server Action to log out
            await logoutUser();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="flex justify-end align-middle m-2">
            <ModeToggle />
            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="rounded-lg gap-2 h-8 dark:bg-gray-900 text-start bg-Sidebar text-sideBarBtnColor px-1 font-sans hover:bg-red-700 hover:text-white m-1 transition-all duration-300 delay-200"
            >
                <LogOut className="dark:text-slate-200"/>
            </button>
        </div>
    );
};

export default Navbar;