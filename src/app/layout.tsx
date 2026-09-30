import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "EventHub | Event & Hackathon Management",
  description: "Register for hackathons, view live leaderboards, and manage your event journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${inter.variable} antialiased min-h-screen bg-[#F6F4F0] text-[#554093] selection:bg-[#554093]/20 flex flex-col`}>
        <NextTopLoader
          color="#554093"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #554093,0 0 5px #554093"
        />
        {children}
      </body>
    </html>
  );
}
