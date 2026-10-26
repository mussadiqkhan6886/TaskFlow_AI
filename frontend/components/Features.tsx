import { FeatureItem } from "@/type";
import {
  FileText,
  ListChecks,
  Users,
  UserCog,
  MessageSquare,
  Bell,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const FEATURES: FeatureItem[] = [
  {
    id: "tasks",
    title: "Task management",
    description:
      "Create tasks, set priority, and track them through Pending, In Progress, and Completed.",
    icon: ListChecks,
  },
  {
    id: "notes",
    title: "Notes management",
    description:
      "Create and organize notes so important information stays easy to find.",
    icon: FileText,
  },
  {
    id: "assign",
    title: "Task assignment",
    description:
      "Managers and Admins assign work to specific users and coordinate responsibilities.",
    icon: Users,
  },
  {
    id: "users",
    title: "User management",
    description: "Admins create and manage user accounts and their roles.",
    icon: UserCog,
  },
  {
    id: "chat",
    title: "Real-time team chat",
    description:
      "Message teammates instantly over Socket.IO, with presence and read receipts.",
    icon: MessageSquare,
  },
  {
    id: "notifications",
    title: "Instant notifications",
    description:
      "Get notified the moment a task is assigned or updated, without refreshing.",
    icon: Bell,
  },
  {
    id: "ai",
    title: "AI summaries & priorities",
    description:
      "Gemini condenses task content into short summaries and suggests a priority level.",
    icon: Sparkles,
  },
  {
    id: "permissions",
    title: "Role-based access control",
    description:
      "Admin, Manager, and Employee roles decide which actions each user can perform, enforced on the server.",
    icon: ShieldCheck,
  },
  {
    id: "ownership",
    title: "Ownership-aware updates",
    description:
      "Employees update only the tasks assigned to them; managers and admins have wider control.",
    icon: Users,
  },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 max-w-lg">
        <h2 className="text-2xl font-semibold tracking-tight text-[#E4E5E7]">
          Application features
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-[#8B8F98]">
          Core functionality implemented in the application, from task
          management to AI and real-time collaboration.
        </p>
      </div>

      <div className="grid gap-px overflow-hidden rounded-lg border border-[#1E2126] bg-[#1E2126] sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.id}
            className="bg-[#0A0B0D] p-5 transition-colors hover:bg-[#0E1014]"
          >
            <feature.icon
              aria-hidden="true"
              className="mb-3 h-5 w-5 text-[#5B7FFF]"
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