"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Menu, X, User, ChevronDown, LogOut, Settings, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib_supabase/cart-context";
import { createClient } from "@/lib_supabase/supabase/client";
import { usePageTransition } from "@/components/page-transition-provider";

interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const { cartCount } = useCart();
  const { triggerLoading } = usePageTransition();
  const pathname = usePathname();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);
  const isHomePage = pathname === "/";

  const handleBack = () => {
    triggerLoading();
    router.back();
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        setUser({
          email: session.user.email ?? "",
          firstName: meta?.first_name ?? meta?.full_name?.split(" ")[0] ?? "",
          lastName: meta?.last_name ?? meta?.full_name?.split(" ").slice(1).join(" ") ?? "",
          avatarUrl: meta?.avatar_url ?? meta?.picture ?? null,
        });
      }
    });

    // Listen for changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        setUser({
          email: session.user.email ?? "",
          firstName: meta?.first_name ?? meta?.full_name?.split(" ")[0] ?? "",
          lastName: meta?.last_name ?? meta?.full_name?.split(" ").slice(1).join(" ") ?? "",
          avatarUrl: meta?.avatar_url ?? meta?.picture ?? null,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfileOpen(false);
    window.location.href = "/";
  };

  const navigation = [
    { name: "Shop", href: "/shop" },
    { name: "Order Status", href: "/order-status" },
  ];

  const infoLinks = [
    { name: "About Us", href: "/about" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user) return "";
    const first = user.firstName?.[0] ?? "";
    const last = user.lastName?.[0] ?? "";
    return (first + last).toUpperCase() || user.email[0]?.toUpperCase() || "U";
  };

  const getDisplayName = () => {
    if (!user) return "";
    if (user.firstName) return `${user.firstName} ${user.lastName}`.trim();
    return user.email.split("@")[0];
  };

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${scrolled
          ? "bg-[#fffaf3]/80 backdrop-blur-xl shadow-sm h-14"
          : "bg-[#fffaf3]/95 backdrop-blur-md h-16"
        }
        border-b border-[#e6dcd0]
      `}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-10 h-full">
        {/* ⭐ Premium Grid */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-full">
          {/* LEFT — BACK + LOGO */}
          <div className="flex items-center gap-2">
            {!isHomePage && (
              <button
                onClick={handleBack}
                className="
                  flex items-center justify-center
                  w-8 h-8 rounded-lg
                  text-[#5a3726]
                  hover:bg-[#f3ebe2]
                  hover:text-[#2b1a12]
                  transition-all duration-200
                "
                title="Go back"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </button>
            )}
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/aryam-maps-logo.png"
                alt="Aryam Maps Logo"
                className="w-9 h-9 rounded-md object-cover"
              />

              <span className="font-serif text-xl tracking-wide text-[#3b2412]">
                Aryam <span className="text-[#9b7b65]">Maps</span>
              </span>
            </Link>
          </div>

          {/* CENTER — NAV */}
          <div className="hidden md:flex items-center gap-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="
                  relative text-sm font-medium
                  text-[#5a3726]
                  hover:text-[#2b1a12]
                  transition
                  after:absolute after:-bottom-1 after:left-0
                  after:h-[2px] after:w-0
                  after:bg-[#9b7b65]
                  after:transition-all after:duration-300
                  hover:after:w-full
                "
              >
                {item.name}
              </Link>
            ))}

            {/*DROPDOWN */}
            <div className="relative group">
              <button
                className="
                  flex items-center gap-1 text-sm font-medium
                  text-[#5a3726]
                  hover:text-[#2b1a12]
                  transition
                "
              >
                Information
                <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
              </button>

              {/* Dropdown */}
              <div
                className="
                  absolute left-1/2 -translate-x-1/2 top-full mt-5 w-60
                  rounded-2xl
                  bg-[#fffaf3]/95
                  backdrop-blur-md
                  border border-[#e6dcd0]
                  shadow-[0_25px_70px_rgba(0,0,0,0.12)]
                  p-3
                  opacity-0 invisible translate-y-4
                  group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                  transition-all duration-300 ease-out
                "
              >
                {infoLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="
                      flex items-center justify-between
                      rounded-xl px-4 py-2.5 text-sm
                      text-[#3b2412]
                      hover:bg-[#f3ebe2]
                      transition
                    "
                  >
                    {item.name}
                    <span className="opacity-0 group-hover:opacity-100 transition">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex justify-end items-center gap-5">
            {user ? (
              /* ── LOGGED-IN: PROFILE DROPDOWN ── */
              <div className="relative hidden sm:block" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 text-sm font-medium text-[#5a3726] hover:text-[#2b1a12] transition"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Avatar"
                      className="h-8 w-8 rounded-full object-cover border-2 border-[#d4b896]"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#8b5a3c] flex items-center justify-center text-white text-xs font-semibold">
                      {getInitials()}
                    </div>
                  )}
                  <span className="max-w-[120px] truncate">{getDisplayName()}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div
                    className="
                      absolute right-0 top-full mt-3 w-72
                      rounded-2xl
                      bg-[#fffaf3]
                      border border-[#e6dcd0]
                      shadow-[0_25px_70px_rgba(0,0,0,0.15)]
                      overflow-hidden
                      animate-in fade-in slide-in-from-top-2 duration-200
                    "
                  >
                    {/* User Info Header */}
                    <div className="px-5 py-4 bg-[#f3ebe2] border-b border-[#e6dcd0]">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt="Avatar"
                            className="h-11 w-11 rounded-full object-cover border-2 border-[#d4b896]"
                          />
                        ) : (
                          <div className="h-11 w-11 rounded-full bg-[#8b5a3c] flex items-center justify-center text-white text-sm font-semibold">
                            {getInitials()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#2b1a12] text-sm truncate">
                            {getDisplayName()}
                          </p>
                          <p className="text-xs text-[#9b7b65] truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <Link
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-[#3b2412] hover:bg-[#f3ebe2] transition"
                      >
                        <User className="h-4 w-4 text-[#9b7b65]" />
                        My Profile
                      </Link>
                      <Link
                        href="/cart"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-[#3b2412] hover:bg-[#f3ebe2] transition"
                      >
                        <ShoppingCart className="h-4 w-4 text-[#9b7b65]" />
                        My Cart
                        {cartCount > 0 && (
                          <span className="ml-auto bg-[#8b5a3c] text-white text-xs px-2 py-0.5 rounded-full">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-[#3b2412] hover:bg-[#f3ebe2] transition"
                      >
                        <Heart className="h-4 w-4 text-[#9b7b65]" />
                        Wishlist
                      </Link>
                      <Link
                        href="/order-status"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-[#3b2412] hover:bg-[#f3ebe2] transition"
                      >
                        <Settings className="h-4 w-4 text-[#9b7b65]" />
                        Order Status
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="p-2 border-t border-[#e6dcd0]">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── NOT LOGGED IN: SIGN IN LINK ── */
              <Link
                href="/login"
                className="
                  hidden sm:flex items-center gap-2 text-sm font-medium
                  text-[#5a3726]
                  hover:text-[#2b1a12]
                  transition
                "
              >
                <User className="h-4 w-4" />
                Sign In
              </Link>
            )}

            <Link href="/cart" className="relative text-[#3b2412]">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span
                  className="
                    absolute -top-2 -right-2
                    h-5 w-5 rounded-full
                    bg-[#8b5a3c]
                    text-white
                    text-xs flex items-center justify-center
                    font-medium
                    animate-in zoom-in duration-200
                  "
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* MOBILE BUTTON */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[#3b2412]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#e6dcd0]">
            <div className="flex flex-col gap-4">
              {[...navigation, ...infoLinks].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-[#5a3726]"
                >
                  {item.name}
                </Link>
              ))}

              {user ? (
                <>
                  {/* Mobile: Logged in user info */}
                  <div className="flex items-center gap-3 pt-2 border-t border-[#e6dcd0]">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt="Avatar"
                        className="h-9 w-9 rounded-full object-cover border-2 border-[#d4b896]"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-[#8b5a3c] flex items-center justify-center text-white text-xs font-semibold">
                        {getInitials()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-[#2b1a12] text-sm">{getDisplayName()}</p>
                      <p className="text-xs text-[#9b7b65]">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-[#5a3726]"
                  >
                    <User className="h-4 w-4" /> My Profile
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-[#5a3726]"
                  >
                    <Heart className="h-4 w-4" /> Wishlist
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    className="flex items-center gap-2 text-sm font-medium text-red-600"
                  >
                    <LogOut className="h-4 w-4" /> Log Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-[#5a3726]"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
