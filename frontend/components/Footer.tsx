import { User } from "lucide-react";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const LINKS = [
  { label: "GitHub", href: "https://github.com/mussadiqkhan6886/TaskFlow_AI", icon: FaGithub },
  { label: "Portfolio", href: "http://mussadiqkhan.vercel.app/", icon: User },
  { label: "LinkedIn", href: "http://linkedin.com/in/mussadiq-khan-dev/", icon: FaLinkedin },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#1E2126]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="text-[12.5px] text-[#5A5E66]">
          TaskFlow AI — a personal full-stack learning project.
        </p>
        <div className="flex items-center gap-5">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[12.5px] text-[#84878D] transition-colors hover:text-[#E4E5E7]"
            >
              <link.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}