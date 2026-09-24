import { TechGroup } from "@/type";

const GROUPS: TechGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    items: [
      { name: "Next.js", role: "App Router, routing & rendering" },
      { name: "React", role: "Component architecture" },
      { name: "TypeScript", role: "Static typing" },
      { name: "Tailwind CSS", role: "UI styling" },
      { name: "TanStack Query", role: "Server state management" },
    ],
  },

  {
    id: "backend",
    label: "Backend",
    items: [
      { name: "Express.js", role: "REST API layer" },
      { name: "MongoDB", role: "Database" },
      { name: "TypeScript", role: "Type-safe backend development" },
      { name: "Redis", role: "Caching & optimization" },
      { name: "Socket.IO", role: "Real-time communication" },
    ],
  },

  {
    id: "quality",
    label: "Engineering",
    items: [
      { name: "Zod", role: "Schema validation" },
      { name: "Vitest", role: "Unit testing" },
      { name: "Supertest", role: "API testing" },
      { name: "Playwright", role: "End-to-end testing" },
      { name: "Swagger", role: "API documentation" },
    ],
  },

  {
    id: "security",
    label: "Security & Services",
    items: [
      { name: "JWT", role: "Authentication & authorization" },
      { name: "bcryptjs", role: "Password hashing" },
      { name: "express-rate-limit", role: "API rate limiting" },
      { name: "Gemini AI", role: "AI summaries & priority generation" },
    ],
  },
];

export default function TechStack() {
  return (
    <section id="technology" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 max-w-lg">
        <h2 className="text-2xl font-semibold tracking-tight text-[#E4E5E7]">
          Technology stack
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-zinc-400">
          The tools behind each layer of the app.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {GROUPS.map((group) => (
          <div
            key={group.id}
            className="rounded-lg border border-[#1E2126] bg-[#101216] p-5"
          >
            <h3 className="mb-4 text-[14px] font-medium text-zinc-400">
              {group.label}
            </h3>
            <ul className="space-y-3">
              {group.items.map((item) => (
                <li
                  key={item.name}
                  className="flex items-baseline justify-between gap-3 border-b border-[#1E2126] pb-3 last:border-none last:pb-0"
                >
                  <span className="  text-[13px] text-zinc-100">
                    {item.name}
                  </span>
                  <span className="text-right text-[12px] text-zinc-400">
                    {item.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}