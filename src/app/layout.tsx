import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Optimus - Inference Optimizer Platform",
  description: "Optimize and compare AI inference models with advanced caching, batching, and performance monitoring.",
  icons: {
    icon: "/logo.ico",
    shortcut: "/logo.ico",
  },
};

import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-screen antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme') || 'xp';
                  
                  // Create and load the theme CSS
                  const link = document.createElement('link');
                  link.id = 'theme-css';
                  link.rel = 'stylesheet';
                  link.href = '/styles/' + savedTheme + '.css';
                  document.head.appendChild(link);
                } catch (e) {
                  console.error('Theme initialization error:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="h-screen w-full flex flex-col overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30">
        <Providers>
          <Navbar />
          <main className="flex-1 flex overflow-hidden relative">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
