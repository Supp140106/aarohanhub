'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const BlurText = ({
  text = '',
  delay = 50,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '-50px',
  animationFrom,
  animationTo,
  easing = 'easeOut',
  onAnimationComplete,
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: rootMargin, amount: threshold });

  const defaultFrom =
    direction === 'top'
      ? { filter: 'blur(10px)', opacity: 0, y: -50 }
      : { filter: 'blur(10px)', opacity: 0, y: 50 };

  const defaultTo = { filter: 'blur(0px)', opacity: 1, y: 0 };

  return (
    <p ref={ref} className={`flex flex-wrap ${className}`}>
      {elements.map((element, index) => (
        <motion.span
          key={index}
          initial={animationFrom || defaultFrom}
          animate={isInView ? animationTo || defaultTo : animationFrom || defaultFrom}
          transition={{
            delay: (index * delay) / 1000,
            duration: 0.6,
            ease: easing,
          }}
          className="inline-block mr-2"
          onAnimationComplete={() => {
            if (index === elements.length - 1 && onAnimationComplete) {
              onAnimationComplete();
            }
          }}
        >
          {element === ' ' ? '\u00A0' : element}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </p>
  );
};

export default BlurText;
