"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2, CheckCircle, AlertCircle, LogIn } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

interface ReviewFormProps {
  doctorId: string;
  doctorName: string;
}

export default function ReviewForm({ doctorId, doctorName }: ReviewFormProps) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center mt-6">
        <LogIn className="h-8 w-8 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600 mb-3">
          Log in to leave a review for {doctorName}
        </p>
        <Link href="/auth/login" className="btn-primary text-sm">
          Log In
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-green-50 rounded-xl p-6 text-center mt-6">
        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-3" />
        <p className="font-semibold text-green-800">
          Thank you for your review!
        </p>
        <p className="text-sm text-green-600 mt-1">
          Your review for {doctorName} has been submitted successfully.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_id: doctorId,
          patient_id: user.id,
          patient_name: profile?.full_name || "Anonymous",
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to submit review");
        return;
      }

      setSuccess(true);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mt-6">
      <h4 className="font-bold text-gray-900 mb-4">Write a Review</h4>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-200 fill-gray-200"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="text-sm text-gray-500 ml-2">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Review{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-400 resize-none"
          placeholder="Share your experience..."
        />
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          Posting as {profile?.full_name || user.email}
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary text-sm flex items-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </button>
      </div>
    </form>
  );
}