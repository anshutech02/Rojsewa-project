import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      <div className="max-w-5xl mx-auto px-6 py-20">

        <h1 className="text-4xl font-bold mb-3">
          Terms & Conditions
        </h1>

        <p className="text-zinc-400 mb-10">
          Effective Date: July 2026
        </p>

        <section className="space-y-8">

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              1. Acceptance
            </h2>

            <p className="text-zinc-400 leading-8">
              By accessing ROJSEWA, you agree to comply with these Terms and
              Conditions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              2. User Accounts
            </h2>

            <ul className="list-disc pl-6 text-zinc-400 space-y-2">
              <li>Provide accurate information.</li>
              <li>Keep your credentials secure.</li>
              <li>You are responsible for your account activities.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              3. Service Providers
            </h2>

            <p className="text-zinc-400 leading-8">
              Providers must provide genuine services, maintain professional
              conduct, and comply with local laws.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              4. Bookings
            </h2>

            <p className="text-zinc-400 leading-8">
              ROJSEWA facilitates bookings between customers and service
              providers. Availability and pricing are determined by providers.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              5. Payments
            </h2>

            <p className="text-zinc-400 leading-8">
              Payments may be processed through secure third-party payment
              gateways. ROJSEWA is not responsible for payment gateway failures.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              6. Prohibited Activities
            </h2>

            <ul className="list-disc pl-6 text-zinc-400 space-y-2">
              <li>Fraudulent bookings</li>
              <li>Harassment</li>
              <li>Uploading false information</li>
              <li>Unauthorized access</li>
              <li>Violation of applicable laws</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              7. Account Suspension
            </h2>

            <p className="text-zinc-400 leading-8">
              ROJSEWA reserves the right to suspend or terminate accounts that
              violate these terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              8. Limitation of Liability
            </h2>

            <p className="text-zinc-400 leading-8">
              ROJSEWA acts as a platform connecting users and providers. We are
              not responsible for disputes, damages, delays, or service quality
              provided by independent service providers.
            </p>
          </div>

        </section>

      </div>
    </div>
  );
};

export default TermsAndConditions;