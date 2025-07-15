import React, { useEffect, useState } from "react";
import axios from "axios";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import _ from "lodash";
import { Input } from "@/components/ui/input";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelList,
} from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chatSession, sendGeminiPromptWithRetry } from "@/service/AIModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { FaUsers, FaUser, FaUserFriends, FaCalendarAlt, FaMoneyBillWave, FaPlus, FaChevronDown, FaMapMarkerAlt, FaPlane, FaSuitcase, FaHeart } from "react-icons/fa";
import { MdLocationOn, MdFamilyRestroom, MdGroups } from "react-icons/md";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/ThemeContext";

const FloatingElement = ({ children, delay = 0, scale = 1, className = "" }) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ 
        y: [-10, 10, -10],
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      style={{ scale }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const BackgroundBlob = ({ color, size, position, delay }) => {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 ${size} ${position}`}
      style={{ background: color }}
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 180, 0],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
        delay,
      }}
    />
  );
};

const Sparkle = ({ delay = 0, className = "" }) => {
  return (
    <motion.div
      className={`absolute w-1 h-1 bg-white rounded-full ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
};

const FloatingEmoji = ({ emoji, delay = 0, className = "" }) => {
  return (
    <motion.div
      initial={{ y: 0, opacity: 0 }}
      animate={{ 
        y: [-20, 20, -20],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className={`text-4xl ${className}`}
    >
      {emoji}
    </motion.div>
  );
};

const ParticleTrail = () => {
  return (
    <motion.div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 1000 1000" fill="none">
        <motion.circle
          cx="500"
          cy="500"
          r="2"
          fill="white"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            cx: [500, 700, 500],
            cy: [500, 300, 500],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </motion.div>
  );
};

const TravelPath = () => {
  return (
    <motion.div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d="M100,500 C300,100 700,900 900,500"
          stroke="url(#travel-gradient)"
          strokeWidth="2"
          strokeDasharray="10,10"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: [0, 1, 1],
            opacity: [0, 0.15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <defs>
          <linearGradient id="travel-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

const CreateTrip = () => {
  const [place, setPlace] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: "",
    noOfDays: "",
    budget: "",
    noOfPeople: "",
    travelingWith: "",
    customDays: "",
    customBudget: "",
  });
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [openCustomDays, setOpenCustomDays] = useState(false);
  const [openCustomBudget, setOpenCustomBudget] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");
  const { scrollYProgress } = useScroll();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.99]);
  const yOffset = useTransform(scrollYProgress, [0, 0.5], [0, -20]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    console.log(formData);

    // Fetch a random travel-related background image from Unsplash
    fetch("https://api.unsplash.com/photos/random?query=travel-destination-landscape&orientation=landscape&client_id=YOUR_UNSPLASH_API_KEY")
      .then(res => res.json())
      .then(data => {
        setBackgroundImage(data.urls.regular);
      })
      .catch(() => {
        // Fallback to a default image if the API call fails
        setBackgroundImage("/images/default-travel-bg.jpg");
      });
  }, []);

  const loginGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => GetUserProfile(tokenResponse),
    onError: (error) => console.log(error),
  });

  const handleSelect = _.debounce((value) => {
    setPlace(value);
    handleInputChange("location", value);
  }, 1000);

  const onGenerateTrip = async () => {
    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (
      !formData.location ||
      (!formData.noOfDays && !formData.customDays) ||
      (!formData.budget && !formData.customBudget) ||
      !formData.noOfPeople ||
      !formData.travelingWith
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      toast.info("Generating your perfect trip...", { duration: 10000 });

      // Extract the destination name from the location object
      const destinationName = formData.location?.label || formData.location;
      if (!destinationName) {
        throw new Error("Invalid destination");
      }

      // Generate trip using Gemini AI
      const prompt = AI_PROMPT
        .replace("{destination}", destinationName)
        .replace("{days}", formData.noOfDays || formData.customDays)
        .replace("{travelingWith}", formData.travelingWith)
        .replace("{budget}", formData.budget || formData.customBudget)
        .replace("{intensity}", "moderate"); // You can make this dynamic if needed

      // Use the new retry logic function
      const geminiResult = await sendGeminiPromptWithRetry(prompt);
      if (!geminiResult.success) {
        toast.error(geminiResult.error);
        return;
      }
      const tripData = geminiResult.data;

      // Parse and validate the response
      let parsedData;
      try {
        parsedData = JSON.parse(tripData);
        
        // Validate that the response is for the correct destination
        if (!parsedData.tripSummary || !parsedData.tripSummary.toLowerCase().includes(destinationName.toLowerCase())) {
          throw new Error("Generated content does not match the requested destination");
        }
        
        // Validate required sections
        if (!parsedData.hotels || !Array.isArray(parsedData.hotels) || parsedData.hotels.length === 0) {
          throw new Error("No hotel recommendations found");
        }
        if (!parsedData.itinerary || !Array.isArray(parsedData.itinerary) || parsedData.itinerary.length === 0) {
          throw new Error("No itinerary found");
        }
        
        // Add destination metadata to ensure consistency
        parsedData.destination = {
          name: destinationName,
          coordinates: formData.location?.value?.place_id || null,
          type: "city"
        };

        // Validate image URLs
        const validateImageUrl = async (url) => {
          if (!url || url.includes("google.com/maps") || url.includes("google.com/search")) {
            return false;
          }
          try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok && response.headers.get('content-type').startsWith('image/');
          } catch {
            return false;
          }
        };

        // Replace invalid image URLs with placeholder
        const placeholderImage = "https://images.unsplash.com/photo-1469474968028-56623f02e42e";
        
        for (let hotel of parsedData.hotels) {
          if (!await validateImageUrl(hotel.imageUrl)) {
            hotel.imageUrl = placeholderImage;
          }
        }

        // Process itinerary
        for (let day of parsedData.itinerary) {
          for (let activity of day.activities) {
            if (!await validateImageUrl(activity.imageUrl)) {
              activity.imageUrl = placeholderImage;
            }
          }
        }

      } catch (error) {
        console.error("Error parsing trip data:", error);
        throw new Error(`Failed to generate a valid trip plan for ${destinationName}. Please try again.`);
      }

      // Save trip data
      await SaveAiTrip(parsedData);
      toast.success(`Your perfect trip to ${destinationName} has been generated! 🎉`);
      
    } catch (error) {
      console.error("Error generating trip:", error);
      toast.error(error.message || "Failed to generate trip. Please try again.");
    } finally {
    setLoading(false);
    }
  };

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((resp) => {
        console.log(resp.data);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        onGenerateTrip();
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  };

  const SaveAiTrip = async (tripData) => {
    try {
    const user = JSON.parse(localStorage.getItem("user"));
      const tripId = Date.now().toString();
      
      // Create the trip object with enhanced metadata
      const trip = {
        id: tripId,
        userEmail: user.email,
        userName: user.name,
      userChoice: formData,
        tripData: tripData,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        status: "active",
        totalBudget: tripData.additionalInfo?.budgetBreakdown || {
          accommodation: "N/A",
          activities: "N/A",
          transportation: "N/A",
          food: "N/A"
        }
      };

      // Get existing trips or initialize empty array
      const existingTrips = JSON.parse(localStorage.getItem("trips") || "[]");
      
      // Add new trip
      existingTrips.push(trip);
      
      // Save back to localStorage
      localStorage.setItem("trips", JSON.stringify(existingTrips));
      
      // Navigate to the view page
      navigate(`/view-trip/${tripId}`);
    } catch (error) {
      console.error("Error saving trip:", error);
      toast.error("Failed to save trip data");
      throw error;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Top-right Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="fixed top-6 right-6 z-50 flex items-center gap-3"
      >
        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-black dark:text-white border border-black/10 dark:border-white/20 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isDarkMode ? (
            <motion.svg
              key="sun"
              initial={{ scale: 0.5, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </motion.svg>
          ) : (
            <motion.svg
              key="moon"
              initial={{ scale: 0.5, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </motion.svg>
          )}
        </motion.button>

        {/* User Profile or Sign In Button */}
        {user ? (
          <Popover>
            <PopoverTrigger>
              <motion.img
                src={user.picture}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
            </PopoverTrigger>
            <PopoverContent className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-white/20">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img src={user.picture} alt="Profile" className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
      </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <Button
                    onClick={() => {
                      localStorage.removeItem("user");
                      window.location.reload();
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Button
            onClick={() => setOpenDialog(true)}
            className="px-6 py-2.5 text-sm font-medium bg-white/10 hover:bg-white/20 text-black dark:text-white border border-black/10 dark:border-white/20 rounded-full backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            Sign In
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              ✨
            </motion.span>
          </Button>
        )}
      </motion.div>

      {/* Background Elements - Reduce blur and opacity */}
      <BackgroundBlob 
        color="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
        size="w-[500px] h-[500px]"
        position="-top-48 -right-24"
        delay={0}
      />
      <BackgroundBlob 
        color="linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)"
        size="w-[600px] h-[600px]"
        position="-bottom-64 -left-32"
        delay={5}
      />

      {/* Floating Travel Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <FloatingElement delay={0} scale={0.8} className="absolute top-20 left-[15%]">
          <FaPlane className="text-4xl text-blue-500/30" />
        </FloatingElement>
        <FloatingElement delay={2} scale={0.7} className="absolute top-40 right-[20%]">
          <FaSuitcase className="text-3xl text-purple-500/30" />
        </FloatingElement>
        <FloatingElement delay={4} scale={0.9} className="absolute bottom-32 left-[25%]">
          <FaMapMarkerAlt className="text-4xl text-red-500/30" />
        </FloatingElement>
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10"
        style={{ opacity, scale, y: yOffset }}
      >
        <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
          <div className="w-full max-w-7xl">
            {/* Form Section */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 items-center">
              {/* Left Decorative Side */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="hidden lg:block lg:col-span-2 relative h-full"
              >
                <div className="relative h-full">
                  {/* Floating Icons */}
                  <FloatingElement 
                    delay={0} 
                    scale={1.2}
                    className="absolute top-1/4 left-1/4"
                  >
                    <FaPlane className="text-7xl text-purple-500/30 transform -rotate-45" />
                  </FloatingElement>
                  <FloatingElement 
                    delay={2}
                    className="absolute bottom-1/3 left-1/2"
                  >
                    <FaSuitcase className="text-6xl text-pink-500/30" />
                  </FloatingElement>
                </div>
              </motion.div>

              {/* Form Container - Reduce backdrop blur */}
              <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                className="lg:col-span-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/20"
              >
                <div className="text-center mb-8">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4"
                  >
                    Plan Your Dream Trip
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-gray-600/90 dark:text-gray-300/90 font-light"
                  >
                    Let our AI create your perfect itinerary 🌍
                  </motion.p>
                </div>

                {/* Form Fields */}
                <motion.div
                  variants={containerVariants}
                  className="space-y-6"
                >
                  {/* Location Input */}
                  <motion.div
                    variants={itemVariants}
                    className="space-y-4"
                  >
                    <Label className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      Where would you like to go?
                    </Label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 dark:text-blue-400 text-xl transition-transform duration-300 group-hover:scale-110">
                        <FaMapMarkerAlt />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter destination"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-lg shadow-sm hover:shadow-md"
        />
      </div>
                  </motion.div>

                  {/* Duration Input */}
                  <motion.div
                    variants={itemVariants}
                    className="space-y-4"
                  >
                    <Label className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      How many days?
                    </Label>
                    <Select
                      value={formData.noOfDays}
                      onValueChange={(value) => {
                        if (value === "custom") {
                          setOpenCustomDays(true);
                        } else {
                          handleInputChange("noOfDays", value);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full py-4 px-4 text-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
                        <SelectGroup>
                          <SelectLabel>Preset Durations</SelectLabel>
                          <SelectItem value="3">
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="text-blue-600 dark:text-blue-400" />
                              <span>Weekend (3 days)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="5">
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="text-blue-600 dark:text-blue-400" />
                              <span>Short Trip (5 days)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="7">
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="text-blue-600 dark:text-blue-400" />
                              <span>Week Long (7 days)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="10">
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="text-blue-600 dark:text-blue-400" />
                              <span>Extended (10 days)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="custom">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                              <FaPlus />
                              <span>Custom Duration</span>
                            </div>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  {/* Budget Input */}
                  <motion.div
                    variants={itemVariants}
                    className="space-y-4"
                  >
                    <Label className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      What's your budget?
                    </Label>
                    <Select
                      value={formData.budget}
                      onValueChange={(value) => {
                        if (value === "custom") {
                          setOpenCustomBudget(true);
                        } else {
                          handleInputChange("budget", value);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full py-4 px-4 text-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
                        <SelectGroup>
                          <SelectLabel>Budget Options</SelectLabel>
                          <SelectItem value="budget">
                            <div className="flex items-center gap-2">
                              <FaMoneyBillWave className="text-blue-600 dark:text-blue-400" />
                              <span>Budget (Economic)</span>
              </div>
                          </SelectItem>
                          <SelectItem value="moderate">
                            <div className="flex items-center gap-2">
                              <FaMoneyBillWave className="text-blue-600 dark:text-blue-400" />
                              <span>Moderate (Mid-range)</span>
            </div>
                          </SelectItem>
                          <SelectItem value="luxury">
                            <div className="flex items-center gap-2">
                              <FaMoneyBillWave className="text-blue-600 dark:text-blue-400" />
                              <span>Luxury (High-end)</span>
        </div>
                          </SelectItem>
                          <SelectItem value="custom">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                              <FaPlus />
                              <span>Custom Budget</span>
      </div>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </motion.div>

      {/* Number of People */}
                  <motion.div
                    variants={itemVariants}
                    className="space-y-4"
                  >
                    <Label className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      How many travelers?
                    </Label>
                    <Select
                      value={formData.noOfPeople}
                      onValueChange={(value) => handleInputChange("noOfPeople", value)}
                    >
                      <SelectTrigger className="w-full py-4 px-4 text-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                        <SelectValue placeholder="Select number of travelers" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
                        <SelectGroup>
                          <SelectLabel>Travel Group</SelectLabel>
                          <SelectItem value="1">
                            <div className="flex items-center gap-2">
                              <FaUser className="text-blue-600 dark:text-blue-400" />
                              <span>Solo Traveler</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="2">
                            <div className="flex items-center gap-2">
                              <FaUserFriends className="text-blue-600 dark:text-blue-400" />
                              <span>Couple (2 people)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="4">
                            <div className="flex items-center gap-2">
                              <FaUsers className="text-blue-600 dark:text-blue-400" />
                              <span>Group (3+ people)</span>
                            </div>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  {/* Who are you traveling with? */}
                  <motion.div
                    variants={itemVariants}
                    className="space-y-4"
                  >
                    <Label className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      Who are you traveling with?
                    </Label>
                    <Select
                      value={formData.travelingWith}
                      onValueChange={(value) => handleInputChange("travelingWith", value)}
                    >
                      <SelectTrigger className="w-full py-4 px-4 text-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                        <SelectValue placeholder="Select travel companions" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
                        <SelectGroup>
                          <SelectLabel>Travel Companions</SelectLabel>
                          <SelectItem value="solo">
                            <div className="flex items-center gap-2">
                              <FaUser className="text-blue-600 dark:text-blue-400" />
                              <span>Solo Adventure</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="family">
                            <div className="flex items-center gap-2">
                              <MdFamilyRestroom className="text-blue-600 dark:text-blue-400" />
                              <span>Family Trip</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="couple">
                            <div className="flex items-center gap-2">
                              <FaUserFriends className="text-blue-600 dark:text-blue-400" />
                              <span>Romantic Getaway</span>
              </div>
                          </SelectItem>
                          <SelectItem value="friends">
                            <div className="flex items-center gap-2">
                              <FaUsers className="text-blue-600 dark:text-blue-400" />
                              <span>Friends Trip</span>
            </div>
                          </SelectItem>
                          <SelectItem value="colleagues">
                            <div className="flex items-center gap-2">
                              <MdGroups className="text-blue-600 dark:text-blue-400" />
                              <span>Work Trip</span>
        </div>
                          </SelectItem>
                          <SelectItem value="surprise">
                            <div className="flex items-center gap-2">
                              <FaHeart className="text-blue-600 dark:text-blue-400" />
                              <span>Surprise Me</span>
      </div>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </motion.div>
                </motion.div>

      {/* Generate Trip Button */}
                <motion.div
                  variants={itemVariants}
                  className="pt-8"
                >
        <Button
          onClick={onGenerateTrip}
          disabled={loading}
                    className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white transition-all duration-500 rounded-xl shadow-lg hover:shadow-2xl disabled:opacity-50 relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 2, opacity: 0.5 }}
                      transition={{ duration: 0.5 }}
                    />
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="animate-spin" />
                        <span>Creating Your Perfect Trip...</span>
                      </div>
                    ) : (
                      "Generate My Trip ✨"
                    )}
                  </Button>
                </motion.div>
              </motion.div>

              {/* Right Decorative Side */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="hidden lg:block lg:col-span-2 relative h-full"
              >
                <div className="relative h-full">
                  {/* Floating Icons */}
                  <FloatingElement 
                    delay={1}
                    className="absolute top-1/3 right-1/3"
                  >
                    <MdLocationOn className="text-7xl text-blue-500/30" />
                  </FloatingElement>
                  <FloatingElement 
                    delay={3}
                    className="absolute bottom-1/4 right-1/4"
                  >
                    <FaHeart className="text-5xl text-pink-500/30" />
                  </FloatingElement>

                  {/* Decorative Circle */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, 0],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-br from-purple-400/5 via-pink-400/5 to-blue-400/5 backdrop-blur-3xl border border-white/10"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Custom Duration Dialog - Reduce backdrop blur */}
      <Dialog open={openCustomDays} onOpenChange={setOpenCustomDays}>
        <DialogContent className="sm:max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Custom Duration</DialogTitle>
            <DialogDescription>
              <div className="space-y-4 pt-4">
                <input
                  type="number"
                  placeholder="Enter number of days"
                  value={formData.customDays}
                  onChange={(e) => handleInputChange("customDays", e.target.value)}
                  className="w-full py-4 px-4 text-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200 dark:border-gray-700 rounded-xl"
                />
                <Button
                  onClick={() => {
                    handleInputChange("noOfDays", formData.customDays);
                    setOpenCustomDays(false);
                  }}
                  className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                >
                  Confirm
        </Button>
      </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Custom Budget Dialog - Reduce backdrop blur */}
      <Dialog open={openCustomBudget} onOpenChange={setOpenCustomBudget}>
        <DialogContent className="sm:max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Custom Budget</DialogTitle>
            <DialogDescription>
              <div className="space-y-4 pt-4">
                <input
                  type="number"
                  placeholder="Enter your budget"
                  value={formData.customBudget}
                  onChange={(e) => handleInputChange("customBudget", e.target.value)}
                  className="w-full py-4 px-4 text-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200 dark:border-gray-700 rounded-xl"
                />
                <Button
                  onClick={() => {
                    handleInputChange("budget", formData.customBudget);
                    setOpenCustomBudget(false);
                  }}
                  className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                >
                  Confirm
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Sign In Dialog - Optimize overlay and backdrop */}
      {openDialog && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setOpenDialog(false)}
          />
          
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50">
            <div className="relative bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => setOpenDialog(false)}
                className="absolute -right-2 -top-2 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <svg
                  className="w-4 h-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Content */}
              <div className="p-8">
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                    Welcome to Travista
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Sign in with Google to save and manage your trips
                  </p>
                  <button
                    onClick={login}
                    className="w-full py-4 px-6 text-lg font-medium bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Continue with Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateTrip;
