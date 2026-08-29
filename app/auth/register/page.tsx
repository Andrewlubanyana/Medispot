"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Stethoscope,
  Building2,
  DollarSign,
  Loader2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PREDEFINED_AREAS = [
  "Durban CBD",
  "Durban",
  "Umhlanga",
  "Ballito",
  "Pinetown",
  "Westville",
  "Amanzimtoti",
  "Scottburgh",
  "Port Shepstone",
  "Shelly Beach",
  "Margate",
  "Hillcrest",
  "Kloof",
  "Pietermaritzburg",
];

const SPECIALTIES = [
  "General Practitioner",
  "Dentist",
  "Pediatrician",
  "Dermatologist",
  "Cardiologist",
  "Gynecologist",
  "ENT Specialist",
  "Other",
];

export default function DoctorDetailsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [specialty, setSpecialty] = useState("");
  const [practiceName, setPracticeName] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [customArea, setCustomArea] = useState("");
  const [isCustomArea, setIsCustomArea] = useState(false);
  const [consultationFee, setConsultationFee] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "OTHER") {
      setIsCustomArea(true);
      setSelectedArea("");
    } else {
      setIsCustomArea(false);
      setSelectedArea(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalArea = isCustomArea ? customArea.trim() : selectedArea;

    if (!specialty) {
      setError("Please select your medical specialty.");
      return;
    }
    if (!finalArea) {
      setError("Please select or enter your practice area.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // 1. Get logged in user ID
      const userId = user?.id;

      if (!userId) {
        setError("User session not found. Please log in again.");
        setLoading(false);
        return;
      }

      // 2. Insert or update doctor profile in Supabase
      const { error: dbError } = await supabase.from("doctors").upsert({
        id: userId,
        full_name: user?.user_metadata?.full_name || "",
        email: user?.email || "",
        specialty,
        practice_name: practiceName || `${specialty} Practice`,
        area: finalArea,
        consultation_fee: consultationFee ? parseFloat(consultationFee) : null,
      });

      if (dbError) throw dbError;

      // 3. Redirect to doctor dashboard
      router.push("/doctor/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to save practice details.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
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

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Practice Details
          </h1>
          <p className="text-gray-500 text-center mb-6 text-sm">
            Help patients in your area find and book appointments with you
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* SPECIALTY */}
            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                Medical Specialty *
              </label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <select
                  id="specialty"
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                >
                  <option value="" disabled>Select specialty...</option>
                  {SPECIALTIES.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* PRACTICE NAME */}
            <div>
              <label htmlFor="practiceName" className="block text-sm font-medium text-gray-700 mb-1">
                Practice / Clinic Name (Optional)
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="practiceName"
                  type="text"
                  value={practiceName}
                  onChange={(e) => setPracticeName(e.target.value)}
                  placeholder="e.g. Umhlanga Medical Centre"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                />
              </div>
            </div>

            {/* LOCATION / AREA SELECTOR */}
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                Practice Location / Area *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <select
                  id="area"
                  required={!isCustomArea}
                  value={isCustomArea ? "OTHER" : selectedArea}
                  onChange={handleAreaChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                >
                  <option value="" disabled>Select location / suburb...</option>
                  {PREDEFINED_AREAS.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                  <option value="OTHER" className="font-semibold text-teal-600">
                    ➕ Other (Add Custom Location)
                  </option>
                </select>
              </div>
            </div>

            {/* CUSTOM LOCATION INPUT FIELD */}
            {isCustomArea && (
              <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200 space-y-2 animate-in fade-in">
                <label htmlFor="customArea" className="block text-xs font-bold text-teal-800">
                  Enter Your Suburb, Town, or City *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-600" />
                  <input
                    id="customArea"
                    type="text"
                    required
                    value={customArea}
                    onChange={(e) => setCustomArea(e.target.value)}
                    placeholder="e.g. Richards Bay, Eshowe, Kokstad..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-teal-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 text-sm"
                  />
                </div>
                <p className="text-[11px] text-teal-700">
                  💡 This location will automatically generate a dedicated search page for your patients on MediSpot.
                </p>
              </div>
            )}

            {/* CONSULTATION FEE */}
            <div>
              <label htmlFor="fee" className="block text-sm font-medium text-gray-700 mb-1">
                Consultation Fee (ZAR R)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="fee"
                  type="number"
                  min="0"
                  step="50"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                  placeholder="e.g. 650"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                />
              </div>
            </div>

            {/* ERROR ALERT */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving practice details...
                </>
              ) : (
                "Complete Setup & Launch Practice"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
