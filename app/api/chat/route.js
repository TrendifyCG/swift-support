import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

function makeName(length = 10) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function saveFileLocally(base64, type) {
  const tempDir = path.join(process.cwd(), 'temp');  
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  
  const fileName = makeName() + (type === "application/pdf" ? ".pdf" : ".csv");
  const filePath = path.join(tempDir, fileName);
  const buffer = Buffer.from(base64, 'base64');

  fs.writeFileSync(filePath, buffer); 
  
  return filePath;
}

async function uploadDoc(fileData) {
  const fileManager = new GoogleAIFileManager(apiKey);
  const { base64, type } = fileData;

  const filePath = await saveFileLocally(base64, type);

  if (type === "application/pdf" || type === "text/csv") {
    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType: type,
      displayName: makeName(),
    });

    fs.unlinkSync(filePath);

    return uploadResponse.file.uri;
  } else {
    throw new Error("Unsupported file type");
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { message, file, language } = body;
    if (!file || !file.base64 || !file.type) {
        throw new Error("File data is missing or incomplete");
      }
  
    const url = await uploadDoc(file);

    const model = await genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `You are a customer support chat bot. You reply to messages of customers in ${language}, and use the data from ${url} as context. Your replies should be within the scope of the data provided in the file.`,
    });

    const reply = await model.generateContent({ text: message });
    return NextResponse.json({ response: reply.text });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
