import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  totalReviews?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export default function StarRating({
  rating,
  totalReviews = 0,
  size = "md",
  showCount = true,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const textClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= Math.round(rating)
                ? "text-amber-400 fill-amber-400"
                : "text-gray-200 fill-gray-200"
            }`}
          />
        ))}
      </div>
      {showCount && (
        <span className={`${textClasses[size]} text-gray-500 ml-1`}>
          {rating > 0 ? rating.toFixed(1) : "New"}{" "}
          {totalReviews > 0 && `(${totalReviews})`}
        </span>
      )}
    </div>
  );
}