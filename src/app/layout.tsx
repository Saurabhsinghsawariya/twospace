import NotificationListener from "@/components/global/NotificationListener";
import RealtimeData from "@/components/global/RealtimeData"; // <--- NEW IMPORT
import QueryProvider from "@/components/providers/QueryProvider";
import SocketProvider from "@/components/providers/SocketProvider";
import FloatingHearts from "@/components/ui/FloatingHeart";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// 1. Standard Metadata
export const metadata: Metadata = {
  title: "TwoSpace",
  description: "A private space for just the two of us.",
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/icon-192x192.png",
  },
};

// 2. Mobile Viewport Settings
export const viewport: Viewport = {
  themeColor: "#db2777",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <QueryProvider>
          <SocketProvider>
            {/* Global Listeners */}
            <NotificationListener />
            <RealtimeData /> {/* <--- ADDED HERE: Triggers auto-refresh */}
            <FloatingHearts />
            
            <main className="min-h-screen bg-background text-foreground select-none">
              {children}
            </main>
            <Toaster position="top-center" richColors />
          </SocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}