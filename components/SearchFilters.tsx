"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Search, MapPin, Stethoscope, X } from "lucide-react";
import { SPECIALTIES, AREAS } from "@/lib/constants";

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );

  const currentSpecialty = searchParams.get("specialty") || "";
  const currentArea = searchParams.get("area") || "";

  const hasFilters = searchInput || currentSpecialty || currentArea;

  const updateFilters = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      router.push(`/doctors?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput });
  };

  const clearAllFilters = () => {
    setSearchInput("");
    router.push("/doctors");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by doctor name, specialty, or practice..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Filter row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Specialty filter */}
          <div className="relative flex-1">
            <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={currentSpecialty}
              onChange={(e) => updateFilters({ specialty: e.target.value })}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 text-sm appearance-none cursor-pointer"
            >
              <option value="">All Specialties</option>
              {SPECIALTIES.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Area filter */}
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={currentArea}
              onChange={(e) => updateFilters({ area: e.target.value })}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 text-sm appearance-none cursor-pointer"
            >
              <option value="">All Areas</option>
              {AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Search button */}
          <button
            type="submit"
            className="btn-primary rounded-xl text-sm px-6 whitespace-nowrap"
          >
            Search
          </button>
        </div>

        {/* Active filters & Clear */}
        {hasFilters && (
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs text-gray-500">Active filters:</span>

            {searchInput && (
              <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full">
                &ldquo;{searchInput}&rdquo;
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    updateFilters({ search: "" });
                  }}
                  className="hover:text-teal-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {currentSpecialty && (
              <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {SPECIALTIES.find((s) => s.slug === currentSpecialty)?.name}
                <button
                  type="button"
                  onClick={() => updateFilters({ specialty: "" })}
                  className="hover:text-teal-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {currentArea && (
              <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {currentArea}
                <button
                  type="button"
                  onClick={() => updateFilters({ area: "" })}
                  className="hover:text-teal-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-gray-500 hover:text-red-500 underline underline-offset-2 ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </form>
    </div>
  );
}