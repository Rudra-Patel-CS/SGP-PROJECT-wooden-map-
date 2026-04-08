import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const DEFAULT_CONFIG = {
  admin_email: "admin@aryammaps.com",
  admin_password: "sgpproject",
  two_factor_enabled: false
};

export async function POST(request: Request) {
  try {
    const { email, password, twoFactorCode } = await request.json();

    const supabase = getServiceClient();

    // Fetch config WITHOUT admin_2fa_secret (it may not exist as a column yet)
    const { data: configs, error } = await supabase
      .from("site_configs")
      .select("admin_password, admin_email, two_factor_enabled")
      .limit(1);

    let config = configs?.[0];

    if (error || !config) {
      if (error) console.error("[AUTH] DB Fetch Error:", error.message);

      // Fallback: only works if no DB record exists at all
      if (email === DEFAULT_CONFIG.admin_email && password === DEFAULT_CONFIG.admin_password) {
        console.log("[AUTH] Using default credentials (no DB record found)");
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ success: false, error: "Configuration not initialized or credentials incorrect" }, { status: 401 });
    }

    // 1. Verify credentials against DB record
    const expectedEmail = config.admin_email || DEFAULT_CONFIG.admin_email;
    const expectedPassword = config.admin_password || DEFAULT_CONFIG.admin_password;

    console.log(`[AUTH] Login attempt: email=${email}, expected_email=${expectedEmail}, db_password="${expectedPassword}"`);

    if (email !== expectedEmail || password !== expectedPassword) {
      console.warn(`[AUTH] FAILED: credentials mismatch`);
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    console.log(`[AUTH] Credentials matched for ${email}`);

    // 2. Handle 2FA if enabled
    if (config.two_factor_enabled) {
      if (!twoFactorCode) {
        return NextResponse.json({ success: true, twoFactorRequired: true });
      }

      // Fetch 2FA secret separately (column may not exist)
      try {
        const { data: secretData, error: secretError } = await supabase
          .from("site_configs")
          .select("admin_2fa_secret")
          .limit(1)
          .single();

        if (secretError || !secretData?.admin_2fa_secret) {
          console.error("[AUTH] 2FA secret not available:", secretError?.message);
          return NextResponse.json({ success: false, error: "2FA is misconfigured. Please disable and re-enable it in Settings." }, { status: 500 });
        }

        // Dynamic import to handle otplib
        const { verify } = await import("otplib");
        const isValid = await verify({
          token: twoFactorCode,
          secret: secretData.admin_2fa_secret
        });

        if (!isValid) {
          return NextResponse.json({ success: false, error: "Invalid 2FA code" }, { status: 401 });
        }
      } catch (e: any) {
        console.error("[AUTH] 2FA verification error:", e.message);
        return NextResponse.json({ success: false, error: "2FA verification failed" }, { status: 500 });
      }
    }

    // Success!
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("[AUTH] Unexpected error:", e.message);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
