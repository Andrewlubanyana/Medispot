"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import {
  CalendarDays,
  Star,
  Clock,
  Loader2,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface UpcomingBooking {
  id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  doctors: {
    title: string;
    full_name: string;
    specialty: string;
    area: string;
    id: string;
  };
}

export default function PatientDashboard() {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<UpcomingBooking[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const today = new Date().toISOString().split("T")[0];

      const { data: upcoming } = await supabase
        .from("bookings")
        .select("id, booking_date, booking_time, status, doctors(id, title, full_name, specialty, area)")
        .eq("patient_id", user.id)
        .gte("booking_date", today)
        .eq("status", "confirmed")
        .order("booking_date")
        .order("booking_time")
        .limit(5);

      const { count: bookingCount } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("patient_id", user.id);

      const { count: reviewCount } = await supabase
        .from("reviews")
        .select("*", { count: "exact", head: true })
        .eq("patient_id", user.id);

      setBookings((upcoming || []) as UpcomingBooking[]);
      setTotalBookings(bookingCount || 0);
      setTotalReviews(reviewCount || 0);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayH = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayH}:${m} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Welcome, {profile?.full_name?.split(" ")[0] || "there"}!
      </h1>
      <p className="text-gray-500 mb-8">Manage your appointments and reviews</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card p-4">
          <CalendarDays className="h-6 w-6 text-teal-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
          <p className="text-sm text-gray-500">Total Bookings</p>
        </div>
        <div className="card p-4">
          <Clock className="h-6 w-6 text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
          <p className="text-sm text-gray-500">Upcoming</p>
        </div>
        <div className="card p-4">
          <Star className="h-6 w-6 text-amber-500 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{totalReviews}</p>
          <p className="text-sm text-gray-500">Reviews Left</p>
        </div>
      </div>

      {/* Upcoming bookings */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-teal-600" />
            Upcoming Appointments
          </h2>
          <Link
            href="/patient/bookings"
            className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <Link
                key={booking.id}
                href={`/doctors/${booking.doctors?.id}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Stethoscope className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.doctors?.title} {booking.doctors?.full_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.doctors?.specialty} · {booking.doctors?.area}
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
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CalendarDays className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No upcoming appointments</p>
            <Link href="/doctors" className="btn-primary text-sm">
              Find a Doctor
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}