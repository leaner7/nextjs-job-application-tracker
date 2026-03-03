import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-border">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity"
      >
        <BriefcaseBusiness className="size-5 text-primary" />
        <span className="font-semibold text-sm">Job Tracker</span>
      </Link>

      {/* Nav actions */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/login">Log In</Link>
        </Button>
        <Button
          size="sm"
          className="rounded-full bg-rose-400 hover:bg-rose-500 text-white"
          asChild
        >
          <Link href="/sign-up">Start for free</Link>
        </Button>
      </div>
    </header>
  );
}
