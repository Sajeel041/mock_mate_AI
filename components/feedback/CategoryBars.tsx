"use client";

import { motion } from "framer-motion";

interface Category {
  name: string;
  score: number;
  comment: string;
}

const tone = (score: number) => {
  if (score >= 75) return "from-[#49de50] to-[#9bf2a7]";
  if (score >= 50) return "from-[#cac5fe] to-[#8b8ffd]";
  return "from-[#ff7b54] to-[#f75353]";
};

const CategoryBars = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="flex flex-col gap-5">
      {categories.map((c, i) => (
        <motion.div
          key={c.name}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.06 }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-baseline justify-between">
            <h4 className="text-sm font-semibold text-white">{c.name}</h4>
            <span className="text-xs font-mono text-light-100/70">
              <span className="text-primary-200 font-bold text-base">{c.score}</span>
              <span className="opacity-60">/100</span>
            </span>
          </div>
          <div className="h-2 bg-dark-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${c.score}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={`h-full rounded-full bg-gradient-to-r ${tone(c.score)}`}
            />
          </div>
          <p className="text-xs leading-relaxed text-light-100/70">{c.comment}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoryBars;
