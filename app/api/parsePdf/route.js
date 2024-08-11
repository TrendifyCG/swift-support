import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";

const pdfCache = {};

export async function POST(req) {
  try {
    const { fileUrl } = await req.json();

    if (pdfCache[fileUrl]) {
      return pdfCache[fileUrl];
    }

    if (!fileUrl) {
      throw new Error("No file URL provided");
    }

    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    const data = await pdfParse(pdfBuffer, { max: 5 });

    pdfCache[fileUrl] = data.text;

    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
