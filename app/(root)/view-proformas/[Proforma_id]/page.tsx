"use client"; // Mark this component as a Client Component

import { useEffect, useRef, useState } from "react";
import { getProformas, Proforma } from "@/lib/utils";
import Image from "next/image";
import HeaderImg from "@/public/Header.png"; // Ensure this image is in the public folder or correctly imported
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Import autoTable plugin
import { Button } from "@/components/ui/button";
import Loading from "@/app/loading";
var converter = require("number-to-words");

const ProformaDetailPage = ({ params }: { params: Promise<{ Proforma_id: string }> }) => {
    const [proformas, setProformas] = useState<Proforma[]>([]);
    const [targetProforma, setTargetProforma] = useState<Proforma | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pdfRef = useRef<HTMLDivElement>(null);

    // Fetch proforma data when the component mounts
    useEffect(() => {
        const fetchProformas = async () => {
            try {
                const data = await getProformas();
                setProformas(data);

                // Resolve the params promise to get the Proforma_id
                const resolvedParams = await params;
                const Proforma_id = resolvedParams.Proforma_id;
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
    }, [params]);

    // Function to generate and download the PDF
    const downloadPdf = () => {
        if (!targetProforma) return;

        const doc = new jsPDF("p", "mm", "a4");
        const margin = 10; // Margin in mm
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Set default text color to black
        doc.setTextColor(0, 0, 0);

        // Add header image
        doc.addImage(HeaderImg.src, "PNG", margin, margin, pageWidth - 2 * margin, 50);

        // Add date and reference
        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin - 50, margin + 60); // First line
        doc.text(`Ref: ${targetProforma.referenceNumber}`, pageWidth - margin - 50, margin + 65); // Second line (0.5 cm spacing)

        // Add proforma title (centered, bold, sans-serif, and underlined)
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold"); // Set font to bold sans-serif
        const proformaText = "PROFORMA";
        const textWidth = doc.getTextWidth(proformaText); // Get the width of the text
        const centerX = (pageWidth - textWidth) / 2; // Calculate the X position to center the text
        const textY = margin + 75; // Y position for the text
        doc.text(proformaText, centerX, textY); // Add the text

        // Draw an underline under the text
        const underlineY = textY + 2; // Adjust the Y position for the underline
        doc.line(centerX, underlineY, centerX + textWidth, underlineY); // Draw the underline

        // Add customer and vehicle details
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal"); // Reset font to normal
        doc.text(`To: ${targetProforma.customerName}`, margin, textY + 10); // First line (left side)
        doc.text(`VIN: ${targetProforma.vin}`, margin, textY + 15); // Second line (left side, 0.5 cm spacing)
        doc.text(`Model: ${targetProforma.model}`, pageWidth - margin - 50, textY + 10); // First line (right side)
        doc.text(`Car Plate No: ${targetProforma.plateNumber}`, pageWidth - margin - 50, textY + 15); // Second line (right side, 0.5 cm spacing)

        // Prepare table data for items
        const tableData = targetProforma.items.map((item, index) => [
            index + 1,
            item.itemName,
            item.unit,
            item.quantity,
            item.unitPrice.toFixed(2),
            (item.unitPrice * item.quantity).toFixed(2),
        ]);

        // Add table using autoTable
        autoTable(doc, {
            startY: margin + 100, // Start after header content
            head: [
                [
                    "No",
                    "Description",
                    "Unit",
                    "Quantity",
                    "Unit Price (in ETB)",
                    "Total Price (in ETB)",
                ],
            ],
            body: tableData,
            theme: "grid",
            headStyles: {
                fillColor: [200, 200, 200], // Light gray header background
                textColor: [0, 0, 0], // Black text
                fontStyle: "bold", // Bold header text
                fontSize: 11, // Font size for header
                lineColor: [148, 163, 184], // Border color (equivalent to border-slate-400)
            },
            bodyStyles: {
                textColor: [0, 0, 0], // Black text for body
                lineColor: [148, 163, 184], // Border color (equivalent to border-slate-400)
                lineWidth: 0.1, // Border thickness
                fontSize: 11, // Font size for body
            },
            styles: {
                fontSize: 11, // Font size for table content
                cellPadding: 3, // Padding inside cells
                valign: "middle", // Vertical alignment
                overflow: "linebreak", // Handle text overflow
            },
            margin: { top: 20, bottom: 20, left: margin, right: margin }, // Padding for layout
            pageBreak: "auto", // Automatic clean page breaks
        });

        // Get the final Y position after the table
        let finalY = (doc as any).lastAutoTable.finalY || margin + 100;

        // Ensure there's enough space for the content below the table
        const contentHeight = 70; // Approximate height of the content below the table
        if (finalY + contentHeight > pageHeight - margin) {
            doc.addPage(); // Add a new page if content exceeds the page height
            finalY = margin; // Reset finalY to the top of the new page
        }

        // 1st Element: Financial Summary (Right Side)
        doc.setFontSize(12);
        const financialSummaryY = finalY + 15; // Y position for financial summary
        doc.text(`Subtotal: ${subtotal.toFixed(2)} ETB`, pageWidth - margin - 50, financialSummaryY);
        doc.text(`VAT (15%): ${vat.toFixed(2)} ETB`, pageWidth - margin - 50, financialSummaryY + 5);
        doc.text(`Total: ${total.toFixed(2)} ETB`, pageWidth - margin - 50, financialSummaryY + 10);

        // 2nd Element: Footer Content (Left Side, after financial summary)
        const footerContentY = financialSummaryY + 20; // Y position for footer content (after financial summary)
        doc.text(`Amount in words: ${converter.toWords(total.toFixed(2))}`, margin, footerContentY);
        doc.text(`Delivery Time: ${targetProforma.deliveryTime}`, margin, footerContentY + 5);
        doc.text(`Prepared by: ${targetProforma.preparedBy}`, margin, footerContentY + 10);

        // 3rd Element: Terms and Conditions (Centered, after footer content)
        const termsY = footerContentY + 20; // Y position for terms and conditions (after footer content)
        doc.setFontSize(12);
        const termsText = "Terms and conditions";
        const termsWidth = doc.getTextWidth(termsText); // Get the width of the terms text
        const termsX = (pageWidth - termsWidth) / 4; // Calculate the X position to center the terms text
        doc.text(termsText, termsX, termsY); // Centered terms and conditions title
        doc.text("* 50% MUST BE PAID FOR ORDER", termsX, termsY + 5); // Centered terms
        doc.text("* The payment should be made in the name of BINIAM ABEBE KASAYE", termsX, termsY + 10); // Centered terms
        doc.text(`* The validity of this proforma is for ${targetProforma.deliveryTime} only`, termsX, termsY + 15); // Centered terms

        // Save the PDF with a unique filename
        doc.save(`proforma_${targetProforma.proformaNumber}.pdf`);
    };

    // Show loading state while fetching data
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

    // Calculate financial summary for display
    const subtotal = targetProforma.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
    );
    const vat = subtotal * 0.15;
    const total = subtotal + vat;

    // Render the proforma details on the page
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
            <div ref={pdfRef} className="w-full flex dark:text-gray-900 rounded-md dark:bg-slate-100 flex-col gap-4 items-center bg-white p-8">
                {/* Header Image */}
                <Image src={HeaderImg} alt="header image" className="w-full" />

                {/* Date and Reference */}
                <div className="flex flex-col w-full items-end text-2xl px-24">
                    <p>
                        <span className="font-semibold">Date:</span> {new Date().toLocaleDateString()}
                    </p>
                    <p>
                        <span className="font-semibold">Ref:</span> {targetProforma.referenceNumber}
                    </p>
                </div>

                {/* Proforma Title */}
                <h1 className="text-4xl font-semibold underline">PROFORMA</h1>

                {/* Customer and Vehicle Details */}
                <div className="flex px-24 w-full justify-between text-2xl">
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
                <div className="w-full px-24 text-xl">
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
                <div className="w-full px-24 flex flex-col text-2xl items-end mt-4">
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
                <div className="w-full px-24 flex flex-col items-start mt-4 text-2xl">
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
                <div className="w-full px-24 mt-4 text-2xl">
                    <p className="font-semibold">Terms and conditions</p>
                    <p>* 50% MUST BE PAID FOR ORDER</p>
                    <p>* The payment should be made in the name of BINIAM ABEBE KASAYE</p>
                    <p>* The validity of this proforma is for {targetProforma.deliveryTime} only</p>
                </div>
            </div>
        </div>)
};

export default ProformaDetailPage;