import Link from "next/link";
import { Film } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 rounded-[24px] glass text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl glass-elevated mx-auto flex items-center justify-center text-accent">
          <Film className="w-5 h-5" />
        </div>
        <p className="text-xs font-mono uppercase tracking-widest text-accent">
          404 — Not Found
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          This title isn&apos;t in our catalog
        </h1>
        <p className="text-sm text-muted">
          The movie or series you&apos;re looking for may have been moved or does
          not exist.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center px-5 py-2.5 rounded-2xl bg-accent text-black text-sm font-semibold hover:brightness-95 active:-translate-y-px transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
