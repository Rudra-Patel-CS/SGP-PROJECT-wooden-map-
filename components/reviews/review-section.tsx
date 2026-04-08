"use client";

import { useEffect, useState } from "react";
import { Star, MessageCircle, User, Loader2 } from "lucide-react";
import { ReviewForm } from "./review-form";
import { formatDistanceToNow } from "date-fns";

interface Review {
  id: string;
  rating: number;
  comment: string;
  user_name: string;
  created_at: string;
}

interface ReviewSectionProps {
  productId: string;
  initialRating: number;
  initialCount: number;
}

export function ReviewSection({ productId, initialRating, initialCount }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(initialRating);
  const [count, setCount] = useState(initialCount);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
        
        // Recalculate average rating for display if needed
        if (data.length > 0) {
          const sum = data.reduce((acc: number, item: Review) => acc + item.rating, 0);
          setRating(sum / data.length);
          setCount(data.length);
        }
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  return (
    <div className="mt-16 pt-16 border-t border-[#e6dcd0]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Rating Summary */}
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-3xl font-bold text-[#2b1a12] mb-4">Customer Reviews</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(rating)
                        ? "fill-[#8b5a3c] text-[#8b5a3c]"
                        : "text-[#e6dcd0]"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xl font-bold text-[#2b1a12]">{rating.toFixed(1)} out of 5</span>
            </div>
            <p className="text-[#5a3726] font-medium">{count === 0 ? "No reviews yet" : `Based on ${count} ${count === 1 ? 'review' : 'reviews'}`}</p>
          </div>

          {!showForm ? (
            <div className="bg-[#fffaf3] border border-[#f3ebe2] rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-[#2b1a12] mb-2 uppercase tracking-wide text-sm">Share your experience</h3>
              <p className="text-sm text-[#5a3726] mb-6 leading-relaxed">Have you purchased this map? Let others know what you thought.</p>
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-white border-2 border-[#8b5a3c] text-[#8b5a3c] hover:bg-[#8b5a3c] hover:text-white py-3 rounded-xl font-bold transition-all duration-300 shadow-sm"
              >
                Write a Review
              </button>
            </div>
          ) : (
             <div className="animate-in slide-in-from-left-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#2b1a12] uppercase tracking-wide text-sm">Write a Review</h3>
                    <button onClick={() => setShowForm(false)} className="text-[#8b5a3c] hover:underline text-xs font-bold uppercase transition">Cancel</button>
                </div>
                <ReviewForm productId={productId} onSuccess={fetchReviews} />
             </div>
          )}
        </div>

        {/* Review List */}
        <div className="lg:col-span-2 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#8b5a3c]">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="font-bold animate-pulse">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-[#e6dcd0] rounded-3xl p-16 text-center">
              <div className="bg-[#f9f5f0] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                 <MessageCircle className="w-8 h-8 text-[#8b5a3c]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#2b1a12] mb-3">Be the first to review!</h3>
              <p className="text-[#5a3726] max-w-md mx-auto leading-relaxed">
                Your thoughts help other map lovers make a choice. Share your experience with this beautiful wooden map.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white border border-[#f3ebe2] rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow group animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#8b5a3c] to-[#5a3726] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#2b1a12]">{review.user_name}</h4>
                        <p className="text-xs text-[#9b7b65] font-medium tracking-tight">
                            Verified Purchase · {formatDistanceToNow(new Date(review.created_at))} ago
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 bg-[#fdf8f2] px-3 py-1.5 rounded-full border border-[#f3ebe2] shadow-sm">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= review.rating
                              ? "fill-[#8b5a3c] text-[#8b5a3c]"
                              : "text-[#e6dcd0]"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[#5a3726] leading-relaxed italic border-l-4 border-[#8b5a3c]/30 pl-6 py-1">
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
