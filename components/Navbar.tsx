"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Plus,
  LayoutDashboard,
  LogOut,
  ShieldAlert,
  User,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    router.push("/");
  };

  const isDoctor = profile?.role === "doctor";
  const isAdmin = profile?.role === "admin";
  const isPatient = profile?.role === "patient";

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-teal-600 rounded-lg p-1.5">
              <Plus className="h-5 w-5 text-white" strokeWidth={3} />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Medi<span className="text-teal-600">Spot</span>
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/doctors"
              className="text-gray-600 hover:text-teal-600 font-medium transition-colors"
            >
              Find Doctors
            </Link>
            <Link
              href="/for-doctors"
              className="text-gray-600 hover:text-teal-600 font-medium transition-colors"
            >
              For Doctors
            </Link>

            {loading ? (
              // Improved Desktop Skeleton: Mimics Log In text and Sign Up button perfectly
              <div className="flex items-center gap-6 ml-2">
                <div className="w-12 h-5 bg-gray-100 rounded animate-pulse" />
                <div className="w-20 h-9 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            ) : user ? (
              <>
                {isDoctor && (
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-teal-600 font-medium transition-colors flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                )}

                {isPatient && (
                  <Link
                    href="/patient"
                    className="text-gray-600 hover:text-teal-600 font-medium transition-colors flex items-center gap-1.5"
                  >
                    <User className="h-4 w-4" />
                    My Account
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-gray-600 hover:text-teal-600 font-medium transition-colors flex items-center gap-1.5"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    Admin
                  </Link>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {profile?.full_name || user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-500 hover:text-red-500 transition-colors p-2"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-teal-600 font-medium transition-colors"
                >
                  Log In
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/doctors"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-gray-600 hover:text-teal-600 font-medium"
            >
              Find Doctors
            </Link>
            <Link
              href="/for-doctors"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-gray-600 hover:text-teal-600 font-medium"
            >
              For Doctors
            </Link>

            {loading ? (
              // Improved Mobile Skeleton: Mimics the mobile auth links
              <div className="pt-2 space-y-2">
                 <div className="w-full h-10 bg-gray-50 rounded-lg animate-pulse" />
                 <div className="w-full h-10 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            ) : user ? (
              <>
                {isDoctor && (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-gray-600 hover:text-teal-600 font-medium"
                  >
                    Dashboard
                  </Link>
                )}

                {isPatient && (
                  <Link
                    href="/patient"
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-gray-600 hover:text-teal-600 font-medium"
                  >
                    My Account
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 py-2 text-gray-600 hover:text-teal-600 font-medium"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    Admin Panel
                  </Link>
                )}

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-500 py-1">
                    {profile?.full_name || user.email}
                  </p>
                  <button
                    onClick={handleSignOut}
                    className="block py-2 text-red-500 font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-gray-600 hover:text-teal-600 font-medium"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsOpen(false)}
                  className="block btn-primary text-center text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
