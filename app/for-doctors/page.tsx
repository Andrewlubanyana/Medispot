import Link from "next/link";
import {
  Users,
  CalendarCheck,
  TrendingUp,
  Star,
  ShieldCheck,
  Clock,
  CheckCircle,
  ArrowRight,
  Smartphone,
  BarChart3,
  Zap,
  Heart,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Doctors — Join MediSpot | Grow Your Practice in KZN",
  description:
    "Join MediSpot and reach thousands of patients in KwaZulu-Natal. Free listing, online booking, patient reviews, and practice management tools.",
};

const benefits = [
  {
    icon: Users,
    title: "Reach More Patients",
    description:
      "Get discovered by thousands of patients actively searching for healthcare in Durban and the South Coast. Your practice is visible 24/7.",
  },
  {
    icon: CalendarCheck,
    title: "Online Booking",
    description:
      "Patients book appointments directly through your profile. No phone tag, no missed calls. Your calendar fills itself.",
  },
  {
    icon: Star,
    title: "Build Your Reputation",
    description:
      "Collect and showcase genuine patient reviews. A strong online reputation is the most powerful marketing tool for any practice.",
  },
  {
    icon: Smartphone,
    title: "Simple Dashboard",
    description:
      "Manage your bookings, update your profile, set your availability, and track your services — all from one clean dashboard.",
  },
  {
    icon: BarChart3,
    title: "Grow Your Practice",
    description:
      "Premium members get priority listing, a verified badge, and insights into how patients find them. Stand out from the competition.",
  },
  {
    icon: ShieldCheck,
    title: "You Stay in Control",
    description:
      "Set your own hours, services, and fees. Accept or manage bookings on your terms. No lock-in contracts.",
  },
];

const steps = [
  {
    number: "1",
    title: "Create Your Profile",
    description:
      "Sign up in 2 minutes. Add your specialty, qualifications, practice address, and services.",
  },
  {
    number: "2",
    title: "Get Approved",
    description:
      "Our team reviews your profile within 24 hours. Quality matters — we verify every doctor on MediSpot.",
  },
  {
    number: "3",
    title: "Set Your Availability",
    description:
      "Tell us when you're available. Patients will only see open slots, so you'll never be double-booked.",
  },
  {
    number: "4",
    title: "Start Receiving Patients",
    description:
      "Your profile goes live. Patients find you, read your reviews, and book appointments instantly.",
  },
];

const faqs = [
  {
    q: "How much does it cost?",
    a: "Getting listed on MediSpot is completely free. You get a full profile, online booking, and patient reviews at no cost. We also offer a Premium plan with priority listing, a verified badge, and extra features for practices that want to stand out.",
  },
  {
    q: "How do patients pay?",
    a: "Patients pay directly at your practice, just like they do now. MediSpot handles the booking — not the payment. Nothing changes about how you run your billing.",
  },
  {
    q: "Can I control my availability?",
    a: "Absolutely. You set your own working hours, appointment duration, and which days you're available. You can update your schedule anytime from your dashboard.",
  },
  {
    q: "What if I need to cancel a booking?",
    a: "You can cancel or reschedule any booking from your dashboard. The patient will be notified. We recommend giving at least 24 hours notice.",
  },
  {
    q: "How do reviews work?",
    a: "After a visit, patients can leave a star rating and comment on your profile. All reviews are moderated by MediSpot to prevent fake or abusive content. You can respond to reviews from your dashboard.",
  },
  {
    q: "Is my information safe?",
    a: "Yes. We use industry-standard security (Supabase + SSL encryption). Your data and your patients' data are protected. We never share personal information with third parties.",
  },
];

const comparisons = [
  { feature: "Professional online profile", free: true, premium: true },
  { feature: "Appear in search results", free: true, premium: true },
  { feature: "Online appointment booking", free: true, premium: true },
  { feature: "Patient reviews", free: true, premium: true },
  { feature: "Dashboard & booking management", free: true, premium: true },
  { feature: "Priority in search results", free: false, premium: true },
  { feature: "Verified badge", free: false, premium: true },
  { feature: "Featured practice label", free: false, premium: true },
  { feature: "Profile analytics", free: false, premium: true },
  { feature: "Multiple practice locations", free: false, premium: true },
];

export default function ForDoctorsPage() {
  return (
    <>
      {/* ====== HERO ====== */}
      <section className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-700 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Join 200+ doctors already on MediSpot
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Grow Your Practice with{" "}
              <span className="text-teal-200">MediSpot</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-teal-50 max-w-2xl mx-auto leading-relaxed">
              Reach thousands of patients in KwaZulu-Natal. Get a professional
              profile, online booking, and patient reviews — all for free.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register?role=doctor"
                className="bg-white text-teal-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-teal-50 transition-all duration-200 active:scale-[0.98] inline-flex items-center justify-center gap-2"
              >
                Join MediSpot — It&apos;s Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <p className="mt-4 text-sm text-teal-200">
              No credit card required · Free forever · Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* ====== SOCIAL PROOF ====== */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "200+", label: "Doctors on platform" },
              { value: "10,000+", label: "Patient bookings" },
              { value: "4.8★", label: "Average doctor rating" },
              { value: "12+", label: "Areas covered" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== BENEFITS ====== */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">
            Why Doctors Choose MediSpot
          </h2>
          <p className="section-subtitle">
            Everything you need to attract patients and manage your practice
            online
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="card p-6">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Get Started in 4 Easy Steps</h2>
          <p className="section-subtitle">
            From sign-up to your first patient booking in under 24 hours
          </p>

          <div className="mt-12 max-w-3xl mx-auto space-y-6">
            {steps.map((step, index) => (
              <div key={step.number} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      index === steps.length - 1
                        ? "bg-teal-600 text-white"
                        : "bg-teal-50 text-teal-600"
                    }`}
                  >
                    {step.number}
                  </div>
                </div>
                <div className="pb-6 border-b border-gray-100 last:border-0 flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PRICING ====== */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">
            Start free. Upgrade when you&apos;re ready to grow faster.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free plan */}
            <div className="card p-8">
              <h3 className="text-xl font-bold text-gray-900">Free</h3>
              <p className="text-gray-500 text-sm mt-1">
                Everything you need to get started
              </p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">R0</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <Link
                href="/auth/register?role=doctor"
                className="btn-secondary w-full text-center mt-6 block"
              >
                Get Started Free
              </Link>
              <div className="mt-6 space-y-3">
                {comparisons
                  .filter((c) => c.free)
                  .map((c) => (
                    <div
                      key={c.feature}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <CheckCircle className="h-4 w-4 text-teal-500 flex-shrink-0" />
                      {c.feature}
                    </div>
                  ))}
              </div>
            </div>

            {/* Premium plan */}
            <div className="card p-8 border-2 border-teal-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                RECOMMENDED
              </div>
              <h3 className="text-xl font-bold text-gray-900">Premium</h3>
              <p className="text-gray-500 text-sm mt-1">
                Maximum visibility and growth tools
              </p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">R499</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <Link
                href="/auth/register?role=doctor"
                className="btn-primary w-full text-center mt-6 block"
              >
                Start Premium
              </Link>
              <div className="mt-6 space-y-3">
                {comparisons.map((c) => (
                  <div
                    key={c.feature}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <CheckCircle
                      className={`h-4 w-4 flex-shrink-0 ${
                        c.premium ? "text-teal-500" : "text-gray-300"
                      }`}
                    />
                    {c.feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FAQ ====== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Everything you need to know about joining MediSpot
          </p>

          <div className="mt-12 max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="card p-6">
                <h3 className="font-bold text-gray-900">{faq.q}</h3>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FINAL CTA ====== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-teal-600 to-emerald-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-12 w-12 text-teal-200 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Grow Your Practice?
          </h2>
          <p className="mt-4 text-lg text-teal-50 max-w-xl mx-auto">
            Join hundreds of doctors in KwaZulu-Natal who are already reaching
            more patients with MediSpot.
          </p>
          <div className="mt-8">
            <Link
              href="/auth/register?role=doctor"
              className="bg-white text-teal-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-teal-50 transition-all duration-200 active:scale-[0.98] inline-flex items-center gap-2"
            >
              Create Your Free Profile
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-teal-200">
            Takes less than 2 minutes · No credit card needed
          </p>
        </div>
      </section>
    </>
  );
}