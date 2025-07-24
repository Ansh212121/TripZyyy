"use client";
import { useEffect, useState } from "react";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function RouteMap({ origin, destination }) {
  const [directions, setDirections] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 22.9734, lng: 78.6569 });

  useEffect(() => {
    if (origin && destination) {
      const getDirections = () => {
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK") {
              setDirections(result);
              // Center map between origin and destination
              const route = result.routes[0];
              if (route && route.bounds) {
                const ne = route.bounds.getNorthEast();
                const sw = route.bounds.getSouthWest();
                setMapCenter({
                  lat: (ne.lat() + sw.lat()) / 2,
                  lng: (ne.lng() + sw.lng()) / 2,
                });
              }
            } else {
              setDirections(null);
            }
          }
        );
      };
      if (window.google && window.google.maps) {
        getDirections();
      }
    }
  }, [origin, destination]);

  if (!origin || !destination) return null;

  return (
    <div className="w-full h-72 rounded-xl overflow-hidden mb-4">
      <GoogleMap mapContainerStyle={{ width: '100%', height: '100%' }} center={mapCenter} zoom={7}>
        {directions && <DirectionsRenderer directions={directions} />}
        {/* Optionally, show markers for origin/destination if no route */}
        {!directions && origin && <Marker position={typeof origin === 'string' ? undefined : origin} />}
        {!directions && destination && <Marker position={typeof destination === 'string' ? undefined : destination} />}
      </GoogleMap>
    </div>
  );
} 