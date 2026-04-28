import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ✅ Catchy Logic: Create a custom pulsing radar icon
const radarIcon = new L.DivIcon({
  className: 'radar-pulse', // This class is defined in your index.css
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -10]
});

// Component to handle auto-centering the map when coordinates change
function RecenterMap({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) {
      map.setView([lat, lon], 14, { animate: true });
    }
  }, [lat, lon, map]);
  return null;
}

export default function MapView({ lat, lon, deviceId }) {
  // Default coordinates (e.g., Juja/Nairobi) if data is null
  const position = [lat || -1.1018, lon || 37.0144];

  return (
    <div className="h-full w-full relative group">
      <MapContainer 
        center={position} 
        zoom={14} 
        scrollWheelZoom={false} 
        className="h-full w-full z-0"
        zoomControl={false} // Hide default +/- for a cleaner look
      >
        {/* ✅ Catchy Tile Layer: CartoDB Voyager (Clean & Bright) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <Marker position={position} icon={radarIcon}>
          <Popup className="custom-popup">
            <div className="p-1">
              <p className="text-[10px] font-black text-blue-600 uppercase">Active Unit</p>
              <p className="text-xs font-bold text-slate-800">Device ID: {deviceId || '3'}</p>
              <p className="text-[9px] text-slate-400 font-mono mt-1 italic leading-none">
                {lat?.toFixed(4)}, {lon?.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>

        <RecenterMap lat={lat} lon={lon} />
      </MapContainer>

      {/* Catchy Decorative Overlay (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-[1000] pointer-events-none">
        <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Live GPS Feed</span>
        </div>
      </div>
    </div>
  );
}