"use client";

import dayjs from "dayjs";
import Link from "next/link";
import { motion } from "framer-motion";

import ScoreDonut from "./ScoreDonut";

interface Props {
  role: string;
  totalScore: number;
  finalAssessment?: string;
  createdAt?: string;
  retakeHref: string;
}

const FeedbackHero = ({
  role,
  totalScore,
  finalAssessment,
  createdAt,
  retakeHref,
}: Props) => {
  const verdict =
    totalScore >= 75
      ? { label: "Strong performance", tone: "text-success-100" }
      : totalScore >= 50
        ? { label: "Solid foundation", tone: "text-primary-200" }
        : { label: "Needs work", tone: "text-[#ff7b54]" };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-primary-200/15 blue-gradient-dark p-8 lg:p-10"
    >
      {/* ambient */}
      <div className="absolute -top-24 -right-24 w-[420px] h-[420px] blur-[110px] opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #6d6dfb 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8">
        <ScoreDonut score={totalScore} />

        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary-100/60">
              Interview wrap-up
            </p>
            <h1 className="mt-1 text-3xl md:text-4xl font-bold text-white capitalize">
              {role} Interview
            </h1>
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <span className={`text-sm font-semibold ${verdict.tone}`}>
                {verdict.label}
              </span>
              {createdAt && (
                <>
                  <span className="text-light-100/30">•</span>
                  <span className="text-xs text-light-100/60">
                    {dayjs(createdAt).format("MMM D, YYYY · h:mm A")}
                  </span>
                </>
              )}
            </div>
          </div>

          {finalAssessment && (
            <p className="text-sm leading-relaxed text-light-100/85 max-w-2xl">
              {finalAssessment}
            </p>
          )}

          <div className="flex flex-row gap-3 mt-3 flex-wrap">
            <Link
              href={retakeHref}
              className="group relative inline-flex items-center gap-2 rounded-full bg-primary-200 px-6 py-3 font-bold text-dark-100 glow-primary transition-all duration-300 hover:-translate-y-0.5 hover:glow-primary-strong overflow-hidden"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 12a9 9 0 1 0 3-6.7" strokeLinecap="round" />
                <path d="M3 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Retry interview</span>
              <span className="shine-sweep" />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold text-primary-100 hover:bg-dark-200/60 hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default FeedbackHero;
