import { FeatureItem } from "@/type";
import {
  FileText,
  ListChecks,
  Users,
  MessageSquare,
  Bell,
  FileStack,
  ArrowUpNarrowWide,
  Lock,
  CheckCircle2,
} from "lucide-react";

const FEATURES: FeatureItem[] = [
  {
    id: "notes",
    title: "Create & manage tasks",
    description:
      "Create notes, track progress, and manage assigned work.",
    icon: FileText,
  },
  {
    id: "assign",
    title: "Task assignment",
    description:
      "Managers and Admins can assign tasks to specific users.",
    icon: ListChecks,
  },
  {
    id: "users",
    title: "User management",
    description:
      "Admins can create users and manage account access.",
    icon: Users,
  },
  {
    id: "chat",
    title: "Real-time chat",
    description:
      "Communicate instantly through Socket.IO powered messaging.",
    icon: MessageSquare,
  },
  {
    id: "notifications",
    title: "Live notifications",
    description:
      "Receive updates when important actions happen.",
    icon: Bell,
  },
  {
    id: "ai-summary",
    title: "AI summaries",
    description:
      "Gemini AI generates short summaries from task content.",
    icon: FileStack,
  },
  {
    id: "ai-priority",
    title: "AI priority suggestions",
    description:
      "AI analyzes tasks and suggests suitable priority levels.",
    icon: ArrowUpNarrowWide,
  },
  {
    id: "permissions",
    title: "Role permissions",
    description:
      "Admin, Manager, and Employee roles control available actions.",
    icon: Lock,
  },
  {
    id: "status",
    title: "Task status tracking",
    description:
      "Track tasks through different states until completion.",
    icon: CheckCircle2,
  },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 max-w-lg">
        <h2 className="text-2xl font-semibold tracking-tight text-[#E4E5E7]">
          Application features
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-[#8B8F98]">
          Core functionality implemented in the application,
          from task management to AI and real-time collaboration.
        </p>
      </div>

      <div className="grid gap-px overflow-hidden rounded-lg border border-[#1E2126] bg-[#1E2126] sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <div key={feature.id} className="bg-[#0A0B0D] p-5">
            <feature.icon
              className="mb-3 h-5 w-5 text-blue-600"
              strokeWidth={1.75}
            />
            <h3 className="text-[14px] font-medium text-[#E4E5E7]">
              {feature.title}
            </h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#8B8F98]">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}