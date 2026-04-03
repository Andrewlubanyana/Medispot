import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BookingFlow from "@/components/BookingFlow";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getDoctorForBooking(id: string) {
  const { data: doctor, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !doctor) return null;

  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("doctor_id", id)
    .eq("is_approved", true);

  const totalReviews = reviews?.length || 0;
  const averageRating =
    totalReviews > 0
      ? Math.round(
          (reviews!.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10
        ) / 10
      : 0;

  return {
    id: doctor.id,
    title: doctor.title,
    full_name: doctor.full_name,
    specialty: doctor.specialty,
    practice_name: doctor.practice_name,
    practice_address: doctor.practice_address,
    area: doctor.area,
    city: doctor.city,
    consultation_fee: doctor.consultation_fee,
    slot_duration: doctor.slot_duration,
    photo_url: doctor.photo_url,
    averageRating,
    totalReviews,
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const doctor = await getDoctorForBooking(id);

  if (!doctor) {
    return { title: "Book Appointment — MediSpot" };
  }

  return {
    title: `Book Appointment with ${doctor.title} ${doctor.full_name} | MediSpot`,
    description: `Book your appointment with ${doctor.title} ${doctor.full_name}, ${doctor.specialty} in ${doctor.area}, ${doctor.city}. Choose a time and confirm instantly.`,
  };
}

export default async function BookingPage({ params }: PageProps) {
  const { id } = await params;
  const doctor = await getDoctorForBooking(id);

  if (!doctor) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Back navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href={`/doctors/${doctor.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {doctor.title} {doctor.full_name}
          </Link>
        </div>
      </div>

      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Book Your Appointment
          </h1>
          <p className="text-gray-600 mt-1">
            Choose a date and time that works for you
          </p>
        </div>
      </div>

      {/* Booking flow */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookingFlow doctor={doctor} />
      </div>
    </div>
  );
}