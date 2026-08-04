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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy for MediSpot</h1>
        <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="prose prose-teal max-w-none text-gray-600">
          <p> Medispot PTY LTD (Reg No: 2026/404567/07) ("MediSpot", "we", "us", or "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the MediSpot mobile application (the "App").
</p>
          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Information We Collect</h2>
          <p>


By accessing or using the App, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy.


We collect personal information that you voluntarily provide to us when registering for the App, expressing an interest in obtaining information about us or our products and services, or otherwise interacting with the App.

A. Personal Information Provided by You

Account Registration: Name, email address, password, and account role (Patient or Healthcare Provider).

Profile Data: Phone numbers, physical addresses (for clinics), professional qualifications (for doctors), and profile pictures.

Healthcare Information: Appointment booking details, medical specialties required, and any health-related information you choose to share directly with healthcare providers via our in-app messaging service.

User Generated Content: Reviews, ratings, and feedback submitted by patients regarding healthcare providers.

B. Information Collected Automatically

Device Data: We may automatically collect device information (such as your mobile device ID, model, and operating system) for troubleshooting and app optimization.

Usage Data: Information about how you interact with the App, including the time and date of your visits, pages viewed, and searches conducted.

C. Biometric Data (Face ID / Fingerprint)
If you choose to enable biometric login, please note that MediSpot does not collect, store, or have access to your biometric data. This data is processed securely and exclusively on your local device hardware using native operating system protocols.

2. How We Use Your Information
We use the information we collect or receive for the following business and operational purposes:

To Facilitate Account Creation and Login: To manage your account and keep it in working order.

To Provide Healthcare Connectivity: To enable patients to find, book, and communicate with healthcare providers.

To Facilitate Communication: To send appointment confirmations, system alerts, 2FA security codes, and updates from doctors you follow.

To Improve Our Services: To analyze app usage trends and improve user experience and functionality.

To Enforce Terms and Conditions: To ensure a safe platform and prevent fraudulent activity.

3. How We Share Your Information
We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.

Between Patients and Doctors: When a patient books an appointment or initiates a chat, relevant profile and contact information is shared with the selected healthcare provider to facilitate care.

Service Providers: We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf (e.g., Supabase for secure database hosting and authentication).

Legal Obligations: We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.

Note: MediSpot will never sell, rent, or trade your personal or medical information to third parties for marketing purposes.

4. Data Security
We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. Your data is stored on secure servers, and we utilize encryption protocols to protect sensitive information and messaging data.

However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure. You transmit personal information to and from our App at your own risk.

5. Data Retention
We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Policy, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements regarding medical records). When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it.  

6. Your Privacy Rights (POPIA Compliance)  
Under the Protection of Personal Information Act (POPIA), you have specific rights regarding your personal data:  

Right to Access: You may request a copy of the personal information we hold about you.

Right to Rectification: You may request that we correct any inaccurate or incomplete personal information.

Right to Erasure: You may request that we delete your personal information, subject to certain legal exceptions.

Right to Object: You have the right to object to the processing of your personal information.  

To exercise any of these rights, please contact us using the details provided below.  

7. Children's Privacy  
We do not knowingly solicit data from or market to children under 18 years of age without verifiable parental consent. By using the App, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the App.  

8. Updates to This Policy
We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date and the updated version will be effective as soon as it is accessible. We encourage you to review this Privacy Policy frequently to be informed of how we are protecting your information.

9. Contact Us
If you have questions or comments about this policy, or if you wish to exercise your data privacy rights, you may contact our Information Officer at:

Medispot PTY LTD

Email: [Insert Support Email Address, e.g., support@medispot.co.za]</p>
        </div>
      </div>
    </div>
  );
}
