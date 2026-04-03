import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { slugToName } from "@/lib/constants";
import type { Doctor, DoctorWithRating } from "@/lib/types";
import DoctorCard from "@/components/DoctorCard";
import SearchFilters from "@/components/SearchFilters";
import { Stethoscope, SearchX } from "lucide-react";
import Link from "next/link";

// This tells Next.js the page content depends on URL search params
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    specialty?: string;
    area?: string;
  }>;
}

function computeRating(doctor: Doctor): DoctorWithRating {
  const reviews = doctor.reviews || [];
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10
        ) / 10
      : 0;

  return { ...doctor, averageRating, totalReviews };
}

async function getDoctors(params: {
  search?: string;
  specialty?: string;
  area?: string;
}): Promise<DoctorWithRating[]> {
  let query = supabase
    .from("doctors")
    .select("*, reviews(*)")
    .order("is_premium", { ascending: false })
    .order("full_name", { ascending: true });

  // Apply search filter
  if (params.search) {
    const term = `%${params.search}%`;
    query = query.or(
      `full_name.ilike.${term},specialty.ilike.${term},practice_name.ilike.${term}`
    );
  }

  // Apply specialty filter
  if (params.specialty) {
    const specialtyName = slugToName(params.specialty);
    if (specialtyName) {
      query = query.eq("specialty", specialtyName);
    }
  }

  // Apply area filter
  if (params.area) {
    query = query.eq("area", params.area);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }

  return (data as Doctor[]).map(computeRating);
}

export default async function DoctorsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const doctors = await getDoctors(params);

  const hasFilters = params.search || params.specialty || params.area;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-teal-50 rounded-xl p-2">
              <Stethoscope className="h-6 w-6 text-teal-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Find Doctors
            </h1>
          </div>
          <p className="text-gray-600">
            Browse trusted healthcare professionals across Durban and the South
            Coast
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <Suspense fallback={null}>
          <SearchFilters />
        </Suspense>

        {/* Results count */}
        <div className="mt-6 mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {doctors.length === 0 ? (
              "No doctors found"
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {doctors.length}
                </span>{" "}
                {doctors.length === 1 ? "doctor" : "doctors"}
                {hasFilters && " matching your search"}
              </>
            )}
          </p>
        </div>

        {/* Doctor grid */}
        {doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-6">
              <SearchX className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {hasFilters
                ? "Try adjusting your filters or search terms to find what you're looking for."
                : "There are no doctors listed yet. Check back soon!"}
            </p>
            {hasFilters && (
              <Link
                href="/doctors"
                className="btn-primary inline-flex items-center gap-2"
              >
                Clear all filters
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}