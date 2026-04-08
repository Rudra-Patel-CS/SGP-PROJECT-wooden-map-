import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// POST /api/blogs/upload — upload blog media (image or video) to blog-media bucket
export async function POST(req: NextRequest) {
  try {
    const adminAuth = req.headers.get("x-admin-auth");
    if (adminAuth !== "true") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const supabase = getServiceClient();
    const ext = file.name.split(".").pop();
    const filename = `public/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("blog-media")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      // Fallback: try product-images bucket if blog-media doesn't exist
      const { error: fallbackError } = await supabase.storage
        .from("product-images")
        .upload(filename.replace("public/", ""), buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (fallbackError) {
        return NextResponse.json({ error: fallbackError.message }, { status: 500 });
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filename.replace("public/", ""));

      return NextResponse.json({ url: urlData.publicUrl });
    }

    const { data: urlData } = supabase.storage
      .from("blog-media")
      .getPublicUrl(filename);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
