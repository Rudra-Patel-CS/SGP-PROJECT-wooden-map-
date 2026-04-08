import { createClient } from "@/lib_supabase/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_configs")
    .select("store_name, support_email, currency")
    .single();

  if (error || !data) {
    // Fallback to defaults if table is missing or empty
    return NextResponse.json({
      store_name: "Aryam Maps",
      support_email: "support@aryammaps.com",
      currency: "INR"
    });
  }

  return NextResponse.json(data);
}
