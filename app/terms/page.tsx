import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <Link href="/" className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="prose prose-teal max-w-none text-gray-600">
          <p>These terms of service are a placeholder. Please update with your actual legal terms.</p>
          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Acceptance of Terms</h2>
          <p>By accessing and using this platform, you accept and agree to be bound by the terms and provision of this agreement.</p>
        </div>
      </div>
    </div>
  );
}
