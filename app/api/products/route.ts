import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Admin-level Supabase client (bypasses RLS)
function getServiceClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// Public Supabase client (respects RLS)
function getPublicClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

// GET /api/products — fetch all active products
export async function GET() {
    try {
        const supabase = getPublicClient();
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

// POST /api/products — admin adds a new product
export async function POST(req: NextRequest) {
    try {
        // Verify admin auth (check cookie or header)
        const adminAuth = req.headers.get("x-admin-auth");
        if (adminAuth !== "true") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const supabase = getServiceClient();

        const { data, error } = await supabase
            .from("products")
            .insert({
                name: body.name,
                description: body.description || "",
                price: parseFloat(body.price),
                stock: parseInt(body.stock) || 0,
                category: body.category || "world",
                size: body.size || "medium",
                badge: body.badge || null,
                image_url: body.image_url || null,
                images: body.images || [],
                features: body.features || [],
                specifications: body.specifications || {
                    "Map Type": "Physical",
                    "Size": "40 X 24 INCH",
                    "Lamination": "Waterproof",
                    "Language": "English",
                    "Material": "Wooden",
                    "Usage": "Home, Coaching, Office, School",
                    "Color": "MULTI COLOR",
                    "Surface Finish": "POLISH",
                    "Service Duration": "WITH INSTALLATION",
                    "Capacity": "10 YEAR AND MORE",
                    "Packaging Type": "BOX PACK"
                },
                rating: 0,
                reviews_count: 0,
                is_active: true,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
