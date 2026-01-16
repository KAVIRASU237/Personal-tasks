import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
    CheckCircle2,
    Circle,
    Clock,
    TrendingUp,
    Calendar as CalendarIcon,
    Plus,
    ArrowRight,
    Target
} from "lucide-react";
import Link from "next/link";


export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userId = session.user.id;

    // Fetch stats
    const totalTasks = await prisma.task.count({ where: { userId } });
    const completedTasks = await prisma.task.count({ where: { userId, status: "COMPLETED" } });
    const pendingTasks = await prisma.task.count({ where: { userId, status: "PENDING" } });

    const goals = await prisma.goal.findMany({
        where: { userId },
        take: 3,
        orderBy: { createdAt: "desc" }
    });

    const recentTasks = await prisma.task.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: "desc" },
    });

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome Back, {session.user.name}</h1>
                    <p className="text-muted-foreground">Here's what's happening in your workspace today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/tasks/new"
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                        <Plus size={18} />
                        Quick Task
                    </Link>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Completion Rate"
                    value={`${completionRate}%`}
                    icon={TrendingUp}
                    trend="Overall progress"
                    color="blue"
                />
                <StatCard
                    label="Active Tasks"
                    value={pendingTasks.toString()}
                    icon={Circle}
                    trend="Tasks needed to be done"
                    color="blue"
                />
                <StatCard
                    label="Completed"
                    value={completedTasks.toString()}
                    icon={CheckCircle2}
                    trend="Tasks finished"
                    color="green"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Tasks */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-semibold">Priority Tasks</h2>
                        <Link href="/dashboard/tasks" className="text-sm text-primary hover:underline flex items-center gap-1">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="glass-morphism rounded-3xl overflow-hidden">
                        {recentTasks.length > 0 ? (
                            <div className="divide-y divide-white/5">
                                {recentTasks.map((task: any) => (
                                    <div key={task.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-2 h-2 rounded-full ${task.status === "COMPLETED" ? "bg-green-500" : "bg-blue-500"}`} />
                                            <div>
                                                <h3 className={`font-medium ${task.status === "COMPLETED" ? "line-through text-muted-foreground" : ""}`}>
                                                    {task.title}
                                                </h3>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                    <CalendarIcon size={12} />
                                                    {task.category}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-primary/20 rounded-lg text-primary transition-colors">
                                                <CheckCircle2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <p className="text-muted-foreground">No tasks yet. Start by adding one!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Long Term Goals */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-semibold">Vision Board</h2>
                        <Link href="/dashboard/goals" className="text-sm text-primary hover:underline flex items-center gap-1">
                            Details <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {goals.length > 0 ? (
                            goals.map((goal: any) => (
                                <div key={goal.id} className="glass rounded-2xl p-4 subtle-3d border border-white/5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-sm">{goal.title}</h3>
                                        <Target size={16} className="text-primary" />
                                    </div>
                                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full w-[45%]" />
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <span className="text-[10px] text-muted-foreground">Progress</span>
                                        <span className="text-[10px] font-bold">45%</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="glass rounded-2xl p-8 text-center border border-dashed border-white/10">
                                <Target size={32} className="mx-auto text-white/10 mb-2" />
                                <p className="text-xs text-muted-foreground">Add your long-term goals to stay inspired</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, trend, color }: any) {
    const colorMap: any = {
        blue: "text-blue-500 bg-blue-500/10",
        green: "text-green-500 bg-green-500/10",
        purple: "text-purple-500 bg-purple-500/10",
    };

    return (
        <div className="glass-morphism p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${colorMap[color] || colorMap.blue}`}>
                    <Icon size={24} />
                </div>
            </div>
            <div>
                <p className="text-sm text-muted-foreground font-medium">{label}</p>
                <h3 className="text-3xl font-bold mt-1 group-hover:scale-105 transition-transform origin-left">{value}</h3>
                <p className="text-xs text-muted-foreground mt-2">{trend}</p>
            </div>
        </div>
    );
}
