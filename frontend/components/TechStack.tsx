import { TechGroup } from "@/type";

const GROUPS: TechGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    items: [
      { name: "Next.js", role: "App Router & rendering" },
      { name: "React", role: "Component-based UI" },
      { name: "TypeScript", role: "Static type checking" },
      { name: "Tailwind CSS", role: "Utility-first styling" },
      { name: "TanStack Query", role: "Server state & caching" },
    ],
  },
  {
    id: "backend",
    label: "Backend & API",
    items: [
      { name: "Node.js", role: "JavaScript runtime" },
      { name: "Express.js", role: "REST API" },
      { name: "Socket.IO", role: "Real-time events & chat" },
      { name: "Swagger / OpenAPI", role: "API documentation" },
      { name: "Gemini AI", role: "Task summaries & priorities" },
    ],
  },
  {
    id: "data",
    label: "Data & Caching",
    items: [
      { name: "MongoDB Atlas", role: "Managed document database" },
      { name: "Mongoose", role: "Schemas & data modeling" },
      { name: "Redis Cloud", role: "Caching & fast data access" },
    ],
  },
  {
    id: "quality",
    label: "Testing",
    items: [
      { name: "Vitest", role: "Unit testing" },
      { name: "React Testing Library", role: "Component testing" },
      { name: "Supertest", role: "HTTP API testing" },
      { name: "Playwright", role: "End-to-end testing" },
    ],
  },
  {
    id: "security",
    label: "Auth & Validation",
    items: [
      { name: "JWT", role: "Access & refresh tokens" },
      { name: "bcryptjs", role: "Password hashing" },
      { name: "express-rate-limit", role: "Request rate limiting" },
      { name: "Zod", role: "Schema validation" },
    ],
  },
  {
    id: "devops",
    label: "DevOps & Cloud",
    items: [
      { name: "Docker", role: "Multi-stage container builds" },
      { name: "Docker Compose", role: "Local multi-service setup" },
      { name: "GitHub Actions", role: "CI/CD automation" },
      { name: "AWS ECR", role: "Container image registry" },
      { name: "AWS ECS Fargate", role: "Managed container deployment" },
      { name: "AWS ALB", role: "HTTP routing to services" },
      { name: "AWS IAM / OIDC", role: "Deployment authentication" },
      { name: "AWS Secrets Manager", role: "Sensitive configuration" },
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
          The technologies used to build, test, secure, and deploy TaskFlow AI.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {GROUPS.map((group) => (
          <div
            key={group.id}
            className="rounded-lg border border-[#1E2126] bg-[#101216] p-5 transition-colors hover:bg-[#12151A]"
          >
            <h3 className="mb-4 text-[14px] font-medium text-[#E4E5E7]">
              {group.label}
            </h3>

            <ul className="space-y-3">
              {group.items.map((item) => (
                <li
                  key={item.name}
                  className="flex items-baseline justify-between gap-3 border-b border-[#1E2126] pb-3 last:border-none last:pb-0"
                >
                  <span className="shrink-0 text-[13px] text-[#E4E5E7]">
                    {item.name}
                  </span>
                  <span className="min-w-0 text-right text-[12px] leading-snug text-[#8B8F98]">
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