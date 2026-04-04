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
  Stethoscope,
  MapPin,
} from "lucide-react";
import Link from "next/link";

interface PatientBooking {
  id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  notes: string | null;
  created_at: string;
  doctors: {
    id: string;
    title: string;
    full_name: string;
    specialty: string;
    area: string;
    practice_name: string | null;
  };
}

export default function PatientBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<PatientBooking[]>([]);
  const [filter, setFilter] = useState("upcoming");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchBookings();
  }, [user, filter]);

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);

    const today = new Date().toISOString().split("T")[0];

    let query = supabase
      .from("bookings")
      .select("*, doctors(id, title, full_name, specialty, area, practice_name)")
      .eq("patient_id", user.id)
      .order("booking_date", { ascending: filter === "upcoming" })
      .order("booking_time")
      .limit(50);

    if (filter === "upcoming") {
      query = query.gte("booking_date", today).eq("status", "confirmed");
    } else if (filter === "past") {
      query = query.lt("booking_date", today);
    } else if (filter === "cancelled") {
      query = query.eq("status", "cancelled");
    }

    const { data } = await query;
    setBookings((data || []) as PatientBooking[]);
    setLoading(false);
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayH = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayH}:${m} ${ampm}`;
  };

  const statusConfig: Record<string, { icon: typeof CheckCircle; color: string }> = {
    confirmed: { icon: Clock, color: "bg-blue-50 text-blue-700" },
    completed: { icon: CheckCircle, color: "bg-green-50 text-green-700" },
    cancelled: { icon: XCircle, color: "bg-red-50 text-red-700" },
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: "upcoming", label: "Upcoming" },
          { key: "past", label: "Past" },
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
          <p className="text-gray-500 mb-4">No {filter} bookings</p>
          <Link href="/doctors" className="btn-primary text-sm">
            Find a Doctor
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const config = statusConfig[booking.status] || statusConfig.confirmed;
            const StatusIcon = config.icon;

            return (
              <div key={booking.id} className="card p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <Link
                        href={`/doctors/${booking.doctors?.id}`}
                        className="font-semibold text-gray-900 hover:text-teal-600 transition-colors"
                      >
                        {booking.doctors?.title} {booking.doctors?.full_name}
                      </Link>
                      <p className="text-sm text-teal-600">
                        {booking.doctors?.specialty}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span>
                          {new Date(booking.booking_date + "T00:00:00").toLocaleDateString("en-ZA", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span>{formatTime(booking.booking_time)}</span>
                      </div>
                      {booking.doctors?.area && (
                        <div className="flex items-center gap-1 text-sm text-gray-400 mt-0.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {booking.doctors.practice_name || booking.doctors.area}
                        </div>
                      )}
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full self-start ${config.color}`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}