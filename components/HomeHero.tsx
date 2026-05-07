"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const HomeHero = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="card-cta perspective-1500"
    >
      {/* animated mesh inside hero */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
        <div
          className="absolute -top-24 -left-24 w-[420px] h-[420px] blur-[110px] opacity-40 animate-blob"
          style={{
            background:
              "radial-gradient(circle, #6d6dfb 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-160px] right-[-80px] w-[420px] h-[420px] blur-[110px] opacity-35 animate-blob"
          style={{
            background:
              "radial-gradient(circle, #cac5fe 0%, transparent 70%)",
            animationDelay: "-7s",
          }}
        />
      </div>

      <div className="flex flex-col gap-6 max-w-xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="inline-flex w-fit items-center gap-2 rounded-full glass px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-primary-100/80"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-success-100 animate-pulse" />
          AI-Powered Interview Coach
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-4xl md:text-5xl font-bold leading-tight"
        >
          <span className="text-gradient">
            Get Interview-Ready
          </span>
          <br />
          <span className="text-white/95">with AI Practice & Feedback</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-lg text-light-100/85"
        >
          Practice real interview questions, hear yourself out loud, and get
          instant, personalized feedback that helps you land the role.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-row gap-3 max-sm:flex-col"
        >
          <Link
            href="/interview"
            className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-primary-200 px-7 py-3.5 font-bold text-dark-100 glow-primary transition-transform duration-300 hover:-translate-y-0.5 hover:glow-primary-strong overflow-hidden"
          >
            <span className="relative z-10">Start an Interview</span>
            <svg
              className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
            <span className="shine-sweep" />
          </Link>

          <a
            href="#interviews"
            className="inline-flex items-center justify-center rounded-full glass px-7 py-3.5 text-sm font-semibold text-primary-100 transition-all duration-300 hover:bg-dark-200/60 hover:-translate-y-0.5"
          >
            View My Interviews
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85, rotateY: -25 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-sm:hidden perspective-1500"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* soft glow halo */}
        <div className="absolute inset-0 -z-10 blur-3xl opacity-50 bg-gradient-to-tr from-primary-200/40 via-transparent to-primary-200/30 rounded-full scale-110" />

        {/* spinning conic ring */}
        <div
          className="absolute inset-0 -z-10 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(202,197,254,0.35) 90deg, transparent 180deg, rgba(139,143,253,0.35) 270deg, transparent 360deg)",
            animation: "spin-border 12s linear infinite",
            mask: "radial-gradient(circle, transparent 55%, #000 56%, #000 60%, transparent 61%)",
            WebkitMask:
              "radial-gradient(circle, transparent 55%, #000 56%, #000 60%, transparent 61%)",
          }}
        />

        <div className="animate-float-slow">
          <Image
            src="/robot.png"
            alt="MockMate AI"
            width={420}
            height={420}
            className="drop-shadow-[0_25px_45px_rgba(109,109,251,0.45)]"
            priority
          />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HomeHero;
