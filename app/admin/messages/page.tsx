"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, User, Box, Calendar, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WatchlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  products: {
    name: string;
    image_url: string | null;
  };
}

export default function AdminWatchlistPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<WatchlistItem[]>([]);

  const fetchAllWatchlists = async () => {
    try {
      const response = await fetch("/api/admin/watchlist", {
        headers: { "x-admin-auth": "true" },
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth");
    if (!isAuth) {
      router.push("/admin/login");
      return;
    }
    fetchAllWatchlists();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffaf3] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#8b5a3c]" />
      </div>
    );
  }

  // Group by user_id for better visualization
  const groupedByUser = items.reduce((acc: Record<string, WatchlistItem[]>, item) => {
    if (!acc[item.user_id]) acc[item.user_id] = [];
    acc[item.user_id].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#fffaf3] pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-serif text-4xl font-bold text-[#2b1a12] mb-2">Customer Watchlists</h1>
            <p className="text-[#9b7b65] font-medium">See which maps are capturing your customers' hearts.</p>
          </div>
          <div className="bg-white border border-[#e6dcd0] rounded-2xl px-8 py-4 shadow-sm text-center">
             <span className="block text-3xl font-black text-[#8b5a3c]">{items.length}</span>
             <span className="text-[10px] uppercase font-bold text-[#9b7b65] tracking-[0.2em]">Total Saved Maps</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-[#e6dcd0] rounded-3xl p-20 text-center">
            <Heart className="w-16 h-16 text-[#e6dcd0] mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[#2b1a12] mb-2">No activity yet</h2>
            <p className="text-[#9b7b65]">Customer selection trends will appear here once they start saving maps.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedByUser).map(([userId, userItems]) => (
              <div key={userId} className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-[#8b5a3c] flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-bold text-[#2b1a12] text-sm">User ID: <span className="text-[#8b5a3c] font-mono">{userId.slice(0, 8)}...</span></h3>
                    <div className="h-px flex-1 bg-[#e6dcd0]" />
                    <span className="text-xs font-bold text-[#9b7b65] uppercase tracking-wider">{userItems.length} Items</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userItems.map((item) => (
                        <div key={item.id} className="bg-white border border-[#e6dcd0] rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all group">
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#f3ebe2] border border-[#f3ebe2] shrink-0">
                                <img 
                                    src={item.products?.image_url || "/placeholder.svg"} 
                                    alt={item.products?.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-[#2b1a12] text-sm truncate">{item.products?.name}</h4>
                                <div className="flex items-center gap-1.5 text-[10px] text-[#9b7b65] mt-1">
                                    <Calendar className="w-3 h-3 text-[#8b5a3c]" />
                                    <span>Saved {new Date(item.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
