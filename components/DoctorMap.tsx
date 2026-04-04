"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";

interface DoctorMapProps {
  latitude: number | null;
  longitude: number | null;
  doctorName: string;
  practiceAddress: string;
}

export default function DoctorMap({
  latitude,
  longitude,
  doctorName,
  practiceAddress,
}: DoctorMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Map unavailable</p>
      </div>
    );
  }

  if (!latitude || !longitude) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-600 font-medium mb-1">Location</p>
        <p className="text-sm text-gray-500">{practiceAddress}</p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(practiceAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-teal-600 text-sm font-medium hover:text-teal-700"
        >
          Open in Google Maps →
        </a>
      </div>
    );
  }

  const center = { lat: latitude, lng: longitude };

  return (
    <div className="rounded-xl overflow-hidden border border-gray-100">
      <APIProvider apiKey={apiKey}>
        <Map
          style={{ width: "100%", height: "300px" }}
          defaultCenter={center}
          defaultZoom={15}
          gestureHandling="cooperative"
          disableDefaultUI={false}
          mapId="medispot-map"
        >
          <Marker position={center} title={doctorName} />
        </Map>
      </APIProvider>
      <div className="bg-gray-50 p-3 text-sm">
        <p className="text-gray-600">📍 {practiceAddress}</p>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-600 font-medium hover:text-teal-700 inline-flex items-center gap-1 mt-1"
        >
          Get Directions →
        </a>
      </div>
    </div>
  );
}