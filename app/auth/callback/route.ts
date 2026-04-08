import { NextResponse } from "next/server";
import { createClient } from "@/lib_supabase/supabase/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");

    if (code) {
        const supabase = await createClient();
        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error && session?.user) {
            // Sync user data to profiles table
            const meta = session.user.user_metadata;
            await supabase.from("profiles").upsert({
                id: session.user.id,
                email: session.user.email,
                first_name: meta?.first_name ?? meta?.full_name?.split(" ")[0] ?? "",
                last_name: meta?.last_name ?? meta?.full_name?.split(" ").slice(1).join(" ") ?? "",
                profile_photo: meta?.avatar_url ?? meta?.picture ?? null,
            });

            return NextResponse.redirect(`${origin}/profile`);
        }
    }

    // Something went wrong — redirect to login with error
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
