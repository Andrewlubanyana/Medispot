import Link from "next/link";
import { Plus, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-teal-600 rounded-lg p-1.5">
                <Plus className="h-5 w-5 text-white" strokeWidth={3} />
              </div>
              <span className="text-xl font-bold text-white">
                Medi<span className="text-teal-400">Spot</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Find and book trusted doctors across KwaZulu-Natal.
              Your health, your choice.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/doctors" className="hover:text-teal-400 transition-colors">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link href="/for-doctors" className="hover:text-teal-400 transition-colors">
                  For Doctors
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-teal-400 transition-colors">
                  About MediSpot
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-teal-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Specialties */}
          <div>
            <h4 className="text-white font-semibold mb-4">Top Specialties</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/doctors?specialty=general-practitioner" className="hover:text-teal-400 transition-colors">
                  General Practitioner
                </Link>
              </li>
              <li>
                <Link href="/doctors?specialty=dentist" className="hover:text-teal-400 transition-colors">
                  Dentist
                </Link>
              </li>
              <li>
                <Link href="/doctors?specialty=pediatrician" className="hover:text-teal-400 transition-colors">
                  Pediatrician
                </Link>
              </li>
              <li>
                <Link href="/doctors?specialty=dermatologist" className="hover:text-teal-400 transition-colors">
                  Dermatologist
                </Link>
              </li>
              <li>
                <Link href="/doctors?specialty=gynecologist" className="hover:text-teal-400 transition-colors">
                  Gynecologist
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal-400 flex-shrink-0" />
                <span>Durban & South Coast, KZN</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal-400 flex-shrink-0" />
                <a href="mailto:hello@medispot.co.za" className="hover:text-teal-400 transition-colors">
                  hello@medispot.co.za
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-teal-400 flex-shrink-0" />
                <a href="tel:+27000000000" className="hover:text-teal-400 transition-colors">
                  +27 (0) 00 000 0000
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} MediSpot. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-teal-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-teal-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}