import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Target, Zap, Shield } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 overflow-hidden relative">
      {/* Hero Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
          Aura
        </div>
        <div className="flex items-center gap-8">
          <Link href="/login" className="text-sm font-medium hover:text-white/70 transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-white/90 transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-32 pb-20 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-primary mb-8 animate-bounce">
          <Zap size={14} />
          New: Version 2.0 is out
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
          Focus on what <br />
          <span className="bg-gradient-to-r from-primary via-blue-400 to-indigo-500 bg-clip-text text-transparent">
            actually matters.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
          The private productivity workspace designed for high achievers.
          Manage your daily tasks and long-term goals in one beautiful place.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link
            href="/register"
            className="group relative px-8 py-4 bg-primary rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-primary/20 flex items-center gap-2"
          >
            Start Your Journey
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
          >
            Sign In to Workspace
          </Link>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40 w-full">
          <FeatureCard
            icon={Shield}
            title="Private by Design"
            description="Single-user architecture ensuring your data stays exclusively yours."
          />
          <FeatureCard
            icon={CheckCircle2}
            title="Task Mastery"
            description="Daily, weekly, monthly and yearly categorization for ultimate focus."
          />
          <FeatureCard
            icon={Target}
            title="Vision Board"
            description="Set long-term goals and track your progress towards the big picture."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-20 border-t border-white/5 text-center mt-20">
        <p className="text-muted-foreground text-sm">
          © 2024 Aura Productivity. Built for excellence.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <div className="glass-morphism p-8 rounded-[2.5rem] border border-white/5 text-left group hover:border-primary/30 transition-all subtle-3d">
      <div className="p-4 bg-primary/10 rounded-2xl w-fit mb-6 text-primary group-hover:scale-110 transition-transform">
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed italic">
        "{description}"
      </p>
    </div>
  );
}
