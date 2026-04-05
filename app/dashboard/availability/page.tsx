"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import {
  Clock,
  Loader2,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface DaySchedule {
  enabled: boolean;
  start: string;
  end: string;
}

export default function AvailabilityPage() {
  const { doctorRecord } = useAuth();
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    DAYS.map(() => ({ enabled: false, start: "08:00", end: "17:00" }))
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // 1. If there's no record, stop loading and bail out safely
    if (!doctorRecord?.id) {
      setLoading(false);
      return;
    }

    const fetchAvailability = async () => {
      try {
        const { data, error } = await supabase
          .from("availability")
          .select("*")
          .eq("doctor_id", doctorRecord.id);

        if (error) {
          console.error("Error fetching schedule:", error);
          return;
        }

        if (data) {
          const newSchedule = DAYS.map((_, i) => {
            const slot = data.find(
              (a: { day_of_week: number }) => a.day_of_week === i
            );
            return slot
              ? {
                  enabled: slot.is_active,
                  start: slot.start_time.slice(0, 5),
                  end: slot.end_time.slice(0, 5),
                }
              : { enabled: false, start: "08:00", end: "17:00" };
          });
          setSchedule(newSchedule);
        }
      } finally {
        // 2. Guarantee the spinner turns off whether fetch succeeds OR fails
        setLoading(false);
      }
    };

    fetchAvailability();
    
    // 3. Depend ONLY on the primitive ID, not the entire object reference
  }, [doctorRecord?.id]);

  const updateDay = (
    index: number,
    field: keyof DaySchedule,
    value: string | boolean
  ) => {
    setSchedule((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = async () => {
    if (!doctorRecord) return;

    setSaving(true);
    setError("");
    setSuccess(false);

    // Delete existing availability
    await supabase
      .from("availability")
      .delete()
      .eq("doctor_id", doctorRecord.id);

    // Insert new schedule
    const rows = schedule
      .map((day, index) => ({
        doctor_id: doctorRecord.id,
        day_of_week: index,
        start_time: day.start,
        end_time: day.end,
        is_active: day.enabled,
      }))
      .filter((row) => row.is_active);

    if (rows.length > 0) {
      const { error: insertError } = await supabase
        .from("availability")
        .insert(rows);

      if (insertError) {
        setError("Failed to save schedule. Please try again.");
        setSaving(false);
        return;
      }
    }

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setSaving(false);
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
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Manage Availability
      </h1>
      <p className="text-gray-500 mb-6">
        Set your weekly schedule. Patients will see available time slots based on
        this.
      </p>

      <div className="card p-6">
        <div className="space-y-4">
          {DAYS.map((day, index) => (
            <div
              key={day}
              className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl ${
                schedule[index].enabled ? "bg-teal-50/50" : "bg-gray-50"
              }`}
            >
              {/* Toggle + Day name */}
              <div className="flex items-center gap-3 sm:w-40">
                <button
                  type="button"
                  onClick={() =>
                    updateDay(index, "enabled", !schedule[index].enabled)
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    schedule[index].enabled ? "bg-teal-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      schedule[index].enabled
                        ? "translate-x-5.5"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
                <span
                  className={`font-medium text-sm ${
                    schedule[index].enabled ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {day}
                </span>
              </div>

              {/* Time pickers */}
              {schedule[index].enabled ? (
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input
                      type="time"
                      value={schedule[index].start}
                      onChange={(e) =>
                        updateDay(index, "start", e.target.value)
                      }
                      className="pl-8 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                    />
                  </div>
                  <span className="text-gray-400 text-sm">to</span>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input
                      type="time"
                      value={schedule[index].end}
                      onChange={(e) => updateDay(index, "end", e.target.value)}
                      className="pl-8 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                    />
                  </div>
                </div>
              ) : (
                <span className="text-sm text-gray-400">Closed</span>
              )}
            </div>
          ))}
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-700">Schedule saved!</p>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary mt-6 flex items-center gap-2"
        >
          {saving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          {saving ? "Saving..." : "Save Schedule"}
        </button>
      </div>
    </div>
  );
}
