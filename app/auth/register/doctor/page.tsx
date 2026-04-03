"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Stethoscope,
  FileText,
  GraduationCap,
  Phone,
  Mail,
  Loader2,
  AlertCircle,
  Plus,
  DollarSign,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { SPECIALTIES, AREAS } from "@/lib/constants";

export default function DoctorRegistrationPage() {
  const router = useRouter();
  const {
    user,
    profile,
    loading: authLoading,
    refreshDoctorRecord,
  } = useAuth();

  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [practiceName, setPracticeName] = useState("");
  const [practiceAddress, setPracticeAddress] = useState("");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/register");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in. Please sign up first.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Double check we have a valid session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError("Your session has expired. Please log in again.");
        setLoading(false);
        router.push("/auth/login");
        return;
      }

      const doctorName =
        profile?.full_name || user.user_metadata?.full_name || "Doctor";

      const insertData = {
        profile_id: user.id,
        title: "Dr.",
        full_name: doctorName,
        specialty,
        bio: bio || null,
        qualifications: qualifications || null,
        practice_name: practiceName || null,
        practice_address: practiceAddress,
        area,
        city: "Durban",
        province: "KwaZulu-Natal",
        phone: phone || null,
        email: email || user.email || null,
        consultation_fee: consultationFee
          ? parseFloat(consultationFee)
          : null,
        is_approved: false,
        is_premium: false,
        is_verified: false,
        slot_duration: 30,
      };

      console.log("Inserting doctor with data:", insertData);

      const { data, error: insertError } = await supabase
        .from("doctors")
        .insert(insertData)
        .select()
        .single();

      console.log("Insert result:", { data, error: insertError });

      if (insertError) {
        console.error("Doctor insert error:", insertError);

        if (insertError.message.includes("duplicate")) {
          setError("You have already registered as a doctor.");
        } else if (insertError.message.includes("policy")) {
          setError(
            "Permission denied. Please try logging out and back in."
          );
        } else {
          setError(
            `Failed to create your listing: ${insertError.message}`
          );
        }
        setLoading(false);
        return;
      }

      // Success — refresh doctor record and redirect
      await refreshDoctorRecord();
      router.push("/dashboard");
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
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

        {/* Debug info - remove before launch */}
        {user && (
          <div className="mb-4 text-xs text-gray-400 text-center">
            Logged in as: {user.email} (ID: {user.id.slice(0, 8)}...)
          </div>
        )}

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Set Up Your Practice
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Tell patients about your practice. You can always edit this later.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Specialty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialty <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="">Select your specialty</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Practice Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Practice Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={practiceName}
                  onChange={(e) => setPracticeName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  placeholder="e.g. Durban Family Practice"
                />
              </div>
            </div>

            {/* Practice Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Practice Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  required
                  value={practiceAddress}
                  onChange={(e) => setPracticeAddress(e.target.value)}
                  rows={2}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 resize-none"
                  placeholder="Full street address"
                />
              </div>
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="">Select your area</option>
                  {AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Qualifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualifications
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  placeholder="e.g. MBChB (UKZN), FC Paed (SA)"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Separate multiple qualifications with commas
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About You
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 resize-none"
                  placeholder="Tell patients about your experience, approach, and what makes your practice special..."
                />
              </div>
            </div>

            {/* Two columns: Phone + Fee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                    placeholder="031 000 0000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consultation Fee (R)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                    placeholder="500"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Contact email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Practice Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  placeholder="practice@example.com"
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
                  Creating your listing...
                </>
              ) : (
                "Complete Registration"
              )}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Your listing will be reviewed and approved within 24 hours.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}