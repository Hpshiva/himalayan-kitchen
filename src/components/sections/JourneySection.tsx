import { useState } from 'react';
import { Compass, Flame, Wind, Mountain } from 'lucide-react';
import { NARRATIVE_STOPS } from '../../data/himalayanData';

interface JourneySectionProps {
  theme?: 'dark' | 'light';
}

export function JourneySection({ theme = 'dark' }: JourneySectionProps) {
  const [activeStop, setActiveStop] = useState(0);
  const isLight = theme === 'light';

  return (
    <section
      id="journey"
      className="relative min-h-screen w-full py-20 sm:py-28 md:py-36 px-4 sm:px-6 md:px-12 flex flex-col justify-center pointer-events-auto overflow-hidden"
    >
      {/* Seamless Atmosphere Wash: gives 100% text contrast without needing any boxes or cards */}
      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-700 ${
          isLight
            ? 'bg-[#f2eee6]/90 backdrop-blur-md'
            : 'bg-[#050607]/85 backdrop-blur-md'
        }`}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section Header: Pure Editorial Layout (No box) */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between border-b pb-6 sm:pb-8 mb-10 sm:mb-14 gap-4 sm:gap-8 ${
            isLight ? 'border-stone-300' : 'border-white/10'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-himalayan-amber text-xs font-mono-tech tracking-[0.3em] uppercase mb-2 font-semibold">
              <Compass className="w-4 h-4" />
              <span>CHAPTER 02 — THE GENESIS</span>
            </div>
            <h2
              className={`font-display text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight font-bold ${
                isLight ? 'text-stone-950' : 'text-himalayan-ivory'
              }`}
            >
              The Himalayan Journey
            </h2>
          </div>

          <div
            className={`max-w-md text-xs font-mono-tech tracking-widest uppercase leading-relaxed ${
              isLight ? 'text-stone-700 font-medium' : 'text-himalayan-fog'
            }`}
          >
            ELEVATION TRANSCENDS INGREDIENTS. WE BRING THE FORGOTTEN MOUNTAIN ESSENCE FROM HIGH GLACIERS TO YOUR PALATE.
          </div>
        </div>

        {/* Central Manifesto Triad: 3 Clean Editorial Columns (No box cards!) */}
        <div
          className={`my-10 sm:my-14 py-8 sm:py-12 border-b grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 ${
            isLight ? 'border-stone-300' : 'border-white/10'
          }`}
        >
          {/* Column 1: Origin */}
          <div
            className={`flex flex-col md:pr-8 lg:pr-12 md:border-r ${
              isLight ? 'border-stone-300' : 'border-white/10'
            }`}
          >
            <span className="text-[11px] font-mono-tech text-himalayan-amber font-bold tracking-[0.25em] uppercase mb-2 block">
              [ 01 ORIGIN ]
            </span>
            <h3
              className={`font-display text-xl sm:text-2xl lg:text-3xl tracking-wide uppercase mb-3 font-bold ${
                isLight ? 'text-stone-950' : 'text-himalayan-ivory'
              }`}
            >
              Born From The Mountains
            </h3>
            <p
              className={`text-xs sm:text-sm font-sans-clean leading-relaxed ${
                isLight ? 'text-stone-700' : 'text-himalayan-fog'
              }`}
            >
              Forged in the shadow of peaks that touch the stratosphere, where icy winds sculpt resilient ecosystems and mineral-rich glacial soils.
            </p>
          </div>

          {/* Column 2: Heritage */}
          <div
            className={`flex flex-col md:px-8 lg:px-12 md:border-r ${
              isLight ? 'border-stone-300' : 'border-white/10'
            }`}
          >
            <span className="text-[11px] font-mono-tech text-himalayan-amber font-bold tracking-[0.25em] uppercase mb-2 block">
              [ 02 HERITAGE ]
            </span>
            <h3
              className={`font-display text-xl sm:text-2xl lg:text-3xl tracking-wide uppercase mb-3 font-bold ${
                isLight ? 'text-stone-950' : 'text-himalayan-ivory'
              }`}
            >
              Inspired By The People
            </h3>
            <p
              className={`text-xs sm:text-sm font-sans-clean leading-relaxed ${
                isLight ? 'text-stone-700' : 'text-himalayan-fog'
              }`}
            >
              Carrying forward centuries of nomadic preservation, sun-cured ferments, and fireside mountain hospitality across high Himalayan passes.
            </p>
          </div>

          {/* Column 3: Elevation */}
          <div className="flex flex-col md:pl-8 lg:pl-12">
            <span className="text-[11px] font-mono-tech text-himalayan-amber font-bold tracking-[0.25em] uppercase mb-2 block">
              [ 03 ELEVATION ]
            </span>
            <h3
              className={`font-display text-xl sm:text-2xl lg:text-3xl tracking-wide uppercase mb-3 font-bold ${
                isLight ? 'text-stone-950' : 'text-himalayan-ivory'
              }`}
            >
              Reimagined For The Table
            </h3>
            <p
              className={`text-xs sm:text-sm font-sans-clean leading-relaxed ${
                isLight ? 'text-stone-700' : 'text-himalayan-fog'
              }`}
            >
              Refined through modern culinary architecture, marrying ancient ferments with roaring wok hei fire and Michelin-level precision in DIFC.
            </p>
          </div>
        </div>

        {/* Interactive Narrative Explorer with Mountain Image & Deep Story */}
        <div className="mt-10 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
          {/* Left Column: Sleek Editorial List Items (No bulky boxes) */}
          <div className="lg:col-span-5 flex flex-col gap-2.5 sm:gap-3">
            {NARRATIVE_STOPS.map((stop, idx) => {
              const isActive = activeStop === idx;
              return (
                <div
                  key={stop.number}
                  onClick={() => setActiveStop(idx)}
                  className={`py-3.5 px-4 sm:px-5 rounded-lg transition-all duration-300 cursor-pointer border-l-2 ${
                    isActive
                      ? isLight
                        ? 'border-l-himalayan-amber bg-stone-200/60 pl-5 sm:pl-6'
                        : 'border-l-himalayan-amber bg-white/10 pl-5 sm:pl-6'
                      : isLight
                      ? 'border-l-stone-300/60 hover:border-l-stone-400 hover:bg-stone-200/30'
                      : 'border-l-white/10 hover:border-l-white/30 hover:bg-white/5'
                  }`}
                  data-cursor="EXPEDITION"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono-tech text-[10px] tracking-[0.25em] text-himalayan-amber font-semibold uppercase">
                      {stop.tag}
                    </span>
                    <span className={`font-mono-tech text-[10px] ${isLight ? 'text-stone-500' : 'text-himalayan-fog/60'}`}>
                      STOP {stop.number}
                    </span>
                  </div>
                  <h4
                    className={`font-display text-base sm:text-lg uppercase tracking-wide font-bold ${
                      isLight ? 'text-stone-950' : 'text-himalayan-ivory'
                    }`}
                  >
                    {stop.title}
                  </h4>
                  <p
                    className={`text-xs font-editorial italic mt-0.5 ${
                      isLight ? 'text-stone-700' : 'text-himalayan-bone'
                    }`}
                  >
                    {stop.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Visual Stage with Mountain Backdrop & Poetic Readout */}
          <div
            className={`lg:col-span-7 relative rounded-2xl overflow-hidden border shadow-2xl group ${
              isLight ? 'border-stone-300 bg-stone-900 text-white' : 'border-himalayan-ivory/15 bg-himalayan-black'
            }`}
          >
            <div className="relative h-[340px] sm:h-[420px] md:h-[480px] w-full overflow-hidden">
              <img
                src="/images/peaks_mist.jpg"
                alt="Himalayan Mountain Landscape"
                className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent" />

              {/* Floating Readout Content */}
              <div className="absolute inset-0 p-5 sm:p-8 md:p-12 flex flex-col justify-end text-white">
                <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-3 py-1 rounded-full border border-himalayan-amber/50 bg-himalayan-amber/20 w-fit">
                  <Mountain className="w-3.5 h-3.5 text-himalayan-amber" />
                  <span className="text-[10px] font-mono-tech tracking-[0.25em] text-himalayan-ivory uppercase">
                    {NARRATIVE_STOPS[activeStop].tag}
                  </span>
                </div>

                <blockquote className="font-editorial text-lg sm:text-2xl md:text-3xl text-stone-100 italic leading-snug mb-3 sm:mb-4">
                  “{NARRATIVE_STOPS[activeStop].quote}”
                </blockquote>

                <p className="font-sans-clean text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
                  {NARRATIVE_STOPS[activeStop].desc}
                </p>

                <div className="flex items-center gap-4 sm:gap-6 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10 text-[10px] font-mono-tech text-stone-300">
                  <div className="flex items-center gap-2">
                    <Wind className="w-3.5 h-3.5 text-himalayan-amber" />
                    <span>ALTITUDE BOTANICALS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-himalayan-amber" />
                    <span>SLOW CEDAR SMOKE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
