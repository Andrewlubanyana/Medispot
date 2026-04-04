"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Star, Loader2 } from "lucide-react";
import Link from "next/link";

interface PatientReview {
  id: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
  doctors: {
    id: string;
    title: string;
    full_name: string;
    specialty: string;
  };
}

export default function PatientReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<PatientReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchReviews = async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*, doctors(id, title, full_name, specialty)")
        .eq("patient_id", user.id)
        .order("created_at", { ascending: false });

      setReviews((data || []) as PatientReview[]);
      setLoading(false);
    };

    fetchReviews();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Reviews</h1>

      {reviews.length === 0 ? (
        <div className="card p-8 text-center">
          <Star className="h-10 w-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">
            You haven&apos;t left any reviews yet
          </p>
          <Link href="/doctors" className="btn-primary text-sm">
            Find Doctors to Review
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/doctors/${review.doctors?.id}`}
                    className="font-semibold text-gray-900 hover:text-teal-600 transition-colors"
                  >
                    {review.doctors?.title} {review.doctors?.full_name}
                  </Link>
                  <p className="text-sm text-teal-600">
                    {review.doctors?.specialty}
                  </p>

                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-200 fill-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  {review.comment && (
                    <p className="text-sm text-gray-700 mt-2">
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

                {!review.is_approved && (
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full font-medium flex-shrink-0">
                    Under review
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}