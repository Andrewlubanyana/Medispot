"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import {
  Loader2,
  Save,
  CheckCircle,
  AlertCircle,
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  GraduationCap,
  DollarSign,
  Globe,
} from "lucide-react";
import { SPECIALTIES, AREAS } from "@/lib/constants";
import PhotoUpload from "@/components/PhotoUpload";

export default function ProfilePage() {
  const { doctorRecord, refreshDoctorRecord } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    specialty: "",
    bio: "",
    qualifications: "",
    practice_name: "",
    practice_address: "",
    area: "",
    phone: "",
    email: "",
    website: "",
    consultation_fee: "",
  });

  useEffect(() => {
    // 1. Safely turn off the spinner if there is no doctor ID
    if (!doctorRecord?.id) {
      setLoading(false);
      return;
    }

    const fetchFull = async () => {
      try {
        const { data, error } = await supabase
          .from("doctors")
          .select("*")
          .eq("id", doctorRecord.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        if (data) {
          setForm({
            full_name: data.full_name || "",
            specialty: data.specialty || "",
            bio: data.bio || "",
            qualifications: data.qualifications || "",
            practice_name: data.practice_name || "",
            practice_address: data.practice_address || "",
            area: data.area || "",
            phone: data.phone || "",
            email: data.email || "",
            website: data.website || "",
            consultation_fee: data.consultation_fee?.toString() || "",
          });
          setPhotoUrl(data.photo_url || null);
        }
      } finally {
        // 2. Guarantee the spinner turns off whether fetch succeeds or fails
        setLoading(false);
      }
    };

    fetchFull();
    
    // 3. Depend strictly on the primitive ID, not the object reference
  }, [doctorRecord?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorRecord) return;

    setSaving(true);
    setError("");
    setSuccess(false);

    // Geocode the address to get coordinates for Google Maps
    let latitude = null;
    let longitude = null;

    try {
      const geocodeResponse = await fetch("/api/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: `${form.practice_address}, ${form.area}, Durban, South Africa`,
        }),
      });

      if (geocodeResponse.ok) {
        const geocodeData = await geocodeResponse.json();
        latitude = geocodeData.latitude;
        longitude = geocodeData.longitude;
        console.log("Geocoded successfully:", latitude, longitude);
      } else {
        console.log("Geocoding failed, continuing without coordinates");
      }
    } catch (err) {
      console.log("Geocoding error, continuing without coordinates:", err);
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      full_name: form.full_name,
      specialty: form.specialty,
      bio: form.bio || null,
      qualifications: form.qualifications || null,
      practice_name: form.practice_name || null,
      practice_address: form.practice_address,
      area: form.area,
      phone: form.phone || null,
      email: form.email || null,
      website: form.website || null,
      consultation_fee: form.consultation_fee
        ? parseFloat(form.consultation_fee)
        : null,
      updated_at: new Date().toISOString(),
    };

    // Only update coordinates if geocoding succeeded
    if (latitude !== null && longitude !== null) {
      updateData.latitude = latitude;
      updateData.longitude = longitude;
    }

    const { error: updateError } = await supabase
      .from("doctors")
      .update(updateData)
      .eq("id", doctorRecord.id);

    if (updateError) {
      console.error("Update error:", updateError);
      setError("Failed to save changes. Please try again.");
    } else {
      setSuccess(true);
      await refreshDoctorRecord();
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>

      {/* Photo Upload */}
      {doctorRecord && (
        <div className="mb-6">
          <PhotoUpload
            doctorId={doctorRecord.id}
            currentPhotoUrl={photoUrl}
            doctorName={form.full_name || "Doctor"}
            onPhotoUpdated={(url) => setPhotoUrl(url)}
          />
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Personal Information */}
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Personal Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.full_name}
              onChange={(e) => updateField("full_name", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialty <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.specialty}
              onChange={(e) => updateField("specialty", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 appearance-none cursor-pointer"
            >
              <option value="">Select specialty</option>
              {SPECIALTIES.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Qualifications
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={form.qualifications}
                onChange={(e) => updateField("qualifications", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                placeholder="e.g. MBChB (UKZN), FC Paed (SA)"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Separate multiple qualifications with commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About You
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                value={form.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                rows={4}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 resize-none"
                placeholder="Tell patients about your experience, approach, and what makes your practice special..."
              />
            </div>
          </div>
        </div>

        {/* Practice Details */}
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Practice Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Practice Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={form.practice_name}
                onChange={(e) => updateField("practice_name", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                placeholder="e.g. Durban Family Practice"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Practice Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                required
                value={form.practice_address}
                onChange={(e) => updateField("practice_address", e.target.value)}
                rows={2}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 resize-none"
                placeholder="Full street address"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              This address will be used to show your location on Google Maps
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.area}
              onChange={(e) => updateField("area", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 appearance-none cursor-pointer"
            >
              <option value="">Select area</option>
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consultation Fee (R)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                value={form.consultation_fee}
                onChange={(e) => updateField("consultation_fee", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                placeholder="e.g. 500"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Contact Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  placeholder="031 000 0000"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  placeholder="practice@example.com"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="url"
                value={form.website}
                onChange={(e) => updateField("website", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                placeholder="https://www.yourpractice.co.za"
              />
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <p className="text-sm text-green-700">
              Profile saved successfully! Your map location has been updated.
            </p>
          </div>
        )}

        {/* Save button */}
        <button
          type="submit"
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}
