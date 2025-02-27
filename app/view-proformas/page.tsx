import { ArrowRight } from "lucide-react";
import SearchForm from "../component/searchForm";
import { getProformas, Proforma } from "@/lib/utils";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ query?: string }>;
}) {
    const proformas = await getProformas();
    const query = (await searchParams).query;

    // Sort proformas by dateCreated (newest first)
    const sortedProformas = proformas.sort((a: Proforma, b: Proforma) => {
        const dateA = new Date(a.dateCreated).getTime();
        const dateB = new Date(b.dateCreated).getTime();
        return dateB - dateA; // Descending order
    });

    // Filter proformas based on query
    let filteredProformas = sortedProformas;
    if (query) {
        filteredProformas = proformas.filter((proforma: Proforma) => {
            return (
                proforma.customerName.toLowerCase().includes(query.toLowerCase()) ||
                proforma.plateNumber.toLowerCase().includes(query.toLowerCase())
            )
        })
    }

    return (
        <div className="flex justify-center">
            <div className="w-3/4 flex flex-col gap-8">
                <SearchForm query={query} />
                {query && <h3 className="font-semibold text-slate-800 text-2xl text-start">Searched Proformas: {query}</h3>}
                {!query && <h3 className="font-semibold text-slate-800 text-2xl text-start">All Proformas</h3>}
                {filteredProformas.length === 0 ? (
                    <p className="text-slate-800">No proformas found for "{query}".</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredProformas.map((proforma: Proforma) => (
                            <div
                                key={proforma.proformaNumber}
                                className="relative p-5 pb-10 rounded-md bg-Sidebar hover:shadow-lg transition-shadow duration-300"
                            >
                                <ul className="flex flex-col gap-2">
                                    <li className="text-slate-800 bg-white px-5 py-1 rounded-md">
                                        <span className="font-semibold">PRF-</span> {proforma.proformaNumber}
                                    </li>
                                    <li className="text-slate-800 bg-white px-5 py-1 rounded-md">
                                        <span className="font-semibold">Customer Name:</span> {proforma.customerName}
                                    </li>
                                    <li className="text-slate-800 bg-white px-5 py-1 rounded-md">
                                        <span className="font-semibold">Plate Number:</span> {proforma.plateNumber}
                                    </li>
                                    <li className="text-slate-800 bg-white px-5 py-1 rounded-md">
                                        <span className="font-semibold">Created at:</span> {proforma.dateCreated}
                                    </li>
                                </ul>
                                <div className="w-full flex justify-end">
                                    <button className="absolute flex gap-2 bg-slate-50 rounded px-3 bottom-1 hover:bg-slate-200 transition-colors duration-300">
                                        more <ArrowRight />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
