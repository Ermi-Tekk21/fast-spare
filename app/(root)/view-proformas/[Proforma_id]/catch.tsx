"use client"; // Mark as Client Component

import { useEffect, useRef, useState, use } from "react";
import { getProformas, Proforma } from "@/lib/utils"; // Adjust path
import Image from "next/image";
import HeaderImg from "@/public/Header.png";
import { Button } from "@/components/ui/button"; // Adjust path
import Loading from "@/app/loading"; // Adjust path
var converter = require("number-to-words");

const ProformaDetailPage = ({ params }: { params: Promise<{ Proforma_id: string }> }) => {
    const [proformas, setProformas] = useState<Proforma[]>([]);
    const [targetProforma, setTargetProforma] = useState<Proforma | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pdfRef = useRef<HTMLDivElement>(null);

    const unwrappedParams = use(params);
    const Proforma_id = unwrappedParams.Proforma_id;

    useEffect(() => {
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
                setIsLoading(false);
            }
        };
        fetchProformas();
    }, [Proforma_id]);

    const downloadPdf = async () => {
        if (!pdfRef.current) return;

        const htmlContent = pdfRef.current.outerHTML;
        const modifiedHtml = htmlContent.replace(
            /<img[^>]+srcSet[^>]+>/i,
            `<img src="${HeaderImg.src}" alt="header image" width="800" height="200" />`
        );

        const styledHtml = `
    <html>
      <head>
        <style>
          @media print {
            table { page-break-inside: avoid; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            .header-section, .footer-section { page-break-inside: avoid; }
          }
          .w-4\\/5 { width: 80%; }
          .flex { display: flex; }
          .flex-col { flex-direction: column; }
          .items-center { align-items: center; }
          .gap-4 { gap: 16px; }
          .p-8 { padding: 32px; }
          .px-24 { padding-left: 96px; padding-right: 96px; }
          .w-full { width: 100%; }
          .text-3xl { font-size: 30px; }
          .font-semibold { font-weight: 600; }
          .underline { text-decoration: underline; }
          .justify-between { justify-content: space-between; }
          .mt-4 { margin-top: 16px; }
          .items-end { align-items: flex-end; }
          .items-start { align-items: flex-start; }
          .min-w-full { min-width: 100%; }
          .border-collapse { border-collapse: collapse; }
          .border { border: 1px solid; }
          .border-slate-400 { border-color: #94a3b8; }
          .border-slate-300 { border-color: #cbd5e1; }
          .py-2 { padding-top: 8px; padding-bottom: 8px; }
          .px-4 { padding-left: 16px; padding-right: 16px; }
          .text-center { text-align: center; }
          .bg-gray-200 { background-color: #e5e7eb; }
          .hover\\:bg-gray-50:hover { background-color: #f9fafb; }
          .dark\\:text-gray-900 { color: #1f2937; }
          .dark\\:bg-slate-100 { background-color: #f1f5f9; }
          .rounded-md { border-radius: 6px; }
          .bg-white { background-color: #ffffff; }
        </style>
      </head>
      <body>${modifiedHtml}</body>
    </html>
  `;

        try {
            const response = await fetch("/api/generate-pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ html: styledHtml }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API Route Error:", errorText);
                throw new Error(`PDF generation failed: ${response.status} - ${errorText}`);
            }

            const pdfBlob = await response.blob();
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `proforma_${targetProforma?.proformaNumber}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Check console for details.");
        }
    };

    if (!targetProforma && isLoading) return <Loading />;
    if (!targetProforma) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-600">Proforma Not Found</h1>
                <p className="text-gray-600">The requested proforma does not exist.</p>
            </div>
        );
    }

    const subtotal = targetProforma.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
    );
    const vat = subtotal * 0.15;
    const total = subtotal + vat;

    return (
        <div className="flex flex-col items-center pb-24">
            <Button
                onClick={downloadPdf}
                className="fixed top-2 right-32 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
            >
                Download PDF
            </Button>
            <div
                ref={pdfRef}
                className="w-4/5 flex dark:text-gray-900 rounded-md dark:bg-slate-100 flex-col gap-4 items-center bg-white p-8"
            >
                <div className="header-section">
                    <Image src={HeaderImg} alt="header image" width={800} height={200} />
                    <div className="flex flex-col w-full items-end px-24">
                        <p>
                            <span className="font-semibold">Date:</span>{" "}
                            {new Date().toLocaleDateString()}
                        </p>
                        <p>
                            <span className="font-semibold">Ref:</span>{" "}
                            {targetProforma.referenceNumber}
                        </p>
                    </div>
                    <h1 className="text-3xl font-semibold underline">Proforma</h1>
                    <div className="flex px-24 w-full justify-between">
                        <div>
                            <p>
                                <span className="font-semibold">To:</span>{" "}
                                {targetProforma.customerName}
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
                                <span className="font-semibold">Car Plate No:</span>{" "}
                                {targetProforma.plateNumber}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-full px-24">
                    <table className="min-w-full border-collapse border border-slate-400">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-slate-300 py-2">No</th>
                            <th className="border border-slate-300 py-2">Description</th>
                            <th className="border border-slate-300 py-2">Unit</th>
                            <th className="border border-slate-300 py-2">Quantity</th>
                            <th className="border border-slate-300 py-2">
                                Unit Price <span className="font-normal">(in ETB)</span>
                            </th>
                            <th className="border border-slate-300 py-2">
                                Total Price <span className="font-normal">(in ETB)</span>
                            </th>
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
                                <td className="border border-slate-300 py-2 text-center">
                                    {(item.unitPrice * item.quantity).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="footer-section">
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
                    <div className="w-full px-24 flex flex-col items-start mt-4">
                        <p>
                            <span className="font-semibold">Amount in words:</span>{" "}
                            {converter.toWords(total.toFixed(2))}
                        </p>
                        <p>
                            <span className="font-semibold">Delivery Time:</span>{" "}
                            {targetProforma.deliveryTime}
                        </p>
                        <p>
                            <span className="font-semibold">Prepared by:</span>{" "}
                            {targetProforma.preparedBy}
                        </p>
                    </div>
                    <div className="w-full px-24 mt-4">
                        <p className="font-semibold">Terms and conditions</p>
                        <p>* 50% MUST BE PAID FOR ORDER</p>
                        <p>* The payment should be made in the name of BINIAM ABEBE KASAYE</p>
                        <p>* The validity of this proforma is for {targetProforma.deliveryTime} only</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProformaDetailPage;