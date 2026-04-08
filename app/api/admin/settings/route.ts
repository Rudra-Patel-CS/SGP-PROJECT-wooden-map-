import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: NextRequest) {
  const adminAuth = req.headers.get("x-admin-auth");
  if (adminAuth !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("site_configs")
      .select("id, store_name, support_email, admin_email, currency, admin_password, two_factor_enabled, updated_at")
      .limit(1);

    if (error || !data?.[0]) {
      console.error("[SETTINGS] GET error:", error?.message);
      return NextResponse.json({ error: error?.message || "Config not found" }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch (e: any) {
    console.error("[SETTINGS] Unexpected GET error:", e.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const adminAuth = req.headers.get("x-admin-auth");
  if (adminAuth !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const supabase = getServiceClient();

    // Always fetch the first record's ID
    const { data: config, error: fetchError } = await supabase
      .from("site_configs")
      .select("id")
      .limit(1)
      .single();

    if (fetchError || !config?.id) {
      console.error("[SETTINGS] PATCH fetch error:", fetchError?.message);
      return NextResponse.json({ error: "Configuration record not found" }, { status: 404 });
    }

    const { store_name, support_email, admin_email, currency, admin_password, two_factor_enabled } = body;
    const updateData: Record<string, any> = {};
    if (store_name !== undefined) updateData.store_name = store_name;
    if (support_email !== undefined) updateData.support_email = support_email;
    if (admin_email !== undefined) updateData.admin_email = admin_email;
    if (currency !== undefined) updateData.currency = currency;
    if (admin_password !== undefined && admin_password !== "") updateData.admin_password = admin_password;
    if (two_factor_enabled !== undefined) updateData.two_factor_enabled = two_factor_enabled;
    updateData.updated_at = new Date().toISOString();

    console.log(`[SETTINGS] Updating config ${config.id}:`, JSON.stringify(updateData));

    const { data: updatedConfig, error: updateError } = await supabase
      .from("site_configs")
      .update(updateData)
      .eq("id", config.id)
      .select()
      .single();

    if (updateError) {
      console.error("[SETTINGS] Update error:", updateError.message);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    console.log("[SETTINGS] Update successful. New password:", updatedConfig?.admin_password);
    return NextResponse.json(updatedConfig);
  } catch (e: any) {
    console.error("[SETTINGS] Unexpected PATCH error:", e.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
