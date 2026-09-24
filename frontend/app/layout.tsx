import TanStackQueryProvider from "@/components/provider/TanStackQueryProvider";
import "./globals.css";
import { Toaster } from "sonner";
import Notification from "@/components/Notification";
import {Inter, JetBrains_Mono} from "next/font/google" 
import { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
 

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${inter.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <TanStackQueryProvider>
          <Toaster
            position="top-right"
            richColors
          />
          <Notification />
          {children}
        </TanStackQueryProvider>
        </body>
    </html>
  );
}
