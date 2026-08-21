import React, { useEffect, useRef } from "react";

export const PixelMountainArt = ({ height = 280, className = "" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = 1200;
    const canvasHeight = height;
    canvas.width = width;
    canvas.height = canvasHeight;

    // Base Sky gradient
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Sky soft pixel dithering (light blue / cream)
    const pixelSize = 4;
    const cols = Math.ceil(width / pixelSize);
    const rows = Math.ceil(height / pixelSize);

    // Draw sky subtle dithered dots
    for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows * 0.45; r++) {
        if (Math.random() < 0.25 - (r / rows) * 0.3) {
          ctx.fillStyle = Math.random() > 0.5 ? "#dbeafe" : "#eff6ff";
          ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
        }
      }
    }

    // Mountain silhouettes generation
    // Colors palette matching Browserbase (black, orange, yellow-gold, forest green, light olive)
    const colors = [
      "#09090b", // deep black
      "#18181b", // dark charcoal
      "#ea580c", // vibrant orange
      "#f97316", // bright orange
      "#facc15", // golden yellow
      "#eab308", // dark yellow
      "#15803d", // forest green
      "#84cc16", // light lime green
      "#fed7aa", // peach highlight
    ];

    // Generate height map with 3 mountain peaks
    const mountainHeights = new Array(cols);
    for (let c = 0; c < cols; c++) {
      const x = c / cols;
      // Multi-frequency wave for rugged mountain ridge
      const peak1 = Math.sin(x * Math.PI * 1.8) * 0.45;
      const peak2 = Math.sin(x * Math.PI * 3.5 + 0.5) * 0.25;
      const peak3 = Math.sin(x * Math.PI * 7.0) * 0.12;
      const noise = (Math.random() - 0.5) * 0.06;
      
      const normalizedHeight = Math.max(0.15, Math.min(0.85, 0.48 + peak1 + peak2 + peak3 + noise));
      mountainHeights[c] = Math.floor(normalizedHeight * rows);
    }

    // Draw Mountain with Dithered Pointillism
    for (let c = 0; c < cols; c++) {
      const mountainTop = rows - mountainHeights[c];
      for (let r = mountainTop; r < rows; r++) {
        const depth = (r - mountainTop) / mountainHeights[c];
        const rand = Math.random();

        // Color selection based on depth & noise
        if (r === mountainTop || (r === mountainTop + 1 && rand > 0.4)) {
          // Mountain ridge edge (deep black or sharp orange)
          ctx.fillStyle = rand > 0.6 ? "#ea580c" : "#09090b";
        } else if (depth < 0.25) {
          // High peak zone: heavy black with dense orange & yellow scatter
          if (rand < 0.45) ctx.fillStyle = "#09090b";
          else if (rand < 0.75) ctx.fillStyle = "#ea580c";
          else if (rand < 0.9) ctx.fillStyle = "#facc15";
          else ctx.fillStyle = "#15803d";
        } else if (depth < 0.6) {
          // Mid slope: high-density orange, yellow, green dither pattern
          if (rand < 0.35) ctx.fillStyle = "#09090b";
          else if (rand < 0.65) ctx.fillStyle = "#ea580c";
          else if (rand < 0.85) ctx.fillStyle = "#f97316";
          else if (rand < 0.95) ctx.fillStyle = "#facc15";
          else ctx.fillStyle = "#84cc16";
        } else {
          // Base valley: rich mix with green and gold highlights
          if (rand < 0.25) ctx.fillStyle = "#09090b";
          else if (rand < 0.5) ctx.fillStyle = "#ea580c";
          else if (rand < 0.7) ctx.fillStyle = "#facc15";
          else if (rand < 0.85) ctx.fillStyle = "#15803d";
          else ctx.fillStyle = "#fed7aa";
        }

        ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
      }
    }
  }, []);

  return (
    <div className={`w-full overflow-hidden border-b border-[#e4e4e7] bg-white flex justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full max-w-7xl object-cover"
        style={{ imageRendering: "pixelated", height: `${height}px` }}
      />
    </div>
  );
};

export default PixelMountainArt;
