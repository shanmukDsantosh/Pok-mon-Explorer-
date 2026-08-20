import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const PokemonCursor: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);

  // Raw mouse position motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics configuration for elastic follower movement
  const springConfig = { damping: 18, stiffness: 120 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Initial position at bottom-left corner of the viewport
    const startX = 20;
    const startY = window.innerHeight - 100;
    mouseX.set(startX);
    mouseY.set(startY);

    // Trigger entrance transition state
    const timer = setTimeout(() => {
      setHasEntered(true);
    }, 1000);

    const handleMouseMove = (e: MouseEvent) => {
      // Offset by 20px so sprite never obscures click targets
      mouseX.set(e.clientX + 20);
      mouseY.set(e.clientY + 20);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: cursorX,
        y: cursorY,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: hasEntered ? 1 : 0.9, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex items-center justify-center pointer-events-none select-none"
    >
      <div className="relative">
        {/* Pikachu Animated Sprite */}
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/25.gif"
          alt="Pikachu Cursor Follower"
          className="w-12 h-12 object-contain drop-shadow-lg pointer-events-none select-none"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png';
          }}
        />

        {/* Sparkle Shadow Trail */}
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 rounded-full bg-amber-400/40 blur-sm pointer-events-none"
        />
      </div>
    </motion.div>
  );
};
