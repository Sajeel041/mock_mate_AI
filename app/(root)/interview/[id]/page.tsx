import { redirect } from "next/navigation";

import FocusInterview from "@/components/interview/FocusInterview";
import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  return (
    <FocusInterview
      userName={user.name}
      userId={user.id}
      interviewId={id}
      feedbackId={feedback?.id}
      role={interview.role}
      type={interview.type}
      questions={interview.questions}
    />
  );
};

export default InterviewDetails;
