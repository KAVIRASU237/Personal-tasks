"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerAdmin(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!email || !password) {
        throw new Error("Missing email or password");
    }

    // Check if any user exists
    const userCount = await prisma.user.count();
    if (userCount > 0) {
        throw new Error("Admin already exists. Registration disabled.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });

    return { success: true, userId: user.id };
}
