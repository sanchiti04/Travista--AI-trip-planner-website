import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { isDarkMode } = useTheme();

  return (
    <footer className={`py-12 ${
      isDarkMode ? 'bg-black/50' : 'bg-white/50'
    } backdrop-blur-sm transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className={`text-xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Travista
            </h3>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Your AI-powered travel companion for unforgettable adventures.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              {['Home', 'Get Started', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    className={`text-sm hover:underline ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Resources
            </h4>
            <ul className="space-y-2">
              {['Blog', 'Travel Guides', 'FAQ', 'Support'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    className={`text-sm hover:underline ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Contact Us
            </h4>
            <ul className="space-y-2">
              <li className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Email: info@travista.com
              </li>
              <li className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Phone: +1 (555) 123-4567
              </li>
              <li className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Address: 123 Travel Street, Adventure City
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className={`mt-8 pt-8 border-t ${
          isDarkMode ? 'border-white/10' : 'border-gray-200'
        } text-center text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          © {new Date().getFullYear()} Travista. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 