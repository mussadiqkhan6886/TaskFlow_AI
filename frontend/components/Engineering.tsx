import { EngineeringArea } from "@/type";
import { ShieldCheck, Radio, Sparkles, Gauge, Database, Layers } from "lucide-react";

const AREAS: EngineeringArea[] = [
  {
    id: "auth",
    title: "Authentication",
    path: "src/middleware/auth.ts",
    icon: ShieldCheck,
    points: ["JWT-based session handling", "Role-based access control"],
  },
  {
    id: "realtime",
    title: "Real-time communication",
    path: "src/socket/index.ts",
    icon: Radio,
    points: ["Socket.IO rooms per project", "Live messaging & instant notifications"],
  },
  {
    id: "ai",
    title: "AI integration",
    path: "src/service/gemini.ts",
    icon: Sparkles,
    points: ["Automated task summaries", "AI-generated priority suggestions"],
  },
  {
    id: "performance",
    title: "Performance",
    path: "src/lib/cache.ts",
    icon: Gauge,
    points: ["Redis caching on read-heavy routes", "Optimized API request patterns"],
  },
  {
    id: "database",
    title: "Database",
    path: "src/models/",
    icon: Database,
    points: ["MongoDB as the primary store", "Mongoose schemas & validation"],
  },
  {
    id: "frontend",
    title: "Frontend architecture",
    path: "frontend/app/",
    icon: Layers,
    points: ["Next.js App Router layout", "TypeScript + React Query for data"],
  },
];

export default function Engineering() {
  return (
    <section id="engineering" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 max-w-lg">
        <h2 className="text-2xl font-semibold tracking-tight text-[#E4E5E7]">
          Engineering overview
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-[#8B8F98]">
          How the backend and frontend are actually put together — the parts
          worth pointing to in a code review.
        </p>
      </div>

      <div className="grid gap-px overflow-hidden rounded-lg border border-[#1E2126] bg-[#1E2126] md:grid-cols-2 lg:grid-cols-3">
        {AREAS.map((area) => (
          <div key={area.id} className="bg-[#0A0B0D] p-5">
            <div className="mb-3 flex items-center gap-2">
              <area.icon className="h-4 w-4 text-[#5B7FFF]" strokeWidth={1.75} />
              <h3 className="text-[14px] font-medium text-[#E4E5E7]">
                {area.title}
              </h3>
            </div>
            <p className="mb-3 font-mono text-[11px] text-[#5A5E66]">
              {area.path}
            </p>
            <ul className="space-y-1.5">
              {area.points.map((point) => (
                <li
                  key={point}
                  className="text-[13px] leading-relaxed text-[#8B8F98]"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}