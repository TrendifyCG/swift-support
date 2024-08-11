import { fetchAndParsePDF } from "@/app/_util/utilities";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req) {
  try {
    const { message, language, pdfContent } = await req.json();

    let systemInstruction = `You are a customer support chat bot. You reply to messages of customers in ${language}.`;

    if (pdfContent) {
      systemInstruction += ` You use the data from the provided file as context. The content from the file is as follows: ${pdfContent}.`;
      systemInstruction += ` If the user asks about the file or mentions anything related to it, your replies should be based on this content.`;
      systemInstruction += `
      If the user asks questions like "Tell me about the file" or similar queries related to the uploaded file, 
      you should provide a concise and clear summary based on the file content.`;
    } else {
      systemInstruction += ` Your replies should be based solely on the questions the customer asks you.`;
    }

    const model = await genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const output = await response.text();

    return NextResponse.json({ response: output });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
