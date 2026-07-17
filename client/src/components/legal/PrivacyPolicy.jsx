import React from "react";

const PrivacyPolicy = () => {
  return (
    <div  className="min-h-screen bg-zinc-950 text-zinc-200">
      <div className="max-w-5xl mx-auto px-6 py-20">

        <h1 className="text-4xl font-bold mb-3">
          Privacy Policy
        </h1>

        <p className="text-zinc-400 mb-10">
          Last Updated: July 2026
        </p>

        <section className="space-y-8">

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              1. Introduction
            </h2>

            <p className="text-zinc-400 leading-8">
              ROJSEWA ("we", "our", or "us") is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our
              platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              2. Information We Collect
            </h2>

            <ul className="list-disc pl-6 text-zinc-400 space-y-2">
              <li>Name and profile information</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Location and address</li>
              <li>Profile photo (optional)</li>
              <li>Service booking history</li>
              <li>Payment information (handled securely through payment providers)</li>
              <li>Device and browser information</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              3. How We Use Your Information
            </h2>

            <ul className="list-disc pl-6 text-zinc-400 space-y-2">
              <li>Create and manage your account.</li>
              <li>Process bookings.</li>
              <li>Connect customers with service providers.</li>
              <li>Improve our services.</li>
              <li>Prevent fraud and abuse.</li>
              <li>Send important notifications.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              4. Sharing Information
            </h2>

            <p className="text-zinc-400 leading-8">
              We never sell your personal information. We may share limited
              information with verified service providers, payment gateways,
              authentication providers, and legal authorities when required.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              5. Data Security
            </h2>

            <p className="text-zinc-400 leading-8">
              We use industry-standard security practices including encrypted
              communication, authentication, secure servers, and access control
              to protect user data.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              6. Cookies
            </h2>

            <p className="text-zinc-400 leading-8">
              We use cookies to maintain login sessions, improve user
              experience, analyze traffic, and enhance platform performance.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              7. User Rights
            </h2>

            <p className="text-zinc-400 leading-8">
              Users may update their profile information, request deletion of
              their account, or contact us regarding privacy concerns.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              8. Changes
            </h2>

            <p className="text-zinc-400 leading-8">
              This policy may be updated periodically. Continued use of ROJSEWA
              constitutes acceptance of any modifications.
            </p>
          </div>

        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;