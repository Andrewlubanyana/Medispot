import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const SPECIALTIES = [
  "general-practitioner", "dentist", "pediatrician", 
  "dermatologist", "cardiologist", "gynecologist", "ent-specialist"
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://medispot.co.za";

  // Fetch all unique areas currently present in the Supabase database
  const { data: doctors } = await supabase.from("doctors").select("area");
  
  // Extract and clean distinct areas into slug format (e.g. "Richards Bay" -> "richards-bay")
  const customAreas = Array.from(
    new Set(doctors?.map((d) => d.area?.toLowerCase().replace(/\s+/g, "-")).filter(Boolean))
  );

  const pSeoUrls = SPECIALTIES.flatMap((specialty) =>
    customAreas.map((locationSlug) => ({
      url: `${baseUrl}/${specialty}-${locationSlug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...pSeoUrls,
  ];
}
