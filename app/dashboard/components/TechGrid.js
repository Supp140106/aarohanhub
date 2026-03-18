'use client';

import { motion } from 'framer-motion';

export default function TechGrid() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Perspective Grid Line */}
            <div 
                className="absolute inset-0" 
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(0, 240, 255, 0.05) 1px, transparent 1px), 
                                     linear-gradient(to bottom, rgba(0, 240, 255, 0.05) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
                    transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(0)',
                    transformOrigin: 'top',
                }}
            >
                <motion.div 
                    className="absolute inset-0"
                    animate={{
                        backgroundPositionY: ['0px', '40px']
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        backgroundImage: 'inherit',
                        backgroundSize: 'inherit'
                    }}
                />
            </div>

            {/* Glowing Orbs / Data Nodes */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-[#00F0FF] rounded-full blur-[2px] shadow-[0_0_8px_#00F0FF]"
                    initial={{ 
                        x: Math.random() * 100 + '%', 
                        y: '110%',
                        opacity: 0 
                    }}
                    animate={{ 
                        y: '-10%',
                        opacity: [0, 1, 1, 0]
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        delay: Math.random() * 10,
                        ease: "linear"
                    }}
                />
            ))}

            {/* Circuit Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M0 50 H50 V0 M50 50 V100 M50 50 H100" fill="none" stroke="#00F0FF" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="1.5" fill="#00F0FF" />
                    <circle cx="0" cy="50" r="1" fill="#00F0FF" />
                    <circle cx="100" cy="50" r="1" fill="#00F0FF" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#circuit)" />
            </svg>

            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a] opacity-60"></div>
        </div>
    );
}
