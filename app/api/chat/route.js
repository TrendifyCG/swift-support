import { uploadDoc } from "@/app/_util/utilities";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req) {
  try {
    const body = await req.json();
    const { message, file, language } = body;
    if (!file || !file.base64 || !file.type) {
      const model = await genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: `You are a customer support chat bot. You reply to messages of customers in ${language}, Your replies should be based solely on the questions the customer asks you .`,
      });
    } else {
      const url = await uploadDoc(file);

      const model = await genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: `You are a customer support chat bot. You reply to messages of customers in ${language}, and use the data from ${url} as context. Your replies should be within the scope of the data provided in the file.`,
      });

      const reply = await model.generateContent({ text: message });
      return NextResponse.json({ response: reply.response.text() });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
