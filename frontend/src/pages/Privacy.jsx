import React from 'react';

const Privacy = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 text-white bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="text-center container-custom">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">Privacy Policy</h1>
          <p className="max-w-3xl mx-auto text-xl text-primary-100">
            We value your privacy and are committed to protecting your personal information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl container-custom">
          <div className="p-8 bg-white rounded-lg shadow-md">
            <p className="mb-6 text-gray-600">Last Updated: January 1, 2024</p>

            <div className="space-y-8">
              <div>
                <h2 className="mb-4 text-2xl font-bold">1. Introduction</h2>
                <p className="mb-4 text-gray-600">
                  FoodieExpress ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our food delivery service, website, and mobile application.
                </p>
                <p className="text-gray-600">
                  Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold">2. Information We Collect</h2>
                <p className="mb-4 text-gray-600">We may collect personal information that you voluntarily provide to us when you:</p>
                <ul className="pl-6 mb-4 space-y-2 text-gray-600 list-disc">
                  <li>Register for an account</li>
                  <li>Place an order</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Contact customer support</li>
                  <li>Participate in promotions or surveys</li>
                </ul>
                <p className="text-gray-600">The personal information we collect may include:</p>
                <ul className="pl-6 space-y-2 text-gray-600 list-disc">
                  <li>Name and contact information (email, phone number, address)</li>
                  <li>Payment information (processed securely by our payment partners)</li>
                  <li>Order history and preferences</li>
                  <li>Device and usage information</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold">3. How We Use Your Information</h2>
                <p className="mb-4 text-gray-600">We use the information we collect to:</p>
                <ul className="pl-6 space-y-2 text-gray-600 list-disc">
                  <li>Process and deliver your orders</li>
                  <li>Communicate with you about your orders</li>
                  <li>Improve our services and user experience</li>
                  <li>Send you promotional offers (with your consent)</li>
                  <li>Prevent fraud and ensure security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold">4. Sharing Your Information</h2>
                <p className="mb-4 text-gray-600">We may share your information with:</p>
                <ul className="pl-6 space-y-2 text-gray-600 list-disc">
                  <li><span className="font-semibold">Restaurants:</span> To fulfill your orders</li>
                  <li><span className="font-semibold">Delivery Partners:</span> To deliver your orders</li>
                  <li><span className="font-semibold">Payment Processors:</span> To process payments securely</li>
                  <li><span className="font-semibold">Service Providers:</span> Who assist in operating our business</li>
                </ul>
                <p className="mt-4 text-gray-600">
                  We do not sell your personal information to third parties.
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold">5. Data Security</h2>
                <p className="text-gray-600">
                  We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee its absolute security.
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold">6. Your Rights</h2>
                <p className="mb-4 text-gray-600">You have the right to:</p>
                <ul className="pl-6 space-y-2 text-gray-600 list-disc">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold">7. Cookies and Tracking</h2>
                <p className="text-gray-600">
                  We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and personalize content. You can control cookies through your browser settings.
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold">8. Children's Privacy</h2>
                <p className="text-gray-600">
                  Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold">9. Changes to This Policy</h2>
                <p className="text-gray-600">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated effective date.
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold">10. Contact Us</h2>
                <p className="text-gray-600">
                  If you have questions about this Privacy Policy, please contact us at:
                </p>
                <p className="mt-2 text-gray-600">
                  Email: privacy@foodieexpress.com<br />
                  Phone: +1 (234) 567-890<br />
                  Address: 123 Foodie Street, New York, NY 10001
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;