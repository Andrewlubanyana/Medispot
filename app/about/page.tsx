import { Heart, Target, Users, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About MediSpot — Our Mission",
  description:
    "MediSpot is building the easiest way to find and book trusted doctors in KwaZulu-Natal.",
};

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About MediSpot
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            We&apos;re on a mission to make healthcare more accessible in
            KwaZulu-Natal. Finding a trusted doctor shouldn&apos;t be hard — and
            booking an appointment shouldn&apos;t require a phone call.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-8">
              <Target className="h-10 w-10 text-teal-600 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed">
                To connect every patient in KwaZulu-Natal with the right
                healthcare professional — quickly, easily, and with full
                transparency. We believe everyone deserves access to quality
                healthcare information.
              </p>
            </div>
            <div className="card p-8">
              <Heart className="h-10 w-10 text-teal-600 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Why We Exist
              </h2>
              <p className="text-gray-600 leading-relaxed">
                South Africa has world-class doctors, but finding the right one
                often relies on word of mouth or outdated directories. MediSpot
                brings healthcare discovery into the digital age — starting
                right here in KZN.
              </p>
            </div>
            <div className="card p-8">
              <Users className="h-10 w-10 text-teal-600 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                For Patients
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Browse verified doctors, read real patient reviews, compare
                services and fees, and book your appointment online — all
                completely free. Your health, your choice.
              </p>
            </div>
            <div className="card p-8">
              <MapPin className="h-10 w-10 text-teal-600 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Starting Local
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We&apos;re starting in Durban and the South Coast because we
                believe the best products are built by solving real problems for
                real communities. KZN first — then all of South Africa.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}