import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#080810]">
      <div className="text-center max-w-lg">
        {/* Illustration */}
        <div className="relative mx-auto mb-8 w-40 h-40">
          <div className="absolute inset-0 rounded-full bg-violet-900/30 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-violet-950/50 flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-violet-500" />
          </div>
          <span className="absolute -top-2 -right-2 flex h-10 w-16 items-center justify-center rounded-full bg-violet-600 text-white text-sm font-black shadow-lg">
            404
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
          Page not found
        </h1>
        <p className="text-slate-400 mb-8 text-base leading-relaxed">
          This lesson seems to have gone offline. The page you are looking for
          does not exist or may have been moved.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            className="bg-violet-600 hover:bg-violet-700 text-white gap-2"
            asChild
          >
            <Link href="/">
              <Home className="h-4 w-4" /> Go Home
            </Link>
          </Button>

          <Button
            variant="outline"
            className="gap-2 bg-transparent text-white border-white/10 hover:bg-white/10"
            asChild
          >
            <Link href="/lessons">
              <Search className="h-4 w-4" /> Browse Lessons
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
