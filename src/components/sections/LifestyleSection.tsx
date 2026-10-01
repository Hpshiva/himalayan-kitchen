import { useState, useEffect, useRef } from 'react';
import { Compass, Sparkles, Layers, Flame, ArrowUpRight } from 'lucide-react';
import { MATERIAL_TEXTURES } from '../../data/himalayanData';
import { soundEngine } from '../../utils/audio';

interface LifestyleSectionProps {
  theme?: 'dark' | 'light';
}

const CULINARY_PAIRINGS = [
  'Namche wild morels, bone marrow broth, chiseled slate stone presentation',
  'Caramelized juniper glaze, cracked pink pepper, live cedar ember smoke',
  'Cultured yak butter emulsion, foraged alpine herbs, edible mountain bloom',
  '18-hour simmered oxtail consommé, royal Kashmir saffron, hand-pulled noodles',
  'Scorched Kashmiri chili, electric Mustang timur, flash-fried alpine Jimbu',
];

const CULINARY_CRAFT_TAGS = [
  'STONE-PLATED DUMPLING ART',
  'LIVE HEARTH CEDAR ROAST',
  'NOMADIC CULTURED BUTTER CONFIT',
  'SACRED BRASS BONE CONSOMMÉ',
  '800°C ROARING WOK HEI',
];

const DISH_SHORT_NAMES = [
  'Morel Momo',
  'Yak Skewer',
  'Glacial Trout',
  'Saffron Thukpa',
  'Timur Prawns',
];

export function LifestyleSection({ theme = 'dark' }: LifestyleSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isLight = theme === 'light';

  // Track scroll position within this pinned section
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableDist = sectionRef.current.offsetHeight - window.innerHeight;
      if (scrollableDist <= 0) return;
      const p = Math.min(1, Math.max(0, -rect.top / scrollableDist));
      setScrollProgress(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine active top card index based on scroll
  // Card 0: 0.00 - 0.08
  // Card 1: slides up 0.08 - 0.28
  // Card 2: slides up 0.30 - 0.50
  // Card 3: slides up 0.52 - 0.72
  // Card 4: slides up 0.74 - 0.94
  let activeIndex = 0;
  if (scrollProgress >= 0.74) activeIndex = 4;
  else if (scrollProgress >= 0.52) activeIndex = 3;
  else if (scrollProgress >= 0.30) activeIndex = 2;
  else if (scrollProgress >= 0.08) activeIndex = 1;

  const scrollToCard = (index: number) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const scrollableDist = sectionRef.current.offsetHeight - window.innerHeight;
    const targetProgress = index === 0 ? 0.02 : 0.08 + (index - 1) * 0.22 + 0.11;
    const targetScrollY = window.scrollY + rect.top + targetProgress * scrollableDist;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    soundEngine.playSoftTick();
  };

  return (
    <section
      id="lifestyle"
      ref={sectionRef}
      className="relative h-[300vh] w-full pointer-events-auto"
    >
      {/* Sticky Pinned Viewport Container (100dvh safe for mobile and desktop) */}
      <div className="sticky top-0 h-[100dvh] w-full flex flex-col justify-between pt-[58px] sm:pt-[76px] pb-3 sm:pb-6 px-4 sm:px-6 md:px-12 overflow-hidden select-none">
        
        {/* Section Header: Minimal Luxury Editorial */}
        <div className="max-w-7xl mx-auto w-full shrink-0">
          <div
            className={`flex flex-col md:flex-row md:items-end justify-between border-b pb-3 sm:pb-4 gap-2 sm:gap-6 ${
              isLight ? 'border-stone-300' : 'border-white/10'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 text-himalayan-amber text-[10px] sm:text-xs font-mono-tech tracking-[0.25em] sm:tracking-[0.3em] uppercase mb-1 font-semibold">
                <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>CHAPTER 05 — THE LIVING ARCHIVE</span>
              </div>
              <h2
                className={`font-display text-2xl sm:text-3xl md:text-5xl uppercase tracking-tight font-bold ${
                  isLight ? 'text-stone-950' : 'text-himalayan-ivory'
                }`}
              >
                Culinary Art & Gastronomy
              </h2>
            </div>

            {/* Apple Card Stack Step Indicators (Clickable) */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 py-1">
              {MATERIAL_TEXTURES.map((mat, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={mat.id}
                    onClick={() => scrollToCard(idx)}
                    className={`px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-mono-tech tracking-wider uppercase transition-all whitespace-nowrap border ${
                      isActive
                        ? 'bg-himalayan-amber text-white border-himalayan-amber shadow-md shadow-himalayan-amber/25 font-semibold'
                        : isLight
                        ? 'border-stone-300 bg-stone-100/60 text-stone-700 hover:bg-stone-200/60'
                        : 'border-white/10 bg-white/5 text-himalayan-fog hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    0{idx + 1} {DISH_SHORT_NAMES[idx]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2-Column Living Archive Layout */}
        <div className="max-w-7xl mx-auto w-full flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center my-auto py-2 sm:py-4">
          
          {/* Left Column: Visual Lifestyle & Cultural Sanctuary Imagery */}
          <div className="hidden lg:block lg:col-span-5 relative h-full max-h-[500px]">
            <div
              className={`relative h-full rounded-2xl overflow-hidden border shadow-2xl group transition-all ${
                isLight ? 'border-stone-300 bg-stone-900' : 'border-white/15 bg-himalayan-black'
              }`}
            >
              {MATERIAL_TEXTURES.map((mat, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <div
                    key={mat.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                    }`}
                  >
                    <img
                      src={mat.image || '/images/morel_momo.jpg'}
                      alt={mat.name}
                      className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${
                        isActive ? 'scale-100' : 'scale-105'
                      }`}
                      loading={isActive ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>
                );
              })}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent z-20 pointer-events-none" />

              {/* Overlaid Badges */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[9px] font-mono-tech text-himalayan-amber tracking-widest uppercase">
                <Flame className="w-3.5 h-3.5" />
                <span>{CULINARY_CRAFT_TAGS[activeIndex]}</span>
              </div>

              {/* Bottom Active Dish Reflection Badge */}
              <div className="absolute bottom-4 left-4 right-4 z-20 p-4 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-white transition-all">
                <div className="flex items-center justify-between text-[9px] font-mono-tech text-himalayan-amber uppercase tracking-widest mb-1 font-semibold">
                  <span>SIGNATURE CREATION</span>
                  <span>0{activeIndex + 1} // 05</span>
                </div>
                <h4 className="font-display text-base uppercase font-bold text-white mb-1">
                  {MATERIAL_TEXTURES[activeIndex].name}
                </h4>
                <p className="font-editorial text-xs italic text-stone-300 line-clamp-2">
                  “{MATERIAL_TEXTURES[activeIndex].description}”
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Apple Frosted Glass Stacking Cards Deck */}
          <div className="col-span-1 lg:col-span-7 flex flex-col justify-center h-full max-h-[540px]">
            
            {/* Header / Subhead over the stack */}
            <div className="flex items-center justify-between mb-2 sm:mb-3 shrink-0">
              <div className="flex items-center gap-2 text-himalayan-amber text-[10px] sm:text-xs font-mono-tech tracking-[0.25em] uppercase font-semibold">
                <Layers className="w-3.5 h-3.5" />
                <span>THE 5 SIGNATURE CREATIONS • SCROLL TO STACK</span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono-tech tracking-widest text-stone-500 dark:text-himalayan-fog uppercase">
                <span>STACK DECK</span>
                <span className="text-himalayan-amber font-semibold">
                  0{activeIndex + 1} / 05
                </span>
              </div>
            </div>

            {/* Apple Stacking Cards Deck Viewport */}
            {/* Background 3D canvas (canyon river, mountains, white circle snow) softly glimmers through the frosted glass */}
            <div className="relative w-full h-[400px] sm:h-[440px] md:h-[480px] lg:h-[500px]">
              {MATERIAL_TEXTURES.map((mat, idx) => {
                // Stacking physics calculations:
                // Card 0 is always at the base.
                // Cards 1-4 slide UP from the bottom on scroll, landing with an offset that leaves previous card tabs exposed.
                const isBase = idx === 0;
                const startProgress = 0.08 + (idx - 1) * 0.22;
                const endProgress = startProgress + 0.16;

                let translateYPercent = 0;
                let opacity = 1;

                if (!isBase) {
                  if (scrollProgress < startProgress) {
                    translateYPercent = 115; // Off-screen below the deck
                    opacity = 0;
                  } else if (scrollProgress >= startProgress && scrollProgress <= endProgress) {
                    const t = (scrollProgress - startProgress) / 0.16;
                    // Smooth ease-out cubic glide
                    const smoothT = 1 - Math.pow(1 - t, 3);
                    translateYPercent = (1 - smoothT) * 115;
                    opacity = Math.min(1, smoothT * 1.4);
                  } else {
                    translateYPercent = 0; // Fully resting in stacked position
                    opacity = 1;
                  }
                }

                // Compact 24px tab peek (leaves tabs exposed while preserving max body height)
                const desktopTopOffset = idx * 24;
                const isCurrentTop = activeIndex === idx;

                return (
                  <div
                    key={mat.id}
                    onClick={() => scrollToCard(idx)}
                    style={{
                      top: `${desktopTopOffset}px`,
                      height: `calc(100% - ${desktopTopOffset}px)`,
                      transform: `translateY(${translateYPercent}%)`,
                      opacity: opacity,
                      zIndex: 10 + idx,
                    }}
                    className={`absolute inset-x-0 rounded-2xl sm:rounded-3xl transition-transform duration-100 ease-out cursor-pointer flex flex-col justify-between overflow-hidden backdrop-blur-2xl shadow-2xl select-none ${
                      isLight
                        ? 'bg-white/45 border border-white/60 shadow-[0_20px_60px_-15px_rgba(20,30,50,0.12)] text-stone-900'
                        : 'bg-[#0c1017]/50 border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65)] text-white'
                    } ${
                      isCurrentTop
                        ? 'ring-1 sm:ring-2 ring-himalayan-amber/50 shadow-himalayan-amber/10'
                        : 'hover:border-himalayan-amber/30'
                    }`}
                  >
                    {/* Top Specular Edge Highlight (Apple Glass Polish) */}
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none" />

                    {/* Card Header Tab (Always stays exposed when cards stack over it!) */}
                    <div className="p-3 sm:p-4 md:p-5 border-b border-white/20 dark:border-white/10 flex items-center justify-between shrink-0">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 sm:gap-2.5">
                          <span className="text-xs sm:text-sm font-mono-tech font-bold text-himalayan-amber shrink-0">
                            0{idx + 1}
                          </span>
                          <h3
                            className={`font-display text-base sm:text-xl md:text-2xl uppercase tracking-wide font-bold leading-tight truncate ${
                              isLight ? 'text-stone-950' : 'text-himalayan-ivory'
                            }`}
                          >
                            {mat.name}
                          </h3>
                        </div>
                        <span
                          className={`text-[9px] sm:text-[11px] font-mono-tech tracking-wider uppercase block truncate mt-0.5 sm:mt-1 ${
                            isLight ? 'text-stone-600' : 'text-himalayan-fog'
                          }`}
                        >
                          {mat.origin}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="hidden sm:inline-block text-[9px] font-mono-tech text-himalayan-amber tracking-widest uppercase">
                          {isCurrentTop ? 'ACTIVE SPEC' : 'STACK TAB'}
                        </span>
                        <Sparkles
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                            isCurrentTop ? 'text-himalayan-amber' : 'text-stone-400 dark:text-stone-600'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Card Body & Tactile Details - Fully fitted, zero vertical scroll */}
                    <div className="p-3 sm:p-5 md:p-6 flex-1 flex flex-col justify-between overflow-hidden">
                      {/* Mobile / Tablet View (lg:hidden): Rich Media Card with Photo & Story */}
                      <div className="block lg:hidden my-auto">
                        <div className="flex items-center gap-3 sm:gap-4">
                          {/* Dish Cinematic Photo with Glass Finish */}
                          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 border border-white/25 shadow-lg shadow-black/20 group">
                            <img
                              src={mat.image || '/images/morel_momo.jpg'}
                              alt={mat.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                              decoding="async"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[8px] font-mono-tech text-white">
                              <span className="text-himalayan-amber font-bold">0{idx + 1}</span>
                              <span className="text-[8px] uppercase tracking-wider text-white/90 truncate max-w-[65px]">
                                {DISH_SHORT_NAMES[idx]}
                              </span>
                            </div>
                          </div>

                          {/* Provenance & Description */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-mono-tech tracking-wider text-himalayan-amber uppercase font-semibold">
                              <span>PROVENANCE</span>
                              <span className="text-stone-400 dark:text-stone-500 font-normal truncate max-w-[120px]">
                                {CULINARY_CRAFT_TAGS[idx]}
                              </span>
                            </div>

                            <p
                              className={`font-sans-clean text-[11px] sm:text-xs leading-relaxed line-clamp-3 sm:line-clamp-4 ${
                                isLight ? 'text-stone-800' : 'text-himalayan-bone'
                              }`}
                            >
                              {mat.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Desktop View (hidden lg:block): Pure Editorial Layout (Large 500px image frame on left column) */}
                      <div className="hidden lg:block space-y-2.5 my-auto">
                        <div className="flex items-center justify-between text-[10px] font-mono-tech tracking-widest text-himalayan-amber uppercase font-semibold">
                          <span>PROVENANCE & HARVEST ALTITUDE</span>
                          <span className="text-stone-400 dark:text-stone-500 font-normal">
                            {CULINARY_CRAFT_TAGS[idx]}
                          </span>
                        </div>

                        <p
                          className={`font-sans-clean text-sm md:text-base leading-relaxed ${
                            isLight ? 'text-stone-800' : 'text-himalayan-bone'
                          }`}
                        >
                          {mat.description}
                        </p>
                      </div>

                      {/* Shared Bottom Sensory Telemetry (Both Mobile & Desktop) */}
                      <div className="pt-2 sm:pt-3.5 border-t border-white/20 dark:border-white/10 space-y-1 sm:space-y-2 shrink-0">
                        {/* Taste Profile */}
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono-tech">
                          <Flame className="w-3.5 h-3.5 text-himalayan-amber shrink-0" />
                          <span className="font-semibold text-himalayan-amber shrink-0">TASTE:</span>
                          <span className={`truncate ${isLight ? 'text-stone-800' : 'text-stone-200'}`}>
                            {mat.tactileTrait}
                          </span>
                        </div>

                        {/* Culinary Preparation & Pairing */}
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[11px] font-mono-tech opacity-80">
                          <ArrowUpRight className="w-3 h-3 text-himalayan-amber shrink-0" />
                          <span className="font-medium shrink-0">PAIRING:</span>
                          <span className="truncate">
                            {CULINARY_PAIRINGS[idx]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
