import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET all blogs — uses service role to bypass RLS
export async function GET() {
  try {
    const supabase = getServiceClient();
    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(blogs ?? []);
  } catch (error: any) {
    console.error('GET /api/blogs error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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

    // Build insert object — only include video_url/published if they have values
    // so it doesn't fail if columns don't exist yet
    const insertData: Record<string, any> = {
      title,
      slug,
      content: content || '',
      excerpt: excerpt || '',
      image_url: image_url || null,
      author: author || 'Admin',
      updated_at: new Date().toISOString(),
    };

    // Conditionally add columns that may not exist in older DB schemas
    if (video_url !== undefined) insertData.video_url = video_url || null;
    if (published !== undefined) insertData.published = published !== false;

    const { data: newBlog, error } = await supabase
      .from('blogs')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      // If error is about missing column, retry without those columns
      if (error.message?.includes('video_url') || error.message?.includes('published')) {
        delete insertData.video_url;
        delete insertData.published;
        const { data: retryBlog, error: retryError } = await supabase
          .from('blogs')
          .insert([insertData])
          .select()
          .single();
        if (retryError) throw retryError;
        return NextResponse.json(retryBlog);
      }
      throw error;
    }

    return NextResponse.json(newBlog);
  } catch (error: any) {
    console.error('POST /api/blogs error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
