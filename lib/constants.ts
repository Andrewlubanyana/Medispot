export const SPECIALTIES = [
  { name: "General Practitioner", slug: "general-practitioner" },
  { name: "Dentist", slug: "dentist" },
  { name: "Pediatrician", slug: "pediatrician" },
  { name: "Dermatologist", slug: "dermatologist" },
  { name: "Ophthalmologist", slug: "ophthalmologist" },
  { name: "Psychiatrist", slug: "psychiatrist" },
  { name: "Cardiologist", slug: "cardiologist" },
  { name: "Gynecologist", slug: "gynecologist" },
  { name: "Orthopedic Surgeon", slug: "orthopedic-surgeon" },
  { name: "ENT Specialist", slug: "ent-specialist" },
  { name: "Urologist", slug: "urologist" },
  { name: "Neurologist", slug: "neurologist" },
  { name: "Pulmonologist", slug: "pulmonologist" },
  { name: "Endocrinologist", slug: "endocrinologist" },
  { name: "Physiotherapist", slug: "physiotherapist" },
  { name: "Psychologist", slug: "psychologist" },
  { name: "Optometrist", slug: "optometrist" },
  { name: "Chiropractor", slug: "chiropractor" },
] as const;

export const AREAS = [
  "Durban CBD",
  "Umhlanga",
  "Ballito",
  "Pinetown",
  "Westville",
  "Amanzimtoti",
  "Scottburgh",
  "Port Shepstone",
  "Margate",
  "Hillcrest",
  "Kloof",
  "Umdloti",
  "La Lucia",
  "Musgrave",
  "Berea",
  "Chatsworth",
] as const;

export function slugToName(slug: string): string | undefined {
  return SPECIALTIES.find((s) => s.slug === slug)?.name;
}

export function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}