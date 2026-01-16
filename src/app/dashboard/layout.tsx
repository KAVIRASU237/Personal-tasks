"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    CheckSquare,
    Target,
    Calendar,
    Settings,
    LogOut,
    Menu,
    X,
    Plus,
    BarChart3,
    Flame
} from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: CheckSquare, label: "Tasks", href: "/dashboard/tasks" },
    { icon: Target, label: "Goals", href: "/dashboard/goals" },
    { icon: Calendar, label: "Calendar", href: "/dashboard/calendar" },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Flame, label: "Consistency", href: "/dashboard/consistency" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();

    // Handle mobile responsiveness
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex h-screen bg-background overflow-hidden relative">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden fixed inset-0 bg-black/50 z-20 backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isSidebarOpen ? 260 : 80
                }}
                className={`
                    glass-morphism h-full flex flex-col z-30
                    fixed md:relative
                    ${!isSidebarOpen && "hidden md:flex"} 
                    ${isSidebarOpen && "flex"}
                `}
            >
                <div className="p-6 flex items-center justify-between mb-8">
                    <AnimatePresence mode="wait">
                        {isSidebarOpen && (
                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent"
                            >
                                Aura
                            </motion.h1>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}>
                                <div className={`
                  flex items-center gap-4 p-3 rounded-xl transition-all relative group
                  ${isActive ? "bg-primary text-white" : "hover:bg-white/5 text-muted-foreground hover:text-white"}
                `}>
                                    <item.icon size={22} className={isActive ? "text-white" : "group-hover:scale-110 transition-transform"} />
                                    {isSidebarOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="font-medium"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                    {!isSidebarOpen && (
                                        <div className="absolute left-16 px-2 py-1 bg-white text-black text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 hidden md:block">
                                            {item.label}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto">
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all group"
                    >
                        <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
                        {isSidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative bg-[#050505] w-full">
                {/* Mobile Header for Menu */}
                <div className="md:hidden p-4 flex items-center gap-4">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 glass rounded-lg">
                        <Menu size={20} />
                    </button>
                    <h1 className="text-xl font-bold">Aura</h1>
                </div>

                {/* Background gradient */}
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
