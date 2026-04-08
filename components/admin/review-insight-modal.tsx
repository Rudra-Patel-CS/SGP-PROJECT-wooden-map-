"use client";

import { useEffect, useState } from "react";
import { Star, MessageCircle, X, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface Review {
  id: string;
  rating: number;
  comment: string;
  user_name: string;
  created_at: string;
}

interface ReviewInsightModalProps {
  product: {
    id: string;
    name: string;
    image_url: string | null;
    rating: number;
    reviews_count: number;
  };
  onClose: () => void;
}

export function ReviewInsightModal({ product, onClose }: ReviewInsightModalProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`/api/products/${product.id}/reviews`, {
          headers: { 'x-admin-auth': 'true' }
        });
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [product.id]);

  // Calculate rating distribution and summary stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews 
    : 0;

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, count, percentage };
  });

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in fade-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e6dcd0] bg-[#fffaf3]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white border border-[#e6dcd0] overflow-hidden flex items-center justify-center shadow-sm">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                    <Star className="w-6 h-6 text-[#8b5a3c]" />
                )}
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-[#2b1a12]">{product.name}</h2>
              <p className="text-sm text-[#9b7b65]">Customer Feedback Insights</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-[#f3ebe2]">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="p-6 md:p-8 space-y-10">
            {/* Visual Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#fdf8f2] p-8 rounded-3xl border border-[#e6dcd0]">
              <div className="text-center md:text-left">
                <div className="text-5xl font-black text-[#2b1a12] mb-2">{averageRating.toFixed(1)}</div>
                <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= Math.round(averageRating) ? "fill-[#8b5a3c] text-[#8b5a3c]" : "text-[#e6dcd0]"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[#9b7b65] font-bold text-sm uppercase tracking-widest">
                  Based on {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
                </p>
              </div>

              <div className="space-y-3">
                {distribution.map((item) => (
                  <div key={item.star} className="flex items-center gap-4 group">
                    <div className="flex items-center gap-1 w-8">
                       <span className="text-xs font-bold text-[#2b1a12]">{item.star}</span>
                       <Star className="w-3 h-3 fill-[#8b5a3c] text-[#8b5a3c]" />
                    </div>
                    <div className="flex-1 h-3 bg-white border border-[#e6dcd0] rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-[#d4b896] to-[#8b5a3c] transition-all duration-1000 ease-out"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-[#9b7b65] w-8 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Reviews */}
            <div className="space-y-6">
              <h3 className="font-bold text-[#2b1a12] uppercase tracking-wider text-sm flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#8b5a3c]" /> Latest Reviews
              </h3>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-[#8b5a3c]">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <p className="text-sm font-bold">Fetching details...</p>
                </div>
              ) : reviews.length === 0 ? (
                 <div className="text-center py-12 bg-white border-2 border-dashed border-[#e6dcd0] rounded-2xl">
                    <p className="text-[#9b7b65] font-medium italic">No written reviews yet for this masterpiece.</p>
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-5 border border-[#f3ebe2] rounded-2xl bg-white shadow-sm hover:shadow-md transition-all group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-[#f3ebe2] flex items-center justify-center">
                              <User className="w-4 h-4 text-[#8b5a3c]" />
                           </div>
                           <div>
                              <div className="text-xs font-bold text-[#2b1a12]">{review.user_name}</div>
                              <div className="text-[10px] text-[#9b7b65] font-medium">{formatDistanceToNow(new Date(review.created_at))} ago</div>
                           </div>
                        </div>
                        <div className="flex gap-0.5">
                           {[1, 2, 3, 4, 5].map((s) => (
                             <Star key={s} className={`w-2.5 h-2.5 ${s <= review.rating ? "fill-[#8b5a3c] text-[#8b5a3c]" : "text-[#e6dcd0]"}`} />
                           ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#5a3726] leading-relaxed italic border-l-2 border-[#8b5a3c]/30 pl-3">
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 bg-[#f7f1e8] border-t border-[#e6dcd0] flex justify-end">
          <Button onClick={onClose} className="bg-[#8b5a3c] hover:bg-[#5a3726] text-white rounded-xl px-8 shadow-md">
            Close Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}
