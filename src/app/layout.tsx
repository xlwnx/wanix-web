import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";
import { BackToTop } from "@/components/BackToTop";
import { AmbientProvider, AmbientMesh } from "@/components/AmbientMesh";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wanix — Stream Movies & TV Series",
  description:
    "Discover, explore, and stream movies and TV series on Wanix with complete cast, crew, trailers, and episode guides.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground pb-24 md:pb-0">
        <AmbientProvider>
          <AmbientMesh />
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <main className="relative z-10 flex-1">{children}</main>
          <BackToTop />
          <Suspense fallback={null}>
            <MobileNav />
          </Suspense>
          <footer className="relative z-10 glass border-x-0 border-b-0 py-10 mt-16">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
              <p className="font-medium text-foreground">
                WANIX <span className="text-muted font-normal">— Cinema & Series</span>
              </p>
              <p>
                Metadata powered by TMDB. Video playback provided via Vidrift.
              </p>
            </div>
          </footer>
        </AmbientProvider>
      </body>
    </html>
  );
}
