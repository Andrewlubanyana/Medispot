"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Star,
  Loader2,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

interface AdminReview {
  id: string;
  patient_name: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
  doctors: {
    title: string;
    full_name: string;
    specialty: string;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    setLoading(true);

    let query = supabase
      .from("reviews")
      .select("*, doctors(title, full_name, specialty)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (filter === "approved") {
      query = query.eq("is_approved", true);
    } else if (filter === "hidden") {
      query = query.eq("is_approved", false);
    }

    const { data } = await query;
    setReviews((data || []) as AdminReview[]);
    setLoading(false);
  };

  const toggleApproval = async (id: string, currentlyApproved: boolean) => {
    await supabase
      .from("reviews")
      .update({ is_approved: !currentlyApproved })
      .eq("id", id);
    await fetchReviews();
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this review?"))
      return;
    await supabase.from("reviews").delete().eq("id", id);
    await fetchReviews();
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Moderate Reviews
      </h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: "all", label: "All" },
          { key: "approved", label: "Approved" },
          { key: "hidden", label: "Hidden" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key
                ? "bg-teal-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="card p-8 text-center">
          <Star className="h-10 w-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">No reviews found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`card p-4 ${
                !review.is_approved ? "opacity-60 border-l-4 border-l-red-300" : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900">
                      {review.patient_name}
                    </p>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3.5 w-3.5 ${
                            star <= review.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-200 fill-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    {!review.is_approved && (
                      <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-teal-600">
                    For: {review.doctors?.title} {review.doctors?.full_name} ·{" "}
                    {review.doctors?.specialty}
                  </p>
                  {review.comment && (
                    <p className="text-sm text-gray-700 mt-2 bg-gray-50 rounded-lg p-3">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(review.created_at).toLocaleDateString("en-ZA", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() =>
                      toggleApproval(review.id, review.is_approved)
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      review.is_approved
                        ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    {review.is_approved ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}