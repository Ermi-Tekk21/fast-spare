"use client"; // Mark this component as a Client Component

import { useEffect, useRef, useState, use, Suspense } from "react"; // Import `use`
import { getProformas, Proforma } from "@/lib/utils";
import Image from "next/image";
import HeaderImg from "@/public/Header.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import Loading from "@/app/loading";
var converter = require('number-to-words');

const ProformaDetailPage = ({ params }: { params: Promise<{ Proforma_id: string }> }) => {
    const [proformas, setProformas] = useState<Proforma[]>([]);
    const [targetProforma, setTargetProforma] = useState<Proforma | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const pdfRef = useRef<HTMLDivElement>(null);

    // Unwrap the params object using React.use()
    const unwrappedParams = use(params);

    // Extract Proforma_id from the unwrapped params
    const Proforma_id = unwrappedParams.Proforma_id;

    useEffect(() => {
        // Fetch proformas and find the target proforma
        const fetchProformas = async () => {
            try {
                const data = await getProformas();
                setProformas(data);

                const targetID = Proforma_id.split("-").join("");
                const foundProforma = data.find(
                    (proforma: Proforma) =>
                        proforma.proformaNumber.split("-").join("").split("/").join("") === targetID
                );
                setTargetProforma(foundProforma || null);
            } catch (error) {
                console.error("Error fetching proformas:", error);
            } finally {
                setIsLoading(false); // Set loading to false after fetching
            }
        };

        fetchProformas();
    }, [Proforma_id]); // Use Proforma_id directly

    // Function to download the proforma as a PDF
    const downloadPdf = () => {
        if (!pdfRef.current) return;

        html2canvas(pdfRef.current, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`proforma_${targetProforma?.proformaNumber}.pdf`);
        });
    };

    // Show loading state while data is being fetched
    if (!targetProforma && isLoading) {
        return <Loading />;
    }

    // Show error message if proforma is not found
    if (!targetProforma) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-600">Proforma Not Found</h1>
                <p className="text-gray-600">The requested proforma does not exist.</p>
            </div>
        );
    }

    // Calculate subtotal, VAT, and total
    const subtotal = targetProforma.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
    );
    const vat = subtotal * 0.15; // Assuming 15% VAT
    const total = subtotal + vat;

    return (
        <div className="flex flex-col items-center pb-24">
            {/* Download PDF Button */}
            <Button
                onClick={downloadPdf}
                className="fixed top-2 right-32 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
            >
                Download PDF
            </Button>

            {/* Proforma Section (to be converted to PDF) */}
            <div ref={pdfRef} className="w-4/5 flex dark:text-gray-900 rounded-md dark:bg-slate-100 flex-col gap-4 items-center bg-white p-8">
                {/* Header Image */}
                <Image src={HeaderImg} alt="header image" width={800} height={200} />

                {/* Date and Reference */}
                <div className="flex flex-col w-full items-end px-24">
                    <p>
                        <span className="font-semibold">Date:</span> {new Date().toLocaleDateString()}
                    </p>
                    <p>
                        <span className="font-semibold">Ref:</span> {targetProforma.referenceNumber}
                    </p>
                </div>

                {/* Proforma Title */}
                <h1 className="text-3xl font-semibold underline">Proforma</h1>

                {/* Customer and Vehicle Details */}
                <div className="flex px-24 w-full justify-between">
                    <div>
                        <p>
                            <span className="font-semibold">To:</span> {targetProforma.customerName}
                        </p>
                        <p>
                            <span className="font-semibold">VIN:</span> {targetProforma.vin}
                        </p>
                    </div>
                    <div>
                        <p>
                            <span className="font-semibold">Model:</span> {targetProforma.model}
                        </p>
                        <p>
                            <span className="font-semibold">Car Plate No:</span> {targetProforma.plateNumber}
                        </p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="w-full px-24">
                    <table className="min-w-full border-collapse border border-slate-400">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-slate-300 py-2">No</th>
                                <th className="border border-slate-300 py-2">Description</th>
                                <th className="border border-slate-300 py-2">Unit</th>
                                <th className="border border-slate-300 py-2">Quantity</th>
                                <th className="border border-slate-300 py-2">Unit Price <span className="font-normal">(in ETB)</span></th>
                                <th className="border border-slate-300 py-2">Total Price <span className="font-normal">(in ETB)</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {targetProforma.items.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="border border-slate-300 py-2 text-center">{index + 1}</td>
                                    <td className="border border-slate-300 py-2 px-4">{item.itemName}</td>
                                    <td className="border border-slate-300 py-2 text-center">{item.unit}</td>
                                    <td className="border border-slate-300 py-2 text-center">{item.quantity}</td>
                                    <td className="border border-slate-300 py-2 text-center">{item.unitPrice.toFixed(2)}</td>
                                    <td className="border border-slate-300 py-2 text-center">{(item.unitPrice * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Subtotal, VAT, and Total */}
                <div className="w-full px-24 flex flex-col items-end mt-4">
                    <p>
                        <span className="font-semibold">Subtotal:</span> {subtotal.toFixed(2)} ETB
                    </p>
                    <p>
                        <span className="font-semibold">VAT (15%):</span> {vat.toFixed(2)} ETB
                    </p>
                    <p>
                        <span className="font-semibold">Total:</span> {total.toFixed(2)} ETB
                    </p>
                </div>

                {/* Amount in Words, Delivery Time, and Prepared By */}
                <div className="w-full px-24 flex flex-col items-start mt-4">
                    <p>
                        <span className="font-semibold">Amount in words:</span> {converter.toWords(total.toFixed(2))} {/* Add amount in words logic here */}
                    </p>
                    <p>
                        <span className="font-semibold">Delivery Time:</span> {targetProforma.deliveryTime}
                    </p>
                    <p>
                        <span className="font-semibold">Prepared by:</span> {targetProforma.preparedBy}
                    </p>
                </div>

                {/* Terms and Conditions */}
                <div className="w-full px-24 mt-4">
                    <p className="font-semibold">Terms and conditions</p>
                    <p>* 50% MUST BE PAID FOR ORDER</p>
                    <p>* The payment should be made in the name of BINIAM ABEBE KASAYE</p>
                    <p>* The validity of this proforma is for {targetProforma.deliveryTime} only</p>
                </div>
            </div>
        </div>
    );
};

export default ProformaDetailPage;