"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Star, MessageSquare, Loader2, Send, CheckCircle } from "lucide-react";

interface Review {
  id: string;
  patient_name: string;
  rating: number;
  comment: string;
  created_at: string;
  doctor_response: string | null;
  response_date: string | null;
}

export default function ReviewsPage() {
  const { doctorRecord } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Reply State
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    if (!doctorRecord?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("doctor_id", doctorRecord.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews((data || []) as Review[]);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [doctorRecord?.id]);

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("reviews")
        .update({
          doctor_response: replyText.trim(),
          response_date: new Date().toISOString(),
        })
        .eq("id", reviewId);

      if (error) throw error;

      // Reset state and refresh
      setReplyingTo(null);
      setReplyText("");
      fetchReviews();
    } catch (err) {
      console.error("Error submitting reply:", err);
      alert("Failed to submit reply. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate Average Rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Patient Reviews</h1>

      {/* Summary Card */}
      <div className="card p-6 mb-8 flex items-center gap-6 bg-teal-50/50 border-teal-100">
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm min-w-[120px]">
          <span className="text-4xl font-bold text-gray-900">{averageRating}</span>
          <div className="flex text-amber-400 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`h-4 w-4 ${star <= parseFloat(averageRating) ? "fill-amber-400" : "text-gray-300"}`} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Overall Rating</h2>
          <p className="text-gray-600">Based on {reviews.length} patient review{reviews.length !== 1 && 's'}</p>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="card p-8 text-center">
          <MessageSquare className="h-10 w-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">You don't have any reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">{review.patient_name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString("en-ZA", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </p>
                </div>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`h-4 w-4 ${star <= review.rating ? "fill-amber-400" : "text-gray-300"}`} />
                  ))}
                </div>
              </div>

              <p className="text-gray-700 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                "{review.comment}"
              </p>

              {/* Doctor Response Section */}
              {review.doctor_response ? (
                <div className="ml-6 pl-4 border-l-2 border-teal-200">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-teal-600" />
                    <span className="font-semibold text-teal-800">Your Response</span>
                    <span className="text-xs text-gray-400 ml-2">
                      {new Date(review.response_date!).toLocaleDateString("en-ZA")}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{review.doctor_response}</p>
                </div>
              ) : replyingTo === review.id ? (
                <div className="ml-6 flex items-end gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-teal-700 mb-1">Draft Response</label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Thank the patient for their feedback..."
                      className="w-full px-4 py-2 rounded-xl border border-teal-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleReply(review.id)}
                      disabled={submitting || !replyText.trim()}
                      className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 transition disabled:opacity-50 flex items-center justify-center h-[38px] w-[38px]"
                    >
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => { setReplyingTo(null); setReplyText(""); }}
                      className="text-xs text-gray-500 hover:text-gray-800 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setReplyingTo(review.id)}
                  className="ml-6 text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1.5"
                >
                  <MessageSquare className="h-4 w-4" />
                  Reply to patient
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
