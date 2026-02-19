import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'Orders & Delivery',
      questions: [
        {
          q: 'How do I place an order?',
          a: 'To place an order, simply browse our menu, add items to your cart, proceed to checkout, provide your delivery address, choose a payment method, and confirm your order. You\'ll receive a confirmation email once your order is placed.'
        },
        {
          q: 'How long does delivery take?',
          a: 'Delivery time varies depending on your location and the restaurant. Typically, delivery takes between 30-45 minutes. You can track your order status in real-time from the "My Orders" page.'
        },
        {
          q: 'Can I modify or cancel my order after placing it?',
          a: 'You can modify or cancel your order only if it\'s still in "pending" status. Once the restaurant starts preparing your order, changes cannot be made. Go to "My Orders" and click on the order to see if cancellation is available.'
        },
        {
          q: 'What if my order is late or missing items?',
          a: 'If your order is delayed or missing items, please contact our customer support immediately. We\'ll work with the restaurant to resolve the issue and ensure you\'re satisfied.'
        }
      ]
    },
    {
      category: 'Payment',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept multiple payment methods including Credit/Debit Cards, UPI (Google Pay, PhonePe, etc.), and Cash on Delivery. All payments are processed securely.'
        },
        {
          q: 'Is it safe to use my credit card on your site?',
          a: 'Yes, absolutely! We use industry-standard encryption and secure payment gateways. Your payment information is never stored on our servers.'
        },
        {
          q: 'Do you offer refunds?',
          a: 'If there\'s an issue with your order, please contact us within 24 hours. We\'ll review the case and may offer a refund or credit based on the situation.'
        }
      ]
    },
    {
      category: 'Account & Settings',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click on "Sign Up" in the top navigation bar, fill in your details, and submit the form. You\'ll be logged in automatically after successful registration.'
        },
        {
          q: 'I forgot my password. What should I do?',
          a: 'Click on "Login", then select "Forgot Password". Enter your email address, and we\'ll send you a link to reset your password.'
        },
        {
          q: 'How can I update my profile information?',
          a: 'After logging in, click on your name in the navigation bar and select "Profile". From there, you can update your name, phone number, and delivery address.'
        }
      ]
    },
    {
      category: 'Restaurants & Food',
      questions: [
        {
          q: 'How do you ensure food quality?',
          a: 'We partner with verified restaurants that maintain high hygiene and quality standards. We regularly review restaurants based on customer feedback and quality checks.'
        },
        {
          q: 'Can I order from multiple restaurants in one order?',
          a: 'Currently, each order can only be from one restaurant. If you want food from different restaurants, you\'ll need to place separate orders.'
        },
        {
          q: 'Do you offer vegetarian options?',
          a: 'Yes! Many restaurants offer vegetarian dishes. You can filter menu items by the "Vegetarian" option to see only vegetarian choices.'
        }
      ]
    }
  ];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 text-white bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="text-center container-custom">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">Frequently Asked Questions</h1>
          <p className="max-w-3xl mx-auto text-xl text-primary-100">
            Find answers to common questions about our service, ordering, payments, and more.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl container-custom">
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-primary-600">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, qIndex) => {
                  const uniqueIndex = `${catIndex}-${qIndex}`;
                  const isOpen = openIndex === uniqueIndex;
                  
                  return (
                    <div
                      key={qIndex}
                      className="overflow-hidden border border-gray-200 rounded-lg"
                    >
                      <button
                        onClick={() => toggleQuestion(uniqueIndex)}
                        className="flex items-center justify-between w-full p-4 text-left transition bg-white hover:bg-gray-50"
                      >
                        <span className="font-medium text-gray-900">{faq.q}</span>
                        {isOpen ? (
                          <FaChevronUp className="text-primary-600" />
                        ) : (
                          <FaChevronDown className="text-gray-400" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                          <p className="text-gray-600">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Still have questions */}
          <div className="p-8 mt-12 text-center rounded-lg bg-primary-50">
            <h3 className="mb-4 text-2xl font-bold">Still have questions?</h3>
            <p className="mb-6 text-gray-600">
              Can't find the answer you're looking for? Please contact our support team.
            </p>
            <a href="/contact" className="inline-block btn-primary">
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;