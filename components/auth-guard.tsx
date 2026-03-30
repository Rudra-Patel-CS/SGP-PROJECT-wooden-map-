"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib_supabase/supabase/client";
import Link from "next/link";
import { LogIn, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
            setStatus(session ? "authenticated" : "unauthenticated");
        });
    }, []);

    if (status === "loading") {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-[#fffaf3] pt-24 flex items-center justify-center">
                    <div className="animate-pulse text-[#9b7b65] text-lg">Loading...</div>
                </main>
            </>
        );
    }

    if (status === "unauthenticated") {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-[#fffaf3] pt-24 pb-16 flex items-center justify-center px-6">
                    <div className="max-w-md w-full text-center">
                        <div className="bg-[#f7f1e8] rounded-2xl border border-[#e6dcd0] p-10 shadow-sm">
                            <div className="h-16 w-16 rounded-full bg-[#f3ebe2] flex items-center justify-center mx-auto mb-6">
                                <ShieldAlert className="h-8 w-8 text-[#8b5a3c]" />
                            </div>
                            <h1 className="font-serif text-2xl text-[#2b1a12] mb-3">
                                Sign In Required
                            </h1>
                            <p className="text-[#5a3726]/70 text-sm mb-8 leading-relaxed">
                                You need to sign in to access this page. Create an account or
                                log in to continue exploring Aryam Maps.
                            </p>
                            <Link href="/login">
                                <Button className="w-full h-11 bg-[#5a3726] hover:bg-[#3a2418] text-white gap-2">
                                    <LogIn className="h-4 w-4" />
                                    Sign In to Continue
                                </Button>
                            </Link>
                            <Link
                                href="/"
                                className="block mt-4 text-sm text-[#9b7b65] hover:text-[#5a3726] transition"
                            >
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return <>{children}</>;
}
