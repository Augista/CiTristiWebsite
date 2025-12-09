import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Missing Supabase environment variables" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
    const buffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from("cristibucket")
      .upload(fileName, buffer, { contentType: file.type, upsert: false });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 400 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("cristibucket").getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
    });
  } catch (error) {
    console.error("Upload server error:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Server error: ${errorMsg}` }, { status: 500 });
  }
}
