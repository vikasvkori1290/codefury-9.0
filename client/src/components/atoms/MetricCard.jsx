import React from "react";

export const MetricCard = ({
  label,
  value,
  unit = "",
  delta,
  deltaType = "positive",
  subtext,
  icon,
}) => {
  const deltaColor =
    deltaType === "positive"
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : deltaType === "negative"
      ? "text-rose-700 bg-rose-50 border-rose-200"
      : "text-zinc-600 bg-zinc-100 border-zinc-200";

  return (
    <div className="bg-white border border-[#e4e4e7] p-4 rounded-xl flex flex-col justify-between transition-all hover:border-zinc-400 group shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono font-medium">
          {label}
        </span>
        {icon && <span className="text-zinc-400 group-hover:text-zinc-700 transition-colors text-base">{icon}</span>}
      </div>

      <div className="flex items-baseline gap-1.5 my-0.5">
        <span className="text-2xl sm:text-3xl font-mono font-bold text-zinc-900 tracking-tight">
          {value}
        </span>
        {unit && <span className="text-xs font-mono text-zinc-500">{unit}</span>}
      </div>

      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-[#f4f4f5]">
        {delta && (
          <span
            className={`inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${deltaColor}`}
          >
            {delta}
          </span>
        )}
        {subtext && <span className="text-[11px] text-zinc-500 font-sans truncate">{subtext}</span>}
      </div>
    </div>
  );
};

export default MetricCard;
