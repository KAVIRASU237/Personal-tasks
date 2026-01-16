export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Workspace Settings</h1>

            <div className="glass-morphism rounded-[2.5rem] divide-y divide-white/5 border border-white/10">
                <div className="p-8">
                    <h2 className="text-xl font-bold mb-4">Account</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Password</p>
                                <p className="text-sm text-muted-foreground">Change your password</p>
                            </div>
                            <button className="px-4 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
                                Update
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <h2 className="text-xl font-bold mb-4">Notifications</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Email Alerts</p>
                                <p className="text-sm text-muted-foreground">Receive daily summaries</p>
                            </div>
                            <div className="w-12 h-6 bg-primary rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
