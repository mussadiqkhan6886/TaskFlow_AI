import {
  KeyRound,
  ListChecks,
  Radio,
  Database,
  ArrowDown,
  type LucideIcon,
} from "lucide-react";

type Phase = {
  id: string;
  title: string;
  detail: string;
  bullets: string[];
  icon: LucideIcon;
};

const PHASES: Phase[] = [
  {
    id: "signin",
    title: "Sign in",
    detail:
      "Users authenticate once, and every later request is verified on the server.",
    bullets: [
      "Credentials are validated and tokens are issued as HTTP-only cookies",
      "Expired access tokens are renewed with the refresh token",
      "Role checks run on every protected route for Admin, Manager and Employee",
    ],
    icon: KeyRound,
  },
  {
    id: "work",
    title: "Manage work",
    detail:
      "The dashboard shows the tasks each role is allowed to see and change.",
    bullets: [
      "Create and assign tasks with priority and status",
      "Update tasks within role and ownership rules",
      "Gemini generates summaries and suggests priorities on demand",
    ],
    icon: ListChecks,
  },
  {
    id: "collaborate",
    title: "Collaborate live",
    detail:
      "Socket.IO pushes events to connected users, so nobody has to refresh.",
    bullets: [
      "Task updates and notifications arrive instantly",
      "Team chat with presence and read receipts",
    ],
    icon: Radio,
  },
  {
    id: "data",
    title: "Persist and cache",
    detail: "Every write ends up in MongoDB; Redis speeds up repeated reads.",
    bullets: [
      "MongoDB is the source of truth",
      "Redis caches frequently read data, and writes invalidate affected entries",
    ],
    icon: Database,
  },
];

const REQUEST_FLOW = [
  "Browser (Next.js)",
  "Application Load Balancer",
  "Express API + Socket.IO",
  "Redis cache",
  "MongoDB Atlas",
];

export default function Workflow() {
  return (
    <section id="workflow" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 max-w-lg">
        <h2 className="text-2xl font-semibold tracking-tight text-[#E4E5E7]">
          Application Workflow
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-[#8B8F98]">
          How a user moves through TaskFlow AI, and how a request travels
          through the stack.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
        {/* Timeline */}
        <div className="relative">
          <div className="absolute bottom-4 left-[18px] top-4 w-px -translate-x-1/2 bg-[#1E2126]" />

          <ol className="space-y-6">
            {PHASES.map((phase, i) => (
              <li key={phase.id} className="relative flex gap-4">
                <div className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#1E2126] bg-[#101216]">
                  <phase.icon
                    aria-hidden="true"
                    className="h-4 w-4 text-[#5B7FFF]"
                    strokeWidth={1.75}
                  />
                </div>

                <div className="flex-1 rounded-lg border border-[#1E2126] bg-[#101216] px-4 py-4 transition-colors hover:bg-[#12151A]">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[11px] text-[#7A7F88]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-[14px] font-medium text-[#E4E5E7]">
                      {phase.title}
                    </h3>
                  </div>

                  <p className="mt-1 text-[13px] leading-relaxed text-[#8B8F98]">
                    {phase.detail}
                  </p>

                  <ul className="mt-3 space-y-1.5">
                    {phase.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex gap-2 text-[13px] leading-relaxed text-[#8B8F98]"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#5B7FFF]"
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Request flow */}
        <aside className="rounded-lg border border-[#1E2126] bg-[#101216] p-5 lg:sticky lg:top-24">
          <h3 className="text-[14px] font-medium text-[#E4E5E7]">
            Request flow
          </h3>
          <p className="mt-1 text-[12px] leading-relaxed text-[#8B8F98]">
            What happens when the browser calls the API.
          </p>

          <ol className="mt-4 flex flex-col items-stretch gap-1">
            {REQUEST_FLOW.map((node, i) => (
              <li key={node} className="flex flex-col items-center gap-1">
                <div className="w-full rounded-md border border-[#1E2126] bg-[#0A0B0D] px-3 py-2 text-center font-mono text-[12px] text-[#E4E5E7]">
                  {node}
                </div>
                {i < REQUEST_FLOW.length - 1 && (
                  <ArrowDown
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-[#5B7FFF]"
                    strokeWidth={1.75}
                  />
                )}
              </li>
            ))}
          </ol>

          <p className="mt-4 text-[12px] leading-relaxed text-[#7A7F88]">
            On a cache hit, Redis answers directly. On a miss, the API reads
            MongoDB and fills the cache.
          </p>
        </aside>
      </div>
    </section>
  );
}