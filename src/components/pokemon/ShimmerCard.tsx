import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ShimmerCardProps {
  children: React.ReactNode;
  className?: string;
}

export const ShimmerCard: React.FC<ShimmerCardProps> = ({ children, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-3xl group ${className}`}
    >
      {/* Animated Shimmer Sweep Beam */}
      {isHovered && (
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: '200%', opacity: [0, 0.6, 0] }}
          transition={{ duration: 1.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.5 }}
          className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-white/40 dark:via-white/20 to-transparent skew-x-12"
        />
      )}

      {/* Subtle Radiant Outer Aura */}
      <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-red-500 via-amber-400 to-indigo-500 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />

      {children}
    </motion.div>
  );
};
