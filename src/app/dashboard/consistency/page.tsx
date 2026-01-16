import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ContributionGraph from "@/app/components/ContributionGraph";

export default async function ConsistencyPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const tasks = await prisma.task.findMany({
        where: { userId: session.user.id },
        include: { completions: true }
    });

    // Flatten all completions to get a global view
    const allCompletions = tasks.flatMap(task =>
        task.completions.map(c => ({
            ...c,
            completedAt: c.completedAt.toISOString()
        }))
    );

    // Also include one-off completed tasks that might not have a separate completion record 
    // (backward compatibility or just in case they were marked done without logic trigger, 
    // though our new action always creates completion. Let's stick to completions array for accuracy).

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Yearly Consistency</h1>
                <p className="text-muted-foreground mt-1">Consistency is key to success.</p>
            </div>

            <div className="glass-morphism p-8 rounded-[2rem] border border-white/5 bg-black/40 overflow-hidden">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary rounded-full" />
                    Global Activity
                </h2>
                <ContributionGraph completions={allCompletions} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* We could list top consistent tasks here if we wanted */}
            </div>
        </div>
    );
}
