"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Calendar, Tag, AlertCircle, Edit } from "lucide-react";
import { updateTask } from "@/app/actions/tasks";
import { toast } from "sonner";

export default function EditTaskDialog({ task }: { task: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            await updateTask(task.id, formData);
            toast.success("Task updated successfully");
            setIsOpen(false);
        } catch (error) {
            toast.error("Failed to update task");
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2.5 hover:bg-blue-500/10 text-blue-400 rounded-xl transition-colors hover:scale-110 active:scale-95"
                title="Edit Task"
            >
                <Edit size={18} />
            </button>

            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-md"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="relative w-full max-w-lg glass-morphism rounded-[2.5rem] shadow-2xl border border-white/10 z-10 my-8"
                            >
                                <div className="p-6 md:p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-white">Edit Task</h2>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium ml-1 text-white">Task Title</label>
                                            <input
                                                name="title"
                                                required
                                                defaultValue={task.title}
                                                placeholder="e.g. Design Landing Page"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-white/20 text-white"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium ml-1 text-white">Description (Optional)</label>
                                            <textarea
                                                name="description"
                                                rows={3}
                                                defaultValue={task.description || ""}
                                                placeholder="Add more details about this task..."
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-white/20 resize-none text-white"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium ml-1 flex items-center gap-2 text-white">
                                                    <Tag size={14} className="text-primary" />
                                                    Category
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        name="category"
                                                        defaultValue={task.category}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none text-white [&>option]:bg-[#1a1a1a] [&>option]:text-white"
                                                    >
                                                        <option value="DAILY">Daily</option>
                                                        <option value="WEEKLY">Weekly</option>
                                                        <option value="MONTHLY">Monthly</option>
                                                        <option value="YEARLY">Yearly</option>
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-red-500">
                                                        <Tag size={14} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium ml-1 flex items-center gap-2 text-white">
                                                    <AlertCircle size={14} className="text-primary" />
                                                    Priority
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        name="priority"
                                                        defaultValue={task.priority}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none text-white [&>option]:bg-[#1a1a1a] [&>option]:text-white"
                                                    >
                                                        <option value="LOW">Low</option>
                                                        <option value="MEDIUM">Medium</option>
                                                        <option value="HIGH">High</option>
                                                        <option value="URGENT">Urgent</option>
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-red-500">
                                                        <AlertCircle size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium ml-1 flex items-center gap-2 text-white">
                                                <Calendar size={14} className="text-primary" />
                                                Due Date
                                            </label>
                                            <input
                                                type="date"
                                                name="dueDate"
                                                defaultValue={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ""}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-white inverted-calendar h-12"
                                            />
                                        </div>

                                        <div className="pt-4 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsOpen(false)}
                                                className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-2xl font-bold transition-all text-white"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="flex-1 bg-primary hover:bg-primary/90 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 text-white"
                                            >
                                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Task"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
