import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// POST /api/upload — upload an image to Supabase Storage
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

        // Generate a unique filename
        const ext = file.name.split(".").pop();
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(filename, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        // Get the public URL
        const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(filename);

        return NextResponse.json({ url: urlData.publicUrl });
    } catch {
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }
}
