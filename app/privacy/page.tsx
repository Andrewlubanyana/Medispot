import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <Link href="/" className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="prose prose-teal max-w-none text-gray-600">
          <p>This privacy policy is a placeholder. Please update with your actual legal privacy policy.</p>
          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you create an account, update your profile, or use our services.</p>
        </div>
      </div>
    </div>
  );
}
