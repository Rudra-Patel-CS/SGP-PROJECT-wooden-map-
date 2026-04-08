"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib_supabase/supabase/client";
import { User, Mail, Calendar, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth-guard";

interface UserProfile {
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    provider: string;
    createdAt: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();
        
        const fetchProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session?.user) {
                // 1. Get basic info from Auth Session
                const meta = session.user.user_metadata;
                const baseProfile = {
                    email: session.user.email ?? "",
                    firstName: meta?.first_name ?? meta?.full_name?.split(" ")[0] ?? "",
                    lastName: meta?.last_name ?? meta?.full_name?.split(" ").slice(1).join(" ") ?? "",
                    avatarUrl: meta?.avatar_url ?? meta?.picture ?? null,
                    provider: session.user.app_metadata?.provider ?? "email",
                    createdAt: session.user.created_at ?? "",
                };

                // 2. Try to get extended info from 'profiles' table
                const { data: dbProfile } = await supabase
                    .from("profiles")
                    .select("profile_photo, first_name, last_name")
                    .eq("id", session.user.id)
                    .single();

                if (dbProfile) {
                    setUser({
                        ...baseProfile,
                        firstName: dbProfile.first_name || baseProfile.firstName,
                        lastName: dbProfile.last_name || baseProfile.lastName,
                        avatarUrl: dbProfile.profile_photo || baseProfile.avatarUrl,
                    });
                } else {
                    setUser(baseProfile);
                }
            } else {
                window.location.href = "/login";
            }
            setLoading(false);
        };

        fetchProfile();
    }, []);

    const getInitials = () => {
        if (!user) return "";
        const f = user.firstName?.[0] ?? "";
        const l = user.lastName?.[0] ?? "";
        return (f + l).toUpperCase() || user.email[0]?.toUpperCase() || "U";
    };

    const getDisplayName = () => {
        if (!user) return "";
        if (user.firstName) return `${user.firstName} ${user.lastName}`.trim();
        return user.email.split("@")[0];
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-[#fffaf3] pt-24 flex items-center justify-center">
                    <div className="animate-pulse text-[#9b7b65] text-lg">Loading profile...</div>
                </main>
            </>
        );
    }

    if (!user) return null;

    const formattedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "N/A";

    return (
        <AuthGuard>
            <>
                <Header />
                <main className="min-h-screen bg-[#fffaf3] pt-24 pb-16">
                    <div className="max-w-2xl mx-auto px-6">
                        {/* Back Link */}
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-[#9b7b65] hover:text-[#5a3726] transition mb-8"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>

                        {/* Profile Card */}
                        <div className="bg-[#f7f1e8] rounded-2xl border border-[#e6dcd0] overflow-hidden shadow-sm">
                            {/* Banner */}
                            <div className="h-32 bg-gradient-to-br from-[#4a2c14] via-[#6d4830] to-[#8b5a3c]" />

                            {/* Avatar */}
                            <div className="px-8 -mt-14">
                                <div className="h-24 w-24 rounded-full border-4 border-[#f7f1e8] shadow-lg overflow-hidden bg-[#8b5a3c]">
                                    <img
                                        src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(getDisplayName())}&background=8b5a3c&color=fff&size=128`}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            // Fallback if image fails to load
                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getDisplayName())}&background=8b5a3c&color=fff&size=128`;
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="px-8 pt-4 pb-8">
                                <h1 className="font-serif text-3xl text-[#2b1a12] mb-1">
                                    {getDisplayName()}
                                </h1>
                                <p className="text-[#9b7b65] text-sm mb-8">{user.email}</p>

                                {/* Details Grid */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-[#fffaf3] rounded-xl border border-[#e6dcd0]">
                                        <div className="h-10 w-10 rounded-lg bg-[#f3ebe2] flex items-center justify-center">
                                            <User className="h-5 w-5 text-[#8b5a3c]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#9b7b65] uppercase tracking-wider">Full Name</p>
                                            <p className="text-sm font-medium text-[#2b1a12]">
                                                {user.firstName || user.lastName
                                                    ? `${user.firstName} ${user.lastName}`.trim()
                                                    : "Not provided"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-[#fffaf3] rounded-xl border border-[#e6dcd0]">
                                        <div className="h-10 w-10 rounded-lg bg-[#f3ebe2] flex items-center justify-center">
                                            <Mail className="h-5 w-5 text-[#8b5a3c]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#9b7b65] uppercase tracking-wider">Email</p>
                                            <p className="text-sm font-medium text-[#2b1a12]">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-[#fffaf3] rounded-xl border border-[#e6dcd0]">
                                        <div className="h-10 w-10 rounded-lg bg-[#f3ebe2] flex items-center justify-center">
                                            <Shield className="h-5 w-5 text-[#8b5a3c]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#9b7b65] uppercase tracking-wider">Sign-in Method</p>
                                            <p className="text-sm font-medium text-[#2b1a12] capitalize">{user.provider}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-[#fffaf3] rounded-xl border border-[#e6dcd0]">
                                        <div className="h-10 w-10 rounded-lg bg-[#f3ebe2] flex items-center justify-center">
                                            <Calendar className="h-5 w-5 text-[#8b5a3c]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#9b7b65] uppercase tracking-wider">Member Since</p>
                                            <p className="text-sm font-medium text-[#2b1a12]">{formattedDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        </AuthGuard>
    );
}
