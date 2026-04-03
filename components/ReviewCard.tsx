import { Star } from "lucide-react";
import type { Review } from "@/lib/types";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const date = new Date(review.created_at);
  const formattedDate = date.toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          {/* Patient avatar */}
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-500">
              {review.patient_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {review.patient_name}
            </p>
            <p className="text-xs text-gray-400">{formattedDate}</p>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center">
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
      </div>

      {review.comment && (
        <p className="text-gray-700 text-sm leading-relaxed pl-12">
          {review.comment}
        </p>
      )}
    </div>
  );
}