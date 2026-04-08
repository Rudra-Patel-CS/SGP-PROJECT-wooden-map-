import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Service client for admin updates (bypassing RLS and accessing auth)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const adminAuth = req.headers.get("x-admin-auth");
    if (adminAuth !== "true") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch all watchlist items with products information
    const { data: watchlistItems, error: wlError } = await supabaseAdmin
      .from("watchlist")
      .select(`
        *,
        products (
          id,
          name,
          price,
          images
        )
      `)
      .order("created_at", { ascending: false });

    if (wlError) {
      console.error("Watchlist fetch error:", wlError);
      return NextResponse.json({ error: wlError.message }, { status: 500 });
    }

    // 2. Map user emails to watchlist items
    // Since watchlist only stores user_id, we'll try to find user information
    // We can list users from auth.admin (requires service role)
    const { data: { users }, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    let userMap: Record<string, string> = {};
    if (!authError && users) {
      users.forEach(u => {
        userMap[u.id] = u.email || 'No Email';
      });
    }

    // 3. Fallback: Check 'orders' table for user emails if not found in auth (for guest/deleted/etc)
    const missingUserIds = watchlistItems
      .filter(item => !userMap[item.user_id])
      .map(item => item.user_id);

    if (missingUserIds.length > 0) {
      const { data: orders } = await supabaseAdmin
        .from("orders")
        .select("user_id, contact_email")
        .in("user_id", missingUserIds);
      
      orders?.forEach(o => {
        if (o.user_id && o.contact_email && !userMap[o.user_id]) {
          userMap[o.user_id] = o.contact_email;
        }
      });
    }

    // 4. Enrich data
    const enrichedData = watchlistItems.map(item => ({
      ...item,
      user_email: userMap[item.user_id] || "Guest / Unknown User"
    }));

    return NextResponse.json(enrichedData);
  } catch (error) {
    console.error("Admin watchlist fetch failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
