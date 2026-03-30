"use client";


import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/lib_supabase/supabase/client";

export default function AuthPage() {
  const supabase = createClient();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Check session on mount → redirect if already logged in
  // Also check if returning user → default to Login tab
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Already logged in → go to dashboard
        router.replace("/profile");
        return;
      }
      // Check if returning user (has registered before)
      const hasAccount = localStorage.getItem("woodmaps-hasAccount");
      if (hasAccount) {
        setMode("login");
      } else {
        setMode("register");
      }
      setPageLoading(false);
    };
    init();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (mode === "login") {
      // ── ADMIN LOGIN (credentials checked server-side) ──────
      const adminRes = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (adminRes.ok) {
        localStorage.setItem("adminAuth", "true");
        localStorage.setItem("adminEmail", email);
        window.location.href = "/admin/dashboard";
        return;
      }

      // ── NORMAL USER LOGIN ─────────────────────────────────
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      localStorage.setItem("woodmaps-hasAccount", "true");
      window.location.href = "/profile";

    } else {
      // ── REGISTER ───────────────────────────────────────────
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      localStorage.setItem("woodmaps-hasAccount", "true");
      setSuccess("Account created! Please check your email to confirm your account, then log in.");
      setMode("login");
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  // Show loading while checking session
  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f1e8]">
        <div className="animate-pulse text-[#9b7b65] text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT — CHOCOLATE */}
      <div className="relative hidden lg:flex flex-col justify-between p-14 bg-[#2b1a12] text-[#f7f1e8]">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/world-map-dark.jpeg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        <h2 className="relative z-10 font-serif text-2xl">Aryam Maps</h2>

        <div className="relative z-10 max-w-md">
          <h1 className="font-serif text-5xl leading-tight mb-6">
            Crafted With <br /> Passion & Precision
          </h1>
          <p className="text-[#f7f1e8]/80 text-lg">
            Bring warmth, travel, and storytelling into your home with
            handcrafted wooden maps designed to last generations.
          </p>
        </div>

        <Link
          href="/"
          className="relative z-10 w-fit px-5 py-2 border border-[#f7f1e8]/30 rounded-full hover:bg-[#3a2418] transition"
        >
          ← Back to website
        </Link>
      </div>

      {/* RIGHT — CREAM */}
      <div className="flex items-center justify-center bg-[#f7f1e8] px-6">
        <div className="w-full max-w-md">
          <div className="bg-[#efe6d8] p-8 rounded-2xl shadow-sm min-h-[520px]">

            {/* PREMIUM SWITCH */}
            <div className="mb-8">
              <div className="relative grid grid-cols-2 bg-[#e7dccb] rounded-xl p-1">
                <div
                  className={`
                    absolute top-1 bottom-1 w-1/2 rounded-lg
                    bg-[#f7f1e8] shadow-sm transition-all duration-300
                    ${mode === "login" ? "left-1" : "left-1/2 -translate-x-1"}
                  `}
                />
                <button
                  onClick={() => { setMode("login"); setError(""); setSuccess(""); setEmail(""); setPassword(""); setFirstName(""); setLastName(""); }}
                  className={`relative z-10 py-2 text-sm font-medium ${mode === "login" ? "text-[#2b1a12]" : "text-[#5a3726]/70"
                    }`}
                >
                  Log In
                </button>
                <button
                  onClick={() => { setMode("register"); setError(""); setSuccess(""); setEmail(""); setPassword(""); setFirstName(""); setLastName(""); }}
                  className={`relative z-10 py-2 text-sm font-medium ${mode === "register" ? "text-[#2b1a12]" : "text-[#5a3726]/70"
                    }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* TITLE */}
            <h1 className="font-serif text-3xl text-[#2b1a12] mb-2">
              {mode === "login" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-[#5a3726]/70 mb-6">
              {mode === "login"
                ? "Log in to continue your journey."
                : "Join our community and start exploring."}
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
                  {success}
                </div>
              )}

              {mode === "register" && (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-[#f7f1e8] border-[#e2d6c6] h-11"
                    required
                  />
                  <Input
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-[#f7f1e8] border-[#e2d6c6] h-11"
                    required
                  />
                </div>
              )}

              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#f7f1e8] border-[#e2d6c6] h-11"
                autoComplete="off"
                required
              />

              <div className="relative">
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#f7f1e8] border-[#e2d6c6] h-11 pr-10"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a3726]"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {mode === "register" && (
                <div className="flex items-center gap-2 text-sm text-[#5a3726]">
                  <Checkbox required className="border-[#5a3726] data-[state=checked]:border-[#5a3726]" />
                  I agree to the Terms & Conditions
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#5a3726] hover:bg-[#3a2418] text-white disabled:opacity-60"
              >
                {loading
                  ? mode === "login" ? "Logging in..." : "Creating account..."
                  : mode === "login" ? "Log In" : "Create Account"}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-3">
                <div className="flex-1 h-px bg-[#d6c6b4]" />
                <span className="text-sm text-[#5a3726]/70">Or continue with</span>
                <div className="flex-1 h-px bg-[#d6c6b4]" />
              </div>

              {/* SOCIAL */}
              <Button
                type="button"
                className="w-full h-11 flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-[#3c4043] border border-[#dadce0] shadow-sm font-medium"
                onClick={async () => {
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                      redirectTo: `${window.location.origin}/auth/callback`,
                    },
                  });
                  if (error) setError(error.message);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.1 24.1 0 0 0 0 21.56l7.98-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                Continue with Google
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
