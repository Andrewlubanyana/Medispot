"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, MapPin } from "lucide-react";

export default function GeocodeDoctorsPage() {
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const geocodeAll = async () => {
    setProcessing(true);
    setResults(["[System] Starting geocoding process..."]);
    setResults((prev) => [...prev, "[System] 1. Requesting doctors from Supabase..."]);

    try {
      // 1. Force a timeout on the DB call just in case Supabase is deadlocking
      const fetchPromise = supabase
        .from("doctors")
        .select("id, full_name, practice_address, area")
        .is("latitude", null);

      // 15-second timeout to catch silent database hangs
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error("Database connection timed out! Check your RLS policies or internet connection.")
            ),
          15000
        )
      );

      // Race the DB fetch against the 15-second timer
      const { data: doctors, error } = (await Promise.race([
        fetchPromise,
        timeoutPromise,
      ])) as any;

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      setResults((prev) => [
        ...prev,
        `[System] 2. Supabase responded! Found ${doctors?.length || 0} doctors.`,
      ]);

      if (!doctors || doctors.length === 0) {
        setResults((prev) => [...prev, "[System] No doctors need geocoding right now."]);
        return;
      }

      for (const doctor of doctors) {
        try {
          const address = `${doctor.practice_address}, ${doctor.area}, Durban, South Africa`;
          setResults((prev) => [
            ...prev,
            `[API] Fetching coordinates for ${doctor.full_name}...`,
          ]);

          // 2. AbortController to prevent the Next.js API route from hanging forever
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s API timeout

          const geocodeResponse = await fetch("/api/geocode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (geocodeResponse.ok) {
            const { latitude, longitude } = await geocodeResponse.json();

            // Check for errors during the update
            const { error: updateError } = await supabase
              .from("doctors")
              .update({ latitude, longitude })
              .eq("id", doctor.id);

            if (updateError) {
              throw new Error("Failed to save coordinates to database");
            }

            setResults((prev) => [
              ...prev,
              `✓ Success: ${doctor.full_name} (${latitude}, ${longitude})`,
            ]);
          } else {
            // Check if it's a specific error from our API route
            const errorData = await geocodeResponse.json().catch(() => ({}));
            setResults((prev) => [
              ...prev,
              `✗ Failed: ${doctor.full_name} - ${
                errorData.error || geocodeResponse.statusText
              }`,
            ]);
          }
        } catch (err: any) {
          const errorMessage =
            err.name === "AbortError"
              ? "API Request Timed Out (Next.js route deadlock)"
              : err.message;
          setResults((prev) => [
            ...prev,
            `✗ Error: ${doctor.full_name} - ${errorMessage}`,
          ]);
        }

        // Rate limit: wait 300ms between requests so Google Maps doesn't block us
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      setResults((prev) => [...prev, "[System] Geocoding process finished!"]);
    } catch (err: any) {
      // Catch any fatal errors (like network failure or RLS blocking)
      setResults((prev) => [...prev, `[FATAL ERROR]: ${err.message}`]);
    } finally {
      // GUARANTEE the spinner turns off
      setProcessing(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center">
          <MapPin className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Geocode Doctors</h1>
      </div>

      <p className="text-gray-600 mb-8 max-w-2xl">
        This utility scans the database for doctors missing geographic coordinates and
        uses the Google Maps API to convert their physical addresses into
        Latitude/Longitude points.
      </p>

      <button
        onClick={geocodeAll}
        disabled={processing}
        className="btn-primary flex items-center gap-2"
      >
        {processing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing Database...
          </>
        ) : (
          "Start Geocoding Scan"
        )}
      </button>

      {/* Terminal-style Diagnostic Window */}
      {results.length > 0 && (
        <div className="mt-8 bg-gray-900 rounded-xl p-5 shadow-inner">
          <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              System Log
            </h3>
            {processing && <Loader2 className="h-4 w-4 text-teal-400 animate-spin" />}
          </div>
          
          <div className="max-h-96 overflow-y-auto font-mono text-sm space-y-1.5 custom-scrollbar">
            {results.map((result, i) => {
              // Color coding the terminal outputs
              let colorClass = "text-gray-300"; 
              if (result.includes("✓ Success")) colorClass = "text-green-400";
              else if (result.includes("✗ Failed") || result.includes("✗ Error"))
                colorClass = "text-red-400";
              else if (result.includes("[System]"))
                colorClass = "text-blue-400 font-semibold";
              else if (result.includes("[FATAL"))
                colorClass = "text-red-500 font-bold bg-red-500/10 p-1 rounded";
              else if (result.includes("[API]")) colorClass = "text-yellow-300";

              return (
                <div key={i} className={`${colorClass} break-all`}>
                  {result}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
