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
  CalendarClock,
  X,
} from "lucide-react";
import type { Booking } from "@/lib/types";

export default function BookingsPage() {
  const { doctorRecord } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>("upcoming");
  const [loading, setLoading] = useState(true);

  // Reschedule Modal State
  const [rescheduling, setRescheduling] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  const fetchBookings = async () => {
    if (!doctorRecord?.id) {
      setLoading(false);
      return;
    }
    
    setLoading(true);

    try {
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

      const { data, error } = await query.limit(50);
      
      if (error) {
        console.error("Error fetching bookings:", error);
        return;
      }
      
      setBookings((data || []) as Booking[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [doctorRecord?.id, filter]);

  const updateStatus = async (
    bookingId: string,
    status: "completed" | "cancelled"
  ) => {
    if (status === "cancelled" && !confirm("Are you sure you want to cancel this appointment?")) return;

    await supabase
      .from("bookings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", bookingId);
      
    fetchBookings();
  };

  const openRescheduleModal = (booking: Booking) => {
    setRescheduling(booking);
    setNewDate(booking.booking_date);
    setNewTime(booking.booking_time.slice(0, 5)); // format HH:MM
  };

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduling) return;

    setRescheduleLoading(true);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ 
          booking_date: newDate, 
          booking_time: newTime,
          updated_at: new Date().toISOString()
        })
        .eq("id", rescheduling.id);

      if (error) throw error;

      setRescheduling(null);
      fetchBookings();
    } catch (err) {
      console.error("Error rescheduling:", err);
      alert("Failed to reschedule. Please try again.");
    } finally {
      setRescheduleLoading(false);
    }
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayH = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayH}:${m} ${ampm}`;
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl relative">
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
                    <span className="font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                      {new Date(booking.booking_date + "T00:00:00").toLocaleDateString("en-ZA", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <span className="font-medium text-gray-600">{formatTime(booking.booking_time)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    <a
                      href={`tel:${booking.patient_phone}`}
                      className="text-sm text-gray-500 hover:text-teal-600"
                    >
                      {booking.patient_phone}
                    </a>
                  </div>
                  {booking.notes && (
                    <p className="text-sm text-gray-400 mt-2 bg-gray-50 p-2 rounded-lg italic border border-gray-100">
                      &ldquo;{booking.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:flex-shrink-0 flex-wrap sm:flex-nowrap">
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
                      onClick={() => openRescheduleModal(booking)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      <CalendarClock className="h-4 w-4" />
                      Reschedule
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

      {/* Reschedule Modal */}
      {rescheduling && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Reschedule Appointment</h2>
              <button 
                onClick={() => setRescheduling(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleReschedule} className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Moving appointment for <span className="font-semibold text-gray-900">{rescheduling.patient_name}</span>.
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]} // Prevent past dates
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Time
                </label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={rescheduleLoading}
                  className="btn-primary flex-1 flex justify-center items-center gap-2"
                >
                  {rescheduleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarClock className="h-4 w-4" />}
                  Confirm Reschedule
                </button>
                <button
                  type="button"
                  onClick={() => setRescheduling(null)}
                  disabled={rescheduleLoading}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
