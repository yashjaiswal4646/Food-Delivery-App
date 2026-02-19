import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 text-white bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="text-center container-custom">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">Terms of Service</h1>
          <p className="max-w-3xl mx-auto text-xl text-primary-100">
            Please read these terms carefully before using our service.
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
                <h2 className="mb-4 text-2xl font-bold">1. Agreement to Terms</h2>
                <p className="text-gray-600">
                  By accessing or using FoodieExpress ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold">2. Description of Service</h2>
                <p className="text-gray-600">
                  FoodieExpress provides an online platform that connects users with local restaurants for food delivery and pickup. We facilitate the ordering and delivery process but are not responsible for the quality of food prepared by restaurants.
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold">3. Accounts</h2>
                <p className="mb-4 text-gray-600">When you create an account with us, you must provide accurate and complete information. You are responsible for:</p>
                <ul className="pl-6 space-y-2 text-gray-600 list-disc">
                  <li>Maintaining the security of your account</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                </ul>
                <p className="mt-4 text-gray-600">
                  We reserve the right to suspend or terminate accounts that violate these terms.
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold">4. Orders and Payments</h2>
                <p className="mb-4 text-gray-600">By placing an order through our Service, you agree to:</p>
                <ul className="pl-6 space-y-2 text-gray-600 list-disc">
                  <li>Pay all charges associated with your order</li>
                  <li>Provide accurate payment information</li>
                  <li>Authorize us to charge your selected payment method</li>
                </ul>
                <p className="mt-4 text-gray-600">
                  Prices are subject to change without notice. We reserve the right to refuse or cancel orders at any time.
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold">5. Delivery</h2>
                <p className="mb-4 text-gray-600">Delivery times are estimates and not guaranteed. Factors that may affect delivery include:</p>
                <ul className="pl-6 space-y-2 text-gray-600 list-disc">
                  <li>Restaurant preparation time</li>
                  <li>Traffic conditions</li>
                  <li>Weather conditions</li>
                  <li>Order volume</li>
                </ul>
                <p className="mt-4 text-gray-600">
                  We are not liable for delays beyond our reasonable control.
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold">6. Cancellations and Refunds</h2>
                <p className="mb-4 text-gray-600">Orders can be cancelled only while in "pending" status. Once preparation begins, cancellations may not be possible.</p>
                <p className="text-gray-600">
                  Refunds are handled on a case-by-case basis. Please contact customer support within 24 hours if you have issues with your order.
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold">7. User Conduct</h2>
                <p className="mb-4 text-gray-600">You agree not to:</p>
                <ul className="pl-6 space-y-2 text-gray-600 list-disc">
                  <li>Use the Service for any illegal purpose</li>
                  <li>Harass, abuse, or harm others</li>
                  <li>Impersonate any person or entity</li>
                  <li>Interfere with the proper functioning of the Service</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold">8. Intellectual Property</h2>
                <p className="text-gray-600">
                  The Service and its original content, features, and functionality are owned by FoodieExpress and are protected by international copyright, trademark, and other intellectual property laws.
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold">9. Limitation of Liability</h2>
                <p className="text-gray-600">
                  To the maximum extent permitted by law, FoodieExpress shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold">10. Changes to Terms</h2>
                <p className="text-gray-600">
                  We reserve the right to modify or replace these Terms at any time. We will provide notice of significant changes by posting the new Terms on this page with an updated effective date.
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-bold">11. Contact Information</h2>
                <p className="text-gray-600">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <p className="mt-2 text-gray-600">
                  Email: legal@foodieexpress.com<br />
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

export default Terms;