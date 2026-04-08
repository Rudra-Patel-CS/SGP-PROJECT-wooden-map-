"use client";

import { useState } from "react";
import { Star, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib_supabase/supabase/client";

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setError("You must be logged in to leave a review");
        setSubmitting(false);
        return;
      }

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          user_id: session.user.id,
          user_name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0],
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit review");
      }

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#fdf8f2] border border-[#e6dcd0] rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-500">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="font-serif text-xl font-bold text-[#2b1a12] mb-2">Thank you!</h3>
        <p className="text-[#5a3726] mb-6">Your review has been submitted successfully.</p>
        <Button 
          variant="outline" 
          onClick={() => { setSubmitted(false); setRating(0); setComment(""); }}
          className="border-[#8b5a3c] text-[#8b5a3c] hover:bg-[#8b5a3c] hover:text-white"
        >
          Submit another review
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border border-[#e6dcd0] shadow-sm">
      <div>
        <label className="block text-sm font-bold text-[#2b1a12] mb-3 uppercase tracking-wider">
          Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hover || rating)
                    ? "fill-[#8b5a3c] text-[#8b5a3c]"
                    : "text-[#e6dcd0]"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-bold text-[#2b1a12] mb-3 uppercase tracking-wider">
          Your Feedback
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
          placeholder="Share your experience with this map..."
          className="min-h-[120px] rounded-xl border-[#e6dcd0] focus:border-[#8b5a3c] focus:ring-[#8b5a3c] resize-none"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm font-medium animate-in slide-in-from-top-1">{error}</p>
      )}

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#8b5a3c] hover:bg-[#5a3726] text-white py-6 rounded-xl font-bold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
      >
        {submitting ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</>
        ) : (
          "Submit Review"
        )}
      </Button>
    </form>
  );
}
