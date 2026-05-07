import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import DisplayTechIcons from "./DisplayTechIcons";
import TiltCard from "./TiltCard";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  const href = feedback
    ? `/interview/${interviewId}/feedback`
    : `/interview/${interviewId}`;

  return (
    <TiltCard className="group w-[360px] max-sm:w-full min-h-96">
      <div className="card-border w-full min-h-96 transition-all duration-500 group-hover:glow-primary">
        <div className="card-interview relative" style={{ transform: "translateZ(0)" }}>
          {/* shine sweep */}
          <span className="shine-sweep" />

          {/* Type Badge */}
          <div
            className={cn(
              "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg backdrop-blur-sm",
              badgeColor
            )}
            style={{ transform: "translateZ(30px)" }}
          >
            <p className="badge-text">{normalizedType}</p>
          </div>

          <div style={{ transform: "translateZ(20px)" }}>
            {/* Cover Image with halo */}
            <div className="relative w-fit">
              <div className="absolute inset-0 rounded-full bg-primary-200/30 blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Image
                src={getRandomInterviewCover()}
                alt="cover-image"
                width={90}
                height={90}
                className="relative rounded-full object-cover size-[90px] ring-2 ring-primary-200/20 group-hover:ring-primary-200/60 transition-all duration-500"
              />
            </div>

            {/* Interview Role */}
            <h3 className="mt-5 capitalize">{role} Interview</h3>

            {/* Date & Score */}
            <div className="flex flex-row gap-5 mt-3">
              <div className="flex flex-row gap-2 items-center">
                <Image
                  src="/calendar.svg"
                  width={20}
                  height={20}
                  alt="calendar"
                />
                <p className="text-sm">{formattedDate}</p>
              </div>

              <div className="flex flex-row gap-2 items-center">
                <Image src="/star.svg" width={20} height={20} alt="star" />
                <p className="text-sm">
                  <span className="text-primary-200 font-bold">
                    {feedback?.totalScore || "---"}
                  </span>
                  /100
                </p>
              </div>
            </div>

            {/* Feedback or Placeholder Text */}
            <p className="line-clamp-2 mt-5 text-light-100/80">
              {feedback?.finalAssessment ||
                "You haven't taken this interview yet. Take it now to improve your skills."}
            </p>
          </div>

          <div
            className="flex flex-row justify-between items-center"
            style={{ transform: "translateZ(30px)" }}
          >
            <DisplayTechIcons techStack={techstack} />

            <Link
              href={href}
              className="group/btn relative inline-flex items-center gap-1.5 rounded-full bg-primary-200 px-5 py-2 text-sm font-bold text-dark-100 transition-all duration-300 hover:glow-primary hover:-translate-y-0.5"
            >
              {feedback ? "Check Feedback" : "View Interview"}
              <svg
                className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5"
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
        </div>
      </div>
    </TiltCard>
  );
};

export default InterviewCard;
