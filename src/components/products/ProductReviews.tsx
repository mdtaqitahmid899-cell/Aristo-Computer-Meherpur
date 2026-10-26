"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquarePlus, CheckCircle2, User, Send } from "lucide-react";
import { ProductReview } from "@/types/order";
import { getProductReviews, addProductReview } from "@/services/orderService";

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export default function ProductReviews({
  productId,
  productName,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [userName, setUserName] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadReviews() {
      setLoading(true);
      try {
        const data = await getProductReviews(productId);
        if (isMounted) setReviews(data);
      } catch (err) {
        console.error("Error loading reviews:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadReviews();
    return () => {
      isMounted = false;
    };
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      const newReview = await addProductReview({
        productId,
        userName: userName.trim(),
        rating,
        title: title.trim() || "Genuine Product Experience",
        comment: comment.trim(),
      });

      setReviews((prev) => [newReview, ...prev]);
      setSubmitted(true);
      setUserName("");
      setTitle("");
      setComment("");
      setRating(5);
      setTimeout(() => {
        setSubmitted(false);
        setIsFormOpen(false);
      }, 2500);
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "5.0";

  return (
    <div className="space-y-6">
      {/* Reviews Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
            {averageRating}
          </div>
          <div>
            <div className="flex items-center gap-1 text-amber-500 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(Number(averageRating))
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300 dark:text-slate-700"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Based on {reviews.length} customer {reviews.length === 1 ? "review" : "reviews"} in Meherpur
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Review Submission Form Modal / Drawer */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-blue-200 dark:border-blue-900/50 shadow-md space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Reviewing: {productName}
            </h4>
            <span className="text-[11px] text-slate-400">Share your genuine feedback</span>
          </div>

          {submitted ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-center space-y-2 text-emerald-800 dark:text-emerald-300 text-xs">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <p className="font-bold">Thank you for your review!</p>
              <p>Your feedback has been saved.</p>
            </div>
          ) : (
            <>
              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Overall Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoverRating || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 dark:text-slate-700"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {rating} out of 5 Stars
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Name / Location <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asif Mahmud (Meherpur Sadar)"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Excellent build quality and genuine warranty!"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Detailed Review <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share your experience regarding performance, warranty, temperatures, delivery speed, and customer care..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Publishing..." : "Submit Review"}</span>
                </button>
              </div>
            </>
          )}
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading customer reviews...</div>
      ) : reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2.5"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-xs">{rev.userName}</span>
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200 dark:text-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {rev.title && (
                <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">{rev.title}</h5>
              )}

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          No reviews yet. Be the first customer in Meherpur to review this hardware!
        </div>
      )}
    </div>
  );
}
