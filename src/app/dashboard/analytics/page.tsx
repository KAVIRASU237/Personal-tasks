import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import OverallProgressGraph from "@/app/components/OverallProgressGraph";

export default async function AnalyticsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const tasks = await prisma.task.findMany({
        where: { userId: session.user.id },
        include: { completions: true },
        orderBy: { createdAt: "asc" }
    });

    // Serialize dates for client components
    const serializedTasks = tasks.map(task => ({
        ...task,
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
        completedAt: task.completedAt ? task.completedAt.toISOString() : null,
        completions: task.completions.map(c => ({
            ...c,
            completedAt: c.completedAt.toISOString()
        }))
    }));

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground mt-1">visualize your productivity trends.</p>
            </div>

            <div className="p-1">
                <OverallProgressGraph tasks={serializedTasks} />
            </div>

            {/* Can add more stats here later */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="glass-morphism p-6 rounded-2xl border border-white/5">
                    <h3 className="text-muted-foreground text-sm font-medium">Total Tasks</h3>
                    <p className="text-3xl font-bold mt-2 text-white">{tasks.length}</p>
                </div>
                <div className="glass-morphism p-6 rounded-2xl border border-white/5">
                    <h3 className="text-muted-foreground text-sm font-medium">Completed</h3>
                    <p className="text-3xl font-bold mt-2 text-green-400">
                        {tasks.filter(t => t.status === "COMPLETED").length}
                    </p>
                </div>
                <div className="glass-morphism p-6 rounded-2xl border border-white/5">
                    <h3 className="text-muted-foreground text-sm font-medium">Pending</h3>
                    <p className="text-3xl font-bold mt-2 text-orange-400">
                        {tasks.filter(t => t.status !== "COMPLETED").length}
                    </p>
                </div>
            </div>
        </div>
    );
}
