"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "@/public/Logo.png";
import { Edit, LayoutDashboard, Settings, View } from "lucide-react";
import Link from "next/link";

const Links = {
    "Dashboard": {
        link: "/",
        icon: LayoutDashboard,
    },
    "Create Proforma": {
        link: "/create-proforma",
        icon: Edit,
    },
    "View Proformas": {
        link: "/view-proformas",
        icon: View,
    },
    "Settings": {
        link: "/settings",
        icon: Settings,
    },
};

const Sidebar = () => {
    const pathname = usePathname(); // Get the current route

    return (
        <div className="flex flex-col gap-14 items-center h-screen w-[265px] shadow-sm bg-Sidebar dark:bg-gray-800">
            <Image src={Logo} alt="Logo" className="pt-2" />
            <div className="flex flex-col gap-3">
                <ul className="flex flex-col gap-3">
                    {Object.entries(Links).map(([name, { link, icon: Icon }]) => {
                        const isActive = pathname === link; // Check if current page matches the link

                        return (
                            <li className="flex gap-3" key={name}>
                                <Link
                                    href={link}
                                    className={`flex bg-root gap-2 text-start pl-3 dark:bg-gray-700 dark:text-slate-200 rounded-sm font-sans w-[199px] py-1 transition-all
                                    ${isActive ? "font-extrabold text-black shadow-md dark:bg-gray-950 dark:border-slate-200  dark:font-extrabold bg-slate-200" : "text-sideBarBtnColor"}
                                    hover:font-extrabold`}
                                >
                                    <Icon className="hover:font-bold ml-2" />
                                    {name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
