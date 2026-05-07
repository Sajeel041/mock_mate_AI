"use client";

import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Pick a role",
    desc: "Select role, difficulty and how long you want to practice.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
        <path d="M4 6h16M4 12h10M4 18h7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "Talk it out",
    desc: "Have a real voice conversation with the AI interviewer.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
        <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
        <path d="M5 11v1a7 7 0 0 0 14 0v-1M12 19v3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "Get feedback",
    desc: "Score, strengths, and concrete next steps — instantly.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
        <path d="M3 3v18h18" strokeLinecap="round" />
        <path d="M7 14l4-4 4 4 5-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const HowItWorks = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {steps.map((s, i) => (
        <motion.div
          key={s.n}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 + i * 0.08 }}
          className="group glass rounded-2xl px-5 py-4 flex items-start gap-3 hover:border-primary-200/30 transition-colors"
        >
          <div className="shrink-0 w-9 h-9 rounded-lg bg-primary-200/15 text-primary-200 flex items-center justify-center group-hover:bg-primary-200/25 transition-colors">
            {s.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-primary-100/60">
                {s.n}
              </span>
              <h4 className="text-sm font-semibold text-white">{s.title}</h4>
            </div>
            <p className="text-xs text-light-100/70 mt-1 leading-relaxed">
              {s.desc}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default HowItWorks;
