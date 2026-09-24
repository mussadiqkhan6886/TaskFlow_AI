import { TechGroup } from "@/type";

const GROUPS: TechGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    items: [
      { name: "Next.js", role: "App Router, routing & rendering" },
      { name: "React", role: "Component model" },
      { name: "TypeScript", role: "Static typing" },
      { name: "Tailwind CSS", role: "Styling" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    items: [
      { name: "Express.js", role: "REST API layer" },
      { name: "MongoDB", role: "Primary data store" },
      { name: "Redis", role: "Caching" },
      { name: "Socket.IO", role: "Real-time transport" },
    ],
  },
  {
    id: "other",
    label: "Other",
    items: [
      { name: "JWT", role: "Session tokens" },
      { name: "Gemini AI", role: "Summaries & priority" },
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
        <p className="mt-2 text-[14px] leading-relaxed text-[#8B8F98]">
          The tools behind each layer of the app.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {GROUPS.map((group) => (
          <div
            key={group.id}
            className="rounded-lg border border-[#1E2126] bg-[#101216] p-5"
          >
            <h3 className="mb-4 text-[13px] font-medium text-[#C4C6C9]">
              {group.label}
            </h3>
            <ul className="space-y-3">
              {group.items.map((item) => (
                <li
                  key={item.name}
                  className="flex items-baseline justify-between gap-3 border-b border-[#1E2126] pb-3 last:border-none last:pb-0"
                >
                  <span className="font-mono text-[12.5px] text-[#E4E5E7]">
                    {item.name}
                  </span>
                  <span className="text-right text-[11.5px] text-[#5A5E66]">
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