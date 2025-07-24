"use client";
import { useState, useRef } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function MapPicker({ open, onClose, onSelect, initialCenter = { lat: 22.9734, lng: 78.6569 } }) {
  const [selected, setSelected] = useState(null);
  const [address, setAddress] = useState("");
  const mapRef = useRef();

  const handleMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setSelected({ lat, lng });
    // Reverse geocode
    if (window.google) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          setAddress(results[0].formatted_address);
        } else {
          setAddress("");
        }
      });
    }
  };

  const handleConfirm = () => {
    if (selected && address) {
      onSelect({ address, lat: selected.lat, lng: selected.lng });
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Pick a Location</h2>
        <div className="w-full h-72 rounded-xl overflow-hidden mb-4">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={selected || initialCenter}
            zoom={selected ? 14 : 5}
            onClick={handleMapClick}
            onLoad={map => (mapRef.current = map)}
          >
            {selected && <Marker position={selected} />}
          </GoogleMap>
        </div>
        <div className="mt-4">
          <div className="text-gray-700 mb-2">{address ? `Selected: ${address}` : "Click on the map to select a location."}</div>
          <button
            className="bg-gradient-to-r from-[#1e90ff] to-[#00bfae] text-white font-semibold py-2 px-6 rounded-lg shadow hover:from-[#00bfae] hover:to-[#1e90ff] transition-colors disabled:opacity-50"
            onClick={handleConfirm}
            disabled={!selected || !address}
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
} 