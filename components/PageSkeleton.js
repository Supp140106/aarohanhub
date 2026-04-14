'use client';

export default function PageSkeleton() {
    return (
        <div className="flex-1 w-full h-full p-6 md:p-10 bg-[#050505] overflow-hidden">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b border-white/5 pb-8">
                <div className="space-y-4 w-full">
                    <div className="w-24 h-4 bg-white/5 rounded-full animate-pulse"></div>
                    <div className="w-3/4 md:w-1/3 h-12 md:h-16 bg-white/[0.03] border border-white/5 rounded-2xl animate-pulse"></div>
                </div>
                <div className="w-32 h-10 bg-white/[0.03] rounded-xl border border-white/5 animate-pulse shrink-0"></div>
            </div>

            {/* Grid Skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-7xl mx-auto">
                <div className="md:col-span-12 h-40 bg-white/[0.02] border border-white/5 rounded-3xl animate-pulse"></div>
                <div className="md:col-span-8 h-48 bg-white/[0.02] border border-white/5 rounded-3xl animate-pulse"></div>
                <div className="md:col-span-4 h-48 bg-white/[0.03] border border-[#BF00FF]/10 rounded-3xl animate-pulse delay-100"></div>
                <div className="md:col-span-5 h-48 bg-white/[0.02] border border-white/5 rounded-3xl animate-pulse delay-150"></div>
                <div className="md:col-span-7 h-48 bg-white/[0.03] border border-emerald-500/10 rounded-3xl animate-pulse delay-200"></div>
                <div className="md:col-span-12 h-64 bg-white/[0.01] border border-white/5 rounded-3xl animate-pulse delay-300"></div>
            </div>
        </div>
    );
}
