import { Sparkles, Compass, Wind, Flame, Eye } from 'lucide-react';
import type { Dish } from '../../types';
import { DISHES } from '../../data/himalayanData';

interface MountainPassTransitionProps {
  theme?: 'dark' | 'light';
  onSelectDish: (dish: Dish) => void;
}

export function MountainPassTransition({ theme = 'dark', onSelectDish }: MountainPassTransitionProps) {
  const isLight = theme === 'light';
  const momoDish = DISHES[0];

  return (
    <section
      id="mountain-emergence"
      className="relative min-h-[140vh] w-full flex flex-col justify-between py-24 px-6 md:px-12 pointer-events-none select-none"
    >
      {/* Top Banner: Announcing the Emergence */}
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center text-center pointer-events-auto">
        <div className={`inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border backdrop-blur-md ${
          isLight
            ? 'border-stone-300 bg-stone-100/80 text-stone-800'
            : 'border-himalayan-ivory/15 bg-himalayan-charcoal/60 text-himalayan-ivory'
        }`}>
          <Compass className="w-3.5 h-3.5 text-himalayan-amber animate-spin" style={{ animationDuration: '20s' }} />
          <span className="text-[10px] font-mono-tech tracking-[0.3em] uppercase font-semibold">
            THE PASS OPENS • 3D CULINARY EMERGENCE
          </span>
        </div>

        <h2 className={`font-display text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight max-w-3xl leading-tight ${
          isLight ? 'text-stone-900' : 'text-himalayan-ivory'
        }`}>
          From The Mountain’s Depths, Flavour Takes Form
        </h2>

        <p className={`font-editorial text-lg sm:text-2xl italic tracking-wide mt-3 max-w-xl ${
          isLight ? 'text-stone-700' : 'text-himalayan-bone'
        }`}>
          “As the high peaks part, the first creation rises through the glacial steam.”
        </p>

        <div className="mt-4 flex items-center gap-2 text-[10px] font-mono-tech text-himalayan-amber tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MOVE CURSOR TO ROTATE & EXAMINE THE FLOATING DISH</span>
        </div>
      </div>

      {/* Middle Floating HUD Annotations framing the 3D Dish in center */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 pointer-events-auto my-auto py-12">
        {/* Left HUD: The Slate Vessel */}
        <div className={`p-5 rounded-2xl border backdrop-blur-md transition-all ${
          isLight
            ? 'border-stone-300/80 bg-stone-100/70 text-stone-900 shadow-lg'
            : 'border-himalayan-ivory/15 bg-himalayan-void/70 text-himalayan-ivory shadow-2xl'
        }`}>
          <div className="flex items-center gap-2 text-himalayan-amber text-[10px] font-mono-tech tracking-widest uppercase font-semibold mb-2">
            <Wind className="w-3 h-3" />
            <span>01 // THE VESSEL</span>
          </div>
          <h4 className="font-display text-base uppercase font-bold mb-1">
            Volcanic Slate Pedestal
          </h4>
          <p className={`text-xs font-sans-clean leading-relaxed ${isLight ? 'text-stone-600' : 'text-himalayan-fog'}`}>
            Quarried at 4,200m in the Langtang pass, hand-chiseled and tempered over cedar embers to retain radiant warmth.
          </p>
        </div>

        {/* Center Prompt / Inspect Trigger */}
        <div className="flex flex-col items-center justify-end text-center p-4">
          <button
            onClick={() => onSelectDish(momoDish)}
            className="group px-6 py-3 rounded-full bg-himalayan-amber hover:bg-himalayan-ember text-white text-xs font-mono-tech tracking-[0.2em] uppercase transition-all shadow-xl shadow-himalayan-amber/25 flex items-center gap-2.5 pointer-events-auto"
            data-cursor="INSPECT"
          >
            <Eye className="w-4 h-4" />
            <span>INSPECT THE 3D MOREL MOMO</span>
          </button>
        </div>

        {/* Right HUD: Volatile Botanicals & Steam */}
        <div className={`p-5 rounded-2xl border backdrop-blur-md transition-all ${
          isLight
            ? 'border-stone-300/80 bg-stone-100/70 text-stone-900 shadow-lg'
            : 'border-himalayan-ivory/15 bg-himalayan-void/70 text-himalayan-ivory shadow-2xl'
        }`}>
          <div className="flex items-center gap-2 text-himalayan-amber text-[10px] font-mono-tech tracking-widest uppercase font-semibold mb-2">
            <Flame className="w-3 h-3" />
            <span>02 // THE ESSENCE</span>
          </div>
          <h4 className="font-display text-base uppercase font-bold mb-1">
            Timur Peppercorn Mist
          </h4>
          <p className={`text-xs font-sans-clean leading-relaxed ${isLight ? 'text-stone-600' : 'text-himalayan-fog'}`}>
            Wild foraged Khumbu morels, bone marrow reduction, and an electric burst of citrus numbness that awakens the senses.
          </p>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center text-[10px] font-mono-tech tracking-widest border-t pt-4 opacity-70">
        <span className={isLight ? 'text-stone-600' : 'text-himalayan-fog'}>
          SAGARMATHA HARVEST ELEVATION 3,800M
        </span>
        <span className="text-himalayan-amber font-semibold">
          SCROLL TO ENTER CHAPTER 02 →
        </span>
      </div>
    </section>
  );
}
