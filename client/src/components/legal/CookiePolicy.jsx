import React from "react";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      <div className="max-w-5xl mx-auto px-6 py-20">

        <h1 className="text-4xl font-bold mb-3">
          Cookie Policy
        </h1>

        <p className="text-zinc-400 mb-10">
          Effective Date: July 2026
        </p>

        <div className="space-y-10">

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              1. What Are Cookies?
            </h2>

            <p className="text-zinc-400 leading-8">
              Cookies are small text files stored on your device that help
              websites remember your preferences, maintain login sessions, and
              improve your browsing experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              2. How ROJSEWA Uses Cookies
            </h2>

            <ul className="list-disc pl-6 text-zinc-400 space-y-3">
              <li>Maintain secure login sessions.</li>
              <li>Remember user preferences.</li>
              <li>Authenticate users.</li>
              <li>Improve website performance.</li>
              <li>Detect suspicious or fraudulent activity.</li>
              <li>Analyze platform usage and traffic.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              3. Types of Cookies We Use
            </h2>

            <div className="overflow-x-auto">

              <table className="w-full border border-zinc-800">

                <thead className="bg-zinc-900">

                  <tr>

                    <th className="border border-zinc-800 p-3 text-left">
                      Type
                    </th>

                    <th className="border border-zinc-800 p-3 text-left">
                      Purpose
                    </th>

                  </tr>

                </thead>

                <tbody>

                  <tr>
                    <td className="border border-zinc-800 p-3">
                      Essential
                    </td>

                    <td className="border border-zinc-800 p-3">
                      Authentication and security.
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-zinc-800 p-3">
                      Functional
                    </td>

                    <td className="border border-zinc-800 p-3">
                      Save preferences and settings.
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-zinc-800 p-3">
                      Analytics
                    </td>

                    <td className="border border-zinc-800 p-3">
                      Understand how users interact with ROJSEWA.
                    </td>
                  </tr>

                </tbody>

              </table>

            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              4. Third-Party Services
            </h2>

            <p className="text-zinc-400 leading-8">
              Third-party providers such as Google Authentication, Firebase,
              Razorpay, Map services, analytics providers, and other integrated
              services may place their own cookies. These cookies are governed
              by their respective privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              5. Managing Cookies
            </h2>

            <p className="text-zinc-400 leading-8">
              Most web browsers allow you to view, block, or delete cookies.
              Disabling essential cookies may affect the functionality of
              ROJSEWA, including login and booking features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              6. Updates
            </h2>

            <p className="text-zinc-400 leading-8">
              We may update this Cookie Policy from time to time. Changes become
              effective once they are published on this page.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};

export default CookiePolicy;