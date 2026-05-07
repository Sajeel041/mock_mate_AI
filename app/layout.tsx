import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";

import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";
import PageTransition from "@/components/PageTransition";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MockMate",
  description: "An AI-powered platform for preparing for mock interviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${monaSans.className} antialiased relative`}>
        <AnimatedBackground />
        <PageTransition>{children}</PageTransition>
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "rgba(20, 22, 30, 0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(202, 197, 254, 0.2)",
              color: "#e5e7ff",
            },
          }}
        />
      </body>
    </html>
  );
}
