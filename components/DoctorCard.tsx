import Link from "next/link";
import {
  MapPin,
  Clock,
  ShieldCheck,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import StarRating from "./StarRating";
import type { DoctorWithRating } from "@/lib/types";

interface DoctorCardProps {
  doctor: DoctorWithRating;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const initials = doctor.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link href={`/doctors/${doctor.id}`} className="card group block">
      <div className="p-5">
        {/* Top section: Avatar + Info */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {doctor.photo_url ? (
              <img
                src={doctor.photo_url}
                alt={doctor.full_name}
                className="w-16 h-16 rounded-xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{initials}</span>
              </div>
            )}
            {doctor.is_verified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <BadgeCheck className="h-4 w-4 text-teal-600 fill-teal-50" />
              </div>
            )}
          </div>

          {/* Doctor info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 truncate group-hover:text-teal-600 transition-colors">
                {doctor.title} {doctor.full_name}
              </h3>
            </div>
            <p className="text-teal-600 font-medium text-sm mt-0.5">
              {doctor.specialty}
            </p>
            <div className="mt-1">
              <StarRating
                rating={doctor.averageRating}
                totalReviews={doctor.totalReviews}
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Practice info */}
        <div className="mt-4 space-y-2">
          {doctor.practice_name && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ShieldCheck className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{doctor.practice_name}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">
              {doctor.area}, {doctor.city}
            </span>
          </div>
          {doctor.slot_duration && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>{doctor.slot_duration} min appointments</span>
            </div>
          )}
        </div>

        {/* Bottom section: Price + CTA */}
        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
          {doctor.consultation_fee ? (
            <div>
              <span className="text-lg font-bold text-gray-900">
                R{doctor.consultation_fee.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 ml-1">consultation</span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">Contact for pricing</span>
          )}
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 group-hover:gap-2 transition-all">
            View Profile
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>

        {/* Premium badge */}
        {doctor.is_premium && (
          <div className="mt-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg px-3 py-1.5 text-center">
            <span className="text-xs font-semibold text-amber-700">
              ⭐ Featured Practice
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}