import { MetadataRoute } from "next";

const SPECIALTIES = [
  "general-practitioner",
  "dentist",
  "pediatrician",
  "dermatologist",
  "cardiologist",
  "gynecologist",
  "ent-specialist",
];

const LOCATIONS = [
  "durban-cbd",
  "durban",
  "umhlanga",
  "ballito",
  "pinetown",
  "westville",
  "amanzimtoti",
  "scottburgh",
  "port-shepstone",
  "shelly-beach",
  "margate",
  "hillcrest",
  "kloof",
  "pietermaritzburg",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://medispot.co.za";

  const pSeoUrls = SPECIALTIES.flatMap((specialty) =>
    LOCATIONS.map((location) => ({
      url: `${baseUrl}/${specialty}-${location}`,
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
