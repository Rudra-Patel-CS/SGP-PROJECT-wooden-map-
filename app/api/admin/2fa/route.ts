import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Helper: safely check if admin_2fa_secret column exists by trying to query it
async function getConfigWith2FA(supabase: any) {
  // First get the basic config
  const { data: configs, error } = await supabase
    .from("site_configs")
    .select("id, admin_password, admin_email, two_factor_enabled, support_email")
    .limit(1);

  if (error || !configs?.[0]) {
    return { config: null, error: error?.message || "No config found" };
  }

  const config = configs[0];

  // Now try to get the 2FA secret separately
  try {
    const { data: secretData, error: secretError } = await supabase
      .from("site_configs")
      .select("admin_2fa_secret")
      .eq("id", config.id)
      .single();

    if (!secretError && secretData) {
      config.admin_2fa_secret = secretData.admin_2fa_secret;
    }
  } catch {
    // Column doesn't exist - that's fine
    config.admin_2fa_secret = null;
  }

  return { config, error: null };
}

// GET: Setup 2FA (returns QR code)
export async function GET(req: NextRequest) {
  const adminAuth = req.headers.get("x-admin-auth");
  const providedPassword = req.headers.get("x-admin-password");

  if (adminAuth !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getServiceClient();
    const { config, error } = await getConfigWith2FA(supabase);

    if (!config) {
      return NextResponse.json({ error: error || "Config not found" }, { status: 500 });
    }

    // Verify password before allowing 2FA setup
    if (providedPassword !== config.admin_password) {
      console.warn(`[2FA] Password mismatch. Provided: "${providedPassword}", Expected: "${config.admin_password}"`);
      return NextResponse.json({ error: "Invalid password for security authorization" }, { status: 401 });
    }

    // If already enabled, don't show secret again
    if (config.two_factor_enabled && config.admin_2fa_secret) {
      return NextResponse.json({ enabled: true });
    }

    // Generate new secret
    const { generateSecret, generateURI } = await import("otplib");
    const qrcode = (await import("qrcode")).default;

    let secret = config.admin_2fa_secret;
    if (!secret) {
      secret = generateSecret();
      // Try to save the secret
      const { error: updateErr } = await supabase
        .from("site_configs")
        .update({ admin_2fa_secret: secret })
        .eq("id", config.id);

      if (updateErr) {
        console.error("[2FA] Failed to save secret:", updateErr.message);
        return NextResponse.json({ 
          error: "Cannot save 2FA secret. The 'admin_2fa_secret' column may be missing from your database. Please run: ALTER TABLE site_configs ADD COLUMN IF NOT EXISTS admin_2fa_secret text;" 
        }, { status: 500 });
      }
    }

    const otpauth = generateURI({
      secret,
      label: config.support_email || "admin@aryammaps.com",
      issuer: "Aryam Maps Admin"
    });
    const qrCodeUrl = await qrcode.toDataURL(otpauth);

    return NextResponse.json({ secret, qrCodeUrl, enabled: false });
  } catch (e: any) {
    console.error("[2FA] GET error:", e.message);
    return NextResponse.json({ error: "Failed to setup 2FA: " + e.message }, { status: 500 });
  }
}

// POST: Verify 2FA code and enable
export async function POST(req: NextRequest) {
  const adminAuth = req.headers.get("x-admin-auth");
  if (adminAuth !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { code } = await req.json();
    const supabase = getServiceClient();
    const { config, error } = await getConfigWith2FA(supabase);

    if (!config || !config.admin_2fa_secret) {
      console.error(`[2FA] Cannot verify - config: ${!!config}, secret: ${!!config?.admin_2fa_secret}`);
      return NextResponse.json({ error: "2FA Setup not initiated or secret missing" }, { status: 400 });
    }

    const { verify } = await import("otplib");
    const isValid = await verify({
      token: code,
      secret: config.admin_2fa_secret
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    // Enable 2FA
    const { error: updateError } = await supabase
      .from("site_configs")
      .update({ two_factor_enabled: true })
      .eq("id", config.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    console.log("[2FA] Successfully enabled");
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("[2FA] POST error:", e.message);
    return NextResponse.json({ error: "Verification failed: " + e.message }, { status: 500 });
  }
}

// DELETE: Disable 2FA
export async function DELETE(req: NextRequest) {
  const adminAuth = req.headers.get("x-admin-auth");
  if (adminAuth !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getServiceClient();
    
    // Get the first record
    const { data: config } = await supabase
      .from("site_configs")
      .select("id")
      .limit(1)
      .single();

    if (!config) {
      return NextResponse.json({ error: "Configuration not found" }, { status: 404 });
    }

    // Disable 2FA: set flag to false and clear the secret
    // We build the update dynamically in case admin_2fa_secret column doesn't exist
    const updatePayload: Record<string, any> = { two_factor_enabled: false };
    
    // Try to also clear the secret
    try {
      const { error: secretClearError } = await supabase
        .from("site_configs")
        .update({ two_factor_enabled: false, admin_2fa_secret: null })
        .eq("id", config.id);

      if (secretClearError) {
        // Column might not exist. Just disable the flag.
        console.warn("[2FA] Could not clear secret (column may not exist), disabling flag only");
        const { error: fallbackError } = await supabase
          .from("site_configs")
          .update({ two_factor_enabled: false })
          .eq("id", config.id);

        if (fallbackError) {
          return NextResponse.json({ error: fallbackError.message }, { status: 500 });
        }
      }
    } catch {
      // Fallback
      await supabase
        .from("site_configs")
        .update({ two_factor_enabled: false })
        .eq("id", config.id);
    }

    console.log(`[2FA] Successfully disabled for record ${config.id}`);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("[2FA] DELETE error:", e.message);
    return NextResponse.json({ error: "Failed to disable 2FA" }, { status: 500 });
  }
}
