"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Menu, X, User, ChevronDown, LogOut, Settings, Heart, ArrowLeft, Search, Info, HelpCircle, Phone, BookOpen, Package, LayoutDashboard, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib_supabase/cart-context";
import { createClient } from "@/lib_supabase/supabase/client";
import { usePageTransition } from "@/components/page-transition-provider";
import { useSettings } from "@/components/settings-context";

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
  const { cartCount, clearCart } = useCart();
  const { triggerLoading } = usePageTransition();
  const { settings } = useSettings();
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

    const updateUserInfo = async (session: any) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        const baseUser = {
          email: session.user.email ?? "",
          firstName: meta?.first_name ?? meta?.full_name?.split(" ")[0] ?? "",
          lastName: meta?.last_name ?? meta?.full_name?.split(" ").slice(1).join(" ") ?? "",
          avatarUrl: meta?.avatar_url ?? meta?.picture ?? null,
        };

        // Try to get updated photo from DB
        const { data: dbProfile } = await supabase
          .from("profiles")
          .select("profile_photo, first_name, last_name")
          .eq("id", session.user.id)
          .single();

        if (dbProfile) {
          setUser({
            ...baseUser,
            firstName: dbProfile.first_name || baseUser.firstName,
            lastName: dbProfile.last_name || baseUser.lastName,
            avatarUrl: dbProfile.profile_photo || baseUser.avatarUrl,
          });
        } else {
          setUser(baseUser);
        }
      } else {
        setUser(null);
      }
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateUserInfo(session);
    });

    // Listen for changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      updateUserInfo(session);
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
    clearCart();
    setUser(null);
    setProfileOpen(false);
    window.location.href = "/";
  };

  const navigation = [
    { name: "Shop", href: "/shop", icon: Package },
    { name: "Order Status", href: "/order-status", icon: ShoppingCart },
  ];

  const infoLinks = [
    { name: "About Us", href: "/about", icon: Info },
    { name: "FAQ", href: "/faq", icon: HelpCircle },
    { name: "Contact", href: "/contact", icon: Phone },
    { name: "Blog", href: "/blog", icon: BookOpen },
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
    <>
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
                alt={`${settings.store_name} Logo`}
                className="w-9 h-9 rounded-md object-cover"
              />

              <span className="font-serif text-xl tracking-wide text-[#3b2412]">
                {settings.store_name.split(' ')[0]} <span className="text-[#9b7b65]">{settings.store_name.split(' ').slice(1).join(' ')}</span>
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
                  <div className="h-8 w-8 rounded-full border-2 border-[#d4b896] overflow-hidden bg-[#8b5a3c]">
                    <img
                      src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(getDisplayName())}&background=8b5a3c&color=fff&size=64`}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
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
                        <div className="h-11 w-11 rounded-full border-2 border-[#d4b896] overflow-hidden bg-[#8b5a3c]">
                          <img
                            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(getDisplayName())}&background=8b5a3c&color=fff&size=96`}
                            alt="Avatar"
                            className="h-full w-full object-cover"
                          />
                        </div>
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
              {user && cartCount > 0 && (
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

        {/* MOBILE MENU DRAWER — RENDERED OUTSIDE HEADER */}
      </nav>
    </header>

    {/* MOBILE MENU DRAWER (ALIGNED WITH ADMIN) */}
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: "-100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "-100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
          className="fixed inset-0 z-[60] md:hidden"
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Sidebar Drawer — Matches Admin Style */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-[80%] max-w-[300px] shadow-2xl flex flex-col overflow-hidden"
            style={{ background: '#FDFBF7', borderRight: '1px solid rgba(139,90,60,0.15)', color: '#1E2430' }}
          >
            {/* Logo Header */}
            <div className="p-6 pb-2" style={{ borderBottom: '1px solid rgba(139,90,60,0.15)' }}>
              <div className="flex items-center gap-3 p-2 rounded-2xl transition-all" style={{ background: '#F0EBE1' }}>
                <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src="/aryam-creation-logo.png" 
                    alt="Aryam Creation Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold truncate" style={{ color: '#1E2430' }}>{settings.store_name}</p>
                  <p className="text-[10px] truncate" style={{ color: '#6E6B5E' }}>Premium Wooden Art</p>
                </div>
              </div>
            </div>

            {/* Close Button — top right of viewport like admin */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="fixed top-6 z-[70] bg-white/80 backdrop-blur-md rounded-full p-2 shadow-lg border border-[#e6dcd0] transition hover:bg-white"
              style={{ left: 'min(80%, 300px)' }}
            >
              <X className="h-5 w-5 text-[#3b2412]" />
            </button>

            {/* Search Box */}
            <div className="px-4 py-4" style={{ borderBottom: '1px solid rgba(139,90,60,0.15)' }}>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors" style={{ color: '#8b5a3c' }} />
                <input 
                  type="text" 
                  placeholder="Search maps..." 
                  style={{ background: '#FFFFFF', border: '1px solid rgba(139,90,60,0.2)', color: '#1E2430', borderRadius: '0.5rem' }}
                  className="w-full py-2.5 pl-10 pr-4 text-xs placeholder:text-[#6E6B5E] focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto pt-6 pb-8 px-4 space-y-6 custom-scrollbar">
              {/* MANAGEMENT section */}
              <div>
                <p className="px-3 mb-3 text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: '#8b5a3c' }}>Management</p>
                <div className="space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="group flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 relative overflow-hidden"
                        style={isActive ? {
                          background: '#8b5a3c',
                          color: '#FFFFFF',
                          fontWeight: 600
                        } : {
                          color: '#6E6B5E'
                        }}
                      >
                        <div className={`relative z-10 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`}>
                          <Icon className="h-[18px] w-[18px]" />
                        </div>
                        <span className="relative z-10 text-[13px] tracking-wide">{item.name}</span>
                        {isActive && (
                          <ChevronRight className="ml-auto h-4 w-4 relative z-10" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* OTHER section */}
              <div>
                <p className="px-3 mb-3 text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: '#8b5a3c' }}>Other</p>
                <div className="space-y-1">
                  {infoLinks.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="group flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300"
                        style={isActive ? {
                          background: '#8b5a3c',
                          color: '#FFFFFF',
                          fontWeight: 600
                        } : {
                          color: '#6E6B5E'
                        }}
                      >
                        <Icon className="h-[18px] w-[18px]" />
                        <span className="text-[13px] tracking-wide">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>

            {/* User Profile Card (Bottom) */}
            <div className="p-4 bg-[#FDFBF7]" style={{ borderTop: '1px solid rgba(139,90,60,0.15)' }}>
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(139,90,60,0.05)', border: '1px solid rgba(139,90,60,0.15)' }}>
                    <div className="w-8 h-8 rounded-lg flex-shrink-0 border border-[#d4b896] overflow-hidden bg-[#8b5a3c]">
                      <img
                        src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(getDisplayName())}&background=8b5a3c&color=fff&size=64`}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate" style={{ color: '#1E2430' }}>{getDisplayName()}</p>
                      <p className="text-[10px] truncate" style={{ color: '#6E6B5E' }}>Customer</p>
                    </div>
                    <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} title="Logout">
                      <LogOut className="h-4 w-4 text-red-500 opacity-70 hover:opacity-100 transition" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 px-1">
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center gap-1">
                      <div className="p-2 rounded-lg bg-white border border-[#e6dcd0] text-[#8b5a3c] transition-colors hover:bg-[#8b5a3c] hover:text-white">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="text-[9px] font-bold text-[#6E6B5E]">Profile</span>
                    </Link>
                    <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center gap-1">
                      <div className="p-2 rounded-lg bg-white border border-[#e6dcd0] text-[#8b5a3c] transition-colors hover:bg-[#8b5a3c] hover:text-white">
                        <Heart className="h-4 w-4" />
                      </div>
                      <span className="text-[9px] font-bold text-[#6E6B5E]">Wishlist</span>
                    </Link>
                    <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center gap-1">
                      <div className="p-2 rounded-lg bg-white border border-[#e6dcd0] text-[#8b5a3c] transition-colors hover:bg-[#8b5a3c] hover:text-white relative">
                        <ShoppingCart className="h-4 w-4" />
                        {cartCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[7px] text-white flex items-center justify-center font-bold">{cartCount}</span>}
                      </div>
                      <span className="text-[9px] font-bold text-[#6E6B5E]">Cart</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg transition-all hover:opacity-90 active:scale-95"
                  style={{ background: '#8b5a3c' }}
                >
                  <User className="h-4 w-4" />
                  Sign In to Account
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
