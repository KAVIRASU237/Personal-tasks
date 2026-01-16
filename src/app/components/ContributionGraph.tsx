"use client";

import { motion } from "framer-motion";
import { format, subDays, eachDayOfInterval, isSameDay, startOfYear, endOfYear } from "date-fns";

export default function ContributionGraph({ completions }: { completions: any[] }) {
    // Generate last 365 days (or current year) grid
    // GitHub style: Rows = Day of week (7), Cols = Weeks

    // Let's simplified version: A grid of small squares for the current year
    const today = new Date();
    const startDate = startOfYear(today);
    const endDate = endOfYear(today);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const getIntensity = (date: Date) => {
        // Check how many completions on this day
        const count = completions.filter(c => isSameDay(new Date(c.completedAt), date)).length;
        if (count === 0) return "bg-white/5";
        if (count === 1) return "bg-blue-900"; // Low
        if (count === 2) return "bg-blue-700"; // Low-Med
        if (count === 3) return "bg-blue-500"; // Med
        return "bg-blue-400"; // High
    };

    return (
        <div className="w-full overflow-x-auto pb-4">
            <div className="min-w-[800px]">
                <div className="flex flex-wrap gap-1">
                    {days.map((day, i) => {
                        const intensity = getIntensity(day);
                        return (
                            <div
                                key={i}
                                title={`${format(day, "MMM dd")}: ${completions.filter(c => isSameDay(new Date(c.completedAt), day)).length} completions`}
                                className={`w-3 h-3 rounded-[2px] ${intensity} transition-all hover:scale-125`}
                            />
                        )
                    })}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                    <span>Jan</span>
                    <span>Dec</span>
                </div>
            </div>
        </div>
    );
}
