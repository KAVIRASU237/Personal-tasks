import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage() {
    const userCount = await prisma.user.count();

    if (userCount > 0) {
        redirect("/login");
    }

    return <RegisterForm />;
}
