export default function AlertBadge({ status }) {
  // Configuration for High-Contrast Status Badges
  const configs = {
    0: { 
      text: "NORMAL", 
      bg: "bg-emerald-100/50", 
      textCol: "text-emerald-800", 
      border: "border-emerald-400/40" 
    },
    1: { 
      text: "WARNING", 
      bg: "bg-amber-100/50", 
      textCol: "text-amber-800", 
      border: "border-amber-400/40" 
    },
    2: { 
      text: "CRITICAL", 
      bg: "bg-red-100/50", 
      textCol: "text-red-800", 
      border: "border-red-400/40" 
    },
  };

  // Fallback to CRITICAL (status 2) if status is unknown
  const config = configs[status] ?? configs[2];

  return (
    <div className={`
      ${config.bg} ${config.textCol} ${config.border}
      px-3 py-1.5 rounded-xl border-2 text-center 
      text-[10px] font-black tracking-[0.1em]
      shadow-sm transition-all duration-300 backdrop-blur-sm
    `}>
      <span className="flex items-center justify-center gap-2">
        {/* Pulse dot for live status monitoring */}
        <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${config.textCol.replace('text', 'bg')}`}></span>
        {config.text}
      </span>
    </div>
  );
}