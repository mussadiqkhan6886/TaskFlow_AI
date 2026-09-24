import { EngineeringArea } from "@/type";
import {
  ShieldCheck,
  Radio,
  Sparkles,
  Gauge,
  Database,
  Layers,
  TestTube,
  Workflow,
} from "lucide-react";

const AREAS: EngineeringArea[] = [
  {
    id: "auth",
    title: "Authentication & Security",
    path: "backend/src/controllers/authControllers.ts",
    icon: ShieldCheck,
    points: [
      "JWT access & refresh token flow",
      "Role-based access control (RBAC)",
    ],
  },
  {
    id: "realtime",
    title: "Real-time Communication",
    path: "backend/src/socket/",
    icon: Radio,
    points: [
      "Socket.IO rooms and events",
      "Live messaging & instant notifications",
    ],
  },
  {
    id: "ai",
    title: "AI Integration",
    path: "backend/src/services/geminiService.ts",
    icon: Sparkles,
    points: [
      "AI-generated task summaries",
      "AI priority suggestions",
    ],
  },
  {
    id: "performance",
    title: "Performance & Caching",
    path: "backend/src/config/connectRedis.ts",
    icon: Gauge,
    points: [
      "Redis caching for frequently accessed data",
      "Cache invalidation strategies",
    ],
  },
  {
    id: "database",
    title: "Database Design",
    path: "backend/src/models/",
    icon: Database,
    points: [
      "MongoDB document modeling",
      "Mongoose schemas, indexing and validation",
    ],
  },
  {
    id: "frontend",
    title: "Frontend Architecture",
    path: "frontend/app/",
    icon: Layers,
    points: [
      "Next.js App Router architecture",
      "React Query server state management",
    ],
  },
  {
    id: "unit-testing",
    title: "Unit Testing",
    path: "backend/__tests__/ && frontend/__tests__/",
    icon: TestTube,
    points: [
      "Component and function testing with vitest",
      "Business logic validation",
    ],
  },
  {
    id: "integration-testing",
    title: "API Testing",
    path: "backend/__tests__/",
    icon: Workflow,
    points: [
      "REST API endpoint testing with supertest",
      "Authentication and database flow testing",
    ],
  },
  {
    id: "e2e-testing",
    title: "End-to-End Testing",
    path: "e2e/tests/",
    icon: Workflow,
    points: [
      "Browser automation with Playwright",
      "Complete user workflow testing",
    ],
  },
];

export default function Engineering() {
  return (
    <section id="engineering" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 max-w-lg">
        <h2 className="text-2xl font-semibold tracking-tight text-[#E4E5E7]">
          Engineering & Architecture
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
            <p className="mb-3   text-[11px] text-[#5A5E66]">
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