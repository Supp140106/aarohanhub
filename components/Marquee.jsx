'use client';

import { motion } from 'framer-motion';

export default function Marquee({ items, speed = 50, direction = 'left', className = '' }) {
    const renderItems = () => (
        <div className="flex shrink-0 items-center justify-around min-w-full gap-8 pr-8">
            {items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 shrink-0">
                    <span className="text-2xl md:text-5xl font-black uppercase tracking-tighter text-white/90">
                        {item}
                    </span>
                    <span className="text-[#00F0FF] text-xl md:text-3xl ml-4">✽</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className={`flex w-full overflow-hidden bg-black/80 py-6 md:py-10 border-y border-white/10 ${className}`}>
            <motion.div
                initial={{ x: direction === 'left' ? '0%' : '-50%' }}
                animate={{ x: direction === 'left' ? '-50%' : '0%' }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="flex shrink-0 will-change-transform w-fit"
            >
                {renderItems()}
                {renderItems()}
            </motion.div>
        </div>
    );
}
