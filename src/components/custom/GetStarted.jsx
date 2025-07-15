import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ArrowRight, MapPin, Calendar, Users } from 'lucide-react';

const GetStarted = () => {
  const { isDarkMode } = useTheme();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.03,
      boxShadow: isDarkMode 
        ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)" 
        : "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };
  
  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: isDarkMode 
        ? "0 10px 15px -3px rgba(52, 152, 219, 0.4)" 
        : "0 10px 15px -3px rgba(52, 152, 219, 0.3)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.98
    }
  };
  
  const featureRef = useRef(null);
  const isFeatureInView = useInView(featureRef, { once: true, amount: 0.2 });
  
  const stepsRef = useRef(null);
  const isStepsInView = useInView(stepsRef, { once: true, amount: 0.2 });
  
  const ctaRef = useRef(null);
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.2 });

  return (
    <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Features Section */}
      <motion.div 
        ref={featureRef}
        initial="hidden"
        animate={isFeatureInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Why Choose Travista?</h2>
            <p className={`text-base sm:text-lg ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } max-w-3xl mx-auto`}>
              Our AI-powered platform makes trip planning effortless and personalized.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />,
                title: "Smart Destination Suggestions",
                description: "Get personalized recommendations based on your preferences and travel style."
              },
              {
                icon: <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />,
                title: "Optimized Itineraries",
                description: "AI creates day-by-day plans that maximize your time and experiences."
              },
              {
                icon: <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />,
                title: "Group Travel Made Easy",
                description: "Plan trips for any group size with customized activities for everyone."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className={`p-6 sm:p-8 rounded-xl ${
                  isDarkMode 
                    ? 'bg-gray-700 shadow-lg' 
                    : 'bg-white shadow-md'
                }`}
              >
                <div className="mb-3 sm:mb-4">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className={`text-sm sm:text-base ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* How It Works Section */}
      <motion.div 
        ref={stepsRef}
        initial="hidden"
        animate={isStepsInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-16 sm:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">How It Works</h2>
            <p className={`text-base sm:text-lg ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } max-w-3xl mx-auto`}>
              Planning your perfect trip is just a few steps away.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                number: "01",
                title: "Tell us your preferences",
                description: "Share your travel style, interests, and must-see destinations."
              },
              {
                number: "02",
                title: "Get your AI itinerary",
                description: "Our AI creates a personalized day-by-day plan for your trip."
              },
              {
                number: "03",
                title: "Customize your plan",
                description: "Fine-tune your itinerary to match your exact preferences."
              },
              {
                number: "04",
                title: "Book and enjoy",
                description: "Book your accommodations and activities, then enjoy your trip!"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className={`relative p-5 sm:p-6 rounded-xl ${
                  isDarkMode 
                    ? 'bg-gray-700' 
                    : 'bg-gray-50'
                }`}
              >
                <div className={`absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold ${
                  isDarkMode 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-blue-500 text-white'
                }`}>
                  {step.number}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mt-3 sm:mt-4 mb-2">{step.title}</h3>
                <p className={`text-sm sm:text-base ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* CTA Section */}
      <motion.div 
        ref={ctaRef}
        initial="hidden"
        animate={isCtaInView ? "visible" : "hidden"}
        variants={containerVariants}
        className={`py-16 sm:py-20 ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Ready to Start Your Adventure?</h2>
            <p className={`text-base sm:text-lg ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } max-w-3xl mx-auto mb-6 sm:mb-8`}>
              Let Travista help you plan the trip of a lifetime.
            </p>
            <Link to="/create-trip">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium ${
                  isDarkMode 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                } transition-all duration-300 flex items-center gap-2 mx-auto`}
              >
                Create Your Trip Now
                <ArrowRight size={18} className="hidden sm:block" />
                <ArrowRight size={16} className="sm:hidden" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default GetStarted; 