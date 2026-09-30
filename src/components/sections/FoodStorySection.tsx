import { ArrowRight, Compass, Sparkles, Wine } from 'lucide-react';
import type { Dish } from '../../types';
import { DISHES } from '../../data/himalayanData';

interface FoodStorySectionProps {
  onSelectDish: (dish: Dish) => void;
  theme?: 'dark' | 'light';
}

export function FoodStorySection({ onSelectDish, theme = 'dark' }: FoodStorySectionProps) {
  const isLight = theme === 'light';

  return (
    <section
      id="food-story"
      className="relative min-h-screen w-full py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 pointer-events-auto"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Editorial Section Masthead */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between border-b pb-4 sm:pb-8 mb-10 sm:mb-20 gap-4 sm:gap-8 ${
          isLight ? 'border-stone-300' : 'border-himalayan-ivory/10'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-himalayan-amber text-xs font-mono-tech tracking-[0.3em] uppercase mb-2">
              <Compass className="w-4 h-4" />
              <span>CHAPTER 04 — GASTRONOMIC COMPENDIUM</span>
            </div>
            <h2 className={`font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight ${
              isLight ? 'text-stone-900' : 'text-himalayan-ivory'
            }`}>
              Culinary Editorial
            </h2>
          </div>

          <div className="max-w-md">
            <p className={`font-editorial text-lg sm:text-xl italic leading-relaxed ${
              isLight ? 'text-stone-800' : 'text-himalayan-bone'
            }`}>
              “Every plate is a geological record of the Himalayas—from deep alluvial valleys to thin, frozen ridges.”
            </p>
          </div>
        </div>

        {/* Cinematic Staggered Dish Editorial Cards */}
        <div className="flex flex-col gap-12 sm:gap-20 md:gap-28">
          {DISHES.map((dish, idx) => {
            const isReversed = idx % 2 === 1;

            return (
              <div
                key={dish.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center ${
                  isReversed ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Visual Editorial Image Frame */}
                <div
                  className={`lg:col-span-7 relative group cursor-pointer ${
                    isReversed ? 'lg:order-2' : 'lg:order-1'
                  }`}
                  onClick={() => onSelectDish(dish)}
                  data-cursor="INSPECT"
                >
                  <div className={`relative rounded-2xl overflow-hidden border shadow-2xl ${
                    isLight ? 'border-stone-300 bg-stone-900' : 'border-himalayan-ivory/15 bg-himalayan-black'
                  }`}>
                    <div className="relative h-[260px] sm:h-[400px] md:h-[540px] w-full overflow-hidden">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                      {/* Technical Elevation Watermark */}
                      <div className="absolute top-3 left-3 sm:top-6 sm:left-6 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[9px] sm:text-[10px] font-mono-tech tracking-[0.2em] text-himalayan-amber uppercase">
                        {dish.elevation}
                      </div>

                      {/* Hover Prompt */}
                      <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono-tech tracking-widest text-white bg-black/70 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20 group-hover:border-himalayan-amber transition-colors">
                        <span>VIEW PROVENANCE</span>
                        <ArrowRight className="w-3.5 h-3.5 text-himalayan-amber group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editorial Typography & Provenance Column */}
                <div
                  className={`lg:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-6 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border backdrop-blur-md transition-all shadow-xl ${
                    isLight
                      ? 'bg-stone-100/90 border-stone-300/80 text-stone-900'
                      : 'bg-black/75 border-white/10 text-white'
                  } ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono-tech text-xs tracking-[0.3em] text-himalayan-amber font-semibold">
                      0{idx + 1} // {dish.category.toUpperCase()}
                    </span>
                    <span className="opacity-40 text-xs">•</span>
                    <span className={`font-mono-tech text-[10px] tracking-widest uppercase ${
                      isLight ? 'text-stone-600 font-semibold' : 'text-himalayan-fog'
                    }`}>
                      {dish.elevation}
                    </span>
                  </div>

                  <h3 className={`font-display text-2xl sm:text-4xl md:text-5xl uppercase leading-tight tracking-wide font-bold ${
                    isLight ? 'text-stone-950' : 'text-himalayan-ivory'
                  }`}>
                    {dish.name}
                  </h3>

                  <p className={`font-sans-clean text-xs md:text-sm leading-relaxed ${
                    isLight ? 'text-stone-700' : 'text-himalayan-fog'
                  }`}>
                    {dish.description}
                  </p>

                  {/* Flavor & Botanical Notes */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono-tech tracking-[0.25em] text-himalayan-amber uppercase block font-semibold">
                      BOTANICAL PROFILE
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {dish.notes.map((note) => (
                        <span
                          key={note}
                          className={`px-2.5 sm:px-3 py-1 rounded-md text-[10px] sm:text-[11px] font-mono-tech tracking-wider border ${
                            isLight
                              ? 'border-stone-300 bg-stone-200/60 text-stone-800'
                              : 'border-himalayan-ivory/10 bg-himalayan-charcoal/40 text-himalayan-bone'
                          }`}
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pairing Recommendation */}
                  <div className={`p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 ${
                    isLight
                      ? 'border-stone-300 bg-stone-200/50'
                      : 'border-himalayan-ivory/10 bg-himalayan-charcoal/20'
                  }`}>
                    <Wine className="w-4 h-4 text-himalayan-amber mt-0.5 shrink-0" />
                    <div>
                      <span className={`text-[10px] font-mono-tech tracking-[0.2em] uppercase block font-semibold ${
                        isLight ? 'text-stone-900' : 'text-himalayan-ivory'
                      }`}>
                        SOMMELIER PAIRING
                      </span>
                      <span className={`text-xs font-editorial italic ${
                        isLight ? 'text-stone-800' : 'text-himalayan-bone'
                      }`}>
                        {dish.pairing}
                      </span>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-2">
                    <button
                      onClick={() => onSelectDish(dish)}
                      className={`group inline-flex items-center gap-3 text-xs font-mono-tech tracking-[0.25em] hover:text-himalayan-amber transition-colors uppercase border-b border-himalayan-amber/50 pb-1 ${
                        isLight ? 'text-stone-900' : 'text-himalayan-ivory'
                      }`}
                      data-cursor="EXPEDITION"
                    >
                      <span>CULINARY DOSSIER</span>
                      <Sparkles className="w-3.5 h-3.5 text-himalayan-amber" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
