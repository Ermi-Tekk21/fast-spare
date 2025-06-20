import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getProformas, Proforma } from "@/lib/utils";

const Dashboard = async () => {
    const proformas = await getProformas();

    const sortedProformas = proformas.sort((a: Proforma, b: Proforma) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA
    })

    let recentProformas = sortedProformas;

    if (proformas && proformas.length >= 6) {
        recentProformas = sortedProformas.slice(0, 6);
    }

    return (
        <div className="flex relative flex-col gap-8 items-center pt-8 pb-14">
            <div className="w-4/5 bg-Sidebar rounded dark:bg-gray-800">
                <p className="font-sans text-3xl dark:text-slate-300 font-light text-center p-8"><span className="font-semibold">Create</span>, <span className="font-semibold">manage</span>, and <span className="font-semibold">generate</span> proforma invoices seamlessly. Stay organized with quick search, PDF generation, and offline access—no complex setup required!</p>
            </div>
            {/* <div className="flex justify-start w-3/4">
                <h3 className="font-semibold text-slate-800 text-2xl text-start dark:text-slate-200">Statistics</h3>
            </div>
            <div className="flex justify-between w-3/4 gap-10 items-center rounded-sm">

                <div className="bg-white rounded-md dark:bg-gray-800">
                    <ProformaPerMonth />
                    <p className="text-slate-600 font-extralight dark:text-slate-200 text-center">proformas generated per <span className="font-semibold">month</span></p>
                </div>
                <div className="flex dark:bg-gray-800 dark:text-slate-200 flex-col shadow-md rounded-md w-60 text-slate-800 bg-white p-6 items-center text-center">
                    <p className="font-extrabold text-3xl flex items-center">220 <Plus /></p>
                    <p className="text-2xl"><span className="font-bold text-2xl">Total</span> Proformas</p>
                </div>
                <div className="flex flex-col shadow-md rounded-md dark:bg-gray-800 dark:text-slate-200 bg-white text-slate-800 w-60 p-6 items-center text-center">
                    <p className="font-extrabold text-3xl flex items-center">320 <Plus /></p>
                    <p className="text-2xl"><span className="font-bold text-2xl">Total</span> Users</p>
                </div>
            </div> */}
            <hr className="w-3/4 text-white" />
            <div className="w-3/4 flex flex-col gap-8 ">
                <div className="relative flex justify-between">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-2xl text-start">Recent Proformas</h3>
                    <Link href="/view-proformas" className="flex text-blue-800 absolute right-0 dark:text-blue-500"><ArrowLeft /><>All proformas</></Link>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {/* card */}
                    {
                        recentProformas.map((proforma: Proforma) => (
                            <div key={proforma.proformaNumber} className="relative dark:bg-gray-800 p-3 pb-10 rounded-md bg-Sidebar">
                                <ul className="flex flex-col gap-2">
                                    <li className="text-slate-800 dark:text-slate-200 dark:bg-gray-900 bg-white px-5 py-1 rounded-md">
                                        <span className="font-semibold">PRF-</span> {proforma.proformaNumber}
                                    </li>
                                    <li className="text-slate-800 dark:text-slate-200 dark:bg-gray-900 bg-white px-5 py-1 rounded-md">
                                        <span className="font-semibold">Customer Name:</span> {proforma.customerName}
                                    </li>
                                    <li className="text-slate-800 dark:text-slate-200 dark:bg-gray-900 bg-white px-5 py-1 rounded-md">
                                        <span className="font-semibold">Plate Number:</span> {proforma.plateNumber}
                                    </li>
                                    <li className="text-slate-800 dark:text-slate-200 dark:bg-gray-900 bg-white px-5 py-1 rounded-md">
                                        <span className="font-semibold">Created at:</span> <span className="text-sm">{proforma.createdAt}</span>
                                    </li>
                                </ul>
                                <div className="w-full flex justify-end ">
                                    <Link href={`/view-proformas/${proforma.proformaNumber.split("-").join("").split("/").join("")}`} className="absolute flex gap-2 dark:bg-gray-700 bg-slate-50 rounded px-3 bottom-1 hover:bg-slate-200 transition-colors duration-300">
                                        more <ArrowRight />
                                    </Link>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default Dashboard;