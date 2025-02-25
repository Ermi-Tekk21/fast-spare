import { CloudMoon, LogOut } from "lucide-react";

const Navbar = () => {
    return (
        <div className="flex">
            <button className="flex rounded-lg h-10 text-start bg-Sidebar text-sideBarBtnColor px-3 font-sans hover:bg-slate-400 py-1 hover:font-extrabold m-2">
             <CloudMoon/>
            </button>
            <button className="flex rounded-lg gap-2 h-10 text-start bg-Sidebar text-sideBarBtnColor px-3 font-sans hover:bg-red-700 hover:text-white py-1 m-2 transition-all duration-300 delay-200">
                Logout <LogOut/>
            </button>
        </div>
    )
}

export default Navbar;