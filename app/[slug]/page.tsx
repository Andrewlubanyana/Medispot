import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- KNOWN DICTIONARIES FOR SLUG PARSING ---
const SPECIALTIES_MAP: Record<string, { name: string; description: string; symptoms: string[] }> = {
  "general-practitioner": {
    name: "General Practitioner",
    description: "Primary care medical doctor providing comprehensive healthcare, diagnosis, and routine medical check-ups.",
    symptoms: ["Flu symptoms & fever", "Routine check-ups", "Prescription renewals", "Minor injuries & illness"],
  },
  "dentist": {
    name: "Dentist",
    description: "Oral health specialist diagnosing and treating dental hygiene, cavities, gum disease, and tooth alignment.",
    symptoms: ["Toothache & sensitivity", "Dental cleanings", "Cavity fillings", "Bleeding gums"],
  },
  "pediatrician": {
    name: "Pediatrician",
    description: "Medical specialist providing medical care for infants, children, and adolescents.",
    symptoms: ["Childhood vaccinations", "Developmental milestones", "Infant fevers & rashes", "Growth assessments"],
  },
  "dermatologist": {
    name: "Dermatologist",
    description: "Skin care specialist expert in diagnosing and treating conditions affecting skin, hair, and nails.",
    symptoms: ["Acne & skin rashes", "Mole inspections", "Eczema & psoriasis", "Unexplained skin lesions"],
  },
  "cardiologist": {
    name: "Cardiologist",
    description: "Heart specialist focused on diagnosing and treating cardiovascular diseases and heart conditions.",
    symptoms: ["Chest pain or tightness", "High blood pressure", "Shortness of breath", "Irregular heartbeat"],
  },
  "gynecologist": {
    name: "Gynecologist",
    description: "Specialist in female reproductive health, pregnancy, fertility, and wellness care.",
    symptoms: ["Annual wellness exams", "Pregnancy care", "Hormonal imbalances", "Pelvic discomfort"],
  },
  "ent-specialist": {
    name: "ENT Specialist",
    description: "Ear, Nose, and Throat specialist expert in sinus, hearing, and throat disorders.",
    symptoms: ["Chronic sinus infections", "Hearing loss & ear pain", "Persistent sore throat", "Tinnitus or dizziness"],
  },
};

const LOCATIONS_MAP: Record<string, string> = {
  "durban-cbd": "Durban CBD",
  "durban": "Durban",
  "umhlanga": "Umhlanga",
  "ballito": "Ballito",
  "pinetown": "Pinetown",
  "westville": "Westville",
  "amanzimtoti": "Amanzimtoti",
  "scottburgh": "Scottburgh",
  "port-shepstone": "Port Shepstone",
  "shelly-beach": "Shelly Beach",
  "margate": "Margate",
  "hillcrest": "Hillcrest",
  "kloof": "Kloof",
  "pietermaritzburg": "Pietermaritzburg",
};

// --- SLUG PARSER HELPER ---
function parseSlug(slug: string) {
  for (const locSlug of Object.keys(LOCATIONS_MAP)) {
    if (slug.endsWith(`-${locSlug}`)) {
      const specSlug = slug.replace(`-${locSlug}`, "");
      if (SPECIALTIES_MAP[specSlug]) {
        return {
          specialtyKey: specSlug,
          specialty: SPECIALTIES_MAP[specSlug],
          locationName: LOCATIONS_MAP[locSlug],
          locationKey: locSlug,
        };
      }
    }
  }
  return null;
}

// --- DYNAMIC METADATA GENERATION FOR GOOGLE ---
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const parsed = parseSlug(params.slug);
  if (!parsed) return { title: "Specialist Not Found — MediSpot" };

  const { specialty, locationName } = parsed;
  const title = `Best ${specialty.name}s in ${locationName} | Book Online — MediSpot`;
  const description = `Looking for a top-rated ${specialty.name.toLowerCase()} in ${locationName}, KZN? View consultation fees, read verified patient reviews, and book instant appointments on MediSpot.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_ZA",
    },
  };
}

// --- DYNAMIC PAGE COMPONENT ---
export default async function SpecialistLocationPage({ params }: { params: { slug: string } }) {
  const parsed = parseSlug(params.slug);
  if (!parsed) notFound();

  // Destructure specialtyKey directly from parsed
  const { specialty, locationName, specialtyKey } = parsed;

  // Query Supabase for doctors matching specialty & location
  const { data: doctors } = await supabase
    .from("doctors")
    .select("*, reviews(*)")
    .ilike("specialty", `%${specialty.name}%`)
    .ilike("area", `%${locationName}%`);

  const doctorList = doctors || [];

  // Schema.org Structured Data for Google Local SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${specialty.name}s in ${locationName}`,
    "description": specialty.description,
    "itemListElement": doctorList.map((doc, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "MedicalBusiness",
        "name": `${doc.title || "Dr."} ${doc.full_name}`,
        "medicalSpecialty": specialty.name,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": doc.area || locationName,
          "addressRegion": "KwaZulu-Natal",
          "addressCountry": "ZA",
        },
      },
    })),
  };

  return (
    <>
      {/* Inject Structured Data into Head for Google Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-16">
        
        {/* HERO SECTION */}
        <header className="bg-teal-700 text-white py-14 px-6 shadow-md">
          <div className="max-w-5xl mx-auto">
            <nav className="text-xs text-teal-200 mb-4 flex items-center gap-2">
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <span className="capitalize">{specialty.name}</span>
              <span>/</span>
              <span className="text-white font-semibold">{locationName}</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Find a {specialty.name} in {locationName}
            </h1>
            <p className="text-teal-100 text-base md:text-lg max-w-2xl leading-relaxed">
              Browse verified local practitioners, compare consultation fees, and schedule your appointment online or through the MediSpot app.
            </p>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-6 pt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MAIN DOCTOR LISTINGS */}
          <main className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {doctorList.length} Available {specialty.name}{doctorList.length === 1 ? "" : "s"}
              </h2>
              <span className="text-xs bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 font-semibold px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                Verified Practitioners
              </span>
            </div>

            {doctorList.length > 0 ? (
              doctorList.map((doctor) => {
                const totalReviews = doctor.reviews?.length || 0;
                const avgRating = totalReviews > 0
                  ? (doctor.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / totalReviews).toFixed(1)
                  : "New";

                return (
                  <div
                    key={doctor.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-teal-500 transition-colors"
                  >
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {doctor.title} {doctor.full_name}
                      </h3>
                      <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                        {doctor.practice_name || doctor.specialty}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        📍 {doctor.area}, {doctor.city || "KwaZulu-Natal"}
                      </p>
                      <div className="flex items-center gap-2 pt-1 text-xs text-slate-600 dark:text-slate-300">
                        <span>⭐ {avgRating} ({totalReviews} reviews)</span>
                        {doctor.consultation_fee && (
                          <>
                            <span>•</span>
                            <span className="font-bold">R{doctor.consultation_fee} per visit</span>
                          </>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/doctor/${doctor.id}`}
                      className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-5 py-3 rounded-xl text-center transition-colors shadow-sm"
                    >
                      Book Visit
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-4">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  We are actively onboarding more verified {specialty.name.toLowerCase()}s in {locationName}.
                </p>
                <Link
                  href="/"
                  className="inline-block bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 font-bold px-4 py-2.5 rounded-xl text-xs border border-teal-200 dark:border-teal-800"
                >
                  Explore All KZN Doctors
                </Link>
              </div>
            )}

            {/* APP DOWNLOAD FLYWHEEL CTA */}
            <div className="bg-gradient-to-br from-teal-800 to-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-4 mt-8">
              <span className="text-xs font-extrabold uppercase tracking-widest text-teal-300">
                Book Faster on Mobile
              </span>
              <h3 className="text-2xl font-bold">
                Get the MediSpot App
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Download the official MediSpot app on Android to message doctors directly, receive appointment reminders, and track your medical updates in real-time.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="https://play.google.com/store/apps/details?id=com.medispot.co.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition-colors inline-flex items-center gap-2"
                >
                  📲 Install from Play Store
                </a>
              </div>
            </div>
          </main>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-2">
                About {specialty.name}s
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {specialty.description}
              </p>

              <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider pt-2">
                Common Reasons to Visit:
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                {specialty.symptoms.map((symptom, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* NEARBY LOCATIONS LINKS */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Other KZN Areas
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(LOCATIONS_MAP).slice(0, 8).map((loc) => (
                  <Link
                    key={loc}
                    href={`/${specialtyKey}-${loc}`}
                    className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950 hover:text-teal-700 transition-colors"
                  >
                    {specialty.name} {LOCATIONS_MAP[loc]}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </>
  );
}
