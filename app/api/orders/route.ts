import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// GET /api/orders — admin fetches all orders (with items + product names)
export async function GET(req: NextRequest) {
    try {
        const adminAuth = req.headers.get("x-admin-auth");
        if (adminAuth !== "true") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabase = getServiceClient();
        const { data, error } = await supabase
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

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

// POST /api/orders — user places an order
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const supabase = getServiceClient();

        // 1. Insert the order
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                user_id: body.user_id,
                total_amount: body.total_amount,
                shipping_address: body.shipping_address,
                shipping_city: body.shipping_city,
                shipping_state: body.shipping_state || "",
                shipping_zip: body.shipping_zip || "",
                shipping_country: body.shipping_country || "India",
                contact_email: body.contact_email || "",
                contact_phone: body.contact_phone || "",
                status: "placed",
            })
            .select()
            .single();

        if (orderError) {
            return NextResponse.json({ error: orderError.message }, { status: 500 });
        }

        // 2. Insert order items
        if (body.items && body.items.length > 0) {
            const orderItems = body.items.map((item: { product_id: string; quantity: number; price: number; size?: string; color?: string }) => ({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
                size: item.size || "",
                color: item.color || "",
            }));

            const { error: itemsError } = await supabase
                .from("order_items")
                .insert(orderItems);

            if (itemsError) {
                // Rollback: delete the order if items fail
                await supabase.from("orders").delete().eq("id", order.id);
                return NextResponse.json({ error: itemsError.message }, { status: 500 });
            }
        }

        // 3. Return the full order with items
        const { data: fullOrder } = await supabase
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
            .eq("id", order.id)
            .single();

        return NextResponse.json(fullOrder, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
