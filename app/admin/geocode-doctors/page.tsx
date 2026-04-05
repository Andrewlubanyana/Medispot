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

    try {
      // 1. Explicitly check for an error on the initial fetch
      const { data: doctors, error } = await supabase
        .from("doctors")
        .select("id, full_name, practice_address, area")
        .is("latitude", null);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      if (!doctors || doctors.length === 0) {
        setResults((prev) => [...prev, "No doctors need geocoding."]);
        return; // The 'finally' block will still run and turn off the spinner
      }

      setResults((prev) => [...prev, `Found ${doctors.length} doctors to geocode.`]);

      for (const doctor of doctors) {
        try {
          const address = `${doctor.practice_address}, ${doctor.area}, Durban, South Africa`;

          // 2. Add an AbortController to prevent the fetch from hanging forever
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

          const geocodeResponse = await fetch("/api/geocode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId); // Clear timeout if fetch succeeds quickly

          if (geocodeResponse.ok) {
            const { latitude, longitude } = await geocodeResponse.json();

            // 3. Catch errors on the update step too
            const { error: updateError } = await supabase
              .from("doctors")
              .update({ latitude, longitude })
              .eq("id", doctor.id);

            if (updateError) {
              throw new Error("Update failed");
            }

            setResults((prev) => [
              ...prev,
              `✓ ${doctor.full_name}: ${latitude}, ${longitude}`,
            ]);
          } else {
            setResults((prev) => [...prev, `✗ ${doctor.full_name}: API Failed`]);
          }
        } catch (err: any) {
          // If it aborts due to timeout, it throws a specific error name
          const errorMessage = err.name === 'AbortError' ? 'Timeout' : 'Error';
          setResults((prev) => [...prev, `✗ ${doctor.full_name}: ${errorMessage}`]);
        }

        // Rate limit: wait 200ms between requests so we don't spam the API
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      setResults((prev) => [...prev, "Geocoding complete!"]);
      
    } catch (err: any) {
      // Catch any fatal errors (like network failure on the initial load)
      setResults((prev) => [...prev, `Critical Error: ${err.message}`]);
    } finally {
      // 4. GUARANTEE the spinner turns off, whether the whole process succeeds or crashes
      setProcessing(false);
    }
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
        <div className="mt-6 bg-gray-50 rounded-xl p-4 max-h-96 overflow-y-auto font-mono text-sm">
          {results.map((result, i) => (
            <div 
              key={i} 
              className={`py-1 ${result.includes('✗') || result.includes('Error') ? 'text-red-600' : 'text-gray-700'}`}
            >
              {result}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
