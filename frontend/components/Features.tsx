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
} from "lucide-react";

const FEATURES: FeatureItem[] = [
  {
    id: "notes",
    title: "Create notes",
    description: "Write and organize notes tied to a project or task.",
    icon: FileText,
  },
  {
    id: "tasks",
    title: "Assign tasks",
    description: "Break work into tasks and assign them to teammates.",
    icon: ListChecks,
  },
  {
    id: "users",
    title: "Manage users",
    description: "Invite, remove, and manage roles for project members.",
    icon: Users,
  },
  {
    id: "chat",
    title: "Team chat",
    description: "Message teammates in real time within a project room.",
    icon: MessageSquare,
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Instant alerts for assignments, mentions, and updates.",
    icon: Bell,
  },
  {
    id: "ai-summary",
    title: "AI summary",
    description: "Gemini condenses long task threads into a short summary.",
    icon: FileStack,
  },
  {
    id: "ai-priority",
    title: "AI priority",
    description: "AI suggests which task to tackle next based on context.",
    icon: ArrowUpNarrowWide,
  },
  {
    id: "permissions",
    title: "Role permissions",
    description: "Admin, member, and viewer roles gate what each can do.",
    icon: Lock,
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
          What the app actually does, from the user's side.
        </p>
      </div>

      <div className="grid gap-px overflow-hidden rounded-lg border border-[#1E2126] bg-[#1E2126] sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <div key={feature.id} className="bg-[#0A0B0D] p-5">
            <feature.icon
              className="mb-3 h-4 w-4 text-[#5B7FFF]"
              strokeWidth={1.75}
            />
            <h3 className="text-[13.5px] font-medium text-[#E4E5E7]">
              {feature.title}
            </h3>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#8B8F98]">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}