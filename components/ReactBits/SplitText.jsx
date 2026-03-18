'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function SplitText({
  text = '',
  className = '',
  delay = 100,
  animationFrom = { opacity: 0, y: 50 },
  animationTo = { opacity: 1, y: 0 },
  easing = 'easeOut',
  threshold = 0.1,
  rootMargin = '-50px',
  textAlign = 'center',
  onLetterAnimationComplete,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold, margin: rootMargin });

  const letters = text.split('');

  return (
    <p
      ref={ref}
      className={`inline-block overflow-hidden ${className}`}
      style={{ textAlign, whiteSpace: 'normal', wordWrap: 'break-word' }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={animationFrom}
          animate={isInView ? animationTo : animationFrom}
          transition={{
            duration: 0.5,
            ease: easing,
            delay: (index * delay) / 1000,
          }}
          onAnimationComplete={() => {
            if (index === letters.length - 1 && onLetterAnimationComplete) {
              onLetterAnimationComplete();
            }
          }}
          className="inline-block"
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </p>
  );
}
