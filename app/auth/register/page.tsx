"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Loader2,
  AlertCircle,
  Plus,
  Stethoscope,
  Heart,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { Suspense } from "react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp } = useAuth();

  const initialRole = searchParams.get("role") || "";

  const [role, setRole] = useState<string>(initialRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setError("Please select whether you are a patient or a doctor.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setLoading(true);

    const { error } = await signUp(email, password, fullName, role);

    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    if (role === "doctor") {
      router.push("/auth/register/doctor");
    } else {
      router.push("/doctors");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-teal-600 rounded-lg p-2">
              <Plus className="h-6 w-6 text-white" strokeWidth={3} />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Medi<span className="text-teal-600">Spot</span>
            </span>
          </Link>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Create your account
          </h1>
          <p className="text-gray-500 text-center mb-6">
            Join MediSpot today
          </p>

          {/* Role selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole("patient")}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                role === "patient"
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Heart
                className={`h-6 w-6 mx-auto mb-2 ${
                  role === "patient" ? "text-teal-600" : "text-gray-400"
                }`}
              />
              <span
                className={`text-sm font-semibold ${
                  role === "patient" ? "text-teal-700" : "text-gray-600"
                }`}
              >
                I&apos;m a Patient
              </span>
            </button>
            <button
              type="button"
              onClick={() => setRole("doctor")}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                role === "doctor"
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Stethoscope
                className={`h-6 w-6 mx-auto mb-2 ${
                  role === "doctor" ? "text-teal-600" : "text-gray-400"
                }`}
              />
              <span
                className={`text-sm font-semibold ${
                  role === "doctor" ? "text-teal-700" : "text-gray-600"
                }`}
              >
                I&apos;m a Doctor
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : role === "doctor" ? (
                "Continue → Practice Details"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-teal-600 font-semibold hover:text-teal-700"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}