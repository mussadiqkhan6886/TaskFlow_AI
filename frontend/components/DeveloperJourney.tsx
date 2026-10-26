
import { JourneyPoint } from "@/type";

const POINTS: JourneyPoint[] = [
  { id: "auth", label: "JWT authentication & session management" },
  { id: "api", label: "REST API architecture with Express" },
  { id: "validation", label: "Request validation with Zod" },
  { id: "db", label: "MongoDB data modeling with Mongoose" },
  { id: "roles", label: "Role-based access control (RBAC)" },
  { id: "realtime", label: "Real-time communication with Socket.IO" },
  { id: "cache", label: "Redis caching & invalidation" },
  { id: "testing", label: "Unit, API & E2E testing" },
  { id: "docs", label: "API documentation with Swagger" },
  { id: "ai", label: "Gemini AI integration" },
  { id: "docker", label: "Docker & multi-stage builds" },
  { id: "cicd", label: "GitHub Actions CI/CD pipelines" },
  { id: "aws", label: "AWS ECS, ECR & load balancing" },
  { id: "security", label: "IAM, OIDC & secrets management" },
];

export default function DeveloperJourney() {
  return (
    <section
      id="developer-journey"
      className="mx-auto max-w-6xl px-6 py-20"
    >
      <div className="rounded-lg border border-[#1E2126] bg-[#101216] p-8 md:p-10">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#5B7FFF]">
          Engineering journey
        </p>

        <h2 className="text-xl font-semibold tracking-tight text-[#E4E5E7]">
          Built to explore real-world full-stack engineering
        </h2>

        <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-[#8B8F98]">
          TaskFlow AI is a full-stack task management and team
          collaboration project built to apply software engineering
          concepts beyond tutorials. From authentication and real-time
          features to automated testing, containerization, and AWS
          deployment, each layer provided hands-on experience with
          building and operating a complete application.
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
