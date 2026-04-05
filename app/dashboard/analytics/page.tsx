"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { BarChart3, TrendingUp, Users, CalendarX, Loader2 } from "lucide-react";

interface BookingStats {
  total: number;
  completed: number;
  cancelled: number;
  estimatedRevenue: number;
}

export default function AnalyticsPage() {
  const { doctorRecord } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BookingStats>({
    total: 0,
    completed: 0,
    cancelled: 0,
    estimatedRevenue: 0,
  });

  const fetchAnalytics = async () => {
    if (!doctorRecord?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("status")
        .eq("doctor_id", doctorRecord.id);

      if (error) throw error;

      const total = bookings.length;
      const completed = bookings.filter((b) => b.status === "completed").length;
      const cancelled = bookings.filter((b) => b.status === "cancelled").length;
      
      // Calculate estimated revenue using the doctor's base consultation fee
      const fee = doctorRecord.consultation_fee || 0;
      const estimatedRevenue = completed * fee;

      setStats({ total, completed, cancelled, estimatedRevenue });
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [doctorRecord?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  // Calculate cancellation rate percentage safely
  const cancelRate = stats.total > 0 ? Math.round((stats.cancelled / stats.total) * 100) : 0;

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center">
          <BarChart3 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Practice Analytics</h1>
          <p className="text-gray-500">Overview of your appointments and estimated revenue.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Appointments */}
        <div className="card p-6">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <Users className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium text-sm">Total Bookings</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>

        {/* Completed Appointments */}
        <div className="card p-6">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h3 className="font-medium text-sm">Completed</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
        </div>

        {/* Cancellation Rate */}
        <div className="card p-6">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <CalendarX className="h-5 w-5 text-red-500" />
            <h3 className="font-medium text-sm">Cancellation Rate</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">{cancelRate}%</p>
            <p className="text-sm text-gray-400">({stats.cancelled} cancelled)</p>
          </div>
        </div>

        {/* Estimated Revenue */}
        <div className="card p-6 bg-gradient-to-br from-teal-600 to-teal-800 text-white border-none shadow-md">
          <div className="flex items-center gap-3 text-teal-100 mb-2">
            <BarChart3 className="h-5 w-5" />
            <h3 className="font-medium text-sm">Estimated Revenue</h3>
          </div>
          <p className="text-3xl font-bold">R {stats.estimatedRevenue.toLocaleString()}</p>
          <p className="text-xs text-teal-200 mt-1">Based on base consultation fee</p>
        </div>
      </div>

      {/* Visual Funnel */}
      <div className="card p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Appointment Funnel</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">Total Booked</span>
              <span className="font-bold text-gray-900">{stats.total}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div className="bg-blue-500 h-4 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">Completed</span>
              <span className="font-bold text-gray-900">{stats.completed}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-green-500 h-4 rounded-full transition-all duration-1000" 
                style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">Cancelled / No Show</span>
              <span className="font-bold text-gray-900">{stats.cancelled}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-red-400 h-4 rounded-full transition-all duration-1000" 
                style={{ width: `${cancelRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
