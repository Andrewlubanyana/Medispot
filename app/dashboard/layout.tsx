"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarDays,
  UserCircle,
  Clock,
  Stethoscope,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
  { href: "/dashboard/availability", label: "Availability", icon: Clock },
  { href: "/dashboard/services", label: "Services", icon: Stethoscope },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, doctorRecord, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  // Doctor hasn't completed registration
  if (profile?.role === "doctor" && !doctorRecord) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="card p-8 text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Complete Your Registration
          </h2>
          <p className="text-gray-600 mb-6">
            You need to set up your practice details before accessing the
            dashboard.
          </p>
          <Link href="/auth/register/doctor" className="btn-primary">
            Set Up Practice
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-100 min-h-screen sticky top-16">
          {/* Doctor info */}
          <div className="p-4 border-b border-gray-100">
            <p className="font-bold text-gray-900 truncate">
              {doctorRecord?.full_name || profile?.full_name}
            </p>
            <p className="text-sm text-teal-600 truncate">
              {doctorRecord?.specialty || "Doctor"}
            </p>
            {doctorRecord && !doctorRecord.is_approved && (
              <span className="inline-flex items-center gap-1 mt-2 bg-amber-50 text-amber-700 text-xs font-medium px-2 py-1 rounded-full">
                <AlertTriangle className="h-3 w-3" />
                Pending Approval
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-teal-600" : ""}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40">
          <nav className="flex justify-around py-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 px-2 py-1 text-xs ${
                    isActive ? "text-teal-600" : "text-gray-400"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 pb-20 md:pb-0">{children}</div>
      </div>
    </div>
  );
}