import AdminHeader from "@/components/AdminHeader";
import ChatWidget from "@/components/ChatWidget";
import SocketProvider from "@/components/provider/SocketProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | TaskFlow AI",
  description:
    "A full-stack learning project exploring authentication, AI integration, real-time communication, and modern web development practices.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
    <SocketProvider>
      <AdminHeader />
        {children}
      <ChatWidget />
    </SocketProvider>
    </>
  );
}
