import { JourneyPoint } from "@/type";

const POINTS: JourneyPoint[] = [
  { id: "auth", label: "Authentication systems" },
  { id: "api", label: "API design" },
  { id: "db", label: "Database modeling" },
  { id: "roles", label: "Role permissions" },
  { id: "realtime", label: "Real-time features" },
  { id: "ai", label: "AI APIs" },
  { id: "cache", label: "Caching strategies" },
];

export default function DeveloperJourney() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="rounded-lg border border-[#1E2126] bg-[#101216] p-8 md:p-10">
        <h2 className="text-xl font-semibold tracking-tight text-[#E4E5E7]">
          Built to practice real-world full-stack development
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