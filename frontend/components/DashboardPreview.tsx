import {
  LayoutGrid,
  CheckSquare,
  Users,
  MessageSquare,
  Settings,
  Sparkles,
  Circle,
  CheckCircle2,
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { icon: LayoutGrid, active: true },
  { icon: CheckSquare, active: false },
  { icon: Users, active: false },
  { icon: MessageSquare, active: false },
  { icon: Settings, active: false },
];

const TASKS = [
  { label: "Design auth middleware", done: true },
  { label: "Wire Socket.IO rooms per project", done: true },
  { label: "Add Redis cache for /api/tasks", done: false },
  { label: "Write Mongoose schema for Notes", done: false },
];

const AVATARS = ["#5B7FFF", "#9B7CFF", "#3A3F47"];

export default function DashboardPreview() {
  return (
    <div className="relative rounded-lg border border-[#1E2126] bg-[#101216] p-3 shadow-[0_0_0_1px_rgba(0,0,0,0.2)]">
      {/* window chrome */}
      <div className="mb-3 flex items-center gap-1.5 px-1">
        <span className="h-2.5 w-2.5 rounded-full bg-[#2A2E35]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#2A2E35]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#2A2E35]" />
        <span className="ml-3 font-mono text-[11px] text-[#5A5E66]">
          app.taskflow.local/dashboard
        </span>
      </div>

      <div className="flex overflow-hidden rounded-md border border-[#1E2126] bg-[#0A0B0D]">
        {/* sidebar */}
        <div className="flex w-11 flex-col items-center gap-3 border-r border-[#1E2126] py-3">
          {SIDEBAR_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`flex h-7 w-7 items-center justify-center rounded-md ${
                item.active ? "bg-[#5B7FFF]/15 text-[#5B7FFF]" : "text-[#4A4E56]"
              }`}
            >
              <item.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            </div>
          ))}
        </div>

        {/* main content */}
        <div className="flex-1 p-3">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#E4E5E7]">
              Sprint tasks
            </span>
            <div className="flex -space-x-1.5">
              {AVATARS.map((color, i) => (
                <span
                  key={i}
                  className="h-5 w-5 rounded-full border-2 border-[#0A0B0D]"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            {TASKS.map((task, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-md border border-[#1E2126] bg-[#101216] px-2 py-1.5"
              >
                {task.done ? (
                  <CheckCircle2 className="h-3 w-3 shrink-0 text-[#5B7FFF]" strokeWidth={2} />
                ) : (
                  <Circle className="h-3 w-3 shrink-0 text-[#3A3F47]" strokeWidth={2} />
                )}
                <span
                  className={`text-[11px] ${
                    task.done ? "text-[#5A5E66] line-through" : "text-[#C4C6C9]"
                  }`}
                >
                  {task.label}
                </span>
              </div>
            ))}
          </div>

          {/* AI assistant card */}
          <div className="mt-2.5 rounded-md border border-[#9B7CFF]/25 bg-[#9B7CFF]/[0.06] p-2.5">
            <div className="mb-1 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-[#9B7CFF]" strokeWidth={1.75} />
              <span className="text-[11px] font-medium text-[#C9BFFF]">
                AI suggestion
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#8B8F98]">
              Redis caching task blocks 2 others — recommend prioritizing next.
            </p>
          </div>
        </div>

        {/* chat panel */}
        <div className="hidden w-24 flex-col border-l border-[#1E2126] p-2.5 sm:flex">
          <span className="mb-2 text-[10px] font-medium text-[#5A5E66]">
            Team chat
          </span>
          <div className="space-y-2">
            <div className="rounded-md bg-[#131519] px-1.5 py-1 text-[9.5px] leading-snug text-[#8B8F98]">
              pushed auth fix
            </div>
            <div className="rounded-md bg-[#5B7FFF]/10 px-1.5 py-1 text-[9.5px] leading-snug text-[#B7C3FF]">
              on it, testing now
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}