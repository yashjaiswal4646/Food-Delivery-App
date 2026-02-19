import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 text-white bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="text-center container-custom">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">Contact Us</h1>
          <p className="max-w-3xl mx-auto text-xl text-primary-100">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid gap-8 mb-12 lg:grid-cols-3">
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100">
                <FaMapMarkerAlt className="text-2xl text-primary-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Visit Us</h3>
              <p className="text-gray-600">
                123 Foodie Street<br />
                Culinary District<br />
                New York, NY 10001
              </p>
            </div>
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100">
                <FaPhone className="text-2xl text-primary-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Call Us</h3>
              <p className="text-gray-600">
                <a href="tel:+1234567890" className="hover:text-primary-600">
                  +1 (234) 567-890
                </a>
              </p>
              <p className="mt-2 text-gray-600">Mon-Fri: 9am - 6pm</p>
            </div>
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100">
                <FaEnvelope className="text-2xl text-primary-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Email Us</h3>
              <p className="text-gray-600">
                <a href="mailto:support@foodieexpress.com" className="hover:text-primary-600">
                  support@foodieexpress.com
                </a>
              </p>
              <p className="mt-2 text-gray-600">
                <a href="mailto:info@foodieexpress.com" className="hover:text-primary-600">
                  info@foodieexpress.com
                </a>
              </p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="p-8 bg-white rounded-lg shadow-md">
              <h2 className="mb-6 text-2xl font-bold">Send us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="input-field"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 btn-primary"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Map */}
            <div className="p-8 bg-white rounded-lg shadow-md">
              <h2 className="mb-6 text-2xl font-bold">Find Us</h2>
              <div className="overflow-hidden rounded-lg aspect-w-16 aspect-h-9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316c0a3c43%3A0xf6348b3f0b8a8e8f!2sCharging%20Bull!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="map"
                  className="rounded-lg"
                ></iframe>
              </div>
              <div className="flex items-center mt-4 text-gray-600">
                <FaClock className="mr-2 text-primary-600" />
                <span>Business Hours: Monday - Friday, 9am - 6pm EST</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;