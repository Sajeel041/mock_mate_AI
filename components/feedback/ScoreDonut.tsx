"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  score: number;
  size?: number;
  thickness?: number;
  label?: string;
}

const ScoreDonut = ({ score, size = 180, thickness = 12, label = "Overall" }: Props) => {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  // color tier
  const color =
    score >= 75 ? "#49de50" : score >= 50 ? "#cac5fe" : "#ff7b54";
  const glow =
    score >= 75 ? "rgba(73,222,80,0.35)" : score >= 50 ? "rgba(202,197,254,0.4)" : "rgba(255,123,84,0.35)";

  const offset = circumference - (animated / 100) * circumference;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size, filter: `drop-shadow(0 0 24px ${glow})` }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={thickness}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl font-bold text-white"
        >
          {score}
        </motion.span>
        <span className="text-[10px] uppercase tracking-[0.3em] text-light-100/60 mt-0.5">
          {label}
        </span>
      </div>
    </div>
  );
};

export default ScoreDonut;
