import { LayoutDashboard } from "lucide-react";
import DashboardPreview from "./DashboardPreview";
import { FaGithub } from "react-icons/fa";


export default function Hero() {
  return (
    <section id="home" className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
      <div className="grid items-center gap-14 md:grid-cols-2 md:gap-10">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1E2126] px-3 py-1 font-mono text-[11px] text-[#84878D]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5B7FFF]" />
            full-stack learning project
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-[#E4E5E7] md:text-5xl">
            TaskFlow AI
          </h1>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#8B8F98]">
            A full-stack learning project exploring authentication, AI
            integration, real-time communication, and modern web development
            practices.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#workflow"
              className="inline-flex items-center gap-2 rounded-md bg-[#5B7FFF] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#4C6EEF]"
            >
              <LayoutDashboard className="h-3.5 w-3.5" strokeWidth={1.75} />
              View dashboard
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-[#1E2126] px-4 py-2 text-[13px] text-[#C4C6C9] transition-colors hover:border-[#2A2E35] hover:bg-[#131519]"
            >
              <FaGithub className="h-3.5 w-3.5" strokeWidth={1.75} />
              GitHub repository
            </a>
          </div>
        </div>

        <DashboardPreview />
      </div>
    </section>
  );
}