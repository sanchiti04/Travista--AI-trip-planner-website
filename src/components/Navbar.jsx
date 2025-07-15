import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  // Don't render navbar on view-trip pages
  if (location.pathname.includes('/view-trip')) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="font-bold text-xl text-gray-900">
              TRAVISTA
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/my-trips"
              className="px-4 py-2 rounded-lg transition-all duration-300 text-gray-900 hover:bg-gray-100"
            >
              My Trips
            </Link>
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-200">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 