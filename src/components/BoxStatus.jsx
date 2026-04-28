export default function BoxStatus({ status }) {
  const isPresent = status === "ITEM_PRESENT";

  return (
    <div className={`
      relative overflow-hidden p-5 rounded-[2rem] border-2 transition-all duration-500
      ${isPresent 
        ? "bg-emerald-50 border-emerald-500/30 shadow-[0_12px_40px_rgba(16,185,129,0.1)]" 
        : "bg-white border-slate-200 shadow-sm"
      }
    `}>
      {/* Background Decorative Glow (Sharpened) */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-[0.15] ${
        isPresent ? "bg-emerald-400" : "bg-slate-300"
      }`}></div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Animated Icon Circle with high-contrast border */}
          <div className={`
            w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-all duration-500 border-2
            ${isPresent 
              ? "bg-emerald-500 text-white border-emerald-400 rotate-0 scale-105" 
              : "bg-slate-100 text-slate-400 border-slate-200 -rotate-12"
            }
          `}>
            {isPresent ? "📦" : "∅"}
          </div>

          <div className="text-left">
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${
              isPresent ? "text-emerald-600/70" : "text-slate-400"
            }`}>
              Cargo Payload
            </p>
            <h4 className={`text-base font-black tracking-tight leading-none ${
              isPresent ? "text-emerald-900" : "text-slate-600"
            }`}>
              {isPresent ? "ITEM PRESENT" : "VACANT UNIT"}
            </h4>
          </div>
        </div>

        {/* Live Indicator Pulse */}
        {isPresent ? (
          <div className="flex flex-col items-end gap-1">
             <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Verified</span>
          </div>
        ) : (
          <div className="h-2 w-8 bg-slate-200 rounded-full"></div> // "Empty" placeholder bar
        )}
      </div>
    </div>
  );
}