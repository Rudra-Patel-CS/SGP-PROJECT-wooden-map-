import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// GET /api/orders/[id] — fetch single order with items
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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
            .eq("id", id)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
    }
}

// PUT /api/orders/[id] — admin updates order status
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const adminAuth = req.headers.get("x-admin-auth");
        if (adminAuth !== "true") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const supabase = getServiceClient();

        const { data, error } = await supabase
            .from("orders")
            .update({ status: body.status })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}

// DELETE /api/orders/[id] — admin deletes an order entirely
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const adminAuth = req.headers.get("x-admin-auth");
        if (adminAuth !== "true") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const supabase = getServiceClient();

        // Foreign keys with cascading delete (if set up) should handle order_items automatically.
        // Otherwise, explicitly delete items first:
        await supabase.from("order_items").delete().eq("order_id", id);
        
        const { error } = await supabase
            .from("orders")
            .delete()
            .eq("id", id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
    }
}
