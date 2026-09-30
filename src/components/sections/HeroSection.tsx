import { useState, useEffect } from 'react';
import { ArrowDown, Compass, Mountain, Sparkles, Volume2, VolumeX, Eye, Wind, Flame, Layers } from 'lucide-react';
import { soundEngine } from '../../utils/audio';
import type { Dish } from '../../types';
import { DISHES } from '../../data/himalayanData';

interface HeroSectionProps {
  onExplore: () => void;
  onStory: () => void;
  onReserve: () => void;
  onSelectDish: (dish: Dish) => void;
  theme?: 'dark' | 'light';
  heroProgress: number;
  activeCategory: 'nepali' | 'indochinese' | 'botanical';
  onCategoryChange: (cat: 'nepali' | 'indochinese' | 'botanical') => void;
}

export function HeroSection({
  onStory,
  onReserve,
  onSelectDish,
  theme = 'light',
  heroProgress,
  activeCategory,
  onCategoryChange,
}: HeroSectionProps) {
  const [isPlayingSound, setIsPlayingSound] = useState(!soundEngine.getMuted());
  const [altarTilt, setAltarTilt] = useState({ x: 0, y: 0 });
  const isLight = theme === 'light';

  useEffect(() => {
    const unsubscribe = soundEngine.subscribe((active) => {
      setIsPlayingSound(active);
    });
    return unsubscribe;
  }, []);

  const handleHeroSoundClick = () => {
    const active = soundEngine.toggleMute();
    setIsPlayingSound(active);
  };

  const handleDialectChange = (cat: 'nepali' | 'indochinese' | 'botanical') => {
    onCategoryChange(cat);
    // Play harmonic frequencies tuned to dialect
    if (cat === 'nepali') soundEngine.playSingingBowl(432, 2.8);
    else if (cat === 'indochinese') soundEngine.playSingingBowl(528, 2.2);
    else soundEngine.playSingingBowl(639, 3.2);
  };

  const currentDish = DISHES.find((d) => d.category === activeCategory) || DISHES[0];

  // Stage thresholds:
  // Stage 1 (High Summit & Parting Gates): 0.00 - 0.28
  // Stage 2 (The Sacred Altar & 3 Dialects): 0.25 - 0.82
  // Stage 3 (Descent into Chapter 01): 0.82 - 1.00
  const isSummitStage = heroProgress < 0.28;
  const isAltarStage = heroProgress >= 0.22 && heroProgress < 0.84;
  const isDescentStage = heroProgress >= 0.82;

  // Tectonic slide offsets for typography parting
  const tectonicOffset = Math.min(1, heroProgress * 3.4);
  const leftShift = tectonicOffset * 120;
  const rightShift = tectonicOffset * 120;
  const summitOpacity = Math.max(0, 1 - heroProgress * 3.6);

  // Altar UI opacity curve
  let altarOpacity = 0;
  if (heroProgress >= 0.22 && heroProgress <= 0.34) {
    altarOpacity = (heroProgress - 0.22) / 0.12;
  } else if (heroProgress > 0.34 && heroProgress < 0.78) {
    altarOpacity = 1;
  } else if (heroProgress >= 0.78 && heroProgress < 0.84) {
    altarOpacity = 1 - (heroProgress - 0.78) / 0.06;
  }

  // Descent stage opacity
  const descentOpacity = heroProgress >= 0.82 ? Math.min(1, (heroProgress - 0.82) / 0.12) : 0;

  return (
    <section id="hero" className="relative h-[290vh] w-full">
      {/* Sticky Pinned Viewport Container */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between pt-[58px] sm:pt-[70px] md:pt-[78px] pb-3 sm:pb-5 px-3 sm:px-6 md:px-12 overflow-hidden pointer-events-auto select-none">
        
        {/* Top Meta Line: Geolocation & Elevation Badges */}
        <div
          className={`shrink-0 flex items-center justify-between text-[9px] sm:text-[11px] font-mono-tech tracking-[0.18em] sm:tracking-[0.25em] border-b py-1.5 sm:py-2 gap-2 sm:gap-4 z-20 transition-colors ${
            isLight ? 'border-stone-300 text-stone-600' : 'border-himalayan-ivory/10 text-himalayan-fog'
          }`}
        >
          <div className="inline-flex items-center gap-2 sm:gap-2.5 h-6 sm:h-7 leading-none">
            <Mountain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-himalayan-amber shrink-0 -translate-y-[0.5px]" />
            <span className={`leading-none font-semibold ${isLight ? 'text-stone-900' : 'text-himalayan-ivory'}`}>
              SAGARMATHA
            </span>
            <span className="hidden sm:inline opacity-40 leading-none">•</span>
            <span className="hidden md:inline leading-none">ORIGIN 8,848M → DUBAI 25°12′N</span>
          </div>

          <div className="inline-flex items-center gap-2 sm:gap-3 h-6 sm:h-7 leading-none">
            <span className="inline-flex items-center justify-center h-6 sm:h-6.5 px-2.5 sm:px-3 rounded border border-himalayan-amber/50 bg-himalayan-amber/10 text-himalayan-amber text-[9px] sm:text-[10px] font-semibold whitespace-nowrap leading-none tracking-wider">
              {isSummitStage
                ? 'STAGE 01 // SUMMIT'
                : isAltarStage
                ? 'STAGE 02 // ALTAR'
                : 'STAGE 03 // SANCTUARY'}
            </span>
            <span className={`hidden sm:inline leading-none ${isLight ? 'text-stone-800' : 'text-himalayan-ivory'}`}>
              {isSummitStage ? '8,848M ELEVATION' : isAltarStage ? '3,800M CLEFT' : 'DIFC HEARTH'}
            </span>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Middle Stage Content Viewport (Dynamically bounded, zero overlap) */}
        {/* ------------------------------------------------------------------ */}
        <div className="relative flex-1 w-full min-h-0 flex flex-col justify-center my-auto">

        {/* ------------------------------------------------------------------ */}
        {/* STAGE 1: MONUMENTAL TECTONIC GATES (Parting on scroll) */}
        {/* ------------------------------------------------------------------ */}
        <div
          className="my-auto py-1 sm:py-2 text-center flex flex-col items-center justify-center transition-transform duration-300 pointer-events-auto"
          style={{
            opacity: summitOpacity,
            pointerEvents: heroProgress > 0.22 ? 'none' : 'auto',
          }}
        >
          {/* Subtle Category Lead */}
          <div
            className={`inline-flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border backdrop-blur-md transition-colors ${
              isLight
                ? 'border-stone-300 bg-stone-200/60 text-stone-800'
                : 'border-himalayan-ivory/10 bg-himalayan-charcoal/40 text-himalayan-ivory/90'
            }`}
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-himalayan-amber shrink-0" />
            <span className="text-[9px] sm:text-[10px] md:text-xs font-mono-tech tracking-[0.18em] sm:tracking-[0.25em] uppercase font-medium">
              HIGH HIMALAYAS • ARRIVING AT DIFC, DUBAI
            </span>
          </div>

          {/* Wordmark Part 1: HIMALAYAN (Parts to the left) */}
          <div
            className="overflow-hidden w-full transition-transform duration-200 ease-out"
            style={{
              transform: `translateX(-${leftShift}px)`,
            }}
          >
            <h1
              className={`font-display text-4xl sm:text-7xl md:text-8xl lg:text-[11.2vw] font-bold tracking-[0.1em] sm:tracking-[0.14em] uppercase leading-none drop-shadow-2xl transition-colors ${
                isLight ? 'text-stone-900' : 'text-himalayan-ivory'
              }`}
            >
              HIMALAYAN
            </h1>
          </div>

          {/* Editorial Subline */}
          <div className="max-w-2xl my-1 sm:my-2 md:my-3 px-3">
            <p
              className={`font-editorial text-base sm:text-2xl md:text-4xl italic tracking-wide leading-tight ${
                isLight ? 'text-stone-800' : 'text-himalayan-bone'
              }`}
            >
              “Where glacial ridges part, the sacred hearth awakens.”
            </p>
          </div>

          {/* Wordmark Part 2: KITCHEN (Parts to the right) */}
          <div
            className="overflow-hidden w-full transition-transform duration-200 ease-out"
            style={{
              transform: `translateX(${rightShift}px)`,
            }}
          >
            <h2
              className={`font-display text-4xl sm:text-7xl md:text-8xl lg:text-[11.2vw] font-bold tracking-[0.12em] sm:tracking-[0.18em] uppercase leading-none ${
                isLight
                  ? 'text-transparent [-webkit-text-stroke:1px_rgba(25,28,32,0.45)] sm:[-webkit-text-stroke:1.5px_rgba(25,28,32,0.45)] hover:[-webkit-text-stroke:1.5px_#d9642a] hover:text-stone-900 transition-all duration-500'
                  : 'text-stroke-himalayan'
              }`}
            >
              KITCHEN
            </h2>
          </div>

          {/* Alpine Sound Activation Trigger */}
          <div className="mt-3 sm:mt-4">
            <button
              onClick={handleHeroSoundClick}
              className={`group inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-[10px] sm:text-xs font-mono-tech tracking-wider transition-all ${
                isPlayingSound
                  ? 'border-himalayan-amber bg-himalayan-amber/15 text-himalayan-amber'
                  : isLight
                  ? 'border-stone-400 bg-stone-200/50 text-stone-700 hover:border-himalayan-amber'
                  : 'border-himalayan-ivory/20 bg-himalayan-charcoal/50 text-himalayan-ivory hover:border-himalayan-amber'
              }`}
              data-cursor="SOUND"
            >
              {isPlayingSound ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-himalayan-amber animate-pulse shrink-0" />
                  <span>SOUNDSCAPE ACTIVE (432HZ)</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-himalayan-amber animate-ping" />
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-himalayan-amber shrink-0" />
                  <span>TAP TO ACTIVATE ALPINE SOUND</span>
                </>
              )}
            </button>
          </div>

          {/* Scroll Cue */}
          <div className="mt-3 sm:mt-5 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono-tech text-himalayan-amber tracking-[0.15em] sm:tracking-[0.2em] uppercase animate-pulse">
            <ArrowDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="hidden sm:inline">SCROLL TO PART THE MOUNTAINS & REVEAL THE CULINARY ALTAR</span>
            <span className="sm:hidden">SCROLL TO REVEAL CULINARY ALTAR</span>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* STAGE 2: THE SACRED GASTRONOMIC ALTAR */}
        {/* ------------------------------------------------------------------ */}
        <div
          className="absolute inset-0 pt-4 sm:pt-5 md:pt-6 pb-1 sm:pb-2 flex flex-col justify-between pointer-events-none z-20 transition-all duration-500"
          style={{
            opacity: altarOpacity,
            pointerEvents: isAltarStage ? 'auto' : 'none',
          }}
        >
          {/* Altar Header & Dialect Tuner */}
          <div className="text-center max-w-4xl mx-auto flex flex-col items-center w-full px-2 sm:px-4 shrink-0 pointer-events-auto">
            <div
              className={`px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl border backdrop-blur-md shadow-2xl transition-all w-full max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-4xl ${
                isLight
                  ? 'bg-stone-100/90 border-stone-300 text-stone-900'
                  : 'bg-black/80 border-white/10 text-white'
              }`}
            >
              <span className="text-[9px] sm:text-[10px] font-mono-tech tracking-[0.2em] sm:tracking-[0.3em] text-himalayan-amber uppercase font-semibold block mb-0.5 sm:mb-1">
                3 GASTRONOMIC DIALECTS
              </span>

              <h3
                className={`font-display text-base sm:text-2xl md:text-3xl lg:text-4xl uppercase tracking-wide font-bold transition-all whitespace-normal sm:whitespace-nowrap ${
                  isLight ? 'text-stone-950' : 'text-himalayan-ivory'
                }`}
              >
                {currentDish.name}
              </h3>

              <p
                className={`font-editorial text-[11px] sm:text-base italic mt-0.5 ${
                  isLight ? 'text-stone-700' : 'text-himalayan-bone'
                }`}
              >
                {currentDish.indigenousName} • Elevation 3,800m
              </p>

              {/* Integrated Dialect Tabs */}
              <div
                className={`mt-2.5 sm:mt-3 inline-flex items-center justify-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-full border backdrop-blur-md max-w-full overflow-x-auto [&::-webkit-scrollbar]:hidden ${
                  isLight
                    ? 'border-stone-300 bg-stone-200/70'
                    : 'border-white/10 bg-white/10'
                }`}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {[
                  { id: 'nepali', label: '01 // NEPALI MOMO', shortLabel: '01 NEPALI' },
                  { id: 'indochinese', label: '02 // TANGRA WOK', shortLabel: '02 TANGRA' },
                  { id: 'botanical', label: '03 // BOTANICAL ELIXIR', shortLabel: '03 BOTANICAL' },
                ].map((dialect) => (
                  <button
                    key={dialect.id}
                    onClick={() => handleDialectChange(dialect.id as any)}
                    className={`px-3 sm:px-4 md:px-5 py-1 sm:py-1.5 md:py-2 rounded-full text-[9px] sm:text-[10px] md:text-[11px] font-mono-tech tracking-wider uppercase transition-all duration-300 shrink-0 whitespace-nowrap ${
                      activeCategory === dialect.id
                        ? 'bg-himalayan-amber text-white shadow-md shadow-himalayan-amber/30 font-semibold'
                        : isLight
                        ? 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/60'
                        : 'text-himalayan-fog hover:text-himalayan-ivory hover:bg-white/5'
                    }`}
                    data-cursor="SWITCH"
                  >
                    <span className="hidden sm:inline">{dialect.label}</span>
                    <span className="sm:hidden">{dialect.shortLabel}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Central Interactive Photorealistic Culinary Showcase */}
          <div className="flex-1 min-h-0 flex items-center justify-center my-auto py-1 sm:py-2 pointer-events-auto">
            <div
              onClick={() => onSelectDish(currentDish)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                setAltarTilt({ x: Math.round(x * 20), y: Math.round(-y * 20) });
              }}
              onMouseLeave={() => setAltarTilt({ x: 0, y: 0 })}
              className="relative group cursor-pointer transition-transform duration-300 ease-out"
              style={{ perspective: '1000px' }}
              data-cursor="INSPECT"
            >
              {/* Volcanic Slate Platter Frame with Brass Bezel */}
              <div
                className={`relative w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full p-2.5 sm:p-3 border-2 transition-all duration-500 shadow-2xl ${
                  isLight
                    ? 'border-stone-300/80 bg-stone-900 shadow-[0_20px_50px_-10px_rgba(40,30,20,0.5)]'
                    : 'border-himalayan-amber/50 bg-black/90 shadow-[0_20px_60px_-10px_rgba(217,100,42,0.45)]'
                }`}
                style={{
                  transform: `rotateX(${altarTilt.y}deg) rotateY(${altarTilt.x}deg)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Hand-hammered Himalayan Brass Inlay Accent */}
                <div className="absolute inset-1.5 sm:inset-2 rounded-full border border-himalayan-amber/50 pointer-events-none" />

                {/* Inner Photographic Dish Container with Soft Glow */}
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-inner">
                  <img
                    key={currentDish.id}
                    src={currentDish.image}
                    alt={currentDish.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-all duration-700 ease-out"
                  />
                  {/* Subtle Culinary Liquid / Broth Glaze */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-white/10 pointer-events-none" />
                  {/* Dark Vignette Rim Blend */}
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_24px_rgba(0,0,0,0.7)] pointer-events-none" />
                </div>

                {/* Interactive Center Hover Overlay Badge */}
                <div className="absolute inset-0 rounded-full flex flex-col items-center justify-center bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] pointer-events-none text-white text-center p-3">
                  <Eye className="w-5 h-5 text-himalayan-amber mb-1 animate-pulse" />
                  <span className="text-[10px] font-mono-tech tracking-widest text-himalayan-amber uppercase font-semibold">
                    INSPECT DOSSIER
                  </span>
                  <span className="text-[9px] font-editorial italic text-stone-200 mt-0.5">
                    {currentDish.elevation}
                  </span>
                </div>

                {/* Floating Altitude Pill Badge */}
                <div className="absolute -bottom-2 sm:-bottom-2.5 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-black/90 border border-himalayan-amber/60 backdrop-blur-md shadow-lg flex items-center gap-1.5 whitespace-nowrap pointer-events-none">
                  <Sparkles className="w-3 h-3 text-himalayan-amber shrink-0" />
                  <span className="text-[8px] sm:text-[9px] font-mono-tech text-himalayan-ivory tracking-widest uppercase font-medium">
                    {activeCategory === 'nepali'
                      ? 'KHUMBU VALLEY • 3,800M'
                      : activeCategory === 'indochinese'
                      ? '800°C ROARING WOK HEI'
                      : '5,364M BASECAMP SPIRITS'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Lower Telemetry & Action Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 items-end gap-3 sm:gap-6 max-w-6xl mx-auto w-full shrink-0 pointer-events-auto">
            {/* Left Telemetry: Forage Origin & Key Botanicals (Hidden on mobile and tablet portrait to give full view of 3D dish) */}
            <div
              className={`hidden lg:block p-4 rounded-xl border backdrop-blur-md text-xs font-mono-tech transition-all shadow-lg ${
                isLight
                  ? 'border-stone-300 bg-stone-100/85 text-stone-800'
                  : 'border-himalayan-ivory/15 bg-black/75 text-himalayan-bone'
              }`}
            >
              <div className="flex items-center gap-1.5 text-himalayan-amber text-[10px] font-semibold mb-2">
                <Wind className="w-3.5 h-3.5" />
                <span>FORAGED BOTANICALS & ALTITUDE</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between border-b pb-1 border-stone-200 dark:border-white/10">
                  <span className="opacity-70">HARVEST PASS:</span>
                  <span className="font-semibold text-himalayan-amber">LANGTANG 3,800M</span>
                </div>
                <div className="flex justify-between border-b pb-1 border-stone-200 dark:border-white/10">
                  <span className="opacity-70">PRIMARY HERB:</span>
                  <span className="font-medium">WILD TIMUR & JIMBU</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">VESSEL:</span>
                  <span className="font-medium">VOLCANIC SLATE PEDESTAL</span>
                </div>
              </div>
            </div>

            {/* Center Action: Inspect Dossier & 3D Orbit Tip */}
            <div className="flex flex-col items-center justify-center text-center">
              {/* Mobile Compact Origin Badge */}
              <div className="lg:hidden flex items-center justify-center gap-1.5 mb-2 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[9px] font-mono-tech text-himalayan-amber backdrop-blur-md">
                <Wind className="w-3 h-3 shrink-0" />
                <span>LANGTANG 3,800M • WILD TIMUR & JIMBU</span>
              </div>

              <button
                onClick={() => onSelectDish(currentDish)}
                className="px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full bg-himalayan-amber hover:bg-himalayan-ember text-white text-[10px] sm:text-xs font-mono-tech tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all shadow-xl shadow-himalayan-amber/30 flex items-center gap-2 group hover:scale-105 active:scale-95"
                data-cursor="INSPECT"
              >
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>INSPECT CULINARY DOSSIER</span>
              </button>

              <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px] font-mono-tech text-himalayan-amber tracking-widest uppercase mt-2">
                <Layers className="w-3 h-3 shrink-0" />
                <span>INTERACTIVE 3D ALTAR • MOVE TO TILT</span>
              </div>
            </div>

            {/* Right Telemetry: Sensory Matrix (Hidden on mobile and tablet portrait) */}
            <div
              className={`hidden lg:block p-4 rounded-xl border backdrop-blur-md text-xs font-mono-tech transition-all shadow-lg ${
                isLight
                  ? 'border-stone-300 bg-stone-100/85 text-stone-800'
                  : 'border-himalayan-ivory/15 bg-black/75 text-himalayan-bone'
              }`}
            >
              <div className="flex items-center justify-between text-himalayan-amber text-[10px] font-semibold mb-2">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>SENSORY MATRIX</span>
                </div>
                <span className="text-[9px] opacity-70">TASTING LAB</span>
              </div>
              <div className="space-y-2 text-[10px]">
                {/* Meter 1: Timur Numbness */}
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span>TIMUR ELECTRIC NUMBNESS</span>
                    <span className="font-semibold text-himalayan-amber">88%</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-stone-300 dark:bg-white/10 overflow-hidden">
                    <div className="h-full bg-himalayan-amber w-[88%]" />
                  </div>
                </div>

                {/* Meter 2: Alpine Umami */}
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span>MOREL ALPINE UMAMI</span>
                    <span className="font-semibold text-himalayan-amber">94%</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-stone-300 dark:bg-white/10 overflow-hidden">
                    <div className="h-full bg-himalayan-amber w-[94%]" />
                  </div>
                </div>

                {/* Meter 3: Cedarwood Smoke */}
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span>CEDAR HEARTH SMOKE</span>
                    <span className="font-semibold text-himalayan-amber">72%</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-stone-300 dark:bg-white/10 overflow-hidden">
                    <div className="h-full bg-himalayan-amber w-[72%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* STAGE 3: DESCENT INTO THE SANCTUARY */}
        {/* ------------------------------------------------------------------ */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6 transition-all duration-500 pointer-events-none z-20"
          style={{
            opacity: descentOpacity,
            pointerEvents: isDescentStage ? 'auto' : 'none',
          }}
        >
          <div
            className={`p-5 sm:p-8 rounded-2xl sm:rounded-3xl border backdrop-blur-md max-w-xl mx-auto shadow-2xl transition-all ${
              isLight
                ? 'border-stone-300 bg-stone-100/90 text-stone-900'
                : 'border-himalayan-ivory/15 bg-himalayan-void/90 text-himalayan-ivory'
            }`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-himalayan-amber/50 bg-himalayan-amber/10 flex items-center justify-center mx-auto mb-3 sm:mb-4 text-himalayan-amber">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" style={{ animationDuration: '24s' }} />
            </div>

            <span className="text-[9px] sm:text-[10px] font-mono-tech tracking-[0.25em] sm:tracking-[0.3em] text-himalayan-amber uppercase font-semibold block mb-1 sm:mb-2">
              DESCENT COMPLETE // 1,400M HEARTH
            </span>

            <h3 className="font-display text-xl sm:text-4xl uppercase tracking-wide mb-2 sm:mb-3">
              Enter The Himalayan Odyssey
            </h3>

            <p
              className={`font-editorial text-sm sm:text-lg italic mb-4 sm:mb-6 ${
                isLight ? 'text-stone-700' : 'text-himalayan-bone'
              }`}
            >
              “From high glacial ridges into the warm fragrance of cedarwood, timur, and live wok fire.”
            </p>

            <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono-tech text-himalayan-amber tracking-widest uppercase animate-bounce">
              <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>CONTINUE SCROLLING TO BEGIN CHAPTER 01</span>
            </div>
          </div>
        </div>
      </div>

        {/* ------------------------------------------------------------------ */}
        {/* Bottom Hero HUD: Atmospheric Specs & Seating Inquiries */}
        {/* ------------------------------------------------------------------ */}
        <div
          className={`shrink-0 grid grid-cols-1 md:grid-cols-3 items-end gap-3 sm:gap-6 text-[9px] sm:text-[10px] font-mono-tech tracking-[0.18em] sm:tracking-[0.2em] border-t pt-2.5 sm:pt-4 z-20 transition-colors ${
            isLight ? 'border-stone-300 text-stone-600' : 'border-himalayan-ivory/10 text-himalayan-fog'
          }`}
        >
          {/* Left: Atmospheric Specs */}
          <div className="hidden md:block space-y-1">
            <div className="flex items-center gap-2">
              <Compass className="w-3 h-3 text-himalayan-amber" />
              <span className={isLight ? 'text-stone-900 font-semibold' : 'text-himalayan-ivory'}>
                MICROCLIMATE:
              </span>
              <span>-4°C • CRISP ALPINE RIDGES</span>
            </div>
            <div>BAROMETER: 337 hPa • FORAGED BOTANICALS READY</div>
          </div>

          {/* Center: Scroll Cue */}
          <div
            onClick={onStory}
            className="flex flex-col items-center justify-center cursor-pointer group text-center"
            data-cursor="SCROLL"
          >
            <span
              className={`group-hover:text-himalayan-amber transition-colors mb-1 sm:mb-2 text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.3em] font-semibold ${
                isLight ? 'text-stone-800' : 'text-himalayan-ivory'
              } ${isAltarStage ? 'hidden' : 'block'}`}
            >
              {isSummitStage
                ? 'SCROLL TO EXPLORE 3D EXPEDITION'
                : 'DESCENDING INTO CHAPTER 01'}
            </span>
            <div className={`w-[1px] h-6 sm:h-8 relative overflow-hidden ${isLight ? 'bg-stone-400' : 'bg-himalayan-ivory/20'}`}>
              <div className="w-full h-1/2 bg-himalayan-amber animate-bounce" />
            </div>
          </div>

          {/* Right: Reservation Status */}
          <div className="text-right space-y-1 hidden md:block">
            <div className="flex items-center justify-end gap-1.5">
              <Flame className="w-3 h-3 text-himalayan-amber" />
              <span className="text-himalayan-amber font-semibold">HEARTH STATUS:</span>
              <span className={isLight ? 'text-stone-800' : 'text-himalayan-bone'}>LIVE CEDAR WOOD FIRE</span>
            </div>
            <button
              onClick={onReserve}
              className={`underline hover:text-himalayan-amber transition-colors ${
                isLight ? 'text-stone-800' : 'text-himalayan-ivory'
              }`}
            >
              INQUIRE FOR UPCOMING SEATINGS →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
