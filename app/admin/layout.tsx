"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Star,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/doctors", label: "Doctors", icon: Users },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || profile?.role !== "admin")) {
      router.push("/");
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (!user || profile?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="card p-8 text-center max-w-md">
          <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don&apos;t have permission to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-100 min-h-screen sticky top-16">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              <p className="font-bold text-gray-900">Admin Panel</p>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {profile?.full_name || user.email}
            </p>
          </div>

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
                  <item.icon
                    className={`h-5 w-5 ${isActive ? "text-teal-600" : ""}`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile nav */}
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

        {/* Content */}
        <div className="flex-1 pb-20 md:pb-0">{children}</div>
      </div>
    </div>
  );
}