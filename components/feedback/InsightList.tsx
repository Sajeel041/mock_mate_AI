"use client";

import { motion } from "framer-motion";

interface Props {
  title: string;
  items: string[];
  variant: "strength" | "improvement";
  empty?: string;
}

const variants = {
  strength: {
    border: "border-success-100/25",
    bg: "bg-success-100/5",
    iconBg: "bg-success-100/15 text-success-100",
    accent: "text-success-100",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  improvement: {
    border: "border-[#ffb347]/25",
    bg: "bg-[#ffb347]/5",
    iconBg: "bg-[#ffb347]/15 text-[#ffb347]",
    accent: "text-[#ffb347]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
    ),
  },
} as const;

const InsightList = ({ title, items, variant, empty }: Props) => {
  const v = variants[variant];

  return (
    <div className={`rounded-2xl border ${v.border} ${v.bg} p-6 flex flex-col gap-4`}>
      <h3 className={`text-base font-semibold ${v.accent}`}>{title}</h3>

      {items.length === 0 ? (
        <p className="text-sm text-light-100/60">{empty ?? "Nothing to show."}</p>
      ) : (
        <ul className="flex flex-col gap-3 list-none">
          {items.map((it, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-start gap-3 text-sm leading-relaxed text-light-100/90"
            >
              <span className={`shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${v.iconBg}`}>
                {v.icon}
              </span>
              <span>{it}</span>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InsightList;
