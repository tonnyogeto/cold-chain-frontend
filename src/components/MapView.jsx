import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Custom Google Maps Style Red Dot Icon ---
const customRedDotIcon = new L.divIcon({
  className: "custom-gps-marker",
  html: `
    <div class="relative flex items-center justify-center w-8 h-8">
      <span class="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-40 animate-ping"></span>
      
      <div class="relative flex items-center justify-center w-4 h-4 bg-white rounded-full shadow-lg border border-slate-300">
        <div class="w-2.5 h-2.5 bg-red-600 rounded-full"></div>
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16], // Centers the icon precisely over the coordinate intercept
  popupAnchor: [0, -10],
});

// Helper component to auto-pan the map view smoothly when coordinates update
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center[0] && center[1] && center[0] !== 0) {
      map.setView(center, 16, { animate: true, duration: 1.5 }); // Zooms in closer for precision tracking
    }
  }, [center, map]);
  return null;
}

export default function MapView({ lat, lon, deviceId }) {
  // Default coordinates fallback if data hasn't loaded yet
  const defaultCenter = [-1.1012, 37.0090]; 
  const position = lat && lon && lat !== 0 ? [lat, lon] : defaultCenter;

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={position} 
        zoom={16} 
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {/* ChangeView intercepts state updates to smoothly pan across coordinates */}
        <ChangeView center={position} />

        {/* Clean Mapbox-alternative open street tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* The precise tracking marker */}
        {lat && lon && lat !== 0 && (
          <Marker position={position} icon={customRedDotIcon}>
            <Popup>
              <div className="p-1 font-sans">
                <p className="font-black text-xs text-slate-800 m-0 uppercase tracking-wide">
                  📍 {deviceId || "Active Asset"}
                </p>
                <p className="text-[10px] font-mono text-slate-500 m-0 mt-1">
                  LAT: {lat.toFixed(5)} <br />
                  LON: {lon.toFixed(5)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}