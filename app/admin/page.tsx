"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Users,
  CalendarDays,
  Star,
  Clock,
  Loader2,
  UserCheck,
  UserX,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  totalDoctors: number;
  approvedDoctors: number;
  pendingDoctors: number;
  totalBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  totalReviews: number;
  totalProfiles: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: totalDoctors },
        { count: approvedDoctors },
        { count: pendingDoctors },
        { count: totalBookings },
        { count: confirmedBookings },
        { count: completedBookings },
        { count: totalReviews },
        { count: totalProfiles },
      ] = await Promise.all([
        supabase.from("doctors").select("*", { count: "exact", head: true }),
        supabase.from("doctors").select("*", { count: "exact", head: true }).eq("is_approved", true),
        supabase.from("doctors").select("*", { count: "exact", head: true }).eq("is_approved", false),
        supabase.from("bookings").select("*", { count: "exact", head: true }),
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "completed"),
        supabase.from("reviews").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        totalDoctors: totalDoctors || 0,
        approvedDoctors: approvedDoctors || 0,
        pendingDoctors: pendingDoctors || 0,
        totalBookings: totalBookings || 0,
        confirmedBookings: confirmedBookings || 0,
        completedBookings: completedBookings || 0,
        totalReviews: totalReviews || 0,
        totalProfiles: totalProfiles || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: "Total Doctors",
      value: stats.totalDoctors,
      icon: Users,
      color: "text-teal-600 bg-teal-50",
      href: "/admin/doctors",
    },
    {
      label: "Approved",
      value: stats.approvedDoctors,
      icon: UserCheck,
      color: "text-green-600 bg-green-50",
      href: "/admin/doctors",
    },
    {
      label: "Pending Approval",
      value: stats.pendingDoctors,
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
      href: "/admin/doctors",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: CalendarDays,
      color: "text-blue-600 bg-blue-50",
      href: "/admin/bookings",
    },
    {
      label: "Active Bookings",
      value: stats.confirmedBookings,
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-50",
      href: "/admin/bookings",
    },
    {
      label: "Completed",
      value: stats.completedBookings,
      icon: UserCheck,
      color: "text-green-600 bg-green-50",
      href: "/admin/bookings",
    },
    {
      label: "Total Reviews",
      value: stats.totalReviews,
      icon: Star,
      color: "text-amber-600 bg-amber-50",
      href: "/admin/reviews",
    },
    {
      label: "Registered Users",
      value: stats.totalProfiles,
      icon: Users,
      color: "text-indigo-600 bg-indigo-50",
      href: "#",
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        MediSpot Admin
      </h1>
      <p className="text-gray-500 mb-8">Platform overview and management</p>

      {/* Alert for pending approvals */}
      {stats.pendingDoctors > 0 && (
        <Link
          href="/admin/doctors"
          className="block mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 hover:bg-amber-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800">
                {stats.pendingDoctors} doctor{stats.pendingDoctors !== 1 ? "s" : ""} waiting for approval
              </p>
              <p className="text-sm text-amber-700">
                Click here to review and approve
              </p>
            </div>
          </div>
        </Link>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href} className="card p-4 hover:border-teal-200">
            <div
              className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${stat.color} mb-3`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}