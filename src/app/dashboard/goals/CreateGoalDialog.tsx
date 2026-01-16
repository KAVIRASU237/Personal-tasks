"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2, Calendar } from "lucide-react";
import { createGoal } from "@/app/actions/goals";
import { toast } from "sonner";

export default function CreateGoalDialog() {
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
            await createGoal(formData);
            toast.success("Goal set! Let's make it happen.");
            setIsOpen(false);
        } catch (error) {
            toast.error("Failed to create goal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-2xl font-bold hover:bg-white/90 transition-all shadow-xl active:scale-95"
            >
                <Plus size={20} />
                Set New Goal
            </button>

            <AnimatePresence>
                {isOpen && mounted && createPortal(
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
                                    <h2 className="text-2xl font-bold text-white">Declare Your Vision</h2>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-white/5 rounded-xl transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium ml-1">Goal Title</label>
                                        <input
                                            name="title"
                                            required
                                            placeholder="e.g. Master React Native"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 focus:ring-2 focus:ring-white/30 outline-none transition-all placeholder:text-white/20 text-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium ml-1">Why is this important? (Optional)</label>
                                        <textarea
                                            name="description"
                                            rows={3}
                                            placeholder="Describe your vision and purpose..."
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 focus:ring-2 focus:ring-white/30 outline-none transition-all placeholder:text-white/20 resize-none text-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium ml-1 flex items-center gap-2">
                                            <Calendar size={14} className="text-primary" />
                                            Target Date
                                        </label>
                                        <input
                                            type="date"
                                            name="deadline"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 focus:ring-2 focus:ring-white/30 outline-none transition-all text-white"
                                        />
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsOpen(false)}
                                            className="flex-1 bg-white/5 hover:bg-white/10 py-3.5 rounded-2xl font-bold transition-all"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-3 bg-white text-black hover:bg-gray-200 py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/10"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Declare Goal"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>,
                    document.body
                )}
            </AnimatePresence>
        </>
    );
}
