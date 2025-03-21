import { NextResponse } from "next/server";
import fetch from "node-fetch";; // Node.js fetch for server-side
global.btoa = (b) => Buffer.from(b).toString("base64"); // Polyfill btoa
const apiKey = process.env.PDFSHIFT_API_KEY;


export async function POST(req: Request) {
    const { html } = await req.json();

    try {
        const authHeader = "Basic " + btoa(`api:${apiKey}`);

        const response = await fetch("https://api.pdfshift.io/v3/convert/pdf", {
            method: "POST",
            headers: {
                Authorization: authHeader,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                source: html,
                landscape: false,
                use_print: false,
                sandbox: false, // Test mode
                margin: { top: 10, bottom: 10, left: 10, right: 10 },
                format: "A4",
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("PDFshift Error:", errorText);
            return NextResponse.json({ error: errorText }, { status: response.status });
        }

        const pdf = await response.arrayBuffer();
        return new NextResponse(Buffer.from(pdf), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "attachment; filename=proforma.pdf",
            },
        });
    } catch (error) {
        console.error("PDF generation error:", error);
        return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
    }
}