'use client';

import React from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

/**
 * The atmosphere layer: warm charcoal → ember gradient washes that drift
 * against the scroll, plus a vignette. Sits at z-index -10, so it is above
 * the canvas background but behind every piece of content.
 */
export const SceneBackdrop: React.FC = () => {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.4 });

  const yGold = useTransform(progress, [0, 1], ['0%', '16%']);
  const yEmber = useTransform(progress, [0, 1], ['0%', '-14%']);
  const deep = useTransform(progress, [0, 0.85], [0, 1]);

  return (
    <div className="backdrop" aria-hidden="true">
      {/* base: warm charcoal, lighter at the horizon */}
      <div
        className="backdrop-wash"
        style={{
          background: 'linear-gradient(180deg, #171410 0%, #100E0C 44%, #090807 100%)',
        }}
      />

      {/* gold key light, top-left */}
      <motion.div
        className="backdrop-wash"
        style={{
          background:
            'radial-gradient(58% 46% at 14% -4%, rgba(233,185,73,0.16), rgba(233,185,73,0.04) 42%, transparent 72%)',
          y: reduce ? 0 : yGold,
        }}
      />

      {/* ember floor, bottom-right */}
      <motion.div
        className="backdrop-wash"
        style={{
          background:
            'radial-gradient(52% 44% at 92% 104%, rgba(217,105,74,0.14), rgba(217,105,74,0.03) 46%, transparent 74%)',
          y: reduce ? 0 : yEmber,
        }}
      />

      {/* steel air, right */}
      <div
        className="backdrop-wash"
        style={{
          background:
            'radial-gradient(46% 38% at 84% 26%, rgba(143,163,173,0.10), transparent 70%)',
        }}
      />

      {/* gold deepens as the mission progresses */}
      <motion.div
        className="backdrop-wash"
        style={{
          opacity: reduce ? 0.5 : deep,
          background:
            'radial-gradient(72% 52% at 50% 116%, rgba(233,185,73,0.20), transparent 68%)',
        }}
      />

      {/* vignette */}
      <div
        className="backdrop-wash"
        style={{
          background:
            'radial-gradient(124% 96% at 50% 42%, transparent 38%, rgba(0,0,0,0.62) 100%)',
        }}
      />
    </div>
  );
};
