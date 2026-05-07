"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full-Stack Developer",
  "DevOps Engineer",
  "Data Engineer",
  "Mobile Developer",
] as const;

const DIFFICULTIES = ["Junior", "Mid", "Senior"] as const;
const DURATIONS = [10, 20, 30] as const;

type Role = (typeof ROLES)[number];
type Difficulty = (typeof DIFFICULTIES)[number];
type Duration = (typeof DURATIONS)[number];

const Pill = ({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
      active
        ? "bg-primary-200 text-dark-100 border-primary-200 glow-primary"
        : "bg-dark-200/40 text-light-100/80 border-light-800/50 hover:border-primary-200/40 hover:text-white"
    }`}
  >
    {children}
  </button>
);

const StartInterviewCard = () => {
  const [role, setRole] = useState<Role>("Frontend Developer");
  const [difficulty, setDifficulty] = useState<Difficulty>("Mid");
  const [duration, setDuration] = useState<Duration>(20);

  const href = `/interview?role=${encodeURIComponent(role)}&difficulty=${difficulty}&duration=${duration}`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-primary-200/15 blue-gradient-dark"
    >
      {/* ambient blobs */}
      <div className="absolute inset-0 -z-0 pointer-events-none">
        <div
          className="absolute -top-24 -left-24 w-[420px] h-[420px] blur-[110px] opacity-40 animate-blob"
          style={{ background: "radial-gradient(circle, #6d6dfb 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-160px] right-[-80px] w-[420px] h-[420px] blur-[110px] opacity-30 animate-blob"
          style={{
            background: "radial-gradient(circle, #cac5fe 0%, transparent 70%)",
            animationDelay: "-7s",
          }}
        />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 p-8 lg:p-10">
        {/* Left: configurator */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-primary-100/80">
              <span className="w-1.5 h-1.5 rounded-full bg-success-100 animate-pulse" />
              Ready when you are
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold leading-tight">
              <span className="text-gradient">Start a new interview</span>
            </h2>
            <p className="mt-2 text-light-100/75 text-sm max-w-md">
              Configure your session, then click start. The AI interviewer will
              greet you and begin asking questions.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-light-100/60">
                Role
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {ROLES.map((r) => (
                  <Pill key={r} active={role === r} onClick={() => setRole(r)}>
                    {r}
                  </Pill>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-light-100/60">
                  Difficulty
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {DIFFICULTIES.map((d) => (
                    <Pill
                      key={d}
                      active={difficulty === d}
                      onClick={() => setDifficulty(d)}
                    >
                      {d}
                    </Pill>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-light-100/60">
                  Duration
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {DURATIONS.map((d) => (
                    <Pill
                      key={d}
                      active={duration === d}
                      onClick={() => setDuration(d)}
                    >
                      {d} min
                    </Pill>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Link
            href={href}
            className="group relative inline-flex items-center justify-center gap-2 self-start rounded-full bg-primary-200 px-8 py-4 font-bold text-dark-100 glow-primary transition-all duration-300 hover:-translate-y-0.5 hover:glow-primary-strong overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Start Interview
            </span>
            <span className="shine-sweep" />
          </Link>
        </div>

        {/* Right: live summary card */}
        <motion.aside
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative rounded-2xl glass p-6 flex flex-col justify-between min-h-[280px]"
        >
          <div>
            <p className="text-xs uppercase tracking-wider text-light-100/60">
              Session preview
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{role}</h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-light-800/60 text-light-100/85">
                {difficulty}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-light-800/60 text-light-100/85">
                {duration} min
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            {[
              { k: "Questions", v: Math.max(3, Math.round(duration / 4)) },
              { k: "Format", v: "Voice" },
              { k: "Feedback", v: "Instant" },
              { k: "Retries", v: "Unlimited" },
            ].map((it) => (
              <div
                key={it.k}
                className="rounded-xl bg-dark-200/60 px-3 py-2 border border-light-800/40"
              >
                <p className="text-[10px] uppercase tracking-wider text-light-100/50">
                  {it.k}
                </p>
                <p className="text-sm font-semibold text-white mt-0.5">{it.v}</p>
              </div>
            ))}
          </div>
        </motion.aside>
      </div>
    </motion.section>
  );
};

export default StartInterviewCard;
