import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  // Don't render navbar on view-trip pages
  if (location.pathname.includes('/view-trip')) {
    return null;
  }

  // Color palette
  const colors = {
    light: {
      primary: "#2C3E50", // Deep slate blue
      secondary: "#34495E", // Muted blue-gray
      accent: "#3498DB", // Soft blue
      text: "#2C3E50", // Deep slate blue
      hover: "#2980B9", // Darker blue
      background: "rgba(255, 255, 255, 0.85)",
      shadow: "rgba(44, 62, 80, 0.1)",
    },
    dark: {
      primary: "#ECF0F1", // Soft white
      secondary: "#BDC3C7", // Light gray
      accent: "#3498DB", // Soft blue
      text: "#ECF0F1", // Soft white
      hover: "#2980B9", // Darker blue
      background: "rgba(44, 62, 80, 0.85)",
      shadow: "rgba(0, 0, 0, 0.2)",
    }
  };

  // Navigation items with scroll targets
  const navItems = [
    { name: "Home", path: "/", isHash: true, target: "home" },
    { name: "Get Started", path: "/create-trip", isHash: false },
    { name: "About", path: "/", isHash: true, target: "about" },
    { name: "Contact", path: "/", isHash: true, target: "contact" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (location.pathname === '/') {
        // Update active section based on scroll position
        const sections = ['home', 'about', 'contact'];
        const currentSection = sections.find(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });

        if (currentSection) {
          setActiveSection(currentSection);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const isBackgroundDark = () => {
    return isScrolled || isDarkMode;
  };

  const handleNavClick = (e, item) => {
    e.preventDefault();
    if (item.isHash) {
      if (location.pathname !== '/') {
        navigate('/');
        // Wait for navigation to complete before scrolling
        setTimeout(() => {
          const element = document.getElementById(item.target);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        }, 100);
      } else {
        const element = document.getElementById(item.target);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    } else {
      navigate(item.path);
    }
    setIsMenuOpen(false);
  };

  const currentColors = isBackgroundDark() ? colors.dark : colors.light;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
      style={{
        backgroundColor: isScrolled ? currentColors.background : "transparent",
        boxShadow: isScrolled ? `0 4px 20px ${currentColors.shadow}` : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => handleNavClick(e, { isHash: true, target: 'home', path: '/' })}
            className="relative group"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <motion.img
                src="/logo.png"
                alt="Travista Logo"
                className="h-40 w-auto transition-all duration-500"
                style={{
                  filter: `drop-shadow(0 0 8px ${currentColors.primary}30)`,
                }}
              />
            </motion.div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                onClick={(e) => handleNavClick(e, item)}
                className={`text-lg font-medium transition-all duration-300 relative group ${
                  isBackgroundDark()
                    ? "text-white/90 hover:text-white"
                    : "text-gray-700/90 hover:text-gray-900"
                }`}
              >
                {item.name}
                <motion.span
                  className={`absolute bottom-0 left-0 h-0.5 bg-current transition-all duration-300 ${
                    item.isHash && activeSection === item.target && location.pathname === '/'
                      ? 'w-full'
                      : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            ))}
          </div>

          {/* Dark Mode Toggle and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-3 rounded-full transition-all duration-300 backdrop-blur-sm ${
                isBackgroundDark()
                  ? "bg-white/10 text-white/90 hover:bg-white/20 hover:text-white"
                  : "bg-gray-900/10 text-gray-700/90 hover:bg-gray-900/20 hover:text-gray-900"
              }`}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
            </motion.button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
                isBackgroundDark()
                  ? "text-white/90 hover:text-white hover:bg-white/10"
                  : "text-gray-700/90 hover:text-gray-900 hover:bg-gray-100/80"
              }`}
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{ height: isMenuOpen ? "auto" : 0 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                onClick={(e) => handleNavClick(e, item)}
                className={`block text-lg font-medium transition-all duration-300 ${
                  isBackgroundDark()
                    ? "text-white/90 hover:text-white"
                    : "text-gray-700/90 hover:text-gray-900"
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 