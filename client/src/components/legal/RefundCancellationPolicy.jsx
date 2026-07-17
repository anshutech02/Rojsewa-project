import React from "react";

const RefundCancellationPolicy = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      <div className="max-w-5xl mx-auto px-6 py-20">

        <h1 className="text-4xl font-bold mb-3">
          Refund & Cancellation Policy
        </h1>

        <p className="text-zinc-400 mb-10">
          Effective Date: July 2026
        </p>

        <div className="space-y-10">

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              1. Introduction
            </h2>

            <p className="text-zinc-400 leading-8">
              ROJSEWA is an online marketplace that connects customers with
              independent local service providers. The refund and cancellation
              process depends on the booking status and, where applicable, the
              service provider's policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              2. Booking Cancellation
            </h2>

            <ul className="list-disc pl-6 text-zinc-400 space-y-3">
              <li>
                Customers may cancel a booking before the provider begins the
                service.
              </li>

              <li>
                Providers may cancel bookings due to emergencies,
                unavailability, or unforeseen circumstances.
              </li>

              <li>
                Frequent cancellation or misuse of the platform may result in
                account suspension.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              3. Refund Eligibility
            </h2>

            <ul className="list-disc pl-6 text-zinc-400 space-y-3">
              <li>
                Full refunds may be issued if a paid booking is cancelled before
                the provider starts the service.
              </li>

              <li>
                Refunds may be considered if the provider fails to arrive or
                cancels the booking.
              </li>

              <li>
                Refunds are generally not available once the service has been
                completed unless required by applicable law or approved after
                investigation.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              4. Refund Processing
            </h2>

            <p className="text-zinc-400 leading-8">
              Approved refunds will be processed to the original payment method.
              Processing times depend on banks and payment gateways and may take
              between 5–10 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              5. Disputes
            </h2>

            <p className="text-zinc-400 leading-8">
              If you believe a service was not delivered as agreed, you may
              raise a dispute through ROJSEWA. We will review the information
              provided by both the customer and the service provider before
              making a decision.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              6. Contact
            </h2>

            <p className="text-zinc-400 leading-8">
              For refund or cancellation related queries, please contact the
              ROJSEWA support team through the Contact Us page or the support
              email provided on our platform.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};

export default RefundCancellationPolicy;