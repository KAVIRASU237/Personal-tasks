import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import TaskList from "./TaskList";
import { Plus } from "lucide-react";
import CreateTaskDialog from "./CreateTaskDialog";

export default async function TasksPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const tasks = await prisma.task.findMany({
        where: { userId: session.user.id },
        include: { completions: true },
        orderBy: { createdAt: "desc" },
    });

    // Serialize dates
    const serializedTasks = tasks.map(task => ({
        ...task,
        completions: task.completions.map(c => ({
            ...c,
            completedAt: c.completedAt.toISOString()
        })),
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
        completedAt: task.completedAt ? task.completedAt.toISOString() : null,
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                    <p className="text-muted-foreground mt-1">Manage your daily, weekly, and yearly objectives.</p>
                </div>
                <CreateTaskDialog />
            </div>

            <TaskList initialTasks={serializedTasks} />
        </div>
    );
}
