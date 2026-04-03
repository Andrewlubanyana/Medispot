"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import {
  CalendarDays,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
} from "lucide-react";
import type { Booking } from "@/lib/types";

export default function BookingsPage() {
  const { doctorRecord } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>("upcoming");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!doctorRecord) return;
    fetchBookings();
  }, [doctorRecord, filter]);

  const fetchBookings = async () => {
    if (!doctorRecord) return;
    setLoading(true);

    const today = new Date().toISOString().split("T")[0];

    let query = supabase
      .from("bookings")
      .select("*")
      .eq("doctor_id", doctorRecord.id)
      .order("booking_date", { ascending: filter === "upcoming" })
      .order("booking_time");

    if (filter === "upcoming") {
      query = query.gte("booking_date", today).eq("status", "confirmed");
    } else if (filter === "completed") {
      query = query.eq("status", "completed");
    } else if (filter === "cancelled") {
      query = query.eq("status", "cancelled");
    }

    const { data } = await query.limit(50);
    setBookings((data || []) as Booking[]);
    setLoading(false);
  };

  const updateStatus = async (
    bookingId: string,
    status: "completed" | "cancelled"
  ) => {
    await supabase
      .from("bookings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", bookingId);
    fetchBookings();
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayH = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayH}:${m} ${ampm}`;
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bookings</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "upcoming", label: "Upcoming" },
          { key: "completed", label: "Completed" },
          { key: "cancelled", label: "Cancelled" },
          { key: "all", label: "All" },
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
      ) : bookings.length === 0 ? (
        <div className="card p-8 text-center">
          <CalendarDays className="h-10 w-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">No {filter} bookings found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CalendarDays className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {booking.patient_name}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span>
                      {new Date(
                        booking.booking_date + "T00:00:00"
                      ).toLocaleDateString("en-ZA", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <span>{formatTime(booking.booking_time)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    <a
                      href={`tel:${booking.patient_phone}`}
                      className="text-sm text-gray-500 hover:text-teal-600"
                    >
                      {booking.patient_phone}
                    </a>
                  </div>
                  {booking.notes && (
                    <p className="text-sm text-gray-400 mt-1 italic">
                      &ldquo;{booking.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:flex-shrink-0">
                {booking.status === "confirmed" && (
                  <>
                    <button
                      onClick={() => updateStatus(booking.id, "completed")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Complete
                    </button>
                    <button
                      onClick={() => updateStatus(booking.id, "cancelled")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      Cancel
                    </button>
                  </>
                )}
                {booking.status === "completed" && (
                  <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-3 py-1.5 rounded-lg">
                    <CheckCircle className="h-4 w-4" />
                    Completed
                  </span>
                )}
                {booking.status === "cancelled" && (
                  <span className="inline-flex items-center gap-1 text-red-600 text-sm font-medium bg-red-50 px-3 py-1.5 rounded-lg">
                    <XCircle className="h-4 w-4" />
                    Cancelled
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