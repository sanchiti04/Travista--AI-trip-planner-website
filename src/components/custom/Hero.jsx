import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

// Predefined background configurations
const BACKGROUNDS = {
  light: [
    {
      id: 'BGL1',
      url: '/bgl1.jpg',
      theme: {
        primary: '#1a1a1a',
        secondary: '#4a4a4a',
        accent: '#FF6B6B',
        overlay: '30'
      }
    },
    {
      id: 'BGL2',
      url: '/bgl2.jpg',
      theme: {
        primary: '#1a1a1a',
        secondary: '#4a4a4a',
        accent: '#4A90E2',
        overlay: '25'
      }
    },
    {
      id: 'BGL3',
      url: '/bgl3.jpg',
      theme: {
        primary: '#1a1a1a',
        secondary: '#4a4a4a',
        accent: '#FFD700',
        overlay: '35'
      }
    },
    {
      id: 'BGL4',
      url: '/bgl4.jpg',
      theme: {
        primary: '#1a1a1a',
        secondary: '#4a4a4a',
        accent: '#4CAF50',
        overlay: '30'
      }
    },
    {
      id: 'BGL5',
      url: '/bgl5.jpg',
      theme: {
        primary: '#1a1a1a',
        secondary: '#4a4a4a',
        accent: '#FF8C00',
        overlay: '25'
      }
    }
  ],
  dark: [
    {
      id: 'BGD1',
      url: '/bgd1.jpg',
      theme: {
        primary: '#ffffff',
        secondary: '#e0e0e0',
        accent: '#FF6B6B',
        overlay: '60'
      }
    },
    {
      id: 'BGD2',
      url: '/bgd2.jpg',
      theme: {
        primary: '#ffffff',
        secondary: '#e0e0e0',
        accent: '#4A90E2',
        overlay: '65'
      }
    },
    {
      id: 'BGD3',
      url: '/bgd3.jpg',
      theme: {
        primary: '#ffffff',
        secondary: '#e0e0e0',
        accent: '#FFD700',
        overlay: '55'
      }
    },
    {
      id: 'BGD4',
      url: '/bgd4.jpg',
      theme: {
        primary: '#ffffff',
        secondary: '#e0e0e0',
        accent: '#4CAF50',
        overlay: '60'
      }
    },
    {
      id: 'BGD5',
      url: '/bgd5.jpg',
      theme: {
        primary: '#ffffff',
        secondary: '#e0e0e0',
        accent: '#FF8C00',
        overlay: '55'
      }
    }
  ]
};

const Hero = () => {
  const { isDarkMode } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);
  const lastImageIndexRef = useRef(0);

  // Function to get a random image index excluding the current one
  const getRandomImageIndex = useCallback((mode) => {
    const images = BACKGROUNDS[mode];
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * images.length);
    } while (newIndex === lastImageIndexRef.current);
    lastImageIndexRef.current = newIndex;
    return newIndex;
  }, []);

  // Function to change background image
  const changeBackground = useCallback(() => {
    setIsTransitioning(true);
    const mode = isDarkMode ? 'dark' : 'light';
    const newIndex = getRandomImageIndex(mode);
    setCurrentImageIndex(newIndex);
    
    // Reset transition state after animation
    setTimeout(() => setIsTransitioning(false), 1000);
  }, [isDarkMode, getRandomImageIndex]);

  // Set up interval for background changes
  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set new interval (change background every 8 seconds)
    intervalRef.current = setInterval(changeBackground, 8000);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [changeBackground]);

  // Preload images for current mode
  useEffect(() => {
    const mode = isDarkMode ? 'dark' : 'light';
    BACKGROUNDS[mode].forEach(image => {
      const img = new Image();
      img.src = image.url;
    });
  }, [isDarkMode]);

  const currentMode = isDarkMode ? 'dark' : 'light';
  const currentImages = BACKGROUNDS[currentMode];
  const currentImage = currentImages[currentImageIndex];
  const { theme } = currentImage;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentMode}-${currentImage.id}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-b from-black/${currentImage.theme.overlay} via-black/30 to-black/${currentImage.theme.overlay}`} />
          <div 
            className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"
            style={{ 
              background: `linear-gradient(to right, ${currentImage.theme.accent}30, transparent, ${currentImage.theme.accent}30)`
            }}
          />
          
          <img
            src={currentImage.url}
            alt={`Background ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
            style={{ filter: isDarkMode ? 'brightness(0.8)' : 'brightness(1.1)' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-12"
        >
          {/* Hero Text */}
          <div className="space-y-8">
            <motion.h1 
              className="text-6xl md:text-8xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ color: theme.primary }}
            >
              <span className="drop-shadow-2xl">Discover Your Perfect</span>{" "}
              <span 
                className="relative"
                style={{ color: theme.accent }}
              >
                Journey
                <motion.span
                  className="absolute -inset-2 bg-white/10 rounded-lg blur-xl -z-10"
                  animate={{
                    opacity: [0.5, 0.7, 0.5],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ color: theme.secondary }}
            >
              Let our AI craft your dream vacation. Personalized itineraries, 
              hidden gems, and seamless planning at your fingertips.
            </motion.p>

            {/* Get Started Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-8"
            >
              <Link to="/create-trip">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${theme.accent}80` }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                    backgroundColor: theme.accent,
                    color: theme.primary
                  }}
                  className="px-12 py-6 rounded-2xl text-2xl font-bold 
                    shadow-lg transform transition-all duration-300
                    border-2 border-white/20 backdrop-blur-sm"
                >
                  Start Your Adventure
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-8"
            style={{ color: theme.secondary }}
          >
            {['AI-Powered Recommendations', 'Personalized Itineraries', '24/7 Travel Support'].map((feature) => (
              <motion.div
                key={feature}
                whileHover={{ y: -2, scale: 1.05 }}
                className="flex items-center space-x-2 backdrop-blur-sm bg-black/20 px-4 py-2 rounded-xl"
              >
                <span style={{ color: theme.accent }} className="text-xl">✦</span>
                <span className="text-lg font-medium">{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 right-8 flex flex-col items-center space-y-2"
        style={{ color: theme.primary }}
      >
        <span className="text-sm font-medium">Scroll to explore</span>
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;