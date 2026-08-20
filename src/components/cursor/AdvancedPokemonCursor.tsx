import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCursorAnimation } from '../../hooks/useCursorAnimation';

// Web Audio API helper for electric sound effect trigger
const playElectricSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    // Ignore audio restrictions
  }
};

export const AdvancedPokemonCursor: React.FC = () => {
  const {
    cursorState,
    cursorX,
    cursorY,
    angle,
    hasMoved,
    clickParticles,
  } = useCursorAnimation();

  useEffect(() => {
    if (cursorState === 'thunder') {
      playElectricSound();
    }
  }, [cursorState]);

  return (
    <>
      {/* FULL PAGE THUNDER ILLUMINATION OVERLAY */}
      <AnimatePresence>
        {cursorState === 'thunder' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0.2, 0.8, 0.25, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, times: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1] }}
            className="fixed inset-0 z-[9990] bg-yellow-300/35 dark:bg-amber-400/40 mix-blend-screen pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* FULL PAGE ATTACK SCREEN FLASH */}
      <AnimatePresence>
        {cursorState === 'attacking' && (
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9990] bg-white/40 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* CLICK PARTICLE BURSTS */}
      {clickParticles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ scale: 0.2, opacity: 1, x: particle.x, y: particle.y }}
          animate={{ scale: 2.5, opacity: 0, x: particle.x, y: particle.y - 20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed z-[9995] w-6 h-6 rounded-full border-2 border-amber-400 bg-yellow-300/60 pointer-events-none"
        />
      ))}

      {/* MAIN PIKACHU RUNNING CURSOR SPRITE */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: cursorX,
          y: cursorY,
          pointerEvents: 'none',
          zIndex: 99999,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: hasMoved ? 1 : 0.8, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none select-none"
      >
        <div className="relative flex items-center justify-center">
          {/* SVG Lightning Bolts around Pikachu during Thunder state */}
          {cursorState === 'thunder' && (
            <div className="absolute inset-0 -m-16 flex items-center justify-center pointer-events-none z-10">
              <svg className="w-36 h-36 animate-pulse text-yellow-300" viewBox="0 0 100 100">
                <path
                  d="M50 0 L40 40 L60 40 L30 100 L45 55 L30 55 Z"
                  fill="currentColor"
                  className="drop-shadow-[0_0_12px_rgba(253,224,71,0.9)]"
                />
                <path
                  d="M10 20 L35 35 L20 45 L50 90 L40 50 L55 50 Z"
                  fill="#fef08a"
                  className="opacity-80"
                />
              </svg>
            </div>
          )}

          {/* Fainted Dizzy Stars graphic */}
          {cursorState === 'fainted' && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="absolute -top-6 text-yellow-400 font-extrabold text-xs tracking-widest pointer-events-none flex gap-1 z-20"
            >
              <span>💫</span>
              <span>⭐</span>
              <span>💫</span>
            </motion.div>
          )}

          {/* Pikachu Sprite Image - Crisp colors with no whiteout filter */}
          <motion.div
            style={{ rotate: angle }}
            animate={
              cursorState === 'moving'
                ? { y: [0, -6, 0], scale: [1, 1.06, 1] }
                : cursorState === 'thunder'
                ? {
                    scale: [1, 1.2, 1, 1.25, 1],
                  }
                : cursorState === 'fainted'
                ? {
                    rotate: [0, 90, 85],
                    y: [0, 12, 10],
                    opacity: [1, 0.85, 1],
                  }
                : cursorState === 'attacking'
                ? {
                    scale: [1, 1.3, 1],
                    x: [0, 15, 0],
                    y: [0, -10, 0],
                  }
                : { y: 0, scale: 1, rotate: 0 } // Completely STILL when idle!
            }
            transition={
              cursorState === 'moving'
                ? { repeat: Infinity, duration: 0.25 }
                : cursorState === 'thunder'
                ? { repeat: Infinity, duration: 0.2 }
                : { duration: 0.3 }
            }
            className="relative z-10"
          >
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/25.gif"
              alt="Pikachu Cursor"
              className="w-14 h-14 object-contain drop-shadow-xl pointer-events-none select-none"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png';
              }}
            />
          </motion.div>

          {/* Electric Sparkle Particles during Thunder State */}
          {cursorState === 'thunder' && (
            <motion.div
              animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.4, 0.9, 0.4] }}
              transition={{ repeat: Infinity, duration: 0.3 }}
              className="absolute -bottom-2 w-10 h-3 rounded-full bg-yellow-400/80 blur-md pointer-events-none"
            />
          )}
        </div>
      </motion.div>
    </>
  );
};
