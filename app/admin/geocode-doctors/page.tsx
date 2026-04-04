"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function GeocodeDoctorsPage() {
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const geocodeAll = async () => {
    setProcessing(true);
    setResults(["Starting geocoding process..."]);

    const { data: doctors } = await supabase
      .from("doctors")
      .select("id, full_name, practice_address, area")
      .is("latitude", null);

    if (!doctors || doctors.length === 0) {
      setResults((prev) => [...prev, "No doctors need geocoding."]);
      setProcessing(false);
      return;
    }

    setResults((prev) => [...prev, `Found ${doctors.length} doctors to geocode.`]);

    for (const doctor of doctors) {
      try {
        const address = `${doctor.practice_address}, ${doctor.area}, Durban, South Africa`;

        const geocodeResponse = await fetch("/api/geocode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
        });

        if (geocodeResponse.ok) {
          const { latitude, longitude } = await geocodeResponse.json();

          await supabase
            .from("doctors")
            .update({ latitude, longitude })
            .eq("id", doctor.id);

          setResults((prev) => [
            ...prev,
            `✓ ${doctor.full_name}: ${latitude}, ${longitude}`,
          ]);
        } else {
          setResults((prev) => [...prev, `✗ ${doctor.full_name}: Failed`]);
        }

        // Rate limit: wait 200ms between requests
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (err) {
        setResults((prev) => [...prev, `✗ ${doctor.full_name}: Error`]);
      }
    }

    setResults((prev) => [...prev, "Geocoding complete!"]);
    setProcessing(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Geocode All Doctors
      </h1>
      <p className="text-gray-600 mb-6">
        This will add latitude/longitude coordinates to all doctors that don't
        have them yet, enabling Google Maps on their profiles.
      </p>

      <button
        onClick={geocodeAll}
        disabled={processing}
        className="btn-primary flex items-center gap-2"
      >
        {processing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          "Start Geocoding"
        )}
      </button>

      {results.length > 0 && (
        <div className="mt-6 bg-gray-50 rounded-xl p-4 max-h-96 overflow-y-auto">
          {results.map((result, i) => (
            <div key={i} className="text-sm text-gray-700 py-1 font-mono">
              {result}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}