"use client";

import { useState } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Clock, Activity, X } from "lucide-react";
import ContributionGraph from "../../components/ContributionGraph";

export default function CalendarClient({ tasks }: { tasks: any[] }) {
    const [selected, setSelected] = useState<Date | undefined>(new Date());
    const [showGraphFor, setShowGraphFor] = useState<string | null>(null);

    const selectedTasks = tasks.filter(task => {
        if (!selected) return false;

        // Always show DAILY tasks
        if (task.category === "DAILY") return true;

        // Show tasks due on selected date
        if (task.dueDate && isSameDay(parseISO(task.dueDate), selected)) return true;

        return false;
    });

    const modifiers = {
        hasTask: (date: Date) => {
            return tasks.some(task =>
                (task.dueDate && isSameDay(parseISO(task.dueDate), date)) || task.category === "DAILY"
            );
        }
    };

    const modifiersStyles = {
        hasTask: {
            color: "var(--primary)",
            fontWeight: "bold"
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-morphism p-8 rounded-[2rem] border border-white/5 flex flex-col items-center">
                <DayPicker
                    mode="single"
                    selected={selected}
                    onSelect={setSelected}
                    modifiers={modifiers}
                    modifiersStyles={modifiersStyles}
                    styles={{
                        caption: { color: "white" },
                        head_cell: { color: "var(--muted-foreground)" },
                        day: { color: "white" },
                        nav_button: { color: "white" }
                    }}
                />
            </div>

            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold">
                        {selected ? format(selected, "MMMM do, yyyy") : "Select a date"}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        {selectedTasks.length} tasks scheduled for this day
                    </p>
                </div>

                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {selectedTasks.length > 0 ? (
                            selectedTasks.map((task) => (
                                <div key={task.id} className="relative">
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="glass-morphism p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-full ${task.status === "COMPLETED" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"}`}>
                                                {task.status === "COMPLETED" ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                            </div>
                                            <div>
                                                <h3 className={`font-medium ${task.status === "COMPLETED" ? "line-through text-muted-foreground" : ""}`}>
                                                    {task.title}
                                                </h3>
                                                <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                                    <Clock size={12} />
                                                    {task.category === "DAILY" ? "Daily Recurring" : (task.priority + " Priority")}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowGraphFor(showGraphFor === task.id ? null : task.id)}
                                            className={`p-2 rounded-xl transition-colors ${showGraphFor === task.id ? "bg-primary text-white" : "hover:bg-white/10 text-muted-foreground"}`}
                                            title="View Progress Graph"
                                        >
                                            <Activity size={18} />
                                        </button>
                                    </motion.div>

                                    {/* Heatmap Popover */}
                                    <AnimatePresence>
                                        {showGraphFor === task.id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-2 glass-morphism p-4 rounded-xl border border-white/5 bg-black/40">
                                                    <p className="text-xs font-bold mb-3 text-muted-foreground uppercase flex items-center gap-2">
                                                        Yearly Consistency
                                                    </p>
                                                    <ContributionGraph completions={task.completions || []} />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-12 text-center glass-morphism rounded-2xl border border-dashed border-white/10"
                            >
                                <p className="text-muted-foreground">No tasks scheduled for this day.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
