import React from 'react';

export default function PrivacyPolicy() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .privacy-body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f8fafc; min-height: 100vh; padding: 30px 20px; }
          .privacy-container { max-width: 800px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
          .privacy-container h1 { color: #0d9488; font-size: 2.5rem; margin-bottom: 0.5rem; }
          .privacy-container h3 { color: #0f172a; font-size: 1.25rem; margin-top: 2rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
          .privacy-container p { margin-bottom: 1rem; color: #475569; }
          .privacy-container ul { margin-bottom: 1.5rem; color: #475569; }
          .privacy-container li { margin-bottom: 0.5rem; }
          .privacy-container strong { color: #1e293b; }
          .privacy-last-updated { font-style: italic; color: #64748b; margin-bottom: 2rem; display: block; }
          .privacy-container a { color: #0d9488; text-decoration: none; }
          .privacy-container a:hover { text-decoration: underline; }
          @media (max-width: 600px) { .privacy-container { padding: 20px; } .privacy-container h1 { font-size: 2rem; } }
        `
      }} />
      
      <div className="privacy-body">
        <div className="privacy-container">
          <h1>Privacy Policy for MediSpot</h1>
          <span className="privacy-last-updated">Last Updated: August 2026</span>

          <p>Medispot PTY LTD (Reg No: 2026/404567/07) ("MediSpot", "we", "us", or "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the MediSpot mobile application (the "App").</p>
          
          <p>By accessing or using the App, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy.</p>

          <h3>1. Information We Collect</h3>
          <p>We collect personal information that you voluntarily provide to us when registering for the App, expressing an interest in obtaining information about us or our products and services, or otherwise interacting with the App.</p>
          
          <p><strong>A. Personal Information Provided by You</strong></p>
          <ul>
              <li><strong>Account Registration:</strong> Name, email address, password, and account role (Patient or Healthcare Provider).</li>
              <li><strong>Profile Data:</strong> Phone numbers, physical addresses (for clinics), professional qualifications (for doctors), and profile pictures.</li>
              <li><strong>Healthcare Information:</strong> Appointment booking details, medical specialties required, and any health-related information you choose to share directly with healthcare providers via our in-app messaging service.</li>
              <li><strong>User Generated Content:</strong> Reviews, ratings, and feedback submitted by patients regarding healthcare providers.</li>
          </ul>

          <p><strong>B. Information Collected Automatically</strong></p>
          <ul>
              <li><strong>Device Data:</strong> We may automatically collect device information (such as your mobile device ID, model, and operating system) for troubleshooting and app optimization.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with the App, including the time and date of your visits, pages viewed, and searches conducted.</li>
          </ul>

          <p><strong>C. Biometric Data (Face ID / Fingerprint)</strong></p>
          <p>If you choose to enable biometric login, please note that <strong>MediSpot does not collect, store, or have access to your biometric data</strong>. This data is processed securely and exclusively on your local device hardware using native operating system protocols.</p>

          <h3>2. How We Use Your Information</h3>
          <p>We use the information we collect or receive for the following business and operational purposes:</p>
          <ul>
              <li><strong>To Facilitate Account Creation and Login:</strong> To manage your account and keep it in working order.</li>
              <li><strong>To Provide Healthcare Connectivity:</strong> To enable patients to find, book, and communicate with healthcare providers.</li>
              <li><strong>To Facilitate Communication:</strong> To send appointment confirmations, system alerts, 2FA security codes, and updates from doctors you follow.</li>
              <li><strong>To Improve Our Services:</strong> To analyze app usage trends and improve user experience and functionality.</li>
              <li><strong>To Enforce Terms and Conditions:</strong> To ensure a safe platform and prevent fraudulent activity.</li>
          </ul>

          <h3>3. How We Share Your Information</h3>
          <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
          <ul>
              <li><strong>Between Patients and Doctors:</strong> When a patient books an appointment or initiates a chat, relevant profile and contact information is shared with the selected healthcare provider to facilitate care.</li>
              <li><strong>Service Providers:</strong> We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf (e.g., Supabase for secure database hosting and authentication).</li>
              <li><strong>Legal Obligations:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
          </ul>
          <p><em>Note: MediSpot will never sell, rent, or trade your personal or medical information to third parties for marketing purposes.</em></p>

          <h3>4. Data Security</h3>
          <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. Your data is stored on secure servers, and we utilize encryption protocols to protect sensitive information and messaging data.</p>
          <p>However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure. You transmit personal information to and from our App at your own risk.</p>

          <h3>5. Data Retention</h3>
          <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Policy, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements regarding medical records). When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it.</p>

          <h3>6. Your Privacy Rights (POPIA Compliance)</h3>
          <p>Under the Protection of Personal Information Act (POPIA), you have specific rights regarding your personal data:</p>
          <ul>
              <li><strong>Right to Access:</strong> You may request a copy of the personal information we hold about you.</li>
              <li><strong>Right to Rectification:</strong> You may request that we correct any inaccurate or incomplete personal information.</li>
              <li><strong>Right to Erasure:</strong> You may request that we delete your personal information, subject to certain legal exceptions.</li>
              <li><strong>Right to Object:</strong> You have the right to object to the processing of your personal information.</li>
          </ul>
          <p>To exercise any of these rights, please contact us using the details provided below.</p>

          <h3>7. Children's Privacy</h3>
          <p>We do not knowingly solicit data from or market to children under 18 years of age without verifiable parental consent. By using the App, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the App.</p>

          <h3>8. Updates to This Policy</h3>
          <p>We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date and the updated version will be effective as soon as it is accessible. We encourage you to review this Privacy Policy frequently to be informed of how we are protecting your information.</p>

          <h3>9. Contact Us</h3>
          <p>If you have questions or comments about this policy, or if you wish to exercise your data privacy rights, you may contact our Information Officer at:</p>
          
          <p>
              <strong>Medispot PTY LTD</strong><br />
              Email: <a href="mailto:support@medispot.co.za">[Insert Support Email Address]</a><br />
              Address: [Insert Physical Business Address]<br />
              KwaZulu-Natal, South Africa
          </p>
        </div>
      </div>
    </>
  );
}
