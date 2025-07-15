import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const FadeInOnScroll = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{
      duration: 0.8,
      delay: delay,
      ease: [0.21, 0.45, 0.32, 0.9]
    }}
  >
    {children}
  </motion.div>
);

const TeamMember = ({ image, name, index, isDarkMode }) => (
  <FadeInOnScroll delay={0.8 + index * 0.2}>
    <div className="flex flex-col items-center space-y-4">
      <div
        className={`aspect-square rounded-2xl overflow-hidden shadow-xl 
          transition-all duration-300 group-hover:-translate-y-2 ${
          isDarkMode 
            ? 'shadow-blue-500/10' 
            : 'shadow-blue-500/20'
        }`}
      >
        {image ? (
          <div className="relative w-full h-full">
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className={`w-full h-full ${
            isDarkMode 
              ? 'bg-gray-800' 
              : 'bg-gray-100'
          } flex items-center justify-center`}>
            <span className={`text-6xl ${
              isDarkMode ? 'text-gray-700' : 'text-gray-300'
            }`}>
              {index + 1}
            </span>
          </div>
        )}
      </div>
      {name && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-center ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          <h4 className="text-xl font-semibold">{name}</h4>
        </motion.div>
      )}
    </div>
  </FadeInOnScroll>
);

const About = () => {
  const { isDarkMode } = useTheme();

  const storyContent = [
    {
      title: "The Challenge",
      content: `In today's digital age, we found ourselves drowning in an ocean of travel possibilities. 
      Countless destinations, endless attractions, and infinite combinations of itineraries – the paradox 
      of choice was real. As students passionate about travel, we noticed how our friends and family would 
      spend hours, sometimes days, trying to plan the perfect trip, only to feel overwhelmed and uncertain.`
    },
    {
      title: "The Realization",
      content: `That's when it hit us: what if we could harness the power of artificial intelligence to 
      cut through the noise? What if we could create a system that understands not just where you want to go, 
      but why you want to travel? A companion that could transform the overwhelming into the exciting, the 
      complex into the simple.`
    },
    {
      title: "The Solution",
      content: `And thus, TRAVISTA was born – your intelligent travel companion that understands your 
      preferences, considers your constraints, and crafts personalized itineraries that feel just right. 
      We've combined cutting-edge AI technology with our passion for travel to create a platform that makes 
      travel planning not just easier, but enjoyable.`
    }
  ];

  const teamMembers = [
    { name: "Sam Soloman", image: "/ai-trip-planner/public/images/sam.png" },
    { name: "Sanchiti Agrawal", image: "/ai-trip-planner/public/images/sanchiti.jpg" },
    { name: "Sangini Agrawal", image: "/ai-trip-planner/public/images/sangini.jpeg" }
  ];

  return (
    <section 
      id="about"
      className={`relative min-h-screen py-20 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-16">
          {/* Main Title */}
          <FadeInOnScroll>
            <h2 
              className={`text-5xl md:text-6xl font-bold mb-8 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}
            >
              Our Story
            </h2>
          </FadeInOnScroll>

          {/* Story Sections */}
          <div className="space-y-16 max-w-4xl mx-auto">
            {storyContent.map((section, index) => (
              <FadeInOnScroll key={section.title} delay={index * 0.2}>
                <div className="space-y-4">
                  <h3 
                    className={`text-2xl md:text-3xl font-semibold ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}
                  >
                    {section.title}
                  </h3>
                  <p 
                    className={`text-lg md:text-xl leading-relaxed ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}
                  >
                    {section.content}
                  </p>
                </div>
              </FadeInOnScroll>
            ))}
          </div>

          {/* Team Section */}
          <div className="pt-16">
            <FadeInOnScroll delay={0.6}>
              <h3 className={`text-3xl md:text-4xl font-semibold mb-12 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>
                Meet the Team
              </h3>
            </FadeInOnScroll>
            
            {/* Team Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
              {teamMembers.map((member, index) => (
                <TeamMember
                  key={index}
                  image={member.image}
                  name={member.name}
                  index={index}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>

            {/* University Info */}
            <FadeInOnScroll delay={1.4}>
              <div
                className={`text-xl md:text-2xl font-medium ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}
              >
                Pre-Final Year Students | Medi-Caps University
              </div>
            </FadeInOnScroll>
          </div>

          {/* Values Section */}
          <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Innovation",
                description: "Pushing boundaries with AI technology"
              },
              {
                title: "Simplicity",
                description: "Making travel planning effortless"
              },
              {
                title: "Personalization",
                description: "Crafting unique experiences for each traveler"
              }
            ].map((value, index) => (
              <FadeInOnScroll key={value.title} delay={1.6 + index * 0.2}>
                <div
                  className={`p-8 rounded-xl transition-colors duration-300 shadow-lg 
                    hover:shadow-xl ${
                    isDarkMode 
                      ? 'bg-gray-800/50 hover:bg-gray-800' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <h4 className={`text-xl font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}>
                    {value.title}
                  </h4>
                  <p className={`${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {value.description}
                  </p>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 