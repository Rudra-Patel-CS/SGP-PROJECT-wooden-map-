import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getServiceClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    const { data: blog, error } = await supabase
      .from('blogs')
      .select('*')
      .eq(isUuid ? 'id' : 'slug', id)
      .single();

    if (error) throw error;
    return NextResponse.json(blog);
  } catch (error: any) {
    console.error('GET /api/blogs/[id] error:', error);
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getServiceClient();
    const body = await req.json();
    const { title, content, excerpt, image_url, video_url, author, published } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const updateData: Record<string, any> = {
      title,
      slug,
      content: content || '',
      excerpt: excerpt || '',
      image_url: image_url || null,
      author: author || 'Admin',
      updated_at: new Date().toISOString(),
    };

    if (video_url !== undefined) updateData.video_url = video_url || null;
    if (published !== undefined) updateData.published = published !== false;

    const { data: updatedBlog, error } = await supabase
      .from('blogs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // Retry without optional columns if they don't exist
      if (error.message?.includes('video_url') || error.message?.includes('published')) {
        delete updateData.video_url;
        delete updateData.published;
        const { data: retryBlog, error: retryError } = await supabase
          .from('blogs')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();
        if (retryError) throw retryError;
        return NextResponse.json(retryBlog);
      }
      throw error;
    }

    return NextResponse.json(updatedBlog);
  } catch (error: any) {
    console.error('PUT /api/blogs/[id] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getServiceClient();
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/blogs/[id] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
