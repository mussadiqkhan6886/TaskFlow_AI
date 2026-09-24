import {
  LogIn,
  KeyRound,
  LayoutDashboard,
  ListPlus,
  Radio,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import { WorkflowStep } from "@/type";

const STEPS: WorkflowStep[] = [
  {
    id: "login",
    title: "User login",
    detail: "Credentials submitted from the client and sent to the auth route.",
    icon: LogIn,
  },
  {
    id: "verify",
    title: "JWT verification",
    detail: "Backend validates access tokens, refresh tokens, and identifies the authenticated user.",
    icon: KeyRound,
  },
  {
    id: "rbac",
    title: "Role-based access control",
    detail: "User permissions are checked based on their role: Admin, Manager, or Employee.",
    icon: ShieldCheck,
  },
  {
    id: "access",
    title: "Dashboard access",
    detail: "Authorized users can access their dashboard and available features.",
    icon: LayoutDashboard,
  },
  {
    id: "create",
    title: "Create / assign tasks",
    detail: "Tasks are stored in MongoDB with ownership, assignment, priority, and status information.",
    icon: ListPlus,
  },
  {
    id: "realtime",
    title: "Real-time synchronization",
    detail:"Socket.IO sends live updates and notifications without requiring page refreshes.",
    icon: Radio,
  },
  {
    id: "messages",
    title: "Real-time communication",
    detail: "Users communicate through shared chat, while Admin and Managers can access staff communication.",
    icon: MessageCircle,
  },
  {
    id: "ai",
    title: "AI assistance",
    detail: "Gemini AI analyzes task content to generate summaries and priority suggestions.",
    icon: Sparkles,
  },
  {
    id: "complete",
    title: "Task completion",
    detail: "Status updates propagate live and the board reflects it instantly.",
    icon: CheckCircle2,
  },
];

export default function Workflow() {
  return (
    <section id="workflow" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 max-w-lg">
        <h2 className="text-2xl font-semibold tracking-tight text-[#E4E5E7]">
          Application Workflow
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-[#8B8F98]">
          The path a single task takes through the system, from login to
          real-time completion.
        </p>
      </div>

      <div className="relative max-w-2xl">
        <div className="absolute bottom-4 left-[17px] top-4 w-px bg-[#1E2126]" />
        <ol className="space-y-6">
          {STEPS.map((step, i) => (
            <li key={step.id} className="relative flex gap-4">
              <div className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#1E2126] bg-[#101216]">
                <step.icon className="h-4 w-4 text-[#5B7FFF]" strokeWidth={1.75} />
              </div>
              <div className="flex-1 rounded-lg border border-[#1E2126] bg-[#101216] px-4 py-3">
                <div className="flex items-baseline gap-2">
                  <span className="  text-[11px] text-[#5A5E66]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[14px] font-medium text-[#E4E5E7]">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-[#8B8F98]">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}