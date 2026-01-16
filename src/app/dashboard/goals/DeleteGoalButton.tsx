"use client";

import { Trash2 } from "lucide-react";
import { deleteGoal } from "@/app/actions/goals";
import { toast } from "sonner";

export default function DeleteGoalButton({ goalId }: { goalId: string }) {
    const handleDelete = async () => {
        if (!confirm("Remove this goal from your vision board?")) return;
        try {
            await deleteGoal(goalId);
            toast.success("Goal removed");
        } catch (error) {
            toast.error("Failed to remove goal");
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="p-2 hover:bg-red-500/10 text-red-400 rounded-xl transition-colors hover:scale-110 active:scale-95"
        >
            <Trash2 size={18} />
        </button>
    );
}
