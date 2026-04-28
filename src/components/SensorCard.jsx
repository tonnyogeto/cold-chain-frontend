export default function SensorCard({ title, value, unit, type }) {
  const themes = {
    temp: {
      border: "border-l-blue-600", // Darker blue for precision
      bg: "bg-white",              // Solid white to prevent fading
      text: "text-blue-600",
      icon: "🌡️"
    },
    humid: {
      border: "border-l-cyan-600",
      bg: "bg-white", 
      text: "text-cyan-600",
      icon: "💧"
    },
    dist: {
      border: "border-l-purple-600",
      bg: "bg-white",
      text: "text-purple-600",
      icon: "📦" 
    },
    default: {
      border: "border-l-slate-400",
      bg: "bg-white",
      text: "text-slate-600",
      icon: "📊"
    }
  };

  const theme = themes[type] || themes.default;

  // ✅ Logic Check: Is the value a number or a status string?
  const isNumeric = !isNaN(parseFloat(value)) && isFinite(value);

  return (
    <div className={`
      relative group overflow-hidden p-5 rounded-2xl border border-slate-200 border-l-4 
      ${theme.border} ${theme.bg} 
      transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:border-slate-300 hover:-translate-y-1
    `}>
      {/* Background Icon Watermark */}
      <div className="absolute -right-2 -bottom-2 text-4xl opacity-[0.03] grayscale group-hover:grayscale-0 group-hover:opacity-10 transition-all">
        {theme.icon}
      </div>

      <div className="relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
          {title}
        </p>
        
        <div className="flex items-baseline gap-1">
          <span className={`${isNumeric ? 'text-3xl' : 'text-xl'} font-black text-slate-800 tracking-tight`}>
            {value ?? '--'}
          </span>
          <span className={`text-xs font-black ${theme.text} uppercase`}>
            {unit}
          </span>
        </div>
      </div>

      {/* ✅ Progress Bar: High-contrast track */}
      <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
        {isNumeric ? (
          <div 
            className={`h-full ${theme.border.replace('border-l', 'bg')} transition-all duration-1000 shadow-[0_0_8px_rgba(0,0,0,0.1)]`} 
            style={{ width: `${Math.min(value, 100)}%` }}
          ></div>
        ) : (
          /* Show a solid indicator for status strings */
          <div className={`h-full ${value === "LOADED" || value === "ITEM_PRESENT" ? "bg-emerald-500" : "bg-slate-300"} w-full`}></div>
        )}
      </div>
    </div>
  );
}