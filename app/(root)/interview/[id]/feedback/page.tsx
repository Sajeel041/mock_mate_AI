import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import FillerWordsChart from "@/components/FillerWordsChart";
import FeedbackHero from "@/components/feedback/FeedbackHero";
import CategoryBars from "@/components/feedback/CategoryBars";
import InsightList from "@/components/feedback/InsightList";
import {
  DEMO_INTERVIEW_ID,
  demoTranscript,
  demoFillerCounts,
} from "@/constants/demo";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  if (!feedback) {
    return (
      <div className="rounded-2xl border border-dashed border-light-800/60 px-6 py-16 text-center max-w-xl mx-auto">
        <h2 className="text-gradient-violet">No feedback yet</h2>
        <p className="mt-2 text-sm text-light-100/70">
          Take this interview first to generate feedback.
        </p>
      </div>
    );
  }

  const isDemo = id === DEMO_INTERVIEW_ID;
  const transcript = isDemo ? demoTranscript : null;
  const fillerData = isDemo ? demoFillerCounts : null;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
      <FeedbackHero
        role={interview.role}
        totalScore={feedback.totalScore}
        finalAssessment={feedback.finalAssessment}
        createdAt={feedback.createdAt}
        retakeHref={`/interview/${id}`}
      />

      {/* Strengths / Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InsightList
          title="What you did well"
          variant="strength"
          items={feedback.strengths ?? []}
          empty="No standout strengths flagged this round — keep practicing."
        />
        <InsightList
          title="Areas to focus on"
          variant="improvement"
          items={feedback.areasForImprovement ?? []}
          empty="Nothing major to flag — great work."
        />
      </div>

      {/* Category breakdown */}
      {feedback.categoryScores && feedback.categoryScores.length > 0 && (
        <section className="rounded-2xl border border-light-800/40 bg-dark-200/30 p-6 md:p-8 flex flex-col gap-5">
          <div>
            <h3 className="text-gradient-violet">Breakdown</h3>
            <p className="text-xs text-light-100/60 mt-0.5">
              Per-category scoring with detailed comments.
            </p>
          </div>
          <CategoryBars categories={feedback.categoryScores} />
        </section>
      )}

      {/* Filler words (demo only) */}
      {fillerData && <FillerWordsChart data={fillerData} />}

      {/* Transcript (demo only) */}
      {transcript && transcript.length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="text-gradient-violet">Conversation</h3>
          <div className="transcript-list scrollbar-soft">
            {transcript.map((m, i) => (
              <div key={i} className={`transcript-row transcript-row--${m.role}`}>
                <span className="transcript-role">
                  {m.role === "assistant" ? "Interviewer" : "You"}
                </span>
                <p className="transcript-text">{m.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Feedback;
