import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FluxStream | Real-time Fraud Detection Platform",
  description: "Senior Data Engineering portfolio project demonstrating Apache Kafka, Spark Structured Streaming, and Airflow orchestration.",
  authors: [{ name: "FluxStream Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className={`${inter.className} min-h-screen bg-[#050505] text-[#f8fafc] border-t-2 border-purple-500/20`}>
        {children}
      </body>
    </html>
  );
}
