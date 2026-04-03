"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  CalendarDays,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
} from "lucide-react";

interface AdminBooking {
  id: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string | null;
  booking_date: string;
  booking_time: string;
  status: string;
  notes: string | null;
  created_at: string;
  doctors: {
    title: string;
    full_name: string;
    specialty: string;
    area: string;
  };
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    setLoading(true);

    let query = supabase
      .from("bookings")
      .select("*, doctors(title, full_name, specialty, area)")
      .order("booking_date", { ascending: false })
      .order("booking_time", { ascending: false })
      .limit(100);

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data } = await query;
    setBookings((data || []) as AdminBooking[]);
    setLoading(false);
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayH = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayH}:${m} ${ampm}`;
  };

  const statusColors: Record<string, string> = {
    confirmed: "bg-blue-50 text-blue-700",
    completed: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-700",
    no_show: "bg-gray-100 text-gray-600",
  };

  const statusIcons: Record<string, typeof CheckCircle> = {
    confirmed: Clock,
    completed: CheckCircle,
    cancelled: XCircle,
    no_show: XCircle,
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Bookings</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: "all", label: "All" },
          { key: "confirmed", label: "Confirmed" },
          { key: "completed", label: "Completed" },
          { key: "cancelled", label: "Cancelled" },
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
          <p className="text-gray-500">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const StatusIcon = statusIcons[booking.status] || Clock;
            return (
              <div key={booking.id} className="card p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">
                        {booking.patient_name}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          statusColors[booking.status] || ""
                        }`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-teal-600 mt-0.5">
                      {booking.doctors?.title} {booking.doctors?.full_name} ·{" "}
                      {booking.doctors?.specialty}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span>
                        {new Date(
                          booking.booking_date + "T00:00:00"
                        ).toLocaleDateString("en-ZA", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span>{formatTime(booking.booking_time)}</span>
                      <a
                        href={`tel:${booking.patient_phone}`}
                        className="flex items-center gap-1 hover:text-teal-600"
                      >
                        <Phone className="h-3.5 w-3.5" />
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}