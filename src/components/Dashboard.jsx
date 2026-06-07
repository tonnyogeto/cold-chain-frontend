import { useEffect, useState } from "react";
import { getFleetReadings, getAllReadings } from "../services/api";
import SensorCard from "./SensorCard";
import AlertBadge from "./AlertBadge";
import BoxStatus from "./BoxStatus";
import FanStatus from "./FanStatus";
import MapView from "./MapView";
import Chart from "./Chart";

export default function Dashboard() {
  const [fleet, setFleet] = useState([]);
  const [activeDevice, setActiveDevice] = useState(null);
  const [dataHistory, setDataHistory] = useState([]);
  const [address, setAddress] = useState("Locating...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // 15s polling interval aligned with hardware
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeDevice?.latitude && activeDevice?.longitude) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${activeDevice.latitude}&lon=${activeDevice.longitude}`)
        .then(res => res.json())
        .then(data => {
          const city = data.address.city || data.address.town || data.address.village || "Transit Route";
          setAddress(city);
        })
        .catch(() => setAddress("Unknown Location"));
    } else {
      setAddress("Locating...");
    }
  }, [activeDevice]);

  const fetchData = async () => {
    try {
      const fleetData = await getFleetReadings();
      setFleet(fleetData);
      
      if (fleetData.length > 0) {
        if (!activeDevice) {
          // SMART INITIALIZATION: Scan for the device that actually has active GPS 
          // tracking data (like TRUCK O1), instead of blindly grabbing index 0
          const activeUnit = fleetData.find(d => d.latitude && d.latitude !== 0) || fleetData[0];
          setActiveDevice({ ...activeUnit });
        } else {
          const updated = fleetData.find(d => d.id === activeDevice.id);
          if (updated) {
            // Safe spread to force state updates across re-renders
            setActiveDevice({ ...updated });
          }
        }
      }

      const history = await getAllReadings();
      setDataHistory(history);
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getAdvisoryMessage = () => {
    if (!activeDevice) return "Initialising system...";
    if (activeDevice.alertStatus === 0) return "All systems nominal. Cold chain integrity verified.";
    if (activeDevice.alertStatus === 1) return "Warning: Temperature rising. System is approaching 30°C threshold.";
    if (activeDevice.alertStatus === 2) {
      return activeDevice.fanStatus === 1 
        ? "CRITICAL: High temp detected! Active cooling engaged."
        : "CRITICAL: Threshold exceeded. Fan failure detected!";
    }
    return "Monitoring system status...";
  };

  if (loading || !activeDevice) return (
    <div className="h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-pulse text-blue-600 font-black tracking-widest">LOADING FLEET HUB...</div>
    </div>
  );

  return (
    /* h-screen + overflow-hidden layout prevents window-level vertical scrolling */
    <div className="h-screen bg-slate-50 p-4 text-slate-900 font-sans flex flex-col overflow-hidden">
      <div className="max-w-[1600px] w-full mx-auto flex flex-col flex-1 gap-4 min-h-0 overflow-hidden">
        
        {/* --- Navbar --- */}
        <nav className="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-200 shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-xl text-white shadow-md">❄️</div>
            <div>
              <h1 className="font-black text-lg tracking-tight text-slate-800 leading-none">ColdChain <span className="text-blue-600">Pro</span></h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Real-Time Logistics</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
            <p className="text-emerald-700 text-[10px] font-black flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> 
              {fleet.length} SYSTEMS ONLINE
            </p>
          </div>
        </nav>

        {/* --- Dashboard Operational Grid Layout --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 overflow-hidden pb-1">
          
          {/* --- Left Column: Active Fleet Sidebar --- */}
          <div className="lg:col-span-3 space-y-2 flex flex-col min-h-0">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1 shrink-0">Active Fleet</h3>
            <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
              {fleet.map((device) => (
                <div 
                  key={device.id}
                  onClick={() => setActiveDevice({ ...device })}
                  className={`group p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                    activeDevice.id === device.id 
                    ? "bg-white border-blue-600 shadow-lg scale-[1.01]" 
                    : "bg-white border-slate-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">Unit Name</p>
                      <p className="text-sm font-black text-slate-700 truncate w-32">
                        {device.deviceName}
                      </p>
                      <p className="text-[8px] font-mono text-slate-400 tracking-tighter">
                        ID: #{device.id}
                      </p>
                    </div>
                    <AlertBadge status={device.alertStatus} />
                  </div>
                  <div className="mt-3">
                     <BoxStatus status={device.boxStatus} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Center Column: Map & Chart Graphic Split --- */}
          <div className="lg:col-span-6 flex flex-col gap-4 min-h-0">
            {/* Top Viewport Half: OpenStreetMap Leaflet Window */}
            <div className="bg-white rounded-[2rem] border border-slate-300/70 shadow-md overflow-hidden relative flex-[1.2] min-h-0">
              <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
                <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200">
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Current Hub</p>
                  <h2 className="text-md font-black text-slate-800 flex items-center gap-1.5 leading-tight">
                    <span className="text-blue-500 animate-bounce">📍</span> {address}
                  </h2>
                  <p className="text-[9px] font-mono text-slate-400 mt-0.5">
                    COORD: {activeDevice.latitude?.toFixed(4)}, {activeDevice.longitude?.toFixed(4)}
                  </p>
                </div>
              </div>
              <MapView lat={activeDevice.latitude} lon={activeDevice.longitude} deviceId={activeDevice.deviceName} />
            </div>

            {/* Bottom Viewport Half: Recharts Thermal Pipeline */}
            <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-md flex flex-col flex-[0.8] min-h-0">
              <div className="flex justify-between items-center mb-1 shrink-0">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Thermal Flux</h3>
                <span className="text-[9px] font-bold text-slate-500 uppercase">
                  {activeDevice.deviceName}
                </span>
              </div>
              <div className="flex-1 min-h-0 w-full">
                <Chart data={dataHistory} /> 
              </div>
            </div>
          </div>

          {/* --- Right Column: Telemetry Modules & Advisory --- */}
          <div className="lg:col-span-3 flex flex-col gap-3 min-h-0 justify-between">
            <div className="shrink-0">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Telemetry</h3>
            </div>
            
            {/* Sensor Stack metrics layout */}
            <div className="flex flex-col gap-3 flex-1 min-h-0 justify-start">
              <SensorCard title="Temperature" value={activeDevice.temperature} unit="°C" type="temp" />
              <SensorCard title="Humidity" value={activeDevice.humidity} unit="%" type="humid" />
              <SensorCard 
                title="Inventory Status" 
                value={activeDevice.boxStatus === "ITEM_PRESENT" ? "LOADED" : "VACANT"} 
                unit={activeDevice.boxStatus === "ITEM_PRESENT" ? "📦" : "∅"} 
                type="dist" 
              />
              <FanStatus status={activeDevice.fanStatus} />
            </div>
            
            {/* System Advisory Banner */}
            <div className={`
                rounded-2xl p-4 text-white shadow-md transition-colors duration-500 relative overflow-hidden shrink-0
                ${activeDevice.alertStatus === 2 ? 'bg-red-950 border-2 border-red-500' : 'bg-slate-900 border-2 border-slate-700'}
            `}>
               <p className={`text-[9px] font-black uppercase mb-1 tracking-widest ${activeDevice.alertStatus === 2 ? 'text-red-400' : 'text-blue-400'}`}>
                 System Advisory
               </p>
               <p className="text-xs font-medium leading-normal">
                 {getAdvisoryMessage()}
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}