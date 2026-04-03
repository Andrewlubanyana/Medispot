import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — MediSpot",
  description: "Get in touch with the MediSpot team.",
};

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Contact Us
        </h1>
        <p className="text-gray-600 text-center mb-10">
          Have a question or need help? We&apos;d love to hear from you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card p-6 text-center">
            <Mail className="h-8 w-8 text-teal-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">Email</h3>
            <a
              href="mailto:hello@medispot.co.za"
              className="text-teal-600 text-sm hover:underline"
            >
              hello@medispot.co.za
            </a>
          </div>
          <div className="card p-6 text-center">
            <Phone className="h-8 w-8 text-teal-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
            <a
              href="tel:+27000000000"
              className="text-teal-600 text-sm hover:underline"
            >
              
            </a>
          </div>
          <div className="card p-6 text-center">
            <MapPin className="h-8 w-8 text-teal-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">Location</h3>
            <p className="text-sm text-gray-600">
              Durban & South Coast, KZN
            </p>
          </div>
        </div>

        <div className="card p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Send Us a Message
          </h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                required
                rows={5}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 resize-none"
                placeholder="Your message..."
              />
            </div>
            <button type="submit" className="btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}