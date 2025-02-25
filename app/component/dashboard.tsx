import { Plus } from "lucide-react";
import ProformaPerMonth from "./ProformaPerMonth";

const Dashboard = () => {
    return (
        <div className="flex flex-col gap-6 justify-center items-center">
            <div className="w-3/4 bg-Sidebar rounded ">
                <p className="font-sans text-3xl font-light text-center p-4"><span className="font-semibold">Create</span>, <span className="font-semibold">manage</span>, and <span className="font-semibold">generate</span> proforma invoices seamlessly. Stay organized with quick search, PDF generation, and offline access—no complex setup required!</p>
            </div>
            <div className="flex justify-center gap-10 items-center rounded-sm">
                <div>
                    <ProformaPerMonth />
                    <p className="text-slate-600 font-extralight text-center">proformas generated per <span className="font-semibold">month</span></p>
                </div>

                <div className="flex flex-col shadow-md rounded-md w-60 text-slate-800 bg-white p-6 items-center text-center">
                    <p className="font-extrabold text-3xl flex items-center">220 <Plus /></p>
                    <p className="text-2xl"><span className="font-bold text-2xl">Total</span> Proformas</p>
                </div>
                <div className="flex flex-col shadow-md rounded-md bg-white text-slate-800 w-60 p-6 items-center text-center">
                    <p className="font-extrabold text-3xl flex items-center">320 <Plus /></p>
                    <p className="text-2xl"><span className="font-bold text-2xl">Total</span> Users</p>
                </div>
            </div>
            <hr className="w-3/4 h-1"/>
            ermias
        </div>
    );
}

export default Dashboard;