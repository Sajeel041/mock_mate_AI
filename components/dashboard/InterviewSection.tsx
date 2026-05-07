import InterviewListItem from "./InterviewListItem";

interface InterviewItem {
  id: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
  score?: number;
}

interface Props {
  title: string;
  subtitle?: string;
  items: InterviewItem[];
  status: "completed" | "available";
  emptyText?: string;
}

const InterviewSection = ({ title, subtitle, items, status, emptyText }: Props) => {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-gradient-violet">{title}</h3>
          {subtitle && (
            <p className="text-xs text-light-100/60 mt-0.5">{subtitle}</p>
          )}
        </div>
        <span className="text-xs text-light-100/50">
          {items.length} {items.length === 1 ? "session" : "sessions"}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-light-800/60 px-6 py-10 text-center">
          <p className="text-sm text-light-100/60">
            {emptyText ?? "Nothing here yet."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((it, i) => (
            <InterviewListItem
              key={it.id}
              id={it.id}
              role={it.role}
              type={it.type}
              techstack={it.techstack}
              createdAt={it.createdAt}
              score={it.score}
              status={status}
              index={i}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default InterviewSection;
