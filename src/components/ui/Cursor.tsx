'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

const INTERACTIVE = 'a,button,[role="button"],input,textarea,select,label,.group';

/**
 * Field cursor: a precise dot with a lagging ring that opens over anything
 * interactive. Only mounted for fine pointers with motion allowed — coarse
 * pointers and reduced-motion users keep the OS cursor untouched.
 */
export const Cursor: React.FC = () => {
  const [on, setOn] = useState(false);
  const [hot, setHot] = useState(false);
  const reduce = useReducedMotion();

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const rx = useSpring(x, { stiffness: 320, damping: 34, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 320, damping: 34, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    setOn(true);
    document.documentElement.classList.add('cursor-none');

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      setHot(!!el?.closest?.(INTERACTIVE));
    };
    const leave = () => {
      x.set(-200);
      y.set(-200);
    };

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      document.documentElement.classList.remove('cursor-none');
    };
  }, [x, y]);

  if (!on) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[80] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-signal"
        style={{ x, y }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[80] -ml-[15px] -mt-[15px] h-[30px] w-[30px] rounded-full border border-signal/45"
        style={{ x: rx, y: ry }}
        animate={{ scale: reduce ? 1 : hot ? 1.55 : 1, opacity: hot ? 1 : 0.55 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      />
    </>
  );
};
