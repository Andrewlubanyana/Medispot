"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Users,
  Loader2,
  CheckCircle,
  XCircle,
  BadgeCheck,
  Star,
  MapPin,
  Eye,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface AdminDoctor {
  id: string;
  title: string;
  full_name: string;
  specialty: string;
  area: string;
  city: string;
  practice_name: string | null;
  email: string | null;
  phone: string | null;
  is_approved: boolean;
  is_premium: boolean;
  is_verified: boolean;
  created_at: string;
}

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<AdminDoctor[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, [filter]);

  const fetchDoctors = async () => {
    setLoading(true);

    let query = supabase
      .from("doctors")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter === "pending") {
      query = query.eq("is_approved", false);
    } else if (filter === "approved") {
      query = query.eq("is_approved", true);
    } else if (filter === "premium") {
      query = query.eq("is_premium", true);
    }

    const { data } = await query;
    setDoctors((data || []) as AdminDoctor[]);
    setLoading(false);
  };

  const updateDoctor = async (
    doctorId: string,
    updates: Partial<AdminDoctor>
  ) => {
    setActionLoading(doctorId);
    await supabase
      .from("doctors")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", doctorId);
    await fetchDoctors();
    setActionLoading(null);
  };

  const deleteDoctor = async (doctorId: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to permanently delete ${name}? This will also delete all their bookings, services, and reviews.`
      )
    )
      return;

    setActionLoading(doctorId);

    // Delete related records first
    await supabase.from("reviews").delete().eq("doctor_id", doctorId);
    await supabase.from("bookings").delete().eq("doctor_id", doctorId);
    await supabase.from("services").delete().eq("doctor_id", doctorId);
    await supabase.from("availability").delete().eq("doctor_id", doctorId);
    await supabase.from("doctors").delete().eq("id", doctorId);

    await fetchDoctors();
    setActionLoading(null);
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Manage Doctors
      </h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "approved", label: "Approved" },
          { key: "premium", label: "Premium" },
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
      ) : doctors.length === 0 ? (
        <div className="card p-8 text-center">
          <Users className="h-10 w-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">No doctors found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className={`card p-5 ${
                !doctor.is_approved ? "border-l-4 border-l-amber-400" : ""
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Doctor info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900">
                      {doctor.title} {doctor.full_name}
                    </h3>
                    {!doctor.is_approved && (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        <Clock className="h-3 w-3" />
                        Pending
                      </span>
                    )}
                    {doctor.is_verified && (
                      <BadgeCheck className="h-4 w-4 text-teal-600" />
                    )}
                    {doctor.is_premium && (
                      <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                        ⭐ Premium
                      </span>
                    )}
                  </div>
                  <p className="text-teal-600 text-sm font-medium mt-0.5">
                    {doctor.specialty}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {doctor.area}, {doctor.city}
                    </span>
                    {doctor.email && <span>{doctor.email}</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Joined{" "}
                    {new Date(doctor.created_at).toLocaleDateString("en-ZA", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  {actionLoading === doctor.id ? (
                    <Loader2 className="h-5 w-5 text-teal-600 animate-spin" />
                  ) : (
                    <>
                      <Link
                        href={`/doctors/${doctor.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>

                      {!doctor.is_approved ? (
                        <button
                          onClick={() =>
                            updateDoctor(doctor.id, { is_approved: true })
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            updateDoctor(doctor.id, { is_approved: false })
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors"
                        >
                          <XCircle className="h-4 w-4" />
                          Unapprove
                        </button>
                      )}

                      <button
                        onClick={() =>
                          updateDoctor(doctor.id, {
                            is_verified: !doctor.is_verified,
                          })
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          doctor.is_verified
                            ? "bg-teal-50 text-teal-700 hover:bg-teal-100"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <BadgeCheck className="h-4 w-4" />
                        {doctor.is_verified ? "Verified" : "Verify"}
                      </button>

                      <button
                        onClick={() =>
                          updateDoctor(doctor.id, {
                            is_premium: !doctor.is_premium,
                          })
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          doctor.is_premium
                            ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Star className="h-4 w-4" />
                        {doctor.is_premium ? "Premium" : "Set Premium"}
                      </button>

                      <button
                        onClick={() =>
                          deleteDoctor(
                            doctor.id,
                            `${doctor.title} ${doctor.full_name}`
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}