import { useState, useEffect } from "react";

export function useGeolocation() {
  const [location, setLocation] = useState(null);
  // location = { lat, lng } or null

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    // Check if browser supports geolocation
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        // err.code:
        // 1 = user denied permission
        // 2 = position unavailable
        // 3 = timeout
        const messages = {
          1: "Location permission denied. Please allow access.",
          2: "Location unavailable. Try again.",
          3: "Location request timed out. Try again.",
        };
        setError(messages[err.code] || "Could not get location");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,      // 10 seconds
        maximumAge: 300000,  // cache location for 5 minutes
      }
    );
  };

  return { location, error, loading, getLocation };
}