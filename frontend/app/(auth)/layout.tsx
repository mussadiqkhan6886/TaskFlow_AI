import LoginHeader from "@/components/LoginHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskFlow AI | LOGIN",
  description:
    "A full-stack learning project exploring authentication, AI integration, real-time communication, and modern web development practices.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
    <LoginHeader />
        {children}
    </>
  );
}
