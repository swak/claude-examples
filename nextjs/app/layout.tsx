import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Navigation from "./components/Navigation";
import ErrorBoundary from "./components/ErrorBoundary";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Claude Code Examples - Full-Stack Demonstration",
  description: "A comprehensive demonstration of Claude Code's capabilities with Next.js, FastAPI, and Material-UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            <Navigation />
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}