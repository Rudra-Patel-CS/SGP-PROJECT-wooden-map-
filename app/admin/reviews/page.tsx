"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, MessageCircle, Trash2, Box, ChevronRight, ChevronDown, User, Calendar, Loader2 } from "lucide-react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  products?: {
    name: string;
    image_url: string | null;
  };
}

interface GroupedReviews {
  [productId: string]: {
    productName: string;
    productImage: string | null;
    reviews: Review[];
    avgRating: number;
  };
}

export default function AdminReviewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reviews, setGroupedReviews] = useState<GroupedReviews>({});
  const [expandedProducts, setExpandedProducts] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews", {
        headers: { "x-admin-auth": "true" },
      });

      if (!response.ok) throw new Error("Failed to fetch reviews");

      const data: Review[] = await response.json();
      setTotalCount(data.length);

      // Group by product
      const grouped = data.reduce((acc: GroupedReviews, review) => {
        const pId = review.product_id;
        if (!acc[pId]) {
          acc[pId] = {
            productName: review.products?.name || "Unknown Product",
            productImage: review.products?.image_url || null,
            reviews: [],
            avgRating: 0,
          };
        }
        acc[pId].reviews.push(review);
        return acc;
      }, {});

      // Calculate averages
      Object.keys(grouped).forEach((pId) => {
        const sum = grouped[pId].reviews.reduce((s, r) => s + r.rating, 0);
        grouped[pId].avgRating = sum / grouped[pId].reviews.length;
      });

      setGroupedReviews(grouped);
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
    fetchReviews();
  }, [router]);

  const toggleProduct = (pId: string) => {
    setExpandedProducts((prev) =>
      prev.includes(pId) ? prev.filter((id) => id !== pId) : [...prev, pId]
    );
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    alert("Delete functionality requires a service role DELETE endpoint. Review hidden locally for now.");
    // Locally remove
    const newGrouped = { ...reviews };
    Object.keys(newGrouped).forEach(pId => {
        newGrouped[pId].reviews = newGrouped[pId].reviews.filter(r => r.id !== reviewId);
    });
    setGroupedReviews(newGrouped);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffaf3] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#8b5a3c]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf3] pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-serif text-4xl font-bold text-[#2b1a12] mb-2">Customer Feedback</h1>
            <p className="text-[#9b7b65] font-medium">Manage and monitor product ratings across your store.</p>
          </div>
          <div className="bg-white border border-[#e6dcd0] rounded-2xl px-6 py-3 shadow-sm flex items-center gap-4">
             <div className="text-center border-r border-[#e6dcd0] pr-4">
                <span className="block text-2xl font-bold text-[#8b5a3c]">{totalCount}</span>
                <span className="text-[10px] uppercase font-bold text-[#9b7b65] tracking-widest">Reviews</span>
             </div>
             <div className="text-center">
                <span className="block text-2xl font-bold text-[#2b1a12]">{Object.keys(reviews).length}</span>
                <span className="text-[10px] uppercase font-bold text-[#9b7b65] tracking-widest">Products</span>
             </div>
          </div>
        </div>

        {totalCount === 0 ? (
          <div className="bg-white border-2 border-dashed border-[#e6dcd0] rounded-3xl p-20 text-center">
            <MessageCircle className="w-16 h-16 text-[#e6dcd0] mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[#2b1a12] mb-2">No reviews found</h2>
            <p className="text-[#9b7b65]">Customer feedback will appear here once they start rating your maps.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(reviews).map(([pId, data]) => (
              <div key={pId} className="bg-white border border-[#e6dcd0] rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
                {/* Product Header */}
                <button
                  onClick={() => toggleProduct(pId)}
                  className="w-full flex items-center justify-between p-6 hover:bg-[#fffaf3] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#f3ebe2] rounded-xl flex items-center justify-center overflow-hidden border border-[#e6dcd0]">
                      {data.productImage ? (
                         <img src={data.productImage} alt={data.productName} className="w-full h-full object-cover" />
                      ) : (
                        <Box className="w-6 h-6 text-[#8b5a3c]" />
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-[#2b1a12] text-lg">{data.productName}</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= Math.round(data.avgRating)
                                  ? "fill-[#8b5a3c] text-[#8b5a3c]"
                                  : "text-[#e6dcd0]"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-[#9b7b65]">
                          {data.avgRating.toFixed(1)} avg ({data.reviews.length} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  {expandedProducts.includes(pId) ? <ChevronDown /> : <ChevronRight />}
                </button>

                {/* Reviews List */}
                {expandedProducts.includes(pId) && (
                  <div className="border-t border-[#e6dcd0] bg-[#fffaf3]/30 animate-in slide-in-from-top-2 duration-300">
                    <div className="p-2 space-y-2">
                      {data.reviews.map((review) => (
                        <div key={review.id} className="bg-white border border-[#f3ebe2] rounded-xl p-5 shadow-sm">
                          <div className="flex items-start justify-between">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#8b5a3c] flex items-center justify-center">
                                   <User className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#2b1a12] text-sm">{review.user_name}</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star key={star} className={`w-2.5 h-2.5 ${star <= review.rating ? "fill-[#8b5a3c] text-[#8b5a3c]" : "text-[#e6dcd0]"}`} />
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-[#9b7b65] font-medium uppercase tracking-tight">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                              </div>
                              <p className="text-[#5a3726] text-sm leading-relaxed italic border-l-2 border-[#8b5a3c]/20 pl-4">
                                "{review.comment}"
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteReview(review.id)}
                              className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 text-center">
                         <span className="text-xs font-bold text-[#9b7b65] uppercase tracking-widest">End of results</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      }
      </div>
    </div>
  );
}
