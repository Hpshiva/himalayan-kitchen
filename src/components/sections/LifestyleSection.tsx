import { useState } from 'react';
import { Compass, Sparkles, Feather, Layers, Flame } from 'lucide-react';
import { MATERIAL_TEXTURES } from '../../data/himalayanData';
import { soundEngine } from '../../utils/audio';

interface LifestyleSectionProps {
  theme?: 'dark' | 'light';
}

export function LifestyleSection({ theme = 'dark' }: LifestyleSectionProps) {
  const [activeMaterial, setActiveMaterial] = useState(MATERIAL_TEXTURES[0]);
  const isLight = theme === 'light';

  const handleSelectMaterial = (item: typeof MATERIAL_TEXTURES[0]) => {
    setActiveMaterial(item);
    soundEngine.playSoftTick();
  };

  return (
    <section
      id="lifestyle"
      className="relative min-h-screen w-full py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 flex flex-col justify-center pointer-events-auto"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between border-b pb-4 sm:pb-6 mb-8 sm:mb-16 gap-4 sm:gap-6 ${
          isLight ? 'border-stone-300' : 'border-himalayan-ivory/10'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-himalayan-amber text-xs font-mono-tech tracking-[0.3em] uppercase mb-2">
              <Compass className="w-4 h-4" />
              <span>CHAPTER 05 — THE LIVING ARCHIVE</span>
            </div>
            <h2 className={`font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight ${
              isLight ? 'text-stone-900' : 'text-himalayan-ivory'
            }`}>
              Materiality & Lifestyle
            </h2>
          </div>

          <div className={`max-w-md text-xs font-mono-tech tracking-widest uppercase ${
            isLight ? 'text-stone-600' : 'text-himalayan-fog'
          }`}>
            THE RESTAURANT IS BUILT AS A MOUNTAIN HABITAT. EVERY TEXTURE HONORS NOMADIC RESILIENCE, SACRED METALLURGY, AND HIGH-ALTITUDE FORESTRY.
          </div>
        </div>

        {/* 2-Column Living Archive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Visual Lifestyle & Cultural Sanctuary Imagery */}
          <div className="lg:col-span-6 relative">
            <div className={`relative rounded-2xl overflow-hidden border shadow-2xl group ${
              isLight ? 'border-stone-300 bg-stone-900' : 'border-himalayan-ivory/15 bg-himalayan-black'
            }`}>
              <div className="relative h-[300px] sm:h-[420px] md:h-[560px] w-full overflow-hidden">
                <img
                  src="/images/lifestyle_culture.jpg"
                  alt="Himalayan Lifestyle, Yak Wool & Mountain Herbs"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-80" />

                {/* Overlaid Badges */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[9px] sm:text-[10px] font-mono-tech text-himalayan-amber tracking-widest uppercase">
                  <Feather className="w-3.5 h-3.5" />
                  <span>NOMADIC CRAFTSMANSHIP</span>
                </div>

                {/* Bottom Narrative Badge */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-3.5 sm:p-5 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 text-white">
                  <span className="text-[9px] sm:text-[10px] font-mono-tech text-himalayan-amber uppercase tracking-widest block mb-1 font-semibold">
                    CRAFT PHILOSOPHY
                  </span>
                  <p className="font-editorial text-xs sm:text-base italic text-stone-200">
                    “In the high mountains, objects must withstand biting frost and woodsmoke. We build only with materials that age with dignified grace.”
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Tactile Material Palette */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-4 sm:space-y-6">
            <div>
              <div className="flex items-center gap-2 text-himalayan-amber text-xs font-mono-tech tracking-[0.25em] uppercase mb-1.5 sm:mb-2">
                <Layers className="w-4 h-4" />
                <span>INTERACTIVE SENSORY BOARD</span>
              </div>
              <h3 className={`font-display text-xl sm:text-3xl md:text-4xl uppercase tracking-wide ${
                isLight ? 'text-stone-900' : 'text-himalayan-ivory'
              }`}>
                The Tactile Elements
              </h3>
            </div>

            {/* Material Selectors */}
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {MATERIAL_TEXTURES.map((mat) => (
                <div
                  key={mat.id}
                  onClick={() => handleSelectMaterial(mat)}
                  className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                    activeMaterial.id === mat.id
                      ? isLight
                        ? 'border-himalayan-amber bg-stone-100 shadow-lg translate-x-1 sm:translate-x-2'
                        : 'border-himalayan-amber bg-himalayan-charcoal/80 shadow-xl translate-x-1 sm:translate-x-2'
                      : isLight
                      ? 'border-stone-300 bg-stone-200/40 hover:border-stone-400'
                      : 'border-himalayan-ivory/10 bg-himalayan-void/40 hover:border-himalayan-ivory/30'
                  }`}
                  data-cursor="TOUCH"
                >
                  <div>
                    <h4 className={`font-display text-sm sm:text-base md:text-lg uppercase ${
                      isLight ? 'text-stone-900' : 'text-himalayan-ivory'
                    }`}>
                      {mat.name}
                    </h4>
                    <span className={`text-[11px] sm:text-xs font-mono-tech ${isLight ? 'text-stone-500' : 'text-himalayan-fog'}`}>
                      {mat.origin}
                    </span>
                  </div>
                  <Sparkles
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                      activeMaterial.id === mat.id ? 'text-himalayan-amber' : 'text-himalayan-amber/30'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Active Material Deep Inspection Card */}
            <div className={`p-4 sm:p-6 rounded-xl border backdrop-blur-md space-y-2.5 sm:space-y-3 ${
              isLight
                ? 'border-himalayan-amber/40 bg-stone-200/60'
                : 'border-himalayan-amber/30 bg-himalayan-charcoal/50'
            }`}>
              <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono-tech tracking-widest text-himalayan-amber uppercase font-semibold">
                <span>PROVENANCE: {activeMaterial.origin}</span>
                <span className="hidden sm:inline">ARCHITECTURAL SPEC</span>
              </div>
              <p className={`text-xs md:text-sm font-sans-clean leading-relaxed ${
                isLight ? 'text-stone-700' : 'text-himalayan-fog'
              }`}>
                {activeMaterial.description}
              </p>
              <div className={`pt-2 border-t flex items-center gap-2 text-[11px] sm:text-xs font-mono-tech ${
                isLight ? 'border-stone-300 text-stone-900' : 'border-himalayan-ivory/10 text-himalayan-bone'
              }`}>
                <Flame className="w-3.5 h-3.5 text-himalayan-amber" />
                <span>TACTILE QUALITY: {activeMaterial.tactileTrait}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
