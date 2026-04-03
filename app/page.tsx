import Link from "next/link";
import {
  Search,
  CalendarCheck,
  UserCheck,
  Star,
  ShieldCheck,
  Clock,
  Heart,
  Stethoscope,
  Eye,
  Brain,
  Baby,
  Smile,
  Activity,
  ArrowRight,
  CheckCircle,
  MapPin,
  Users,
  Building2,
} from "lucide-react";

// ============================================
// DATA
// ============================================

const specialties = [
  { name: "General Practitioner", icon: Stethoscope, count: "45+ Doctors", slug: "general-practitioner" },
  { name: "Dentist", icon: Smile, count: "30+ Doctors", slug: "dentist" },
  { name: "Pediatrician", icon: Baby, count: "20+ Doctors", slug: "pediatrician" },
  { name: "Dermatologist", icon: Heart, count: "15+ Doctors", slug: "dermatologist" },
  { name: "Ophthalmologist", icon: Eye, count: "12+ Doctors", slug: "ophthalmologist" },
  { name: "Psychiatrist", icon: Brain, count: "18+ Doctors", slug: "psychiatrist" },
  { name: "Cardiologist", icon: Activity, count: "10+ Doctors", slug: "cardiologist" },
  { name: "Gynecologist", icon: ShieldCheck, count: "22+ Doctors", slug: "gynecologist" },
];

const steps = [
  {
    icon: Search,
    title: "Search",
    description: "Browse doctors by specialty, location, or name. Filter results to find exactly who you need.",
  },
  {
    icon: UserCheck,
    title: "Choose",
    description: "View detailed profiles, read patient reviews, compare services and consultation fees.",
  },
  {
    icon: CalendarCheck,
    title: "Book",
    description: "Pick an available time slot that works for you and confirm your appointment instantly.",
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Doctors",
    description: "Every doctor on MediSpot is reviewed and approved before going live on the platform.",
  },
  {
    icon: Star,
    title: "Real Reviews",
    description: "Read genuine patient reviews to make informed decisions about your healthcare.",
  },
  {
    icon: Clock,
    title: "Instant Booking",
    description: "No phone calls needed. See real-time availability and book your appointment in seconds.",
  },
  {
    icon: Heart,
    title: "100% Free for Patients",
    description: "Finding and booking doctors on MediSpot is completely free. No hidden charges.",
  },
];

const areas = [
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
];

// ============================================
// PAGE
// ============================================

export default function Home() {
  return (
    <>
      {/* ====== HERO SECTION ====== */}
      <section className="relative bg-gradient-to-br from-teal-50 via-white to-emerald-50 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-100 rounded-full opacity-40 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-100 rounded-full opacity-40 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <MapPin className="h-4 w-4" />
              Now serving Durban & South Coast
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Find & Book Trusted{" "}
              <span className="text-teal-600">Doctors</span> in{" "}
              <span className="text-teal-600">KwaZulu-Natal</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Browse verified doctors across Durban and the South Coast.
              Read real patient reviews, compare services, and book your
              appointment — all in one place.
            </p>

            {/* Search bar */}
            <div className="mt-10 max-w-3xl mx-auto">
              <form
                action="/doctors"
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3 flex flex-col md:flex-row gap-3"
              >
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Doctor name or specialty..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    name="area"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 appearance-none cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select area...
                    </option>
                    {areas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn-primary rounded-xl whitespace-nowrap">
                  Find Doctors
                </button>
              </form>
            </div>

            {/* Secondary CTA */}
            <p className="mt-6 text-sm text-gray-500">
              Are you a doctor?{" "}
              <Link
                href="/for-doctors"
                className="text-teal-600 font-semibold hover:text-teal-700 underline underline-offset-2"
              >
                Join MediSpot — it&apos;s free
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ====== STATS BAR ====== */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "200+", label: "Verified Doctors", icon: UserCheck },
              { value: "10,000+", label: "Appointments Booked", icon: CalendarCheck },
              { value: "50+", label: "Specialties", icon: Stethoscope },
              { value: "12+", label: "Areas Covered", icon: MapPin },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <stat.icon className="h-6 w-6 text-teal-600 mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">How MediSpot Works</h2>
          <p className="section-subtitle">
            Book your next doctor&apos;s appointment in three simple steps.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center">
                {/* Step number */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-50 rounded-2xl mb-6">
                  <step.icon className="h-8 w-8 text-teal-600" />
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-teal-200" />
                )}

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  <span className="text-teal-600 mr-1">{index + 1}.</span>
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== BROWSE BY SPECIALTY ====== */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Browse by Specialty</h2>
          <p className="section-subtitle">
            Find the right specialist for your needs.
          </p>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {specialties.map((specialty) => (
              <Link
                key={specialty.slug}
                href={`/doctors?specialty=${specialty.slug}`}
                className="card p-6 text-center group hover:border-teal-200"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-50 rounded-xl mb-4 group-hover:bg-teal-100 transition-colors">
                  <specialty.icon className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                  {specialty.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  {specialty.count}
                </p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition-colors"
            >
              View all specialties
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ====== WHY MEDISPOT ====== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Why Choose MediSpot?</h2>
          <p className="section-subtitle">
            We&apos;re building the easiest way to find and book healthcare in
            KwaZulu-Natal.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card p-6 flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mt-1 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== AREAS WE COVER ====== */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Areas We Cover</h2>
          <p className="section-subtitle">
            Starting in Durban and the South Coast, expanding across KZN.
          </p>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {areas.map((area) => (
              <Link
                key={area}
                href={`/doctors?area=${area}`}
                className="card px-5 py-4 flex items-center gap-3 group hover:border-teal-200"
              >
                <MapPin className="h-5 w-5 text-teal-600 flex-shrink-0" />
                <span className="font-medium text-gray-700 group-hover:text-teal-600 transition-colors">
                  {area}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== DOCTOR CTA ====== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-teal-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6">
              <Building2 className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold">
              Are You a Healthcare Provider?
            </h2>
            <p className="mt-4 text-lg text-teal-50 max-w-xl mx-auto leading-relaxed">
              Join MediSpot and reach thousands of patients looking for
              healthcare in KwaZulu-Natal. Getting started is free.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                "Free basic listing",
                "Manage your appointments",
                "Grow your practice",
              ].map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-2 text-teal-50 justify-center"
                >
                  <CheckCircle className="h-5 w-5 text-teal-200 flex-shrink-0" />
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register?role=doctor"
                className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-all duration-200 active:scale-[0.98]"
              >
                Join MediSpot
              </Link>
              <Link
                href="/for-doctors"
                className="border-2 border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FINAL CTA ====== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Ready to Find Your Doctor?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            It takes less than a minute to find and book the right healthcare
            professional for you.
          </p>
          <div className="mt-8">
            <Link
              href="/doctors"
              className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
            >
              Browse Doctors
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}