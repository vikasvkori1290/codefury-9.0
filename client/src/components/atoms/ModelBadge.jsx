import React from "react";

const badgeVariants = {
  creator: "bg-[#ea580c]/10 text-[#ea580c] border-[#ea580c]/30",
  frontier: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  "fine-tuned": "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  quantized: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  verified: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  default: "bg-zinc-100 text-zinc-700 border-zinc-300",
};

export const ModelBadge = ({ type = "default", children, size = "md", icon }) => {
  const variantClass = badgeVariants[type.toLowerCase()] || badgeVariants.default;
  const sizeClass = size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono font-medium rounded-none border ${variantClass} ${sizeClass} tracking-wide select-none`}
    >
      {icon && <span className="text-[1.1em]">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default ModelBadge;
