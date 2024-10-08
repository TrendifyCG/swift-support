import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import path from "path";

export const generateUniqueId = () => {
  return uuidv4();
};

export const generateUsername = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const length = 9;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
};

async function saveFileLocally(base64, type) {
  const tempDir = path.join(process.cwd(), "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const fileName =
    generateUsername() + (type === "application/pdf" ? ".pdf" : ".csv");
  const filePath = path.join(tempDir, fileName);
  const buffer = Buffer.from(base64, "base64");

  fs.writeFileSync(filePath, buffer);

  return filePath;
}

export async function uploadDoc(base64, type, apiKey) {
  const fileManager = new GoogleAIFileManager(apiKey);

  const filePath = await saveFileLocally(base64, type);

  if (type === "application/pdf" || type === "text/csv") {
    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType: type,
      displayName: generateUsername(),
    });

    fs.unlinkSync(filePath);

    return uploadResponse.file.uri;
  } else {
    throw new Error("Unsupported file type");
  }
}

export function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64File = reader.result.split(",")[1];
      resolve(base64File);
    };
    reader.onerror = reject;
  });
}
