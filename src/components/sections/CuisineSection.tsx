import { useState } from 'react';
import { Flame, Sparkles, Wind, Eye, Compass } from 'lucide-react';
import type { Dish } from '../../types';
import { DISHES } from '../../data/himalayanData';

interface CuisineSectionProps {
  onSelectDish: (dish: Dish) => void;
  theme?: 'dark' | 'light';
}

export function CuisineSection({ onSelectDish, theme = 'dark' }: CuisineSectionProps) {
  const [activeTab, setActiveTab] = useState<'nepali' | 'indochinese'>('nepali');
  const isLight = theme === 'light';

  const nepaliDish = DISHES.find((d) => d.category === 'nepali')!;
  const indochineseDish = DISHES.find((d) => d.category === 'indochinese')!;

  return (
    <section
      id="cuisine"
      className="relative min-h-screen w-full py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 flex flex-col justify-center pointer-events-auto"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between border-b pb-4 sm:pb-6 mb-8 sm:mb-12 gap-4 sm:gap-6 ${
          isLight ? 'border-stone-300' : 'border-himalayan-ivory/10'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-himalayan-amber text-xs font-mono-tech tracking-[0.3em] uppercase mb-2">
              <Compass className="w-4 h-4" />
              <span>CHAPTER 03 — DUAL CULINARY DIALECT</span>
            </div>
            <h2 className={`font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight ${
              isLight ? 'text-stone-900' : 'text-himalayan-ivory'
            }`}>
              Two Traditions. One High Peak.
            </h2>
          </div>

          {/* Interactive Dualism Switcher */}
          <div className={`flex rounded-full p-1 border backdrop-blur-md self-start md:self-auto ${
            isLight ? 'border-stone-300 bg-stone-200/80' : 'border-himalayan-ivory/15 bg-himalayan-charcoal/60'
          }`}>
            <button
              onClick={() => setActiveTab('nepali')}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-mono-tech tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all duration-300 ${
                activeTab === 'nepali'
                  ? 'bg-himalayan-amber text-white shadow-lg font-semibold'
                  : isLight
                  ? 'text-stone-600 hover:text-stone-900'
                  : 'text-himalayan-fog hover:text-himalayan-ivory'
              }`}
              data-cursor="NEPALI"
            >
              MODIFIED NEPALI
            </button>
            <button
              onClick={() => setActiveTab('indochinese')}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-mono-tech tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all duration-300 ${
                activeTab === 'indochinese'
                  ? 'bg-himalayan-amber text-white shadow-lg font-semibold'
                  : isLight
                  ? 'text-stone-600 hover:text-stone-900'
                  : 'text-himalayan-fog hover:text-himalayan-ivory'
              }`}
              data-cursor="HAKKA"
            >
              TANGRA WOK
            </button>
          </div>
        </div>

        {/* Dynamic Dual Interactive Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Deep Culinary Narrative & Flavor Mechanics */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {activeTab === 'nepali' ? (
              <div className="animate-fadeIn space-y-4 sm:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-himalayan-amber/50 bg-himalayan-amber/15">
                  <Wind className="w-3.5 h-3.5 text-himalayan-amber" />
                  <span className={`text-[10px] font-mono-tech tracking-[0.25em] uppercase font-semibold ${
                    isLight ? 'text-stone-900' : 'text-himalayan-ivory'
                  }`}>
                    MOUNTAIN-INSPIRED BOTANICALS
                  </span>
                </div>

                <h3 className={`font-display text-2xl sm:text-4xl md:text-5xl uppercase leading-tight ${
                  isLight ? 'text-stone-900' : 'text-himalayan-ivory'
                }`}>
                  Modified Nepali Cuisine
                </h3>

                <p className={`font-editorial text-lg sm:text-xl italic leading-relaxed ${
                  isLight ? 'text-stone-800' : 'text-himalayan-bone'
                }`}>
                  “The subtle alchemy of high-altitude foraging, sun-dried fermentation, and electric timur peppercorns.”
                </p>

                <p className={`font-sans-clean text-xs md:text-sm leading-relaxed ${
                  isLight ? 'text-stone-600' : 'text-himalayan-fog'
                }`}>
                  We strip away rustic heaviness to celebrate the raw botanical brilliance of Nepal’s microclimates. Wild morels gathered in Khumbu pine forests, fragrant Himalayan jimbu tempered in brown yak butter, and ancient gundruk broth rendered crystal-clear through French culinary clarification.
                </p>

                {/* Flavor Profile Matrix */}
                <div className={`grid grid-cols-2 gap-4 pt-4 border-t font-mono-tech text-xs ${
                  isLight ? 'border-stone-300' : 'border-himalayan-ivory/10'
                }`}>
                  <div>
                    <span className="text-himalayan-amber block text-[10px] tracking-widest mb-1 font-semibold">
                      KEY AROMATICS
                    </span>
                    <span className={isLight ? 'text-stone-800' : 'text-himalayan-ivory'}>
                      Timur, Jimbu, Wild Marrow, Juniper
                    </span>
                  </div>
                  <div>
                    <span className="text-himalayan-amber block text-[10px] tracking-widest mb-1 font-semibold">
                      FERMENTATION
                    </span>
                    <span className={isLight ? 'text-stone-800' : 'text-himalayan-ivory'}>
                      Gundruk (Mustard greens), Kinema
                    </span>
                  </div>
                </div>

                <div className="pt-2 sm:pt-4">
                  <button
                    onClick={() => onSelectDish(nepaliDish)}
                    className="group inline-flex items-center gap-2.5 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-full border border-himalayan-amber text-himalayan-amber hover:bg-himalayan-amber hover:text-white text-[11px] sm:text-xs font-mono-tech tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all shadow-md"
                    data-cursor="INSPECT"
                  >
                    <Eye className="w-4 h-4" />
                    <span>INSPECT THE MOREL MOMO</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-fadeIn space-y-4 sm:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-himalayan-amber/50 bg-himalayan-amber/15">
                  <Flame className="w-3.5 h-3.5 text-himalayan-amber" />
                  <span className={`text-[10px] font-mono-tech tracking-[0.25em] uppercase font-semibold ${
                    isLight ? 'text-stone-900' : 'text-himalayan-ivory'
                  }`}>
                    WOK HEI & SCORCHED CHILIES
                  </span>
                </div>

                <h3 className={`font-display text-2xl sm:text-4xl md:text-5xl uppercase leading-tight ${
                  isLight ? 'text-stone-900' : 'text-himalayan-ivory'
                }`}>
                  Indian Chinese Cuisine
                </h3>

                <p className={`font-editorial text-lg sm:text-xl italic leading-relaxed ${
                  isLight ? 'text-stone-800' : 'text-himalayan-bone'
                }`}>
                  “Born in the immigrant tanneries of Tangra, elevated with high-altitude mountain smoke and fiery precision.”
                </p>

                <p className={`font-sans-clean text-xs md:text-sm leading-relaxed ${
                  isLight ? 'text-stone-600' : 'text-himalayan-fog'
                }`}>
                  A century ago, Hakka Chinese settlers landed in Calcutta, fusing Chinese stir-frying with Indian chili paste and garlic. At Himalayan Kitchen, we push this cultural collision to Michelin proportions—searing tiger prawns over 800°C woks with charred Kashmiri chili reductions and toasted mountain timur crunch.
                </p>

                {/* Flavor Profile Matrix */}
                <div className={`grid grid-cols-2 gap-4 pt-4 border-t font-mono-tech text-xs ${
                  isLight ? 'border-stone-300' : 'border-himalayan-ivory/10'
                }`}>
                  <div>
                    <span className="text-himalayan-amber block text-[10px] tracking-widest mb-1 font-semibold">
                      WOK INTENSITY
                    </span>
                    <span className={isLight ? 'text-stone-800' : 'text-himalayan-ivory'}>
                      800°C Cast Iron Smoke (Wok Hei)
                    </span>
                  </div>
                  <div>
                    <span className="text-himalayan-amber block text-[10px] tracking-widest mb-1 font-semibold">
                      CHILI PROFILE
                    </span>
                    <span className={isLight ? 'text-stone-800' : 'text-himalayan-ivory'}>
                      Scorched Kashmiri & Himalayan Timur
                    </span>
                  </div>
                </div>

                <div className="pt-2 sm:pt-4">
                  <button
                    onClick={() => onSelectDish(indochineseDish)}
                    className="group inline-flex items-center gap-2.5 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-full border border-himalayan-amber text-himalayan-amber hover:bg-himalayan-amber hover:text-white text-[11px] sm:text-xs font-mono-tech tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all shadow-md"
                    data-cursor="INSPECT"
                  >
                    <Eye className="w-4 h-4" />
                    <span>INSPECT SCORCHED TIGER PRAWNS</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Monumental Dish Presentation with Interactive Hover */}
          <div className="lg:col-span-6 relative">
            <div
              onClick={() => onSelectDish(activeTab === 'nepali' ? nepaliDish : indochineseDish)}
              className={`relative rounded-2xl overflow-hidden border group cursor-pointer shadow-2xl transition-all duration-700 ${
                isLight ? 'border-stone-300 bg-stone-900' : 'border-himalayan-ivory/20 bg-himalayan-black'
              }`}
              data-cursor="INSPECT"
            >
              <div className="relative h-[320px] sm:h-[420px] md:h-[520px] w-full overflow-hidden">
                <img
                  src={activeTab === 'nepali' ? nepaliDish.image : indochineseDish.image}
                  alt={activeTab === 'nepali' ? nepaliDish.name : indochineseDish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />

                {/* Overlaid Badges */}
                <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex justify-between items-center">
                  <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[9px] sm:text-[10px] font-mono-tech text-himalayan-amber tracking-widest uppercase">
                    {activeTab === 'nepali' ? 'SIGNATURE NEPALI' : 'TANGRA WOK HEI'}
                  </span>
                  <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[9px] sm:text-[10px] font-mono-tech text-white tracking-widest">
                    {activeTab === 'nepali' ? '3,800M ELEVATION' : 'HIGH WOK INTENSITY'}
                  </span>
                </div>

                {/* Bottom Overlaid Title */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
                  <span className="text-[10px] sm:text-xs font-mono-tech text-himalayan-amber tracking-[0.2em] block mb-1">
                    {activeTab === 'nepali' ? nepaliDish.elevation : indochineseDish.elevation}
                  </span>
                  <h4 className="font-display text-xl sm:text-2xl md:text-3xl uppercase tracking-wide">
                    {activeTab === 'nepali' ? nepaliDish.name : indochineseDish.name}
                  </h4>
                  <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-mono-tech text-stone-300">
                    <span>TAP TO REVEAL INGREDIENTS & PAIRING</span>
                    <Sparkles className="w-3.5 h-3.5 text-himalayan-amber" />
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
