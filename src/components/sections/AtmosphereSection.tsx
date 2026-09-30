import { useState } from 'react';
import { Compass, Flame, Users, Sparkles, ArrowRight } from 'lucide-react';
import { DINING_SPACES } from '../../data/himalayanData';

interface AtmosphereSectionProps {
  onReserve: () => void;
  theme?: 'dark' | 'light';
}

export function AtmosphereSection({ onReserve, theme = 'dark' }: AtmosphereSectionProps) {
  const [activeSpace, setActiveSpace] = useState(DINING_SPACES[0]);
  const isLight = theme === 'light';

  return (
    <section
      id="atmosphere"
      className="relative min-h-screen w-full py-32 px-6 md:px-12 flex flex-col justify-center pointer-events-auto"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between border-b pb-6 mb-16 gap-6 ${
          isLight ? 'border-stone-300' : 'border-himalayan-ivory/10'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-himalayan-amber text-xs font-mono-tech tracking-[0.3em] uppercase mb-2">
              <Compass className="w-4 h-4" />
              <span>CHAPTER 06 — SPATIAL ARCHITECTURE</span>
            </div>
            <h2 className={`font-display text-3xl md:text-5xl lg:text-6xl uppercase tracking-tight ${
              isLight ? 'text-stone-900' : 'text-himalayan-ivory'
            }`}>
              The Restaurant
            </h2>
          </div>

          <div className={`max-w-md text-xs font-mono-tech tracking-widest uppercase ${
            isLight ? 'text-stone-600' : 'text-himalayan-fog'
          }`}>
            STEP FROM THE RAW MOUNTAIN PASS INTO THE LOW-LIT WARMTH OF THE HEARTH. AN ARCHITECTURAL MONUMENT TO FIRE, STONE, AND INTROSPECTION.
          </div>
        </div>

        {/* Master Architectural Feature Frame */}
        <div className={`relative rounded-3xl overflow-hidden border shadow-2xl mb-16 ${
          isLight ? 'border-stone-300 bg-stone-900' : 'border-himalayan-ivory/20 bg-himalayan-black'
        }`}>
          <div className="relative h-[480px] md:h-[640px] w-full overflow-hidden">
            <img
              src="/images/restaurant_interior.jpg"
              alt="Himalayan Kitchen Restaurant Interior Hearth"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

            {/* Overlaid Sanctuary Info */}
            <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-between text-white">
              <div className="flex justify-between items-start">
                <span className="px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-himalayan-amber/50 text-xs font-mono-tech text-himalayan-amber tracking-[0.25em] uppercase font-semibold">
                  BRUTALIST MOUNTAIN INTERIOR
                </span>
                <span className="hidden sm:inline-block px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-xs font-mono-tech text-stone-200 tracking-widest">
                  SEATING CAPACITY: 68 SEATS
                </span>
              </div>

              <div className="max-w-2xl">
                <span className="text-xs font-mono-tech tracking-[0.3em] text-himalayan-amber uppercase block mb-2 font-semibold">
                  THE SPATIAL MOMENT
                </span>
                <h3 className="font-display text-2xl sm:text-4xl md:text-5xl uppercase tracking-wide leading-tight mb-4 text-white">
                  Where Fire Meets The Eternal Snow
                </h3>
                <p className="font-editorial text-lg md:text-2xl text-stone-200 italic leading-relaxed mb-6">
                  “Built entirely from quarried black slate and smoke-cured timber. A roaring open hearth anchors the room while floor-to-ceiling glass reveals the moonlit mountain ridgeline.”
                </p>

                <button
                  onClick={onReserve}
                  className="px-8 py-3.5 rounded-full bg-himalayan-amber hover:bg-himalayan-ember text-white text-xs font-mono-tech tracking-[0.25em] uppercase transition-all duration-300 shadow-xl flex items-center gap-3"
                  data-cursor="RESERVE"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>REQUEST TABLE SANCTUARY</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Dining Sanctuaries Detail Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DINING_SPACES.map((space) => {
            const isSelected = activeSpace.id === space.id;

            return (
              <div
                key={space.id}
                onClick={() => setActiveSpace(space)}
                className={`p-6 md:p-8 rounded-2xl border transition-all duration-500 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? isLight
                      ? 'border-himalayan-amber bg-stone-100 shadow-xl -translate-y-2'
                      : 'border-himalayan-amber bg-himalayan-charcoal/80 shadow-2xl -translate-y-2'
                    : isLight
                    ? 'border-stone-300 bg-stone-200/40 hover:border-stone-400'
                    : 'border-himalayan-ivory/10 bg-himalayan-void/60 hover:border-himalayan-ivory/30'
                }`}
                data-cursor="SPACE"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono-tech text-himalayan-amber tracking-widest uppercase mb-3 font-semibold">
                    <span>{space.subtitle}</span>
                    <Flame className={`w-3.5 h-3.5 ${isSelected ? 'text-himalayan-amber' : 'text-himalayan-amber/30'}`} />
                  </div>
                  <h4 className={`font-display text-xl md:text-2xl uppercase tracking-wide mb-2 ${
                    isLight ? 'text-stone-900' : 'text-himalayan-ivory'
                  }`}>
                    {space.title}
                  </h4>
                  <p className={`text-xs font-sans-clean leading-relaxed mb-4 ${
                    isLight ? 'text-stone-600' : 'text-himalayan-fog'
                  }`}>
                    {space.description}
                  </p>
                </div>

                <div className={`pt-4 border-t flex items-center justify-between text-[11px] font-mono-tech ${
                  isLight ? 'border-stone-300 text-stone-800' : 'border-himalayan-ivory/10 text-himalayan-bone'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-himalayan-amber" />
                    <span>{space.capacity}</span>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 ${isLight ? 'text-stone-400' : 'text-himalayan-fog'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
