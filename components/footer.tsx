"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { useSettings } from "@/components/settings-context";

export function Footer() {
  const { settings } = useSettings();
  const footerLinks = {
    shop: [
      { name: "World Map", href: "/shop?category=world" },
      { name: "Country Map", href: "/shop?category=country" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Story", href: "/about#story" },
      { name: "Blogs", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],
    support: [
      { name: "FAQs", href: "/faq" },
      { name: "Shipping", href: "/shipping" },
      { name: "Returns", href: "/returns" },
      { name: "Installation Guide", href: "/installation" },
    ],
  };

  return (
    <footer className="bg-[#4a2c14] text-[#f5efe6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-14">
          {/* BRAND */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <img
                src="/aryam-maps-logo.png"
                alt="Aryam Maps Logo"
                className="w-9 h-9 rounded-md object-cover"
              />

              <span className="font-serif text-xl tracking-tight">{settings.store_name}</span>
            </Link>

            <p className="text-[#f5efe6]/80 max-w-sm leading-relaxed text-sm mb-4">
              Handcrafted wooden maps that bring {settings.store_name}&apos;s artisan craftsmanship into
              your home. Each piece is made with sustainably sourced wood and
              artisan craftsmanship.
            </p>

            <p className="text-[#f5efe6]/60 text-xs leading-relaxed mb-6">
              📍 Parshwanath Industrial Park, 47, Phase 2, GIDC Chhatral, Chhatral, Gujarat 382729
            </p>

            {/* SOCIALS */}
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <Icon
                  key={i}
                  className="w-5 h-5 text-[#f5efe6]/80 hover:text-white transition cursor-pointer"
                />
              ))}
            </div>
          </div>

          {/* LINKS */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="uppercase tracking-widest text-xs mb-5 text-[#f5efe6]/70">
                {title}
              </h3>

              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="
                        text-sm
                        text-[#f5efe6]/85
                        hover:text-white
                        transition
                      "
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* DIVIDER */}
        <div className="border-t border-[#f5efe6]/20 mt-16 pt-8 text-center">
          <p className="text-sm text-[#f5efe6]/60">
            © {new Date().getFullYear()} {settings.store_name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
