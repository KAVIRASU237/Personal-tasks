"use client";

import { useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import { format, startOfMonth, eachMonthOfInterval, subMonths, isSameMonth, parseISO } from "date-fns";

export default function OverallProgressGraph({ tasks }: { tasks: any[] }) {
    const data = useMemo(() => {
        // 1. Identify all categories
        const categories = Array.from(new Set(tasks.map((t) => t.category)));

        // 2. Generate last 12 months intervals
        const today = new Date();
        const startDate = subMonths(today, 11); // Last 12 months including current
        const months = eachMonthOfInterval({ start: startDate, end: today });

        // 3. Flatten all completions with their task category
        const allCompletions = tasks.flatMap(task =>
            (task.completions || []).map((c: any) => ({
                date: parseISO(c.completedAt),
                category: task.category
            }))
        );

        // 4. Build chart data
        return months.map(month => {
            const point: any = {
                name: format(month, "MMM"),
            };

            categories.forEach(cat => {
                // Count completions for this category in this month
                const count = allCompletions.filter(c =>
                    c.category === cat && isSameMonth(c.date, month)
                ).length;
                point[cat] = count;
            });

            return point;
        });
    }, [tasks]);

    const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899"];

    if (tasks.length === 0) return null;

    return (
        <div className="w-full h-[300px] glass-morphism p-4 rounded-3xl border border-white/5">
            <h3 className="text-lg font-bold mb-4 pl-2">Productivity Trends</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#000", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                        itemStyle={{ fontSize: "12px" }}
                        labelStyle={{ color: "#fff", marginBottom: "5px" }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "10px" }} />
                    {Object.keys(data[0] || {}).filter(k => k !== 'name').map((key, index) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={colors[index % colors.length]}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
