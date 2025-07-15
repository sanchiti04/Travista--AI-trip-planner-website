import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  FaHotel, FaMapMarkedAlt, FaCalendarAlt, FaMoneyBillWave, 
  FaUsers, FaUtensils, FaBus, FaShieldAlt, FaClock, FaSun,
  FaWifi, FaCoffee, FaPlane, FaStar, FaThermometerHalf
} from "react-icons/fa";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTheme } from "@/context/ThemeContext";
import { Badge } from "@/components/ui/badge";

const ViewTrip = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { isDarkMode, toggleTheme } = useTheme();

  // Add currency formatting utility
  const formatINR = (amount) => {
    // If amount is already formatted with ₹, return as is
    if (typeof amount === 'string' && amount.includes('₹')) {
      return amount;
    }

    // If amount is a string containing a range (e.g., "1000-2000")
    if (typeof amount === 'string' && amount.includes('-')) {
      const [min, max] = amount.split('-').map(num => num.trim().replace(/[^\d.]/g, ''));
      return `₹${formatINR(min)} - ₹${formatINR(max)}`;
    }

    // If amount is a number or numeric string, format it
    const num = parseFloat(amount);
    if (isNaN(num)) return amount; // Return original if not a valid number

    // Format with Indian numbering system (e.g., 1,00,000)
    return num.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    exit: { opacity: 0, y: -20 }
  };

  useEffect(() => {
    const fetchTripData = () => {
      try {
        const trips = JSON.parse(localStorage.getItem("trips") || "[]");
        const foundTrip = trips.find(t => t.id === tripId);
        
        if (!foundTrip) {
          toast.error("Trip not found");
          navigate("/create-trip");
          return;
        }

        // Validate destination-specific content
        if (!foundTrip.tripData?.destination?.name) {
          toast.error("Invalid trip data - missing destination information");
          navigate("/create-trip");
          return;
        }

        setTrip(foundTrip);
      } catch (error) {
        console.error("Error fetching trip:", error);
        toast.error("Error loading trip details");
        navigate("/create-trip");
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId, navigate]);

  const getIntensityColor = (intensity) => {
    // Handle undefined/null values with a default
    if (!intensity) return 'bg-gray-500';
    
    // Safely convert to lowercase and handle the cases
    switch (intensity.toString().toLowerCase()) {
      case 'light': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'intense': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const renderStars = (rating) => {
    // Handle undefined/null values
    const safeRating = Number(rating) || 0;
    return [...Array(5)].map((_, index) => (
      <FaStar 
        key={index} 
        className={index < safeRating ? 'text-yellow-400' : 'text-gray-300'} 
      />
    ));
  };

  // Ensure arrays are valid before mapping
  const ensureArray = (data) => Array.isArray(data) ? data : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!trip || !trip.userChoice || !trip.tripData) {
    return null;
  }

  const { userChoice, tripData } = trip;
  const destinationName = tripData.destination?.name || userChoice?.location?.label || "Your Destination";

  // Ensure all required data exists with proper initialization
  const tripIntensity = tripData?.tripIntensity || 'moderate';
  const tripSummary = tripData?.tripSummary || `Trip details for ${destinationName} are not available yet`;
  const budgetBreakdown = tripData?.budgetBreakdown || {};
  const bestTimeToVisit = tripData?.bestTimeToVisit || `Information about the best time to visit ${destinationName} is not available yet`;
  const transportationTips = tripData?.transportationTips || `Transportation information for ${destinationName} is not available yet`;
  const localCuisine = ensureArray(tripData?.localCuisine);
  const safetyTips = ensureArray(tripData?.safetyTips);
  const hotels = ensureArray(tripData?.hotels);
  const itinerary = ensureArray(tripData?.itinerary);
  const additionalInfo = {
    travelTips: ensureArray(tripData?.additionalInfo?.travelTips),
    localEtiquette: ensureArray(tripData?.additionalInfo?.localEtiquette),
    currency: tripData?.additionalInfo?.currency || { 
      name: 'Local currency', 
      exchangeRate: 'Exchange rate not available', 
      tips: `Currency information for ${destinationName} is not available yet` 
    },
    seasons: tripData?.additionalInfo?.seasons || {
      spring: `Spring information for ${destinationName} is not available yet`,
      summer: `Summer information for ${destinationName} is not available yet`,
      fall: `Fall information for ${destinationName} is not available yet`,
      winter: `Winter information for ${destinationName} is not available yet`
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Theme Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="fixed top-4 right-20 p-3 rounded-full bg-white/10 backdrop-blur-sm dark:bg-gray-800/10 shadow-lg z-50"
      >
        {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaSun className="text-gray-600" />}
      </motion.button>

      {/* User Profile */}
      <motion.div
        className="fixed top-4 right-4 w-12 h-12 rounded-full overflow-hidden shadow-lg z-50"
        whileHover={{ scale: 1.05 }}
      >
        <img
          src={JSON.parse(localStorage.getItem("user"))?.picture || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Your Trip to {destinationName}
          </h1>
          <div className="flex items-center justify-center space-x-2 text-lg text-gray-600 dark:text-gray-300">
            <span>{userChoice?.noOfDays || userChoice?.customDays || '0'} days</span>
            <span>•</span>
            <span>{userChoice?.travelingWith || 'Solo'}</span>
            <span>•</span>
            <span>{userChoice?.budget || userChoice?.customBudget || 'Budget'}</span>
            <span>•</span>
            <Badge 
              className={`${getIntensityColor(tripIntensity)} text-white`}
            >
              {tripIntensity} intensity
            </Badge>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs 
          defaultValue="overview" 
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="flex justify-center mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="info">Additional Info</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            <TabsContent value="overview">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid gap-6"
              >
                {/* Trip Summary */}
                <motion.div variants={itemVariants} className="bg-white/95 dark:bg-gray-800/95 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <FaMapMarkedAlt className="mr-2" /> Trip Summary
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{tripSummary}</p>
                </motion.div>

                {/* Budget Breakdown */}
                <motion.div variants={itemVariants} className="bg-white/95 dark:bg-gray-800/95 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <FaMoneyBillWave className="mr-2" /> Budget Breakdown
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(budgetBreakdown || {}).map(([category, amount]) => (
                      <div key={category} className="text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{category}</p>
                        <p className="font-semibold">{formatINR(amount)}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Quick Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Best Time to Visit */}
                  <motion.div variants={itemVariants} className="bg-white/95 dark:bg-gray-800/95 rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FaSun className="mr-2" /> Best Time to Visit
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{bestTimeToVisit}</p>
                  </motion.div>

                  {/* Transportation */}
                  <motion.div variants={itemVariants} className="bg-white/95 dark:bg-gray-800/95 rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FaBus className="mr-2" /> Transportation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{transportationTips}</p>
                  </motion.div>

                  {/* Local Cuisine */}
                  <motion.div variants={itemVariants} className="bg-white/95 dark:bg-gray-800/95 rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FaUtensils className="mr-2" /> Local Cuisine
                    </h3>
                    <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                      {localCuisine.length > 0 ? (
                        localCuisine.map((item, index) => {
                          // Handle both string and object formats
                          if (typeof item === 'string') {
                            return <li key={index} className="list-disc list-inside">{item}</li>;
                          }
                          // Handle object format with dish, context, location, and cost
                          return (
                            <li key={index} className="pb-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                              <div className="font-medium">{item.dish}</div>
                              {item.context && (
                                <div className="text-sm mt-1">{item.context}</div>
                              )}
                              <div className="text-sm mt-1 flex justify-between items-center">
                                {item.location && (
                                  <span className="text-gray-500">📍 {item.location}</span>
                                )}
                                {item.cost && (
                                  <span className="text-gray-500">{formatINR(item.cost)}</span>
                                )}
                              </div>
                            </li>
                          );
                        })
                      ) : (
                        <li>Local cuisine information for {destinationName} is not available yet</li>
                      )}
                    </ul>
                  </motion.div>

                  {/* Safety Tips */}
                  <motion.div variants={itemVariants} className="bg-white/95 dark:bg-gray-800/95 rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FaShieldAlt className="mr-2" /> Safety Tips
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                      {safetyTips.length > 0 ? (
                        safetyTips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))
                      ) : (
                        <li>Safety information for {destinationName} is not available yet</li>
                      )}
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Hotels Tab */}
            <TabsContent value="hotels">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {hotels.length > 0 ? (
                  hotels.map((hotel, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="bg-white/95 dark:bg-gray-800/95 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="relative h-48">
                        <img
                          src={hotel.imageUrl || 'https://via.placeholder.com/400x300?text=Hotel+Image'}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex">
                          {renderStars(hotel.rating)}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{hotel.description}</p>
                        <div className="space-y-2">
                          <p className="text-sm"><strong>Price Range:</strong> {formatINR(hotel.priceRange)}</p>
                          <p className="text-sm"><strong>Address:</strong> {hotel.address}</p>
                          <div className="mt-4">
                            <strong className="text-sm block mb-2">Amenities:</strong>
                            <div className="flex flex-wrap gap-2">
                              {ensureArray(hotel.amenities).map((amenity, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No hotel information available
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Itinerary Tab */}
            <TabsContent value="itinerary">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                {itinerary.length > 0 ? (
                  itinerary.map((day, dayIndex) => (
                    <motion.div
                      key={dayIndex}
                      variants={itemVariants}
                      className="bg-white/95 dark:bg-gray-800/95 rounded-xl p-6 shadow-lg"
                    >
                      <h3 className="text-xl font-semibold mb-4">Day {dayIndex + 1}</h3>
                      <div className="space-y-6">
                        {ensureArray(day?.activities).map((activity, actIndex) => (
                          <div 
                            key={actIndex}
                            className="border-l-4 border-purple-500 pl-4 py-2"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-medium">{activity.name}</h4>
                              <div className="flex items-center space-x-2">
                                <Badge>{activity.duration}</Badge>
                                <Badge variant="outline">{activity.time}</Badge>
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-2">
                              {activity.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {ensureArray(activity.tags).map((tag, tagIndex) => (
                                <Badge 
                                  key={tagIndex}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            {activity.entryFee && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Entry Fee: {formatINR(activity.entryFee)}
                              </p>
                            )}
                            {activity.nearbyPlaces && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Nearby: {ensureArray(activity.nearbyPlaces).join(', ')}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No itinerary information available
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Additional Info Tab */}
            <TabsContent value="info">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Travel Tips */}
                <motion.div variants={itemVariants} className="bg-white/95 dark:bg-gray-800/95 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Travel Tips</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    {additionalInfo.travelTips.length > 0 ? (
                      additionalInfo.travelTips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          {tip}
                        </li>
                      ))
                    ) : (
                      <li>No travel tips available</li>
                    )}
                  </ul>
                </motion.div>

                {/* Local Etiquette */}
                <motion.div variants={itemVariants} className="bg-white/95 dark:bg-gray-800/95 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Local Etiquette</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    {additionalInfo.localEtiquette.length > 0 ? (
                      additionalInfo.localEtiquette.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          {item}
                        </li>
                      ))
                    ) : (
                      <li>No etiquette information available</li>
                    )}
                  </ul>
                </motion.div>

                {/* Currency Info */}
                <motion.div variants={itemVariants} className="bg-white/95 dark:bg-gray-800/95 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Currency Information</h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-300">
                    <p><strong>Local Currency:</strong> {additionalInfo.currency.name}</p>
                    <p><strong>Symbol:</strong> {additionalInfo.currency.symbol || '₹'}</p>
                    <p><strong>Exchange Rate:</strong> {additionalInfo.currency.exchangeRate}</p>
                    <p><strong>Tips:</strong> {additionalInfo.currency.tips}</p>
                  </div>
                </motion.div>

                {/* Weather & Seasons */}
                <motion.div variants={itemVariants} className="bg-white/95 dark:bg-gray-800/95 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Weather & Best Seasons</h3>
                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                    {Object.entries(additionalInfo.seasons || {}).length > 0 ? (
                      Object.entries(additionalInfo.seasons).map(([season, info]) => (
                        <div key={season}>
                          <h4 className="font-medium mb-1 capitalize">{season}</h4>
                          <p>{info}</p>
                        </div>
                      ))
                    ) : (
                      <p>No seasonal information available</p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
};

export default ViewTrip;
