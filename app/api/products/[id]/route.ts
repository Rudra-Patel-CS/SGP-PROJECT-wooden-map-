import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

function getPublicClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

// GET /api/products/[id] — fetch a single product
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = getPublicClient();

        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}

// PUT /api/products/[id] — admin updates a product
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

        const updateData: Record<string, any> = {};
        if (body.name !== undefined) updateData.name = body.name;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.price !== undefined) updateData.price = parseFloat(body.price) || 0;
        if (body.stock !== undefined) updateData.stock = parseInt(body.stock) || 0;
        if (body.category !== undefined) updateData.category = body.category;
        if (body.size !== undefined) updateData.size = body.size;
        if (body.badge !== undefined) updateData.badge = body.badge || null;
        if (body.image_url !== undefined) updateData.image_url = body.image_url;
        if (body.images !== undefined) updateData.images = body.images;
        if (body.features !== undefined) updateData.features = body.features;
        if (body.specifications !== undefined) updateData.specifications = body.specifications;
        if (body.is_active !== undefined) updateData.is_active = body.is_active;
        if (body.featured !== undefined) updateData.featured = body.featured;

        const { data, error } = await supabase
            .from("products")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

// DELETE /api/products/[id] — admin deletes or soft-deletes a product
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
        const { searchParams } = new URL(req.url);
        const permanent = searchParams.get("permanent") === "true";
        const supabase = getServiceClient();

        if (permanent) {
            // Hard delete: completely remove from database
            const { error } = await supabase
                .from("products")
                .delete()
                .eq("id", id);

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
        } else {
            // Soft delete: set is_active = false
            const { error } = await supabase
                .from("products")
                .update({ is_active: false })
                .eq("id", id);

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true, permanent });
    } catch {
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
