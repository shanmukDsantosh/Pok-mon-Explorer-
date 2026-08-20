import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PokedexLoaderProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

export const PokedexLoader: React.FC<PokedexLoaderProps> = ({
  onComplete,
  minDurationMs = 2200,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress bar increment animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, minDurationMs);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [minDurationMs, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 overflow-hidden"
        >
          {/* Pokédex Main Device Container */}
          <motion.div
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md bg-gradient-to-b from-red-600 via-red-700 to-red-800 rounded-3xl p-6 shadow-2xl border-4 border-red-500 flex flex-col gap-6"
          >
            {/* Top Sensor Bar & Blinking LEDs */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-red-900/40">
              <div className="flex items-center gap-3">
                {/* Main Big Blue Lens / Sensor */}
                <div className="relative flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute w-12 h-12 rounded-full bg-cyan-400/50 blur-md"
                  />
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 via-sky-400 to-white p-1 border-2 border-white shadow-inner flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-cyan-200/80 shadow-inner" />
                  </div>
                </div>

                {/* 3 Small Status LEDs */}
                <div className="flex items-center gap-2">
                  {/* Red Light */}
                  <motion.div
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-3.5 h-3.5 rounded-full bg-red-400 border border-red-200 shadow-md shadow-red-500/50"
                  />
                  {/* Yellow Light */}
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-200 shadow-md shadow-amber-500/50"
                  />
                  {/* Green Light */}
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.6 }}
                    className="w-3.5 h-3.5 rounded-full bg-emerald-400 border border-emerald-200 shadow-md shadow-emerald-500/50"
                  />
                </div>
              </div>

              {/* Pokédex Branding Badge */}
              <span className="font-mono text-xs font-black uppercase tracking-widest text-red-200 bg-red-950/60 px-3 py-1 rounded-full border border-red-500/40">
                HANDHELD v2.0
              </span>
            </div>

            {/* Scanning Blue Display Screen */}
            <div className="relative overflow-hidden bg-slate-900 rounded-2xl p-5 border-4 border-slate-700 shadow-inner flex flex-col gap-4">
              {/* Animated Laser Grid Background */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Scanning Blue Radar Beam */}
              <motion.div
                animate={{ y: ['-100%', '250%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="absolute inset-x-0 h-12 bg-gradient-to-b from-cyan-400/0 via-cyan-400/30 to-cyan-400/0 pointer-events-none z-10"
              />

              {/* Screen Header Info */}
              <div className="flex items-center justify-between z-20 text-cyan-400 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="w-2.5 h-2.5 rounded-full bg-red-500"
                  />
                  <span className="font-bold tracking-wider uppercase">System Boot</span>
                </div>
                <span>{Math.min(100, progress)}%</span>
              </div>

              {/* Screen Center Text & Animated Pokeball graphic */}
              <div className="relative z-20 my-2 flex flex-col items-center justify-center gap-3 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  className="w-16 h-16 rounded-full border-4 border-cyan-400 flex items-center justify-center relative shadow-lg shadow-cyan-500/20"
                >
                  <div className="absolute w-full h-[4px] bg-cyan-400 top-1/2 -translate-y-1/2" />
                  <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-cyan-400 z-10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-cyan-300 animate-ping" />
                  </div>
                </motion.div>

                <div className="space-y-1">
                  <p className="font-mono text-sm font-bold text-cyan-300 tracking-wide">
                    INITIALIZING POKÉDEX
                  </p>
                  <p className="font-mono text-[11px] text-cyan-500/80">
                    Scanning Kanto & Paldea Databases...
                  </p>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="space-y-1.5 z-20">
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-cyan-900">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-teal-300 rounded-full"
                    style={{ width: `${Math.min(100, progress)}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <div className="flex justify-between font-mono text-[10px] text-cyan-600">
                  <span>BOOT: READY</span>
                  <span>STATUS: SYNCING</span>
                </div>
              </div>
            </div>

            {/* Bottom D-Pad & Control Buttons Graphic */}
            <div className="flex items-center justify-between pt-1">
              {/* Black D-Pad */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute w-12 h-4 bg-slate-900 rounded-sm shadow" />
                <div className="absolute w-4 h-12 bg-slate-900 rounded-sm shadow" />
                <div className="w-3 h-3 bg-slate-800 rounded-full z-10" />
              </div>

              {/* Speaker Grille Slots */}
              <div className="flex gap-1.5">
                <div className="w-1.5 h-8 bg-slate-900/60 rounded-full" />
                <div className="w-1.5 h-8 bg-slate-900/60 rounded-full" />
                <div className="w-1.5 h-8 bg-slate-900/60 rounded-full" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
