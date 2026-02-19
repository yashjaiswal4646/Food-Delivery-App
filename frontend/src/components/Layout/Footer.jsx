import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="mt-auto text-white bg-gray-900">
      <div className="py-12 container-custom">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-xl font-bold">FoodieExpress</h3>
            <p className="mb-4 text-gray-400">
              Delicious food delivered to your doorstep. Order now and enjoy!
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 transition hover:text-white">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 transition hover:text-white">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 transition hover:text-white">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 transition hover:text-white">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 transition hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-400 transition hover:text-white">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-400 transition hover:text-white">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 transition hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-400 transition hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 transition hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 transition hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 transition hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Contact Info</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📍 123 Food Street, City</li>
              <li>📞 +1 234 567 890</li>
              <li>✉️ info@foodieexpress.com</li>
              <li>🕒 Mon-Sun: 10AM - 11PM</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 text-center text-gray-400 border-t border-gray-800">
          <p>&copy; {new Date().getFullYear()} FoodieExpress. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;