import React from "react";
import { Snowflake } from "lucide-react";

const SNOWFLAKES = Array.from({ length: 20 });

const COLORS = [
  "text-[#ABC270]/15", // sage green
  "text-[#F5F1EB]/20", // warm beige
];

function Snow() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {SNOWFLAKES.map((_, i) => {
        const colorClass =
          COLORS[Math.floor(Math.random() * COLORS.length)];

        return (
          <Snowflake
            key={i}
            className={`absolute ${colorClass} animate-snow`}
            size={Math.random() * 18 + 10}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 12 + 10}s`,
            }}
          />
        );
      })}
    </div>
  );
}

export default Snow;
