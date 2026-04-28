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
    const interval = setInterval(fetchData, 15000);
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
    }
  }, [activeDevice]);

  const fetchData = async () => {
    try {
      const fleetData = await getFleetReadings();
      setFleet(fleetData);
      
      if (fleetData.length > 0) {
        if (!activeDevice) {
          setActiveDevice(fleetData[0]);
        } else {
          const updated = fleetData.find(d => d.id === activeDevice.id);
          if (updated) setActiveDevice(updated);
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-pulse text-blue-600 font-black tracking-widest">LOADING FLEET...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* --- Navbar (Strengthened Shadow/Border) --- */}
        <nav className="flex justify-between items-center bg-white sticky top-0 z-[50] p-4 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-xl text-white shadow-lg shadow-blue-200">❄️</div>
            <div>
              <h1 className="font-black text-xl tracking-tight text-slate-800">ColdChain <span className="text-blue-600">Pro</span></h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Real-Time Logistics</p>
            </div>
          </div>
          <div className="px-4 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
            <p className="text-emerald-700 text-[10px] font-black flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span> 
              {fleet.length} SYSTEMS ONLINE
            </p>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- Left Sidebar (Corrected Fading Borders) --- */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Active Fleet</h3>
            <div className="space-y-4 overflow-y-auto max-h-[78vh] pr-2 custom-scrollbar">
              {fleet.map((device) => (
                <div 
                  key={device.id}
                  onClick={() => setActiveDevice(device)}
                  className={`group p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                    activeDevice.id === device.id 
                    ? "bg-white border-blue-600 shadow-2xl shadow-blue-100 scale-[1.02]" 
                    : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg"
                  }`}
                >
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Unit Name</p>
                      <p className="text-md font-black text-slate-700 truncate w-32">
                        {device.device_name || device.deviceName || `Unit_${device.id}`}
                      </p>
                      <p className="text-[9px] font-mono text-slate-400 uppercase tracking-tighter">
                        ID: #{device.id}
                      </p>
                    </div>
                    <AlertBadge status={device.alertStatus} />
                  </div>
                  <div className="mt-4">
                     <BoxStatus status={device.boxStatus} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Middle: Map & Analytics (Sharper Containers) --- */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-300/70 shadow-2xl shadow-slate-200/50 overflow-hidden relative min-h-[500px]">
              <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-2">
                <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-200">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Current Hub</p>
                  <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <span className="text-blue-500 animate-bounce">📍</span> {address}
                  </h2>
                  <p className="text-[10px] font-mono text-slate-400 mt-1">COORD: {activeDevice.latitude?.toFixed(4)}, {activeDevice.longitude?.toFixed(4)}</p>
                </div>
              </div>
              <MapView lat={activeDevice.latitude} lon={activeDevice.longitude} deviceId={activeDevice.deviceName || activeDevice.id} />
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Live Thermal Flux</h3>
                <div className="flex gap-2">
                  <span className="h-4 w-4 bg-blue-600 rounded-sm"></span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    {activeDevice.deviceName || activeDevice.device_name || `UNIT ${activeDevice.id}`}
                  </span>
                </div>
              </div>
              <Chart data={dataHistory} /> 
            </div>
          </div>

          {/* --- Right Column: Telemetry --- */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Telemetry</h3>
            <div className="grid grid-cols-1 gap-4">
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
            
            {/* Advisory (Increased contrast) */}
            <div className={`
                rounded-3xl p-6 text-white shadow-2xl transition-colors duration-500 relative overflow-hidden mt-4
                ${activeDevice.alertStatus === 2 ? 'bg-red-950 border-2 border-red-500 shadow-red-900/40' : 'bg-slate-900 border-2 border-slate-700 shadow-slate-900/40'}
            `}>
               <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl italic font-black">AI</div>
               <p className={`text-[10px] font-black uppercase mb-4 tracking-widest ${activeDevice.alertStatus === 2 ? 'text-red-400' : 'text-blue-400'}`}>
                 System Advisory
               </p>
               <p className="text-sm font-medium leading-relaxed">
                 {getAdvisoryMessage()}
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}