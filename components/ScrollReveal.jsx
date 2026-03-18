'use client';

import { motion } from 'framer-motion';

export default function ScrollReveal({ children, className = "", delay = 0, yOffset = 30 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: yOffset }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true, margin: "-50px" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
