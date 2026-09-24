import { JourneyPoint } from "@/type";

const POINTS: JourneyPoint[] = [
  { id: "auth", label: "Authentication & JWT systems" },
  { id: "api", label: "REST API architecture" },
  { id: "validation", label: "Schema validation with Zod" },
  { id: "db", label: "Database modeling with MongoDB" },
  { id: "roles", label: "Role-based access control" },
  { id: "realtime", label: "Real-time communication" },
  { id: "cache", label: "Caching with Redis" },
  { id: "testing", label: "Unit, API & E2E testing" },
  { id: "docs", label: "API documentation with Swagger" },
  { id: "ai", label: "AI API integration" },
];

export default function DeveloperJourney() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="rounded-lg border border-[#1E2126] bg-[#101216] p-8 md:p-10">
        <h2 className="text-xl font-semibold tracking-tight text-[#E4E5E7]">
          Built to practice real-world production full-stack development
        </h2>
        <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-[#8B8F98]">
          TaskFlow AI isn't a product — it's a project I built to get hands-on
          with the parts of full-stack engineering that are easy to read
          about and hard to actually implement. Working through it meant
          implementing:
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {POINTS.map((point) => (
            <li
              key={point.id}
              className="rounded-md border border-[#1E2126] bg-[#0A0B0D] px-3 py-1.5 text-[12.5px] text-[#C4C6C9]"
            >
              {point.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}