"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    Circle,
    Clock,
    Trash2,
    Tag,
    AlertCircle,
    MoreVertical,
    Filter
} from "lucide-react";
import { toggleTaskStatus, deleteTask } from "@/app/actions/tasks";
import { toast } from "sonner";
import { format, isSameDay, isSameWeek, isSameMonth, isSameYear, parseISO, isValid } from "date-fns";
import EditTaskDialog from "./EditTaskDialog";

export default function TaskList({ initialTasks }: { initialTasks: any[] }) {
    const [filter, setFilter] = useState<string>("ALL");
    const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

    // Helper to determine if a task is completed based on its type/frequency
    const isTaskCompleted = (task: any) => {
        if (!task) return false;

        // For non-recurring tasks, just check status
        if (!["DAILY", "WEEKLY", "MONTHLY", "YEARLY"].includes(task.category)) {
            return task.status === "COMPLETED";
        }

        // For recurring tasks, check the completions history
        const completions = task.completions || [];
        const now = new Date();

        try {
            if (task.category === "DAILY") {
                return completions.some((c: any) => isSameDay(parseISO(c.completedAt), now));
            }
            if (task.category === "WEEKLY") {
                return completions.some((c: any) => isSameWeek(parseISO(c.completedAt), now));
            }
            if (task.category === "MONTHLY") {
                return completions.some((c: any) => isSameMonth(parseISO(c.completedAt), now));
            }
            if (task.category === "YEARLY") {
                return completions.some((c: any) => isSameYear(parseISO(c.completedAt), now));
            }
        } catch (e) {
            console.error("Date parsing error", e);
            return false;
        }

        return false;
    };

    const filteredTasks = initialTasks.filter(task => {
        const isCompleted = isTaskCompleted(task);
        if (filter === "COMPLETED" && !isCompleted) return false;
        if (filter === "PENDING" && isCompleted) return false;
        if (categoryFilter !== "ALL" && task.category !== categoryFilter) return false;
        return true;
    });

    const handleToggle = async (id: string, currentStatus: string) => {
        try {
            await toggleTaskStatus(id, currentStatus);
            toast.success("Task updated");
        } catch (error) {
            toast.error("Failed to update task");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            await deleteTask(id);
            toast.success("Task deleted");
        } catch (error) {
            toast.error("Failed to delete task");
        }
    };

    const priorityColors: any = {
        URGENT: "text-red-500",
        HIGH: "text-orange-500",
        MEDIUM: "text-blue-500",
        LOW: "text-gray-500",
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10">
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium mr-2">Filters:</span>
                </div>

                <div className="flex bg-black/40 p-1 rounded-xl">
                    {["ALL", "PENDING", "COMPLETED"].map((stat) => (
                        <button
                            key={stat}
                            onClick={() => setFilter(stat)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === stat ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"
                                }`}
                        >
                            {stat.charAt(0) + stat.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                <div className="flex bg-black/40 p-1 rounded-xl">
                    {["ALL", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${categoryFilter === cat ? "bg-blue-600 text-white shadow-lg" : "text-muted-foreground hover:text-white"
                                }`}
                        >
                            {cat === "ALL" ? "All Categories" : cat.charAt(0) + cat.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Task Grid/List */}
            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => (
                            <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="glass-morphism p-5 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all hover:shadow-2xl hover:shadow-black/20"
                            >
                                <div className="flex items-center gap-5 flex-1">
                                    <button
                                        onClick={() => handleToggle(task.id, task.status)}
                                        className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isTaskCompleted(task)
                                            ? "bg-primary border-primary text-white"
                                            : "border-white/20 hover:border-primary/50"
                                            }`}
                                    >
                                        {isTaskCompleted(task) ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                                    </button>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className={`font-semibold text-lg transition-all ${isTaskCompleted(task) ? "text-muted-foreground line-through decoration-primary/50" : "text-white"
                                                }`}>
                                                {task.title}
                                            </h3>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 ${priorityColors[task.priority]}`}>
                                                {task.priority}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1.5">
                                                <Tag size={12} className="text-primary" />
                                                {task.category}
                                            </span>
                                            {task.dueDate && (
                                                <span className="flex items-center gap-1.5">
                                                    <Clock size={12} className="text-blue-400" />
                                                    {isValid(new Date(task.dueDate)) ? format(new Date(task.dueDate), "MMM dd, yyyy") : ""}
                                                </span>
                                            )}
                                            {task.description && (
                                                <span className="hidden md:inline-block italic truncate max-w-[200px]">
                                                    {task.description}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleDelete(task.id)}
                                        className="p-2.5 hover:bg-red-500/10 text-red-400 rounded-xl transition-colors hover:scale-110 active:scale-95"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <EditTaskDialog task={task} />
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-20 text-center glass-morphism rounded-3xl border border-dashed border-white/10"
                        >
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-white/20">
                                <AlertCircle size={32} />
                            </div>
                            <h3 className="text-xl font-medium text-white/50">No tasks found</h3>
                            <p className="text-muted-foreground mt-2">Adjust your filters or create a new task to get started.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
