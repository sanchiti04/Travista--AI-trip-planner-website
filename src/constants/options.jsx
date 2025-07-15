export const SelectTravelList = [
  {
    id: 1,
    title: "Solo Adventure",
    desc: "Embark on a journey of self-discovery",
    icon: "🎒",
    people: "1 person",
  },
  {
    id: 2,
    title: "Romantic Getaway",
    desc: "Experience the world together",
    icon: "💑",
    people: "2 people",
  },
  {
    id: 3,
    title: "Family Fun",
    desc: "Create unforgettable memories with loved ones",
    icon: "🏠",
    people: "3 to 4 people",
  },
  {
    id: 4,
    title: "Friends' Escapade",
    desc: "Thrilling adventures with your best pals",
    icon: "🧑‍🤝‍🧑",
    people: "5 to 10 people",
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Budget-Friendly",
    desc: "Travel smart, spend less",
    icon: "💸",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Balance comfort and cost",
    icon: "💵",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Indulge in lavish experiences",
    icon: "💎",
  },
];

export const AI_PROMPT = `You are a knowledgeable travel expert. Create a detailed travel plan for {destination} for {days} days, suitable for {travelingWith} with a {budget} budget and {intensity} intensity level. All prices should be in Indian Rupees (INR/₹).

Please provide the information in the following structured format:

{
  "tripSummary": "Write a compelling 4-6 sentence overview highlighting the destination's unique charm, key attractions, cultural significance, and what makes this trip special. Include mentions of iconic landmarks, cultural experiences, and the overall atmosphere travelers can expect.",
  
  "budgetBreakdown": {
    "Flights": "Estimated cost range in INR (₹)",
    "Accommodation": "Per night cost range in INR (₹)",
    "Daily Meals": "Per person per day in INR (₹)",
    "Local Transport": "Per day estimate in INR (₹)",
    "Activities": "Total activities budget in INR (₹)",
    "Miscellaneous": "Extra expenses buffer in INR (₹)"
  },
  
  "bestTimeToVisit": "Provide 2-3 detailed sentences about optimal visiting seasons, including weather patterns, tourist crowds, and any special events or festivals worth considering.",
  
  "transportationTips": "Write a comprehensive paragraph about local transportation options, including public transit systems, travel passes, and tips for getting around efficiently. Include approximate costs in INR (₹) and recommended methods.",
  
  "localCuisine": [
    "Must-try dish 1 with brief cultural context, where to find it, and approximate cost in INR (₹)",
    "Must-try dish 2 with brief cultural context, where to find it, and approximate cost in INR (₹)",
    "Must-try dish 3 with brief cultural context, where to find it, and approximate cost in INR (₹)",
    "Must-try dish 4 with brief cultural context, where to find it, and approximate cost in INR (₹)"
  ],
  
  "safetyTips": [
    "Specific safety tip 1 about local areas or situations to be aware of",
    "Specific safety tip 2 about transportation or nighttime safety",
    "Specific safety tip 3 about common scams or tourist-targeted issues",
    "Specific safety tip 4 about emergency contacts or healthcare"
  ],
  
  "hotels": [
    {
      "name": "Hotel name",
      "description": "2-3 sentences about the hotel's unique features and location benefits",
      "rating": "4.5",
      "priceRange": "Price per night in INR (₹)",
      "address": "Full hotel address",
      "imageUrl": "Direct URL to hotel image",
      "amenities": ["Amenity 1", "Amenity 2", "Amenity 3", "etc"]
    }
  ],
  
  "itinerary": [
    {
      "activities": [
        {
          "name": "Activity name",
          "description": "Detailed description of the activity and its significance",
          "time": "Suggested time (e.g., '9:00 AM')",
          "duration": "Expected duration",
          "entryFee": "Cost in INR (₹)",
          "tags": ["tag1", "tag2", "tag3"],
          "nearbyPlaces": ["Place 1", "Place 2"]
        }
      ]
    }
  ],
  
  "additionalInfo": {
    "travelTips": [
      "Practical tip about local customs",
      "Tip about packing essentials",
      "Tip about local etiquette",
      "Money-saving advice with costs in INR (₹)"
    ],
    "localEtiquette": [
      "Important cultural norm 1",
      "Important cultural norm 2",
      "Important cultural norm 3"
    ],
    "currency": {
      "name": "Indian Rupee (INR)",
      "symbol": "₹",
      "exchangeRate": "Current exchange rate with major currencies",
      "tips": "Tips about using local currency, cards, and ATMs"
    },
    "seasons": {
      "spring": "March-May weather and activities",
      "summer": "June-August weather and activities",
      "fall": "September-November weather and activities",
      "winter": "December-February weather and activities"
    }
  }
}

Important guidelines:
1. Ensure all content is factually accurate and up-to-date
2. Provide realistic price estimates in Indian Rupees (INR/₹)
3. Include specific local insights and practical tips
4. Adapt recommendations based on the travel group type and budget level
5. Consider the trip intensity level when suggesting activities
6. Use proper formatting and maintain consistent structure
7. Provide direct image URLs that are publicly accessible
8. Include emergency contact numbers and local helpline information
9. Mention any seasonal considerations or weather-related advice
10. Add specific location names and addresses where relevant
11. Format all currency values with the ₹ symbol and proper comma placement (e.g., ₹1,500 or ₹15,000)`;

export const PHOTO_REF_URL =
  "https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=600&maxWidthPx=600&key=" +
  import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
