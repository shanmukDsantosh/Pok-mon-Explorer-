import { useState, useEffect, useRef, useCallback } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

export type CursorState = 'idle' | 'moving' | 'thunder' | 'fainted' | 'attacking';

export function useCursorAnimation() {
  const [cursorState, setCursorState] = useState<CursorState>('idle');
  const [clickParticles, setClickParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [hasMoved, setHasMoved] = useState(false);

  // Raw mouse position motion values
  const mouseX = useMotionValue(100);
  const mouseY = useMotionValue(100);
  const velocity = useMotionValue(0);
  const angle = useMotionValue(0);

  // Smooth spring physics: damping 25, stiffness 300
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Position tracking and idle timers
  const lastPos = useRef({ x: 100, y: 100, time: Date.now() });
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerThunderAnimation = useCallback(() => {
    setCursorState('thunder');

    // 1.5s Thunder Shock -> Fainted state -> Idle state
    if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
    stateTimerRef.current = setTimeout(() => {
      setCursorState('fainted');

      stateTimerRef.current = setTimeout(() => {
        setCursorState('idle');
      }, 1400);
    }, 1500);
  }, []);

  // Mouse movement & click tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!hasMoved) setHasMoved(true);

      const now = Date.now();
      const dt = Math.max(1, now - lastPos.current.time);
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = Math.min(100, (dist / dt) * 15);

      if (dist > 2) {
        const rad = Math.atan2(dy, dx);
        const deg = (rad * 180) / Math.PI;
        const tilt = Math.max(-15, Math.min(15, deg / 4));
        angle.set(tilt);
      }

      velocity.set(speed);
      mouseX.set(e.clientX + 18);
      mouseY.set(e.clientY + 18);

      lastPos.current = { x: e.clientX, y: e.clientY, time: now };

      setCursorState((prev) => {
        if (prev === 'thunder' || prev === 'fainted' || prev === 'attacking') return prev;
        return 'moving';
      });

      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      // Short timer to stop running animation when mouse stops
      idleTimerRef.current = setTimeout(() => {
        velocity.set(0);
        angle.set(0);

        setCursorState((prev) => {
          if (prev === 'thunder' || prev === 'fainted' || prev === 'attacking') return prev;

          // 15% probability (decreased odds) to trigger Thunder Shock
          if (Math.random() < 0.15) {
            triggerThunderAnimation();
            return 'thunder';
          }
          return 'idle';
        });
      }, 300);
    };

    const handleMouseClick = (e: MouseEvent) => {
      const newParticle = { id: Date.now(), x: e.clientX, y: e.clientY };
      setClickParticles((prev) => [...prev.slice(-8), newParticle]);

      setCursorState('attacking');

      if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
      stateTimerRef.current = setTimeout(() => {
        setCursorState('idle');
      }, 500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
    };
  }, [hasMoved, mouseX, mouseY, velocity, angle, triggerThunderAnimation]);

  return {
    cursorState,
    cursorX,
    cursorY,
    velocity,
    angle,
    hasMoved,
    clickParticles,
  };
}
