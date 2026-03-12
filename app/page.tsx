import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, Zap, Shield, Globe, Star } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background selection:bg-rose-500/20">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-rose-500/5 blur-[100px] rounded-full pointer-events-none animate-pulse" />
      
      {/* Hero Section */}
      <main className="relative z-10 flex flex-1 flex-col items-center">
        <section className="flex flex-col items-center justify-center px-6 text-center pt-32 pb-24 md:pt-48 md:pb-32">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">Premium Job Tracking</span>
          </div>

          <h1 className="max-w-4xl text-5xl md:text-7xl font-black leading-[1.05] tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            Own your career journey <br />
            <span className="bg-gradient-to-r from-rose-500 via-primary to-rose-400 bg-clip-text text-transparent">with total clarity.</span>
          </h1>
          
          <p className="mt-8 text-muted-foreground text-lg md:text-xl max-w-2xl font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 leading-relaxed">
            Stop losing track of opportunities. Capture, organize, and manage every stage of your job search in one powerful interface.
          </p>

          <div className="mt-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-700">
            <Button
              size="lg"
              className="rounded-full bg-rose-500 hover:bg-rose-600 text-white px-10 py-7 shadow-xl shadow-rose-500/25 transition-all hover:scale-105 active:scale-95 text-base font-bold group"
              asChild
            >
              <Link href="/sign-up">
                Start for Free <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          {/* Trust Badge */}
          <div className="mt-16 flex items-center gap-6 opacity-40 grayscale animate-in fade-in duration-1000 delay-1000">
            <div className="flex items-center gap-1.5 font-bold tracking-tighter text-xl">
              <Globe className="size-5" /> GLOBAL
            </div>
            <div className="flex items-center gap-1.5 font-bold tracking-tighter text-xl text-primary">
              <Shield className="size-5" /> SECURE
            </div>
            <div className="flex items-center gap-1.5 font-bold tracking-tighter text-xl">
              <Zap className="size-5" /> FAST
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="w-full max-w-7xl px-6 py-24 border-t border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<LayoutDashboard className="size-6 text-rose-500" />}
              title="Visual Kanban Board"
              description="Drag and drop your applications through custom stages. Get a bird's-eye view of your entire pipeline."
            />
            <FeatureCard 
              icon={<Zap className="size-6 text-amber-500" />}
              title="One-Click Capture"
              description="Quickly add job details, links, and notes. No more messy spreadsheets or forgotten bookmarks."
            />
            <FeatureCard 
              icon={<Star className="size-6 text-indigo-500" />}
              title="Interview Analytics"
              description="Track your conversion rates and identify which stages need more focus to land that offer."
            />
          </div>
        </section>

        {/* How it Works */}
        <section className="w-full bg-secondary/30 py-24 flex flex-col items-center text-center px-6">
          <h2 className="text-3xl font-bold tracking-tight mb-4">How it works</h2>
          <p className="text-muted-foreground mb-16 max-w-md">Three simple steps to a better job search experience.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl">
            <Step number="01" title="Sign up" description="Create your free account in seconds with just an email." />
            <Step number="02" title="Add Jobs" description="Paste URLs and details from any job board instantly." />
            <Step number="03" title="Track Progress" description="Watch your career move forward as you apply and interview." />
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-12 px-6 border-t border-border flex flex-col items-center justify-center gap-6 text-muted-foreground text-sm font-medium">
          <p>© 2026 JobTracker. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group p-8 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="p-3 rounded-xl bg-secondary w-fit mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm font-medium">{description}</p>
    </div>
  )
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-5xl font-black text-primary/10 mb-6">{number}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-[200px]">{description}</p>
    </div>
  )
}
