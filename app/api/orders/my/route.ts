import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// GET /api/orders/my?user_id=xxx — user fetches their own orders
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("user_id");
        const userEmail = searchParams.get("email");

        if (!userId && !userEmail) {
            return NextResponse.json({ error: "Missing user_id or email" }, { status: 400 });
        }

        const supabase = getServiceClient();

        let query = supabase
            .from("orders")
            .select(`
                *,
                order_items (
                    id,
                    product_id,
                    quantity,
                    price,
                    size,
                    color,
                    products ( id, name, images )
                )
            `)
            .order("created_at", { ascending: false });

        if (userId) {
            query = query.eq("user_id", userId);
        } else if (userEmail) {
            query = query.eq("contact_email", userEmail);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
