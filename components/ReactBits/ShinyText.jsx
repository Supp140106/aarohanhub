'use client';

import { motion } from 'framer-motion';

const ShinyText = ({ text, disabled = false, speed = 3, className = '' }) => {
  return (
    <motion.div
      className={`inline-block ${className}`}
      style={{
        backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: disabled ? 'inherit' : 'transparent',
      }}
      animate={{
        backgroundPosition: disabled ? '100% 0' : ['100% 0', '-100% 0'],
      }}
      transition={{
        repeat: Infinity,
        duration: speed,
        ease: 'linear',
      }}
    >
      {text}
    </motion.div>
  );
};

export default ShinyText;
