"use client";

import { motion } from "framer-motion";
import type { UserStats } from "@/lib/actions/general.action";

interface Props {
  stats: UserStats;
  userName: string;
}

const StatsRow = ({ stats, userName }: Props) => {
  const items = [
    {
      label: "Interviews",
      value: stats.interviewsTaken,
      sub: "completed",
      accent: "from-[#cac5fe] to-[#8b8ffd]",
    },
    {
      label: "Average score",
      value: `${stats.averageScore}`,
      sub: "/ 100",
      accent: "from-[#9bf2a7] to-[#49de50]",
    },
    {
      label: "Best score",
      value: `${stats.bestScore}`,
      sub: "/ 100",
      accent: "from-[#ffe08a] to-[#ffb347]",
    },
    {
      label: "Practice time",
      value: stats.practiceMinutes,
      sub: "minutes",
      accent: "from-[#a3c7ff] to-[#4fc3f7]",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between gap-3"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary-100/60">
            Welcome back
          </p>
          <h2 className="text-gradient mt-1">{userName}</h2>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 + i * 0.06 }}
            className="relative overflow-hidden glass rounded-2xl px-5 py-4"
          >
            <div
              className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-30 bg-gradient-to-br ${it.accent}`}
            />
            <p className="text-xs uppercase tracking-wider text-light-100/60">
              {it.label}
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span
                className={`text-3xl font-bold bg-gradient-to-br ${it.accent} bg-clip-text text-transparent`}
              >
                {it.value}
              </span>
              <span className="text-xs text-light-100/60">{it.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatsRow;
