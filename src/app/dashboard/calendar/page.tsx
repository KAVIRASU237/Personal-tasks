import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CalendarClient from "./CalendarClient";

export default async function CalendarPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const tasks = await prisma.task.findMany({
        where: { userId: session.user.id },
        include: { completions: true }
    });

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
                <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
                <p className="text-muted-foreground mt-1">Plan your schedule efficiently.</p>
            </div>

            <CalendarClient tasks={serializedTasks} />
        </div>
    );
}
