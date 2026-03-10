import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center pt-20">
        <h1 className="max-w-sm text-4xl font-bold leading-tight tracking-tight text-foreground">
          A better way to track your job application.
        </h1>
        <p className="mt-4 text-muted-foreground text-sm max-w-xs">
          Capture, organize, and manage your job search in one place.
        </p>

        <div className="mt-8 flex flex-col items-center gap-2">
          <Button
            size="lg"
            className="rounded-full bg-rose-400 hover:bg-rose-500 text-white px-8"
            asChild
          >
            <Link href="/sign-up">
              Start for free <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            Free forever. No credit card required.
          </p>
        </div>
      </main>
    </div>
  );
}
