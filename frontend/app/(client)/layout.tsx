import Navbar from "@/components/ClientHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskFlow AI | Full-stack learning project",
  description:
    "A full-stack learning project exploring authentication, AI integration, real-time communication, and modern web development practices.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
    <Navbar />
        {children}
    </>
  );
}
