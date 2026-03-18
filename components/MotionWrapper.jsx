'use client';

import { motion } from 'framer-motion';

export default function MotionWrapper({ children, className = "", animate, initial, transition }) {
    return (
        <motion.div
            initial={initial}
            animate={animate}
            transition={transition}
            className={className}
        >
            {children}
        </motion.div>
    );
}
