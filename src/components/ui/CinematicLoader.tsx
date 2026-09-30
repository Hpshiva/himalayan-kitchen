import { useEffect, useState, useRef } from 'react';
import { Compass, Wind, Sparkles } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface CinematicLoaderProps {
  onComplete: () => void;
  theme?: 'dark' | 'light';
}

const ALTITUDE_MILESTONES = [
  { elevation: 0, location: 'SEA LEVEL' },
  { elevation: 1400, location: 'KATHMANDU BASIN' },
  { elevation: 2860, location: 'LUKLA AIRSTRIP' },
  { elevation: 3867, location: 'TENGBOCHE RIDGE' },
  { elevation: 5364, location: 'KHUMBU BASECAMP' },
  { elevation: 8848, location: 'SAGARMATHA PEAK' },
];

export function CinematicLoader({ onComplete, theme = 'light' }: CinematicLoaderProps) {
  const [altitude, setAltitude] = useState(0);
  const [currentMilestone, setCurrentMilestone] = useState('SEA LEVEL');
  const [isRevealed, setIsRevealed] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isLight = theme === 'light';

  useEffect(() => {
    let current = 0;
    const target = 8848;
    const interval = setInterval(() => {
      const step = Math.max(18, Math.floor((target - current) * 0.08));
      current += step;

      if (current >= target) {
        current = target;
        setAltitude(target);
        setCurrentMilestone('SAGARMATHA PEAK');
        clearInterval(interval);
        setTimeout(() => {
          setIsRevealed(true);
        }, 400);
      } else {
        setAltitude(current);
        const match = ALTITUDE_MILESTONES.slice().reverse().find(m => current >= m.elevation);
        if (match) {
          setCurrentMilestone(match.location);
        }
      }
    }, 28);

    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    soundEngine.enableSound();
    soundEngine.playSingingBowl(432, 4.0);
    setIsRevealed(true);
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  const toggleSound = () => {
    const active = soundEngine.toggleMute();
    setSoundEnabled(active);
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[100] flex flex-col justify-between p-4 sm:p-6 md:p-12 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isRevealed ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      } ${
        isLight ? 'bg-[#f7f5f0] text-stone-900' : 'bg-himalayan-void text-himalayan-ivory'
      }`}
    >
      {/* Top Bar: Technical Metadata */}
      <div className={`flex items-center justify-between text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.25em] font-mono-tech border-b pb-3 sm:pb-4 ${
        isLight ? 'text-stone-500 border-stone-300' : 'text-himalayan-fog border-himalayan-ivory/10'
      }`}>
        <div className="flex items-center gap-2 sm:gap-3">
          <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-himalayan-amber animate-spin" style={{ animationDuration: '12s' }} />
          <span>27°59′17″N 86°55′31″E</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={toggleSound}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full border text-[9px] sm:text-[10px] transition-colors ${
              soundEnabled
                ? 'border-himalayan-amber bg-himalayan-amber/15 text-himalayan-amber font-semibold'
                : isLight
                ? 'border-stone-400 text-stone-700 hover:border-himalayan-amber hover:text-himalayan-amber'
                : 'border-himalayan-ivory/15 text-himalayan-ivory/70 hover:border-himalayan-amber hover:text-himalayan-amber'
            }`}
          >
            <Wind className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-himalayan-amber" />
            <span>{soundEnabled ? 'SOUND ON' : 'ENABLE SOUND'}</span>
          </button>
          <span className="hidden sm:inline-block text-himalayan-amber font-semibold">EXPEDITION 01</span>
        </div>
      </div>

      {/* Centerpiece: Mountain Ridge Line Drawing & Typography */}
      <div className="relative my-auto flex flex-col items-center justify-center text-center">
        {/* SVG Procedural Mountain Contour with Stroke Dash Animation */}
        <div className="w-full max-w-2xl h-28 sm:h-36 md:h-44 relative mb-4 sm:mb-6">
          <svg
            viewBox="0 0 1000 300"
            className="w-full h-full overflow-visible"
            fill="none"
          >
            <defs>
              <linearGradient id="ridgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#828a94" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#d9642a" stopOpacity="1" />
                <stop offset="100%" stopColor="#dfb76c" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            {/* Background low ridge */}
            <path
              d="M0,280 Q250,220 400,240 T700,210 Q850,230 1000,280"
              stroke={isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(244, 240, 232, 0.1)'}
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />
            {/* Foreground Main Himalayan Summit Contour */}
            <path
              d="M 50,290 
                 L 220,190 
                 L 310,230 
                 L 450,110 
                 L 500,40 
                 L 560,130 
                 L 680,80 
                 L 780,210 
                 L 860,170 
                 L 950,290"
              stroke="url(#ridgeGlow)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 2000,
                strokeDashoffset: 2000 - (altitude / 8848) * 2000,
                transition: 'stroke-dashoffset 0.1s linear',
              }}
            />
            {/* Glowing Summit Point at Sagarmatha peak */}
            {altitude > 7500 && (
              <circle
                cx="500"
                cy="40"
                r="4.5"
                fill="#d9642a"
                className="animate-ping"
              />
            )}
          </svg>
        </div>

        {/* Live Elevation Counter */}
        <div className="font-mono-tech flex flex-col items-center mb-4 sm:mb-6">
          <div className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] text-himalayan-amber uppercase mb-1 font-semibold">
            ALTITUDE ASCENT
          </div>
          <div className={`text-3xl sm:text-4xl md:text-6xl font-light tracking-tight flex items-baseline ${
            isLight ? 'text-stone-900' : 'text-himalayan-ivory'
          }`}>
            <span>{altitude.toLocaleString()}</span>
            <span className={`text-lg sm:text-xl md:text-2xl ml-1 ${isLight ? 'text-stone-500' : 'text-himalayan-fog'}`}>M</span>
          </div>
          <div className={`text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase mt-1 ${isLight ? 'text-stone-600' : 'text-himalayan-fog/80'}`}>
            {currentMilestone}
          </div>
        </div>

        {/* Wordmark Reveal */}
        <div className="overflow-hidden">
          <h1
            className={`font-display text-xl sm:text-3xl md:text-5xl tracking-[0.2em] sm:tracking-[0.35em] uppercase transition-all duration-700 font-bold ${
              isLight ? 'text-stone-900' : 'text-himalayan-ivory'
            }`}
            style={{
              opacity: altitude > 4000 ? 1 : 0.2,
              transform: altitude > 4000 ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            HIMALAYAN KITCHEN
          </h1>
        </div>

        <p
          className={`text-[10px] sm:text-xs md:text-sm tracking-[0.15em] sm:tracking-[0.25em] uppercase mt-2 sm:mt-3 transition-opacity duration-700 max-w-md ${
            isLight ? 'text-stone-600' : 'text-himalayan-fog'
          }`}
          style={{ opacity: altitude > 7000 ? 1 : 0 }}
        >
          Where The Mountains Meet The Hearth
        </p>

        {/* Action Button once peak is reached */}
        {altitude >= 8848 && (
          <button
            onClick={handleEnter}
            className="mt-6 sm:mt-8 group relative px-6 sm:px-8 py-3 sm:py-3.5 overflow-hidden rounded-full border border-himalayan-amber/50 bg-himalayan-amber/15 hover:bg-himalayan-amber text-himalayan-amber hover:text-white transition-all duration-500 flex items-center gap-2.5 sm:gap-3 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase font-semibold shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5 group-hover:text-white transition-colors" />
            <span>ENTER SANCTUARY</span>
          </button>
        )}
      </div>

      {/* Bottom Status Grid */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] font-mono-tech border-t pt-3 sm:pt-4 ${
        isLight ? 'text-stone-600 border-stone-300' : 'text-himalayan-fog/70 border-himalayan-ivory/10'
      }`}>
        <div>
          <span className="text-himalayan-amber block font-semibold">CUISINE</span>
          MODIFIED NEPALI & HAKKA
        </div>
        <div>
          <span className="text-himalayan-amber block font-semibold">ATMOSPHERE</span>
          BRUTALIST MOUNTAIN HEARTH
        </div>
        <div className="hidden md:block">
          <span className="text-himalayan-amber block font-semibold">PRESSURE</span>
          337 MBAR (SAGARMATHA)
        </div>
        <div className="text-right">
          <span className="text-himalayan-amber block font-semibold">STATUS</span>
          {altitude >= 8848 ? 'SANCTUARY READY' : 'ASCENDING...'}
        </div>
      </div>
    </div>
  );
}
