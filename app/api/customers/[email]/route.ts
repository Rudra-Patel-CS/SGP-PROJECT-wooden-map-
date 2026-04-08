import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ email: string }> }) {
    try {
        const adminAuth = req.headers.get("x-admin-auth");
        if (adminAuth !== "true") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const resolvedParams = await params;
        const email = decodeURIComponent(resolvedParams.email).toLowerCase();
        const supabase = getServiceClient();

        const { data: orders, error } = await supabase
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
            .ilike("contact_email", email)
            .order("created_at", { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!orders || orders.length === 0) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }

        const customerDetails = {
            name: email.split("@")[0],
            email: email,
            phone: orders[0]?.contact_phone || "N/A",
            location: `${orders[0]?.shipping_city || ""}, ${orders[0]?.shipping_state || ""}`.replace(/^, | , $/g, "") || "N/A",
            totalOrders: orders.length,
            totalSpent: orders.reduce((acc, order) => acc + (order.total_amount || 0), 0),
            orders: orders
        };

        return NextResponse.json(customerDetails);
    } catch {
        return NextResponse.json({ error: "Failed to fetch customer details" }, { status: 500 });
    }
}
