export default function FanStatus({ status }) {
  const isOn = status === 1;

  return (
    <div className={`
      relative overflow-hidden p-5 rounded-[2rem] border-2 transition-all duration-500
      ${isOn 
        ? "bg-blue-50 border-blue-500/30 shadow-[0_12px_40px_rgba(59,130,246,0.1)]" 
        : "bg-white border-slate-200 shadow-sm"
      }
    `}>
      {/* Background Cooling Effect Glow */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-[0.12] ${
        isOn ? "bg-blue-400" : "bg-slate-300"
      }`}></div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Spinning Icon with High-Contrast Border */}
          <div className={`
            w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-all duration-500 border-2
            ${isOn 
              ? "bg-blue-600 text-white border-blue-400 animate-spin-slow scale-105" 
              : "bg-slate-100 text-slate-400 border-slate-200 scale-100"
            }
          `}>
            {isOn ? "⚙️" : "💤"}
          </div>

          <div className="text-left">
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${
              isOn ? "text-blue-600/70" : "text-slate-400"
            }`}>
              Active Cooling
            </p>
            <h4 className={`text-base font-black tracking-tight leading-none ${
              isOn ? "text-blue-900" : "text-slate-600"
            }`}>
              {isOn ? "FAN OPERATIONAL" : "SYSTEM IDLE"}
            </h4>
          </div>
        </div>

        {/* Dynamic Status Tag */}
        <div className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-tighter ${
          isOn ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-400 border-slate-200"
        }`}>
          {isOn ? "Running" : "Standby"}
        </div>
      </div>
    </div>
  );
}

