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
    <header className="fixed top-0 left-0 right-0 z-[100] border-b border-border/50 bg-background/80 backdrop-blur-xl transition-all duration-300">
      <div className="w-full flex h-16 items-center justify-between px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-all hover:opacity-90"
        >
          <div className="bg-primary/10 p-1.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <BriefcaseBusiness className="size-5 text-primary" />
          </div>
          <span className="font-black text-lg tracking-tighter text-foreground">
            Job<span className="text-primary italic">Tracker</span>
          </span>
        </Link>
  
        {/* Nav actions */}
        <div className="flex items-center gap-6">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="group flex items-center gap-3 cursor-pointer select-none">
                  <div className="hidden md:flex flex-col items-end">
                    <p className="text-xs font-bold text-foreground line-clamp-1">{user.name}</p>
                  </div>
                  <Avatar className="size-10 border-2 border-primary/20 transition-transform group-hover:scale-105">
                    <AvatarFallback className="bg-gradient-to-br from-rose-400 to-rose-600 text-white text-sm font-black">
                      {user.name?.charAt(0).toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 mt-2 p-2 backdrop-blur-2xl bg-background/90 border-border/40 shadow-2xl">
                <DropdownMenuLabel className="px-3 py-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-black text-foreground">{user.name}</p>
                    <p className="text-xs font-medium text-muted-foreground/80 truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/40" />
                <div className="p-1">
                  <SignOutBtn />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="font-bold text-sm hover:bg-primary/5 rounded-full px-6" asChild>
                <Link href="/sign-in">Log In</Link>
              </Button>
              <Button
                className="rounded-full bg-rose-500 hover:bg-rose-600 text-white px-8 font-bold shadow-lg shadow-rose-500/20 active:scale-95 transition-all text-sm"
                asChild
              >
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
