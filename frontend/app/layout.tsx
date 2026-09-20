import TanStackQueryProvider from "@/components/provider/TanStackQueryProvider";
import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TanStackQueryProvider>
          <Toaster
            position="top-right"
            richColors
          />
          {children}
        </TanStackQueryProvider>
        </body>
    </html>
  );
}
