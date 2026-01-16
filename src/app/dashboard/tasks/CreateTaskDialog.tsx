"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2, Calendar, Tag, AlertCircle } from "lucide-react";
import { createTask } from "@/app/actions/tasks";
import { toast } from "sonner";

export default function CreateTaskDialog() {
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
            await createTask(formData);
            toast.success("Task created successfully");
            setIsOpen(false);
        } catch (error) {
            toast.error("Failed to create task");
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95"
            >
                <Plus size={20} />
                New Task
            </button>

            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                                className="relative w-full max-w-lg glass-morphism rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10"
                            >
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-2xl font-bold text-white">Create New Task</h2>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium ml-1 text-white">Task Title</label>
                                            <input
                                                name="title"
                                                required
                                                placeholder="e.g. Design Landing Page"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-white/20 text-white"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium ml-1 text-white">Description (Optional)</label>
                                            <textarea
                                                name="description"
                                                rows={3}
                                                placeholder="Add more details about this task..."
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-white/20 resize-none text-white"
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
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none text-white [&>option]:bg-[#1a1a1a] [&>option]:text-white"
                                                    >
                                                        <option value="DAILY">Daily</option>
                                                        <option value="WEEKLY">Weekly</option>
                                                        <option value="MONTHLY">Monthly</option>
                                                        <option value="YEARLY">Yearly</option>
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
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
                                                        defaultValue="MEDIUM"
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none text-white [&>option]:bg-[#1a1a1a] [&>option]:text-white"
                                                    >
                                                        <option value="LOW">Low</option>
                                                        <option value="MEDIUM">Medium</option>
                                                        <option value="HIGH">High</option>
                                                        <option value="URGENT">Urgent</option>
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
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
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-white inverted-calendar h-12"
                                            />
                                        </div>

                                        <div className="pt-4 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsOpen(false)}
                                                className="flex-1 bg-white/5 hover:bg-white/10 py-3.5 rounded-2xl font-bold transition-all text-white"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="flex-3 bg-primary hover:bg-primary/90 py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 text-white"
                                            >
                                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Task"}
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
