import { useState } from 'react';
import { Compass, Mountain } from 'lucide-react';

interface AltitudeScrollRailProps {
  scrollProgress: number;
  currentChapter: string;
  theme?: 'dark' | 'light';
  onNavigate: (sectionId: string) => void;
}

interface Waypoint {
  id: string;
  number: string;
  label: string;
  altitude: string;
  progress: number;
}

const WAYPOINTS: Waypoint[] = [
  { id: 'hero', number: '01', label: 'SUMMIT', altitude: '8,848M', progress: 0.0 },
  { id: 'journey', number: '02', label: 'GENESIS', altitude: '6,200M', progress: 0.25 },
  { id: 'cuisine', number: '03', label: 'DUAL CUISINE', altitude: '4,500M', progress: 0.45 },
  { id: 'food-story', number: '04', label: 'HARVEST', altitude: '3,800M', progress: 0.65 },
  { id: 'lifestyle', number: '05', label: 'CRAFT', altitude: '2,400M', progress: 0.82 },
  { id: 'atmosphere', number: '06', label: 'SANCTUARY', altitude: '1,400M', progress: 0.95 },
];

export function AltitudeScrollRail({
  scrollProgress,
  currentChapter,
  theme = 'light',
  onNavigate,
}: AltitudeScrollRailProps) {
  const [hoveredWaypoint, setHoveredWaypoint] = useState<string | null>(null);
  const isLight = theme === 'light';

  // Calculate live descent altitude from 8,848m down to DIFC (sea level)
  const currentElevation = Math.max(0, Math.round(8848 - scrollProgress * 8800));

  const scrollToTop = () => {
    onNavigate('hero');
  };

  return (
    <aside
      aria-label="Altitude Scroll Navigation"
      className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center select-none pointer-events-auto"
    >
      <div
        className={`relative flex flex-col items-center py-4 px-2 rounded-full border backdrop-blur-xl shadow-2xl transition-all duration-300 ${
          isLight
            ? 'bg-stone-100/80 border-stone-300/80 text-stone-900 shadow-stone-400/20'
            : 'bg-himalayan-void/85 border-himalayan-ivory/15 text-himalayan-ivory shadow-black/60'
        }`}
      >
        {/* Top: Mountain Peak / Return to Summit */}
        <button
          onClick={scrollToTop}
          title="Return to High Summit (8,848m)"
          className={`p-1.5 rounded-full transition-colors mb-2 text-himalayan-amber hover:scale-110 active:scale-95 ${
            isLight ? 'hover:bg-stone-200/60' : 'hover:bg-white/10'
          }`}
          data-cursor="SUMMIT"
          aria-label="Scroll to Summit"
        >
          <Mountain className="w-3.5 h-3.5" />
        </button>

        {/* Live Altitude Readout */}
        <div className="flex flex-col items-center mb-3">
          <span className="font-mono-tech text-[8px] tracking-wider text-himalayan-amber font-semibold">
            {currentElevation > 50 ? `${currentElevation.toLocaleString()}M` : 'DIFC'}
          </span>
          <span className={`font-mono-tech text-[7px] tracking-widest uppercase ${
            isLight ? 'text-stone-500' : 'text-himalayan-fog'
          }`}>
            ALT
          </span>
        </div>

        {/* Central Vertical Rail Track */}
        <div className="relative w-7 h-48 sm:h-56 flex justify-center items-center">
          {/* Background Groove */}
          <div
            className={`absolute top-0 bottom-0 w-[1.5px] rounded-full ${
              isLight ? 'bg-stone-300' : 'bg-white/15'
            }`}
          />

          {/* Active Progress Fill */}
          <div
            className="absolute top-0 w-[2px] rounded-full bg-gradient-to-b from-himalayan-amber to-himalayan-ember transition-all duration-75"
            style={{
              height: `${Math.min(100, Math.max(0, scrollProgress * 100))}%`,
            }}
          />

          {/* Sliding Glowing Altitude Bead */}
          <div
            className="absolute w-3 h-3 rounded-full bg-himalayan-amber border-2 border-white shadow-lg shadow-himalayan-amber/60 -translate-x-1/2 -translate-y-1/2 transition-all duration-75 pointer-events-none"
            style={{
              left: '50%',
              top: `${Math.min(100, Math.max(0, scrollProgress * 100))}%`,
            }}
          />

          {/* Waypoints along the Descent Route */}
          {WAYPOINTS.map((wp) => {
            const isActive = currentChapter.includes(wp.label);
            const isPassed = scrollProgress >= wp.progress;

            return (
              <div
                key={wp.id}
                className="absolute -translate-y-1/2 flex items-center group cursor-pointer"
                style={{
                  top: `${wp.progress * 100}%`,
                }}
                onMouseEnter={() => setHoveredWaypoint(wp.id)}
                onMouseLeave={() => setHoveredWaypoint(null)}
                onClick={() => onNavigate(wp.id)}
              >
                {/* Waypoint Dot */}
                <button
                  className={`w-2 h-2 rounded-full border transition-all duration-300 ${
                    isActive
                      ? 'w-2.5 h-2.5 bg-himalayan-amber border-white shadow-md shadow-himalayan-amber/50 scale-125'
                      : isPassed
                      ? 'bg-himalayan-amber/70 border-himalayan-amber'
                      : isLight
                      ? 'bg-stone-200 border-stone-400 hover:border-himalayan-amber'
                      : 'bg-stone-800 border-white/30 hover:border-himalayan-amber'
                  }`}
                  data-cursor={wp.label}
                  aria-label={`Jump to ${wp.label}`}
                />

                {/* Floating Chapter Tooltip on Hover */}
                {hoveredWaypoint === wp.id && (
                  <div
                    className={`absolute right-6 px-3 py-1 rounded-lg border backdrop-blur-md shadow-xl whitespace-nowrap z-50 text-[9px] font-mono-tech tracking-wider pointer-events-none animate-fadeIn ${
                      isLight
                        ? 'bg-stone-100/95 border-stone-300 text-stone-900'
                        : 'bg-black/90 border-white/15 text-white'
                    }`}
                  >
                    <span className="text-himalayan-amber font-semibold">{wp.number} // </span>
                    <span className="font-bold">{wp.label}</span>
                    <span className="opacity-60 ml-1.5">• {wp.altitude}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Destination (DIFC Compass) */}
        <button
          onClick={() => onNavigate('atmosphere')}
          title="Descent Complete: DIFC Hearth (Dubai)"
          className={`p-1.5 rounded-full transition-colors mt-2 text-himalayan-amber hover:scale-110 active:scale-95 ${
            isLight ? 'hover:bg-stone-200/60' : 'hover:bg-white/10'
          }`}
          data-cursor="HEARTH"
          aria-label="Scroll to Sanctuary"
        >
          <Compass className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
