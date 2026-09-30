import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(false);

  useEffect(() => {
    // Check if mouse/pointer device is present
    if (window.matchMedia('(pointer: fine)').matches) {
      setIsPointerDevice(true);
      document.body.classList.add('custom-cursor-active');
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check cursor data attribute on hovered target
      const target = e.target as HTMLElement | null;
      const hoverEl = target?.closest('[data-cursor]') as HTMLElement | null;
      if (hoverEl) {
        setIsHovered(true);
        setCursorText(hoverEl.getAttribute('data-cursor') || '');
      } else if (target?.closest('button, a, input, select, textarea')) {
        setIsHovered(true);
        setCursorText('');
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  // Smooth trail animation
  useEffect(() => {
    if (!isPointerDevice) return;
    let animId: number;
    const lerp = () => {
      setTrailPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.18,
        y: prev.y + (pos.y - prev.y) * 0.18,
      }));
      animId = requestAnimationFrame(lerp);
    };
    animId = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(animId);
  }, [pos, isPointerDevice]);

  if (!isPointerDevice) return null;

  return (
    <>
      {/* Tiny sharp center point */}
      <div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-himalayan-amber pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        }}
      />

      {/* Trailing Ring with dynamic scale & text label */}
      <div
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-[width,height,background-color,border-color] duration-300 flex items-center justify-center text-center font-mono-tech ${
          isHovered
            ? cursorText
              ? 'w-20 h-20 bg-himalayan-amber/20 border border-himalayan-amber backdrop-blur-sm'
              : 'w-12 h-12 bg-white/10 border border-white/40'
            : 'w-8 h-8 border border-himalayan-ivory/20'
        }`}
        style={{
          transform: `translate3d(${trailPos.x}px, ${trailPos.y}px, 0)`,
        }}
      >
        {cursorText && (
          <span className="text-[9px] tracking-widest text-himalayan-ivory font-bold uppercase select-none px-1">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
}
