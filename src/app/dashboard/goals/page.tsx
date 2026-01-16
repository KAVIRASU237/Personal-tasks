import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Plus, Target, Calendar, Trash2 } from "lucide-react";
import { format } from "date-fns";
import CreateGoalDialog from "./CreateGoalDialog";
import DeleteGoalButton from "./DeleteGoalButton";

export default async function GoalsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const goals = await prisma.goal.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Vision Board</h1>
                    <p className="text-muted-foreground mt-1">Focus on your long-term ambitions and dreams.</p>
                </div>
                <CreateGoalDialog />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.length > 0 ? (
                    goals.map((goal) => (
                        <div key={goal.id} className="glass-morphism p-6 rounded-[2rem] border border-white/5 group hover:border-white/20 transition-all relative overflow-hidden subtle-3d shadow-xl">
                            <div className="absolute top-0 right-0 p-8 text-primary/10 group-hover:text-primary/20 transition-colors">
                                <Target size={80} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-xl font-bold max-w-[80%]">{goal.title}</h3>
                                    <DeleteGoalButton goalId={goal.id} />
                                </div>

                                <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                                    {goal.description || "No description provided."}
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="font-medium text-muted-foreground">Overall Progress</span>
                                        <span className="font-bold text-primary">0%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full w-[0%] transition-all duration-1000" />
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                                        <Calendar size={14} className="text-primary" />
                                        <span>Target: {goal.deadline ? format(new Date(goal.deadline), "MMMM yyyy") : "TBD"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center glass-morphism rounded-[2rem] border border-dashed border-white/10">
                        <Target size={48} className="mx-auto text-white/10 mb-4" />
                        <h3 className="text-xl font-medium">No goals yet</h3>
                        <p className="text-muted-foreground mt-2">The future belongs to those who believe in the beauty of their dreams.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
