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
      className="relative min-h-screen w-full py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 flex flex-col justify-center pointer-events-auto"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header with Altitude Stamp */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between border-b pb-4 sm:pb-6 mb-8 sm:mb-16 gap-4 sm:gap-6 ${
          isLight ? 'border-stone-300' : 'border-himalayan-ivory/10'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-himalayan-amber text-xs font-mono-tech tracking-[0.3em] uppercase mb-2">
              <Compass className="w-4 h-4" />
              <span>CHAPTER 02 — THE GENESIS</span>
            </div>
            <h2 className={`font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight ${
              isLight ? 'text-stone-900' : 'text-himalayan-ivory'
            }`}>
              The Himalayan Journey
            </h2>
          </div>

          <div className={`max-w-md text-xs font-mono-tech tracking-widest uppercase ${
            isLight ? 'text-stone-600' : 'text-himalayan-fog'
          }`}>
            ELEVATION TRANSCENDS INGREDIENTS. WE BRING THE FORGOTTEN MOUNTAIN ESSENCE FROM HIGH GLACIERS TO YOUR PALATE.
          </div>
        </div>

        {/* Central Monumental Manifesto Triad */}
        <div className={`my-8 sm:my-12 py-6 sm:py-8 border-y grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center md:text-left ${
          isLight ? 'border-stone-300' : 'border-himalayan-ivory/10'
        }`}>
          <div className="group">
            <span className="text-[10px] font-mono-tech text-himalayan-amber tracking-[0.3em] block mb-1.5 font-semibold">
              [ 01 ORIGIN ]
            </span>
            <h3 className={`font-display text-lg sm:text-xl md:text-2xl tracking-wider uppercase mb-1.5 ${
              isLight ? 'text-stone-900' : 'text-himalayan-ivory'
            }`}>
              Born From The Mountains
            </h3>
            <p className={`text-xs font-sans-clean leading-relaxed ${
              isLight ? 'text-stone-600' : 'text-himalayan-fog'
            }`}>
              Forged in the shadow of peaks that touch the stratosphere, where icy winds sculpt resilient ecosystems.
            </p>
          </div>

          <div className="group">
            <span className="text-[10px] font-mono-tech text-himalayan-amber tracking-[0.3em] block mb-1.5 font-semibold">
              [ 02 HERITAGE ]
            </span>
            <h3 className={`font-display text-lg sm:text-xl md:text-2xl tracking-wider uppercase mb-1.5 ${
              isLight ? 'text-stone-900' : 'text-himalayan-ivory'
            }`}>
              Inspired By The People
            </h3>
            <p className={`text-xs font-sans-clean leading-relaxed ${
              isLight ? 'text-stone-600' : 'text-himalayan-fog'
            }`}>
              Carrying forward centuries of nomadic preservation, sun-cured ferments, and fireside mountain hospitality.
            </p>
          </div>

          <div className="group">
            <span className="text-[10px] font-mono-tech text-himalayan-amber tracking-[0.3em] block mb-1.5 font-semibold">
              [ 03 ELEVATION ]
            </span>
            <h3 className={`font-display text-lg sm:text-xl md:text-2xl tracking-wider uppercase mb-1.5 ${
              isLight ? 'text-stone-900' : 'text-himalayan-ivory'
            }`}>
              Reimagined For The Table
            </h3>
            <p className={`text-xs font-sans-clean leading-relaxed ${
              isLight ? 'text-stone-600' : 'text-himalayan-fog'
            }`}>
              Refined through modern culinary architecture, marrying ancient ferments with wok hei fire and Michelin-level precision.
            </p>
          </div>
        </div>

        {/* Interactive Narrative Explorer with Mountain Image & Deep Story */}
        <div className="mt-8 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Column: Interactive Chapter Selectors */}
          <div className="lg:col-span-5 flex flex-col gap-3 sm:gap-4">
            {NARRATIVE_STOPS.map((stop, idx) => (
              <div
                key={stop.number}
                onClick={() => setActiveStop(idx)}
                className={`p-4 sm:p-6 rounded-xl border transition-all duration-500 cursor-pointer ${
                  activeStop === idx
                    ? isLight
                      ? 'border-himalayan-amber bg-stone-100 shadow-xl translate-x-1 sm:translate-x-2'
                      : 'border-himalayan-amber bg-himalayan-charcoal/80 shadow-2xl translate-x-1 sm:translate-x-2'
                    : isLight
                    ? 'border-stone-300 bg-stone-200/40 hover:border-stone-400'
                    : 'border-himalayan-ivory/10 bg-himalayan-void/60 hover:border-himalayan-ivory/30'
                }`}
                data-cursor="EXPEDITION"
              >
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <span className="font-mono-tech text-xs tracking-[0.25em] text-himalayan-amber font-semibold">
                    {stop.tag}
                  </span>
                  <span className={`font-mono-tech text-xs ${isLight ? 'text-stone-400' : 'text-himalayan-fog/60'}`}>
                    STOP {stop.number}
                  </span>
                </div>
                <h4 className={`font-display text-lg sm:text-xl uppercase tracking-wide mb-0.5 sm:mb-1 ${
                  isLight ? 'text-stone-900' : 'text-himalayan-ivory'
                }`}>
                  {stop.title}
                </h4>
                <p className={`text-xs font-editorial italic ${
                  isLight ? 'text-stone-700' : 'text-himalayan-bone'
                }`}>
                  {stop.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Visual Stage with Mountain Backdrop & Poetic Readout */}
          <div className={`lg:col-span-7 relative rounded-2xl overflow-hidden border shadow-2xl group ${
            isLight ? 'border-stone-300 bg-stone-900 text-white' : 'border-himalayan-ivory/15 bg-himalayan-black'
          }`}>
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
