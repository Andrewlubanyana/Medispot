"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import {
  CalendarDays,
  Users,
  Star,
  Clock,
  Loader2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import type { Booking } from "@/lib/types";

export default function DashboardPage() {
  const { doctorRecord } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    avgRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!doctorRecord) return;

    const fetchData = async () => {
      const today = new Date().toISOString().split("T")[0];

      // Fetch upcoming bookings
      const { data: upcomingBookings } = await supabase
        .from("bookings")
        .select("*")
        .eq("doctor_id", doctorRecord.id)
        .gte("booking_date", today)
        .eq("status", "confirmed")
        .order("booking_date")
        .order("booking_time")
        .limit(5);

      // Fetch all bookings count
      const { count: totalCount } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("doctor_id", doctorRecord.id);

      const { count: completedCount } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("doctor_id", doctorRecord.id)
        .eq("status", "completed");

      // Fetch reviews
      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("doctor_id", doctorRecord.id)
        .eq("is_approved", true);

      const totalReviews = reviews?.length || 0;
      const avgRating =
        totalReviews > 0
          ? Math.round(
              (reviews!.reduce((s, r) => s + r.rating, 0) / totalReviews) * 10
            ) / 10
          : 0;

      setBookings((upcomingBookings || []) as Booking[]);
      setStats({
        total: totalCount || 0,
        upcoming: upcomingBookings?.length || 0,
        completed: completedCount || 0,
        avgRating,
        totalReviews,
      });
      setLoading(false);
    };

    fetchData();
  }, [doctorRecord]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayH = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayH}:${m} ${ampm}`;
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Welcome back, Dr. {doctorRecord?.full_name?.split(" ").pop()}
      </h1>
      <p className="text-gray-500 mb-6">
        Here&apos;s what&apos;s happening with your practice
      </p>

      {/* Pending approval notice */}
      {doctorRecord && !doctorRecord.is_approved && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800">Pending Approval</p>
            <p className="text-sm text-amber-700 mt-1">
              Your listing is being reviewed by MediSpot. Once approved,
              patients will be able to find and book you. This usually takes less
              than 24 hours.
            </p>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Upcoming",
            value: stats.upcoming,
            icon: Clock,
            color: "text-blue-600 bg-blue-50",
          },
          {
            label: "Total Bookings",
            value: stats.total,
            icon: CalendarDays,
            color: "text-teal-600 bg-teal-50",
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: CheckCircle,
            color: "text-green-600 bg-green-50",
          },
          {
            label: "Avg Rating",
            value: stats.avgRating > 0 ? stats.avgRating : "New",
            icon: Star,
            color: "text-amber-600 bg-amber-50",
            sub: stats.totalReviews > 0 ? `${stats.totalReviews} reviews` : "",
          },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <div
              className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${stat.color} mb-3`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
            {stat.sub && (
              <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
            )}
          </div>
        ))}
      </div>

      {/* Upcoming bookings */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-teal-600" />
          Upcoming Appointments
        </h2>

        {bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Users className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.patient_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.patient_phone}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {new Date(booking.booking_date + "T00:00:00").toLocaleDateString("en-ZA", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                  <p className="text-sm text-teal-600">
                    {formatTime(booking.booking_time)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CalendarDays className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">No upcoming appointments</p>
          </div>
        )}
      </div>
    </div>
  );
}