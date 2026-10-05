'use client';

import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';

export const ease = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/*  Reveal — enters when it reaches the viewport (once, then stays)    */
/* ------------------------------------------------------------------ */
export const Reveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  margin?: string;
}> = ({ children, className, delay = 0, y = 14, x = 0, margin = '-60px' }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin }}
      transition={{ delay, duration: 0.5, ease }}
    >
      {children}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Parallax — travels against the scroll, GPU only                    */
/* ------------------------------------------------------------------ */
export const Parallax: React.FC<{
  children: React.ReactNode;
  className?: string;
  /** total travel in px across the element's pass through the viewport */
  range?: number;
  /** anchor to an element instead of the whole document */
  target?: React.RefObject<HTMLElement>;
}> = ({ children, className, range = 70, target }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: target ?? ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduce ? undefined : { y }}
    >
      {children}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Magnetic — the element leans toward the pointer                    */
/* ------------------------------------------------------------------ */
export const Magnetic: React.FC<{
  children: React.ReactNode;
  className?: string;
  strength?: number;
}> = ({ children, className, strength = 0.22 }) => {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 240, damping: 18, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 240, damping: 18, mass: 0.35 });

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
};
