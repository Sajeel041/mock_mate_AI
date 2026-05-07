"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface Props {
  userName: string;
  userId?: string;
  interviewId: string;
  feedbackId?: string;
  role: string;
  type: string;
  questions: string[];
}

// Token-overlap based matcher: pick the question with the most shared
// (lowercased, length>3) words to the assistant's last sentence.
const pickActiveQuestion = (text: string, questions: string[]): number | null => {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3);

  const tokens = new Set(norm(text));
  if (tokens.size === 0) return null;

  let bestIdx = -1;
  let bestScore = 0;
  questions.forEach((q, i) => {
    const qTokens = norm(q);
    if (qTokens.length === 0) return;
    const overlap = qTokens.filter((t) => tokens.has(t)).length;
    const score = overlap / qTokens.length;
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  });

  // Require at least 25% overlap to call it a match — avoids advancing on
  // greetings and filler.
  return bestScore >= 0.25 ? bestIdx : null;
};

const FocusInterview = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  role,
  questions,
}: Props) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [hasUserAnswered, setHasUserAnswered] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const activeIdxRef = useRef(0);

  useEffect(() => {
    activeIdxRef.current = activeIdx;
  }, [activeIdx]);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type !== "transcript" || message.transcriptType !== "final") return;

      const m: SavedMessage = { role: message.role, content: message.transcript };
      setMessages((prev) => [...prev, m]);

      if (m.role === "assistant") {
        const idx = pickActiveQuestion(m.content, questions);
        // Only advance forward — never jump backward on a re-prompt or recap.
        if (idx !== null && idx >= activeIdxRef.current) {
          setActiveIdx(idx);
          setHasUserAnswered(false);
        }
      } else if (m.role === "user" && m.content.trim().length > 8) {
        setHasUserAnswered(true);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (e: Error) => console.log("Vapi error:", e);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, [questions]);

  // When the call ends → generate feedback and redirect to the end screen.
  useEffect(() => {
    if (callStatus !== CallStatus.FINISHED || isGeneratingFeedback) return;
    if (messages.length === 0) {
      router.push(`/interview/${interviewId}`);
      return;
    }

    let cancelled = false;
    (async () => {
      setIsGeneratingFeedback(true);
      const res = await createFeedback({
        interviewId,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });
      if (cancelled) return;
      if (res?.success) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        router.push("/");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [callStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStart = async () => {
    setCallStatus(CallStatus.CONNECTING);
    const formattedQuestions = questions.map((q) => `- ${q}`).join("\n");
    await vapi.start(interviewer, {
      variableValues: { questions: formattedQuestions },
    });
  };

  const handleEnd = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const total = questions.length;
  const progressPct = useMemo(
    () => Math.min(100, Math.round(((activeIdx + (hasUserAnswered ? 1 : 0)) / total) * 100)),
    [activeIdx, hasUserAnswered, total]
  );

  const isIdle = callStatus === CallStatus.INACTIVE;
  const isConnecting = callStatus === CallStatus.CONNECTING;
  const isActive = callStatus === CallStatus.ACTIVE;

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      {/* Top bar — minimal, focus mode */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-light-100/60 hover:text-white transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Exit
        </Link>

        <div className="flex flex-col items-center min-w-[260px] flex-1 max-w-md">
          <div className="flex items-center justify-between w-full mb-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-light-100/60">
              {role}
            </span>
            <span className="text-xs font-mono text-light-100/80">
              {Math.min(activeIdx + 1, total)} / {total}
            </span>
          </div>
          <div className="w-full h-1.5 bg-dark-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-[#cac5fe] to-[#8b8ffd] glow-primary"
            />
          </div>
        </div>

        <div className="text-xs text-light-100/60 min-w-[60px] text-right">
          {isActive && (isSpeaking ? "AI speaking" : "Listening")}
          {isConnecting && "Connecting"}
          {isIdle && "Ready"}
        </div>
      </div>

      {/* Center stage — single question, dominant */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-3xl mx-auto perspective-1500">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 28, rotateX: -8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20, rotateX: 8 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: "preserve-3d" }}
              className="text-center"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary-100/60 mb-4">
                Question {activeIdx + 1}
              </p>
              <h1 className="text-2xl md:text-4xl font-semibold text-white leading-snug">
                {questions[activeIdx] ?? "Get ready…"}
              </h1>

              {/* AI talking indicator */}
              <div className="mt-10 flex items-center justify-center gap-1.5 h-8">
                {isSpeaking ? (
                  <>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ scaleY: [0.4, 1, 0.4] }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: "easeInOut",
                        }}
                        className="w-1 h-6 rounded-full bg-primary-200 origin-center"
                      />
                    ))}
                  </>
                ) : isActive ? (
                  <span className="text-xs text-light-100/55">
                    Take your time — speak when ready.
                  </span>
                ) : (
                  <span className="text-xs text-light-100/55">
                    {isConnecting
                      ? "Connecting to interviewer…"
                      : "Press Start to begin."}
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="mt-10 flex flex-col items-center gap-4">
        {/* Avatars: AI + user */}
        <div className="flex items-center gap-6 mb-2">
          <div className="relative">
            {isSpeaking && (
              <span className="absolute inset-0 rounded-full bg-primary-200/40 animate-pulse-ring" />
            )}
            <div className="relative w-12 h-12 rounded-full blue-gradient flex items-center justify-center">
              <Image src="/ai-avatar.png" alt="AI" width={28} height={24} />
            </div>
          </div>
          <span className="text-xs text-light-100/40">×</span>
          <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary-200/30">
            <Image
              src="/user-avatar.png"
              alt={userName}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
        </div>

        {isIdle || isConnecting ? (
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            disabled={isConnecting}
            onClick={handleStart}
            className="group relative inline-flex items-center gap-2 rounded-full bg-success-100 px-8 py-3.5 font-bold text-white glow-success disabled:opacity-80 overflow-visible"
          >
            {isConnecting && (
              <span className="absolute inset-0 rounded-full bg-success-100 animate-ping opacity-50" />
            )}
            <svg className="relative w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z" />
            </svg>
            <span className="relative">{isConnecting ? "Connecting…" : "Start interview"}</span>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleEnd}
            disabled={isGeneratingFeedback}
            className="inline-flex items-center gap-2 rounded-full bg-destructive-100 px-8 py-3.5 font-bold text-white glow-destructive disabled:opacity-70"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.965.965 0 0 1-.29-.7c0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.1-.7-.28a11.27 11.27 0 0 0-2.67-1.85.99.99 0 0 1-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
            </svg>
            {isGeneratingFeedback ? "Scoring…" : "End interview"}
          </motion.button>
        )}

        <p className="text-[11px] text-light-100/40 max-w-md text-center">
          The interviewer controls the pace. Your progress advances as the AI
          moves to each question.
        </p>
      </div>
    </div>
  );
};

export default FocusInterview;
