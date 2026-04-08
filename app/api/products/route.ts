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

// GET /api/products — fetch products (add ?all=true for admin to include inactive)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const showAll = searchParams.get("all") === "true";
        const featuredOnly = searchParams.get("featured") === "true";
        const adminAuth = req.headers.get("x-admin-auth");

        // Use service client for admin requests to bypass RLS
        const supabase = (showAll && adminAuth === "true") ? getServiceClient() : getPublicClient();

        let query = supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });

        // Only filter by is_active for public requests
        if (!showAll || adminAuth !== "true") {
            query = query.eq("is_active", true);
        }

        // Filter featured products for homepage
        if (featuredOnly) {
            query = query.eq("featured", true);
        }

        const { data, error } = await query;

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

        const insertData: any = {
                name: body.name,
                description: body.description || "",
                price: parseFloat(body.price) || 0,
                stock: parseInt(body.stock) || 0,
                category: body.category || "world",
                size: body.size || "medium",
                badge: body.badge || null,
                image_url: body.image_url || null,
                images: body.images || [],
                features: body.features || [],
                rating: 0,
                reviews_count: 0,
                is_active: true,
                featured: body.featured || false,
        };

        // Add specifications only if provided to prevent errors if column is missing
        if (body.specifications) {
            insertData.specifications = body.specifications;
        }

        const { data, error } = await supabase
            .from("products")
            .insert(insertData)
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
