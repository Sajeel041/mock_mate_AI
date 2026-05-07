"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
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

interface SummaryData {
  feedbackId: string;
  totalScore: number;
  finalAssessment: string;
  areasForImprovement: string[];
  strengths: string[];
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isSummarySpeaking, setIsSummarySpeaking] = useState(false);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

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
  }, []);

  const speakSummary = (data: SummaryData) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const areas =
      data.areasForImprovement.length > 0
        ? `Here are the main areas you should focus on. ${data.areasForImprovement
            .map((a, i) => `Number ${i + 1}. ${a}`)
            .join(" ")}`
        : "Great job! I did not find major areas of weakness.";

    const text = `Thanks for completing the interview. Your overall score is ${data.totalScore} out of 100. ${data.finalAssessment} ${areas} Keep practicing and you will improve quickly.`;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.lang = "en-US";
      utterance.onstart = () => setIsSummarySpeaking(true);
      utterance.onend = () => setIsSummarySpeaking(false);
      utterance.onerror = () => setIsSummarySpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSummarySpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSummarySpeaking(false);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (msgs: SavedMessage[]) => {
      setIsGeneratingSummary(true);
      const result = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: msgs,
        feedbackId,
      });
      setIsGeneratingSummary(false);

      if (result?.success && result.feedback) {
        const data: SummaryData = {
          feedbackId: result.feedbackId!,
          totalScore: result.feedback.totalScore,
          finalAssessment: result.feedback.finalAssessment,
          areasForImprovement: result.feedback.areasForImprovement || [],
          strengths: result.feedback.strengths || [],
        };
        setSummary(data);
        speakSummary(data);
      } else {
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED && !summary && !isGeneratingSummary) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [
    messages,
    callStatus,
    feedbackId,
    interviewId,
    router,
    type,
    userId,
    summary,
    isGeneratingSummary,
  ]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const goToFullFeedback = () => {
    stopSpeaking();
    router.push(`/interview/${interviewId}/feedback`);
  };

  const isAiActive = isSpeaking || isSummarySpeaking;

  return (
    <>
      <div className="call-view">
        {/* AI Interviewer Card */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="card-interviewer relative overflow-hidden"
        >
          {/* ambient gradient */}
          <div className="absolute inset-0 -z-10 opacity-60">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200/20 blur-3xl rounded-full" />
          </div>

          <div className="avatar relative">
            {/* outer pulse rings when speaking */}
            {isAiActive && (
              <>
                <span className="absolute inset-0 rounded-full bg-primary-200/40 animate-pulse-ring" />
                <span
                  className="absolute inset-0 rounded-full bg-primary-200/30 animate-pulse-ring"
                  style={{ animationDelay: "0.4s" }}
                />
              </>
            )}

            <motion.div
              animate={
                isAiActive
                  ? { scale: [1, 1.05, 1] }
                  : { scale: 1 }
              }
              transition={{
                duration: 0.6,
                repeat: isAiActive ? Infinity : 0,
                ease: "easeInOut",
              }}
              className="relative z-10 flex items-center justify-center blue-gradient rounded-full size-[120px]"
            >
              <Image
                src="/ai-avatar.png"
                alt="profile-image"
                width={65}
                height={54}
                className="object-cover"
              />
            </motion.div>
          </div>
          <h3>AI Interviewer</h3>
          <span className="text-xs uppercase tracking-[0.2em] text-primary-100/60">
            {callStatus === CallStatus.ACTIVE
              ? isAiActive
                ? "Speaking…"
                : "Listening…"
              : callStatus === CallStatus.CONNECTING
                ? "Connecting…"
                : "Idle"}
          </span>
        </motion.div>

        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="card-border"
        >
          <div className="card-content relative overflow-hidden">
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-primary-200/15 blur-3xl rounded-full" />
            <h3>{userName}</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-primary-100/60">
              You
            </span>
          </div>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {messages.length > 0 && !summary && (
          <motion.div
            key="transcript"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="transcript-border"
          >
            <div className="transcript">
              <motion.p
                key={lastMessage}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {lastMessage}
              </motion.p>
            </div>
          </motion.div>
        )}

        {isGeneratingSummary && (
          <motion.div
            key="generating"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="transcript-border"
          >
            <div className="transcript flex items-center gap-3">
              <span className="inline-flex gap-1">
                <span className="w-2 h-2 rounded-full bg-primary-200 animate-bounce" />
                <span
                  className="w-2 h-2 rounded-full bg-primary-200 animate-bounce"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-primary-200 animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                />
              </span>
              <p>Analyzing your interview and preparing personalized feedback…</p>
            </div>
          </motion.div>
        )}

        {summary && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="summary-card relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary-200/10 blur-3xl rounded-full pointer-events-none" />

            <div className="summary-header">
              <h3 className="text-gradient">Interview Wrap-up</h3>
              <p className="summary-score">
                Score:{" "}
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  {summary.totalScore}
                </motion.span>
                /100
              </p>
            </div>

            <p className="summary-assessment">{summary.finalAssessment}</p>

            <div className="summary-section">
              <h4>Areas to focus on</h4>
              {summary.areasForImprovement.length > 0 ? (
                <ul>
                  {summary.areasForImprovement.map((area, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                    >
                      {area}
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p>No major weak areas detected. Excellent work!</p>
              )}
            </div>

            {summary.strengths.length > 0 && (
              <div className="summary-section">
                <h4>What you did well</h4>
                <ul>
                  {summary.strengths.map((s, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.08 }}
                    >
                      {s}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            <div className="summary-actions">
              {isSummarySpeaking ? (
                <button
                  className="btn-secondary transition-transform hover:-translate-y-0.5"
                  onClick={stopSpeaking}
                >
                  Stop voice
                </button>
              ) : (
                <button
                  className="btn-secondary transition-transform hover:-translate-y-0.5"
                  onClick={() => speakSummary(summary)}
                >
                  Replay voice
                </button>
              )}
              <button
                className="btn-primary hover:glow-primary transition-all hover:-translate-y-0.5"
                onClick={goToFullFeedback}
              >
                View full feedback
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!summary && !isGeneratingSummary && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full flex justify-center"
        >
          {callStatus !== "ACTIVE" ? (
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "relative btn-call glow-success overflow-visible",
                callStatus === "CONNECTING" && "opacity-90"
              )}
              onClick={() => handleCall()}
            >
              {callStatus === "CONNECTING" && (
                <span className="absolute inset-0 rounded-full bg-success-100 animate-ping opacity-60" />
              )}
              <span className="relative flex items-center gap-2">
                {callStatus === "INACTIVE" || callStatus === "FINISHED" ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z" />
                    </svg>
                    Start Call
                  </>
                ) : (
                  ". . ."
                )}
              </span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn-disconnect glow-destructive"
              onClick={() => handleDisconnect()}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.965.965 0 0 1-.29-.7c0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.1-.7-.28a11.27 11.27 0 0 0-2.67-1.85.99.99 0 0 1-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
                </svg>
                End
              </span>
            </motion.button>
          )}
        </motion.div>
      )}
    </>
  );
};

export default Agent;
