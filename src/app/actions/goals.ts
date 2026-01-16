"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createGoal(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const deadline = formData.get("deadline") as string;

    const goal = await prisma.goal.create({
        data: {
            title,
            description,
            deadline: deadline ? new Date(deadline) : null,
            userId: session.user.id,
        },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/goals");
    return goal;
}

export async function deleteGoal(goalId: string) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    await prisma.goal.delete({
        where: { id: goalId, userId: session.user.id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/goals");
}
