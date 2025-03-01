import { ArrowRight } from "lucide-react";
import SearchForm from "../../component/searchForm";
import { getProformas, Proforma } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ query?: string }>;
}) {
    const proformas = await getProformas();
    const query = (await searchParams).query;

    // Sort proformas by dateCreated (newest first)
    const sortedProformas = proformas.sort((a: Proforma, b: Proforma) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
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
            <p className="fixed w-1/3 text-center rounded z-30 text-3xl font-semibold bg-Sidebar top-0 pt-4 text-slate-600 pb-1">View proforma invoice data</p>
            <div className="w-3/4 mt-4 flex flex-col gap-8">
                <SearchForm query={query} />
                {query && <h3 className="font-semibold text-slate-800 text-2xl text-start">Searched Proformas: {query}</h3>}
                {!query && <h3 className="font-semibold text-slate-800 text-2xl text-start">All Proformas</h3>}
                {filteredProformas.length === 0 ? (
                    <p className="text-slate-800">No proformas found for "{query}".</p>
                ) : (
                    <ScrollArea className="h-[500px] p-2"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredProformas.map((proforma: Proforma) => (
                            <div key={proforma.proformaNumber} className="relative p-3 pb-10 rounded-md bg-Sidebar">
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
                                        <span className="font-semibold">Created at:</span> <span className="text-sm">{proforma.createdAt}</span>
                                    </li>
                                </ul>
                                <div className="w-full flex justify-end">
                                    <Link href={`/view-proformas/${proforma.proformaNumber.split("-").join("").split("/").join("")}`} className="absolute flex gap-2 bg-slate-50 rounded px-3 bottom-1 hover:bg-slate-200 transition-colors duration-300">
                                        more <ArrowRight />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div></ScrollArea>

                )}
            </div>
        </div>
    );
}
