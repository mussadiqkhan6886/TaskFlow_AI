import TanStackQueryProvider from "@/components/provider/TanStackQueryProvider";
import "./globals.css";
import { Toaster } from "sonner";
import SocketProvider from "@/components/provider/SocketProvider";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SocketProvider>
            <TanStackQueryProvider>
              <Toaster
                position="top-right"
                richColors
                />
              {children}
            </TanStackQueryProvider>
        </SocketProvider>
        </body>
    </html>
  );
}
