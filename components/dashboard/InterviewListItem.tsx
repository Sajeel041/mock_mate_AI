"use client";

import dayjs from "dayjs";
import Link from "next/link";
import { motion } from "framer-motion";

interface Props {
  id: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
  status: "completed" | "available";
  score?: number;
  index?: number;
}

const InterviewListItem = ({
  id,
  role,
  type,
  techstack,
  createdAt,
  status,
  score,
  index = 0,
}: Props) => {
  const isDone = status === "completed";
  const date = dayjs(createdAt || Date.now()).format("MMM D, YYYY");

  const primaryHref = isDone ? `/interview/${id}/feedback` : `/interview/${id}`;
  const primaryLabel = isDone ? "View feedback" : "Start";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex items-center gap-4 px-4 py-3.5 rounded-xl border border-light-800/40 bg-dark-200/40 hover:bg-dark-200/70 hover:border-primary-200/30 transition-all duration-300"
    >
      {/* status dot */}
      <span
        className={`shrink-0 w-2 h-2 rounded-full ${
          isDone ? "bg-success-100" : "bg-primary-200 animate-pulse"
        }`}
      />

      {/* role + meta */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="text-sm font-semibold text-white capitalize truncate">
            {role} Interview
          </h4>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-light-800/60 text-light-100/85 capitalize">
            {type}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-light-100/55">
          <span>{date}</span>
          {techstack && techstack.length > 0 && (
            <>
              <span className="opacity-40">•</span>
              <span className="truncate">{techstack.slice(0, 3).join(" · ")}</span>
            </>
          )}
        </div>
      </div>

      {/* score */}
      {isDone && typeof score === "number" && (
        <div className="hidden sm:flex flex-col items-end shrink-0 mr-2">
          <span className="text-xs text-light-100/55">Score</span>
          <span className="text-base font-bold text-primary-200">{score}</span>
        </div>
      )}

      {/* actions */}
      <div className="flex items-center gap-2 shrink-0">
        {isDone && (
          <Link
            href={`/interview/${id}`}
            className="text-xs font-semibold text-light-100/70 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-dark-200/80"
          >
            Retry
          </Link>
        )}
        <Link
          href={primaryHref}
          className="inline-flex items-center gap-1 text-xs font-bold text-dark-100 bg-primary-200 hover:bg-primary-100 px-3.5 py-1.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 group-hover:glow-primary"
        >
          {primaryLabel}
          <svg
            className="w-3 h-3 transition-transform group-hover:translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

export default InterviewListItem;
