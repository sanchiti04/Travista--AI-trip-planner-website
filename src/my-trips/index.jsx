import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserTripCardItem from "./components/UserTripCardItem";

const MyTrips = () => {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);

  // Get user trips from localStorage
  const GetUserTrips = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/");
      return;
    }

    const allTrips = JSON.parse(localStorage.getItem("trips") || "[]");
    const userTrips = allTrips.filter(trip => trip.userEmail === user.email);
    setUserTrips(userTrips);
  };

  useEffect(() => {
    GetUserTrips();
  }, []);

  return (
    <div className="p-10 md:px-20 lg:px-36">
      <h2 className="font-bold text-4xl text-center">My Trips</h2>
      {userTrips.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-lg text-gray-600">No trips found. Start planning your adventure!</p>
          <button 
            onClick={() => navigate("/create-trip")}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {userTrips.map((trip, index) => (
            <UserTripCardItem trip={trip} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrips;
