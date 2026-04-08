import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function GET(req: NextRequest) {
    try {
        const adminAuth = req.headers.get("x-admin-auth");
        if (adminAuth !== "true") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabase = getServiceClient();

        const { data: orders, error } = await supabase
            .from("orders")
            .select(`
                id,
                user_id,
                contact_email,
                contact_phone,
                shipping_address,
                shipping_city,
                shipping_state,
                total_amount,
                created_at,
                order_items (
                    products ( name )
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Aggregate orders by email
        const customersMap = new Map<string, any>();

        orders?.forEach((order) => {
            const email = order.contact_email?.toLowerCase().trim() || 'guest@unknown.com';
            
            if (!customersMap.has(email)) {
                customersMap.set(email, {
                    id: order.user_id || `guest-${order.id}`, // fallback ID
                    name: email.split('@')[0], 
                    email: email,
                    phone: order.contact_phone || 'N/A',
                    location: `${order.shipping_city || ''}, ${order.shipping_state || ''}`.replace(/^, | , $/g, '') || 'N/A',
                    totalOrders: 0,
                    totalSpent: 0,
                    latestOrderDate: order.created_at,
                    favoriteMapMap: new Map<string, number>()
                });
            }

            const customer = customersMap.get(email);
            customer.totalOrders += 1;
            customer.totalSpent += (order.total_amount || 0);

            // Track map types for "favorite map" calculation
            order.order_items?.forEach((item: any) => {
                const mapName = item.products?.name || 'Custom Map';
                customer.favoriteMapMap.set(mapName, (customer.favoriteMapMap.get(mapName) || 0) + 1);
            });
        });

        // Convert Map to Array and determine favorite map
        const customers = Array.from(customersMap.values()).map(c => {
            let favoriteMap = 'N/A';
            let maxCount = 0;
            c.favoriteMapMap.forEach((count: number, name: string) => {
                if (count > maxCount) {
                    maxCount = count;
                    favoriteMap = name;
                }
            });
            delete c.favoriteMapMap;
            c.favoriteMap = favoriteMap;
            return c;
        });

        // Sort by total spent descending
        customers.sort((a, b) => b.totalSpent - a.totalSpent);

        return NextResponse.json(customers);
    } catch {
        return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }
}
