import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Service client for updates
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("watchlist")
      .select("*, products(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch watchlist" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_id, user_id } = body;

    if (!product_id || !user_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if it already exists
    const { data: existing } = await supabaseAdmin
      .from("watchlist")
      .select("id")
      .eq("user_id", user_id)
      .eq("product_id", product_id)
      .single();

    if (existing) {
      // Toggle off: Delete
      const { error: deleteError } = await supabaseAdmin
        .from("watchlist")
        .delete()
        .eq("id", existing.id);

      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }

      return NextResponse.json({ status: "removed" });
    } else {
      // Toggle on: Insert
      const { data, error: insertError } = await supabaseAdmin
        .from("watchlist")
        .insert({ user_id, product_id })
        .select()
        .single();

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      return NextResponse.json({ status: "added", data });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to toggle watchlist" }, { status: 500 });
  }
}
