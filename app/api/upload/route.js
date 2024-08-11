import { uploadFileDoc } from "@/app/_lib/data-service";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const { id, url } = await uploadFileDoc(file);

    return NextResponse.json({ success: true, fileUrl: url, id: id });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
