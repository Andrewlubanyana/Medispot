import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 pt-8 pb-4 px-6 flex items-center border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-10">
        <Link 
          href="/" 
          className="p-2 mr-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Go back"
        >
          {/* Inline SVG arrow replaces the Ionicon so it works out-of-the-box on web */}
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="font-bold text-gray-900 dark:text-white text-lg">Terms of Use</h1>
      </div>

      {/* Main Content Area - Centered with max-width for desktop readability */}
      <main className="max-w-3xl mx-auto px-6 pt-10 pb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Terms and Conditions</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last Updated: May 2026</p>

        <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">1. Acceptance of Terms</h3>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement. 
          </p>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">2. Medical Disclaimer</h3>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            This platform facilitates communication between healthcare providers and patients. It is not a substitute for emergency medical services. In case of an emergency, contact your local emergency services immediately.
          </p>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">3. Provider Responsibilities</h3>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            Healthcare providers using this platform are solely responsible for the medical advice and services they provide. Providers must maintain valid licenses and credentials required by their local jurisdiction.
          </p>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">4. User Accounts</h3>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
          </p>
          
        </div>
      </main>

    </div>
  );
}
