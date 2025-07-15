import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
import CreateTrip from "./create-trip/index.jsx";
import Header from "./components/custom/Header.jsx";
import { Toaster } from "./components/ui/sonner.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ViewTrip from "./view-trip/[tripId]/index.jsx";
import { ParallaxProvider } from "react-scroll-parallax";
import MyTrips from "./my-trips/index.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

// Layout component for pages that need the header
const WithHeader = ({ children }) => {
  const location = useLocation();
  const isViewTripPage = location.pathname.includes('/view-trip');

  return (
    <ThemeProvider>
      <AuthProvider>
        {!isViewTripPage && <Header />}
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/about",
    element: <WithHeader><div>About Page</div></WithHeader>,
  },
  {
    path: "/destinations",
    element: <WithHeader><div>Destinations Page</div></WithHeader>,
  },
  {
    path: "/contact",
    element: <WithHeader><div>Contact Page</div></WithHeader>,
  },
  {
    path: "/get-started",
    element: <WithHeader><CreateTrip /></WithHeader>,
  },
  {
    path: "/login",
    element: <WithHeader><div>Login Page</div></WithHeader>,
  },
  {
    path: "/create-trip",
    element: (
      <ThemeProvider>
        <AuthProvider>
          <CreateTrip />
        </AuthProvider>
      </ThemeProvider>
    ),
  },
  {
    path: "/view-trip/:tripId",
    element: <WithHeader><ViewTrip /></WithHeader>,
  },
  {
    path: "/my-trip",
    element: <WithHeader><MyTrips /></WithHeader>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <AuthProvider>
        <ParallaxProvider>
          <Toaster />
          <RouterProvider router={router} />
        </ParallaxProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
