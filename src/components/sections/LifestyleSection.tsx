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
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 [&::-webkit-scrollbar]:hidden">
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
          <div className="col-span-1 lg:col-span-7 flex flex-col justify-center h-full max-h-[520px]">
            
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
            <div className="relative w-full h-[340px] sm:h-[400px] md:h-[450px]">
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

                // Header tab offset: desktop ~44px, mobile ~36px
                // Leaves the top portion of earlier cards visible like Apple indexed folder tabs
                const desktopTopOffset = idx * 42;
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
                    className={`absolute inset-x-0 rounded-2xl sm:rounded-3xl transition-transform duration-100 ease-out cursor-pointer flex flex-col justify-between overflow-hidden backdrop-blur-2xl shadow-2xl ${
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
                      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                        {/* Food Dish Photo Thumbnail */}
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl overflow-hidden border border-white/30 dark:border-white/20 shadow-md shrink-0">
                          <img
                            src={mat.image || '/images/morel_momo.jpg'}
                            alt={mat.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-black/10" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="text-[10px] font-mono-tech font-bold text-himalayan-amber shrink-0">
                              0{idx + 1}
                            </span>
                            <h3
                              className={`font-display text-sm sm:text-lg md:text-xl uppercase tracking-wide font-bold leading-tight truncate ${
                                isLight ? 'text-stone-950' : 'text-himalayan-ivory'
                              }`}
                            >
                              {mat.name}
                            </h3>
                          </div>
                          <span
                            className={`text-[9px] sm:text-[11px] font-mono-tech tracking-wider uppercase block truncate mt-0.5 ${
                              isLight ? 'text-stone-600' : 'text-himalayan-fog'
                            }`}
                          >
                            {mat.origin}
                          </span>
                        </div>
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

                    {/* Card Body & Tactile Details (Visible when this card is in focus) */}
                    <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between overflow-y-auto [&::-webkit-scrollbar]:hidden">
                      <div className="space-y-2 sm:space-y-3">
                        {/* Mobile Food Photo Preview */}
                        <div className="block lg:hidden relative h-24 sm:h-28 w-full rounded-xl overflow-hidden border border-white/20 mb-2 shrink-0 shadow-md">
                          <img
                            src={mat.image || '/images/morel_momo.jpg'}
                            alt={mat.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono-tech text-white">
                            <span className="text-himalayan-amber uppercase tracking-wider font-semibold">
                              {mat.origin}
                            </span>
                            <span className="text-white/80">{CULINARY_CRAFT_TAGS[idx]}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono-tech tracking-widest text-himalayan-amber uppercase font-semibold">
                          <span>PROVENANCE & HARVEST ALTITUDE</span>
                          <span className="hidden sm:inline">DIFC GASTRONOMIC SUITE</span>
                        </div>

                        <p
                          className={`font-sans-clean text-xs sm:text-sm md:text-base leading-relaxed ${
                            isLight ? 'text-stone-800' : 'text-himalayan-bone'
                          }`}
                        >
                          {mat.description}
                        </p>
                      </div>

                      <div className="pt-3 sm:pt-4 border-t border-white/20 dark:border-white/10 space-y-2">
                        {/* Taste Profile */}
                        <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono-tech">
                          <Flame className="w-3.5 h-3.5 text-himalayan-amber shrink-0" />
                          <span className="font-semibold text-himalayan-amber">TASTE PROFILE:</span>
                          <span className={isLight ? 'text-stone-800' : 'text-stone-200'}>
                            {mat.tactileTrait}
                          </span>
                        </div>

                        {/* Culinary Preparation & Pairing */}
                        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono-tech opacity-80">
                          <ArrowUpRight className="w-3 h-3 text-himalayan-amber shrink-0" />
                          <span className="font-medium">PREPARATION:</span>
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
