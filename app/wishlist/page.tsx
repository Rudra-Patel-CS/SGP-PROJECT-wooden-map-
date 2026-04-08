"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight, Loader2, Trash2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib_supabase/supabase/client";

interface WishlistItem {
  product_id: string;
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    category: string;
  };
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) setLoading(false);
    });
  }, []);

  const fetchWishlist = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/watchlist?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user, fetchWishlist]);

  const removeItem = async (productId: string) => {
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, user_id: user.id }),
      });
      if (res.ok) {
        setItems(prev => prev.filter(item => item.product_id !== productId));
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffaf3] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#8b5a3c]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf3]">
      <Header />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            </div>
            <div>
                <h1 className="text-3xl font-serif font-bold text-[#2b1a12]">My Wishlist</h1>
                <p className="text-[#9b7b65] font-medium">Your collection of favorite masterpieces.</p>
            </div>
        </div>

        {!user ? (
            <div className="bg-white border border-[#e6dcd0] rounded-3xl p-16 text-center shadow-sm">
                <ShoppingBag className="w-16 h-16 text-[#e6dcd0] mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-[#2b1a12] mb-4">Sign in to save favorites</h2>
                <p className="text-[#9b7b65] mb-8 max-w-md mx-auto">Keep track of the maps you love across all your devices.</p>
                <Link href="/login?redirect=/wishlist">
                    <Button className="bg-[#8b5a3c] hover:bg-[#5a3726] text-white px-10 py-6 rounded-xl font-bold">
                        Sign In Now
                    </Button>
                </Link>
            </div>
        ) : items.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-[#e6dcd0] rounded-3xl p-20 text-center">
                <div className="w-20 h-20 bg-[#fffaf3] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 text-[#e6dcd0]" />
                </div>
                <h2 className="text-2xl font-bold text-[#2b1a12] mb-2">Your wishlist is empty</h2>
                <p className="text-[#9b7b65] mb-8">Start exploring and save the maps that inspire you.</p>
                <Link href="/shop">
                    <Button variant="outline" className="border-[#8b5a3c] text-[#8b5a3c] hover:bg-[#8b5a3c] hover:text-white group">
                        Explore Shop <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {items.map((item) => (
                    <div key={item.product_id} className="group bg-white rounded-3xl border border-[#e6dcd0] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                        <Link href={`/product/${item.product_id}`} className="block relative aspect-square overflow-hidden bg-[#f3ebe2]">
                            <img 
                                src={item.products.image_url || "/placeholder.svg"} 
                                alt={item.products.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-2">
                                <Link href={`/product/${item.product_id}`} className="flex-1">
                                    <h3 className="font-bold text-[#2b1a12] group-hover:text-[#8b5a3c] transition-colors line-clamp-1">{item.products.name}</h3>
                                    <p className="text-xs font-bold text-[#9b7b65] uppercase tracking-widest">{item.products.category}</p>
                                </Link>
                                <button 
                                    onClick={() => removeItem(item.product_id)}
                                    className="p-2 text-[#e6dcd0] hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                    title="Remove"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-xl font-black text-[#2b1a12]">₹{item.products.price.toLocaleString()}</span>
                                <Link href={`/product/${item.product_id}`}>
                                    <Button size="sm" className="bg-[#8b5a3c] hover:bg-[#5a3726] text-white rounded-lg">
                                        View Map
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
