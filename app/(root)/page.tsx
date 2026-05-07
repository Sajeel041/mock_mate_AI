import { redirect } from "next/navigation";

import HowItWorks from "@/components/dashboard/HowItWorks";
import StatsRow from "@/components/dashboard/StatsRow";
import StartInterviewCard from "@/components/dashboard/StartInterviewCard";
import InterviewSection from "@/components/dashboard/InterviewSection";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbackByInterviewId,
  getInterviewsByUserId,
  getLatestInterviews,
  getUserStats,
} from "@/lib/actions/general.action";
import { demoInterview } from "@/constants/demo";

async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const [stats, takenInterviews, availableInterviews] = await Promise.all([
    getUserStats(user.id),
    getInterviewsByUserId(user.id),
    getLatestInterviews({ userId: user.id }),
  ]);

  // Always make sure the demo interview is reachable from the dashboard
  // so a brand-new user has something to click. Avoid duplicating it if the
  // backend already returned it.
  const haveTaken = takenInterviews ?? [];
  const haveAvailable = availableInterviews ?? [];

  const allRefIds = new Set([
    ...haveTaken.map((i) => i.id),
    ...haveAvailable.map((i) => i.id),
  ]);

  const pastWithScores = await Promise.all(
    haveTaken.map(async (i) => {
      const fb = await getFeedbackByInterviewId({
        interviewId: i.id,
        userId: user.id,
      });
      return {
        id: i.id,
        role: i.role,
        type: i.type,
        techstack: i.techstack,
        createdAt: fb?.createdAt ?? i.createdAt,
        score: fb?.totalScore,
      };
    })
  );

  // Demo always appears in "past" so the user can revisit feedback.
  if (!allRefIds.has(demoInterview.id)) {
    pastWithScores.unshift({
      id: demoInterview.id,
      role: demoInterview.role,
      type: demoInterview.type,
      techstack: demoInterview.techstack,
      createdAt: demoInterview.createdAt,
      score: undefined,
    });
  }

  const available = haveAvailable.map((i) => ({
    id: i.id,
    role: i.role,
    type: i.type,
    techstack: i.techstack,
    createdAt: i.createdAt,
  }));

  return (
    <div className="flex flex-col gap-10">
      {/* Top: welcome + stats */}
      <StatsRow stats={stats} userName={user.name} />

      {/* How it works */}
      <HowItWorks />

      {/* Center: dominant Start Interview */}
      <StartInterviewCard />

      {/* Past interviews */}
      <InterviewSection
        title="Your sessions"
        subtitle="Past interviews — retry or review feedback"
        items={pastWithScores}
        status="completed"
        emptyText="You haven't completed any interviews yet."
      />

      {/* Available */}
      {available.length > 0 && (
        <InterviewSection
          title="Take an interview"
          subtitle="Curated practice sets ready to go"
          items={available}
          status="available"
        />
      )}
    </div>
  );
}

export default Dashboard;
