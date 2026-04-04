import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  BadgeCheck,
  Star,
  ArrowLeft,
  Stethoscope,
  GraduationCap,
  Building2,
  CalendarCheck,
  ChevronRight,
} from "lucide-react";
import StarRating from "@/components/StarRating";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";
import AvailabilityTable from "@/components/AvailabilityTable";
import DoctorMap from "@/components/DoctorMap";
import type { Doctor, Service, Review } from "@/lib/types";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getDoctor(id: string) {
  const { data: doctor, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !doctor) return null;

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("doctor_id", id)
    .order("name");

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("doctor_id", id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  const { data: availability } = await supabase
    .from("availability")
    .select("*")
    .eq("doctor_id", id)
    .eq("is_active", true)
    .order("day_of_week");

  return {
    doctor: doctor as Doctor,
    services: (services || []) as Service[],
    reviews: (reviews || []) as Review[],
    availability: availability || [],
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getDoctor(id);

  if (!data) {
    return { title: "Doctor Not Found — MediSpot" };
  }

  const { doctor } = data;

  return {
    title: `${doctor.title} ${doctor.full_name} — ${doctor.specialty} | MediSpot`,
    description: `Book an appointment with ${doctor.title} ${doctor.full_name}, ${doctor.specialty} in ${doctor.area}, ${doctor.city}. ${doctor.bio?.slice(0, 120) || ""}`,
  };
}

export default async function DoctorProfilePage({ params }: PageProps) {
  const { id } = await params;
  const data = await getDoctor(id);

  if (!data) {
    notFound();
  }

  const { doctor, services, reviews, availability } = data;

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10
        ) / 10
      : 0;

  const initials = doctor.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Back navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all doctors
          </Link>
        </div>
      </div>

      {/* ====== DOCTOR HEADER ====== */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {doctor.photo_url ? (
                <img
                  src={doctor.photo_url}
                  alt={doctor.full_name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                  <span className="text-white font-bold text-3xl md:text-4xl">
                    {initials}
                  </span>
                </div>
              )}
              {doctor.is_verified && (
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm">
                  <BadgeCheck className="h-6 w-6 text-teal-600 fill-teal-50" />
                </div>
              )}
            </div>

            {/* Doctor info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {doctor.title} {doctor.full_name}
                </h1>
                {doctor.is_premium && (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full w-fit">
                    ⭐ Featured
                  </span>
                )}
              </div>

              <p className="text-teal-600 font-semibold text-lg mt-1">
                {doctor.specialty}
              </p>

              <div className="mt-2">
                <StarRating
                  rating={averageRating}
                  totalReviews={totalReviews}
                  size="lg"
                />
              </div>

              {/* Quick details */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                {doctor.practice_name && (
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    {doctor.practice_name}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {doctor.area}, {doctor.city}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gray-400" />
                  {doctor.slot_duration} min appointments
                </div>
              </div>

              {/* CTA buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/doctors/${doctor.id}/book`}
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  <CalendarCheck className="h-5 w-5" />
                  Book Appointment
                </Link>
                {doctor.phone && (
                  <a
                    href={`tel:${doctor.phone}`}
                    className="btn-secondary inline-flex items-center justify-center gap-2"
                  >
                    <Phone className="h-5 w-5" />
                    Call Practice
                  </a>
                )}
              </div>
            </div>

            {/* Consultation fee card */}
            {doctor.consultation_fee && (
              <div className="card p-5 text-center md:min-w-[180px]">
                <p className="text-sm text-gray-500 mb-1">Consultation Fee</p>
                <p className="text-3xl font-bold text-gray-900">
                  R{doctor.consultation_fee.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">per visit</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ====== MAIN CONTENT ====== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column (2/3 width on desktop) */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            {doctor.bio && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-teal-600" />
                  About {doctor.title} {doctor.full_name}
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {doctor.bio}
                </p>
              </div>
            )}

            {/* Qualifications */}
            {doctor.qualifications && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-teal-600" />
                  Qualifications
                </h2>
                <div className="flex flex-wrap gap-2">
                  {doctor.qualifications.split(",").map((qual, i) => (
                    <span
                      key={i}
                      className="bg-teal-50 text-teal-700 text-sm font-medium px-3 py-1.5 rounded-full"
                    >
                      {qual.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            {services.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-teal-600" />
                  Services Offered
                </h2>
                <div className="divide-y divide-gray-50">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {service.name}
                        </p>
                        {service.description && (
                          <p className="text-sm text-gray-500 mt-0.5">
                            {service.description}
                          </p>
                        )}
                      </div>
                      {service.price && (
                        <span className="text-teal-600 font-bold whitespace-nowrap ml-4">
                          R{service.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Star className="h-5 w-5 text-teal-600" />
                  Patient Reviews
                </h2>
                {totalReviews > 0 && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {averageRating}
                    </div>
                    <div className="text-xs text-gray-500">
                      {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                    </div>
                  </div>
                )}
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No reviews yet. Be the first to review{" "}
                    {doctor.title} {doctor.full_name}!
                  </p>
                </div>
              )}

              {/* Review Form */}
              <ReviewForm
                doctorId={doctor.id}
                doctorName={`${doctor.title} ${doctor.full_name}`}
              />
            </div>
          </div>

          {/* Right column (1/3 width on desktop) — Sidebar */}
          <div className="space-y-6">
            {/* Book appointment card */}
            <div className="card p-6 border-teal-200 bg-teal-50/30">
              <h3 className="font-bold text-gray-900 text-lg mb-3">
                Book an Appointment
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose a time that works for you and confirm your visit instantly.
              </p>
              <Link
                href={`/doctors/${doctor.id}/book`}
                className="btn-primary w-full inline-flex items-center justify-center gap-2"
              >
                <CalendarCheck className="h-5 w-5" />
                View Available Slots
              </Link>
            </div>

            {/* Availability */}
            {availability.length > 0 && (
              <div className="card p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-teal-600" />
                  Working Hours
                </h3>
                <AvailabilityTable availability={availability} />
              </div>
            )}

            {/* Contact & Location with Google Maps */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4">
                Contact & Location
              </h3>

              {/* Google Map */}
              <div className="mb-4">
                <DoctorMap
                  latitude={doctor.latitude}
                  longitude={doctor.longitude}
                  doctorName={`${doctor.title} ${doctor.full_name}`}
                  practiceAddress={doctor.practice_address}
                />
              </div>

              <div className="space-y-3 mt-4">
                {doctor.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-teal-600 flex-shrink-0" />
                    <a
                      href={`tel:${doctor.phone}`}
                      className="text-sm text-gray-600 hover:text-teal-600 transition-colors"
                    >
                      {doctor.phone}
                    </a>
                  </div>
                )}

                {doctor.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-teal-600 flex-shrink-0" />
                    <a
                      href={`mailto:${doctor.email}`}
                      className="text-sm text-gray-600 hover:text-teal-600 transition-colors break-all"
                    >
                      {doctor.email}
                    </a>
                  </div>
                )}

                {doctor.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-teal-600 flex-shrink-0" />
                    <a
                      href={doctor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-teal-600 transition-colors break-all"
                    >
                      {doctor.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-3">
                Quick Links
              </h3>
              <div className="space-y-2">
                <Link
                  href={`/doctors?specialty=${doctor.specialty.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center justify-between text-sm text-gray-600 hover:text-teal-600 transition-colors py-1.5"
                >
                  <span>More {doctor.specialty}s nearby</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href={`/doctors?area=${doctor.area}`}
                  className="flex items-center justify-between text-sm text-gray-600 hover:text-teal-600 transition-colors py-1.5"
                >
                  <span>All doctors in {doctor.area}</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}