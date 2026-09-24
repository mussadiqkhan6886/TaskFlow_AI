"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Terminal } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Technology", href: "#technology" },
  { label: "Workflow", href: "#workflow" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled
          ? "border-[#1E2126] bg-[#0A0B0D]/90 backdrop-blur"
          : "border-transparent bg-[#0A0B0D] backdrop-blur"
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="#home" className="flex items-center gap-2 text-[#E4E5E7]">
          <Terminal className="h-4 w-4 text-[#5B7FFF]" strokeWidth={1.75} />
          <span className="text-[15px] font-medium tracking-tight">
            TaskFlow AI
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] text-white transition-colors hover:text-[#E4E5E7]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/login"
          className="rounded-md border border-[#1E2126] px-3.5 py-1.5 text-[13px] text-[#E4E5E7] transition-colors hover:border-[#2A2E35] hover:bg-blue-800 bg-blue-700"
        >
          Log in
        </Link>
      </nav>
    </header>
  );
}