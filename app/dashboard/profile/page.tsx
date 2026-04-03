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

export default function ProfilePage() {
  const { doctorRecord, refreshDoctorRecord } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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
    if (!doctorRecord) return;

    const fetchFull = async () => {
      const { data } = await supabase
        .from("doctors")
        .select("*")
        .eq("id", doctorRecord.id)
        .single();

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
      }
      setLoading(false);
    };

    fetchFull();
  }, [doctorRecord]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorRecord) return;

    setSaving(true);
    setError("");
    setSuccess(false);

    const { error: updateError } = await supabase
      .from("doctors")
      .update({
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
      })
      .eq("id", doctorRecord.id);

    if (updateError) {
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

      <form onSubmit={handleSave} className="space-y-5">
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Personal Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
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
              Specialty
            </label>
            <select
              required
              value={form.specialty}
              onChange={(e) => updateField("specialty", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 appearance-none"
            >
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
                placeholder="Separate with commas"
              />
            </div>
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
              />
            </div>
          </div>
        </div>

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
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                required
                value={form.practice_address}
                onChange={(e) => updateField("practice_address", e.target.value)}
                rows={2}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 resize-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area
            </label>
            <select
              required
              value={form.area}
              onChange={(e) => updateField("area", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 appearance-none"
            >
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
                min="0"
              />
            </div>
          </div>
        </div>

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
                placeholder="https://"
              />
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-700">Profile saved successfully!</p>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          {saving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}