import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSession } from "@/lib/auth/auth";
import SignOutBtn from "@/components/sign-out-btn";

export default async function Navbar() {
  const session = await getSession();
  const user = session?.user;

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
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="size-8 cursor-pointer select-none">
              <AvatarFallback className="bg-rose-400 text-white text-sm font-semibold">
                {user.name?.charAt(0).toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="font-semibold">{user.name}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {user.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <SignOutBtn />
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/sign-in">Log In</Link>
          </Button>
          <Button
            size="sm"
            className="rounded-full bg-rose-400 hover:bg-rose-500 text-white"
            asChild
          >
            <Link href="/sign-up">Start for free</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
