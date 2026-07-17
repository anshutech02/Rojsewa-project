import React from "react";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      <div className="max-w-5xl mx-auto px-6 py-20">

        <h1 className="text-4xl font-bold mb-3">
          Disclaimer
        </h1>

        <p className="text-zinc-400 mb-10">
          Please read this disclaimer carefully before using ROJSEWA.
        </p>

        <section className="space-y-8">

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              Independent Service Providers
            </h2>

            <p className="text-zinc-400 leading-8">
              ROJSEWA is an online marketplace that connects customers with
              independent service providers. We do not employ or supervise these
              providers.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              No Warranty
            </h2>

            <p className="text-zinc-400 leading-8">
              Services are provided on an "as is" and "as available" basis. We
              make no warranties regarding availability, quality, or outcomes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              Accuracy
            </h2>

            <p className="text-zinc-400 leading-8">
              While we strive to keep information accurate, we cannot guarantee
              the completeness or correctness of listings, pricing, or provider
              details.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              External Services
            </h2>

            <p className="text-zinc-400 leading-8">
              ROJSEWA may use third-party services including Google
              Authentication, Firebase, Razorpay, Map providers, WhatsApp,
              Email providers, and analytics tools. Their use is governed by
              their respective privacy policies and terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">
              Limitation of Liability
            </h2>

            <p className="text-zinc-400 leading-8">
              ROJSEWA shall not be liable for any direct, indirect, incidental,
              or consequential damages arising from the use of our platform or
              services offered by third-party providers.
            </p>
          </div>

        </section>

      </div>
    </div>
  );
};

export default Disclaimer;