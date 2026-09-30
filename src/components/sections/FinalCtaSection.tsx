import { Compass, Sparkles, ArrowRight } from 'lucide-react';

interface FinalCtaSectionProps {
  onReserve: () => void;
  onContact: () => void;
  theme?: 'dark' | 'light';
}

export function FinalCtaSection({ onReserve, onContact, theme = 'dark' }: FinalCtaSectionProps) {
  const isLight = theme === 'light';

  return (
    <section
      id="final-cta"
      className="relative min-h-[80vh] w-full py-16 sm:py-24 md:py-28 px-4 sm:px-6 md:px-12 flex flex-col items-center justify-center text-center pointer-events-auto overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full pointer-events-none blur-3xl ${
        isLight ? 'bg-amber-500/10' : 'amber-glow opacity-40'
      }`} />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Top Tagline */}
        <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-himalayan-amber/50 bg-himalayan-amber/15 backdrop-blur-md">
          <Compass className="w-3.5 h-3.5 text-himalayan-amber" />
          <span className={`text-[10px] sm:text-xs font-mono-tech tracking-[0.2em] sm:tracking-[0.3em] uppercase font-semibold ${
            isLight ? 'text-stone-900' : 'text-himalayan-ivory'
          }`}>
            CHAPTER 07 — THE SUMMIT INVITATION
          </span>
        </div>

        {/* Cinematic Closing Quote */}
        <h2 className={`font-editorial text-xl sm:text-3xl md:text-5xl italic tracking-wide mb-3 sm:mb-4 ${
          isLight ? 'text-stone-800' : 'text-himalayan-bone'
        }`}>
          “The mountains are calling. The hearth is burning.”
        </h2>

        {/* Wordmark Monument */}
        <h3 className={`font-display text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-[0.1em] sm:tracking-[0.14em] mb-4 sm:mb-6 leading-none ${
          isLight ? 'text-stone-900' : 'text-himalayan-ivory'
        }`}>
          HIMALAYAN KITCHEN
        </h3>

        <p className={`max-w-xl text-xs sm:text-sm font-sans-clean tracking-wider mb-6 sm:mb-10 leading-relaxed px-2 ${
          isLight ? 'text-stone-600' : 'text-himalayan-fog'
        }`}>
          Prepare for an intimate multi-course culinary expedition through forgotten high-altitude passes, wild mountain aromatics, and roaring wok hei fire.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 w-full sm:w-auto">
          <button
            onClick={onReserve}
            className="w-full sm:w-auto px-6 sm:px-9 py-3 sm:py-4 rounded-full bg-himalayan-amber hover:bg-himalayan-ember text-white text-[11px] sm:text-xs font-mono-tech tracking-[0.18em] sm:tracking-[0.25em] uppercase transition-all duration-300 shadow-2xl shadow-himalayan-amber/30 flex items-center justify-center gap-2.5 sm:gap-3 group font-semibold"
            data-cursor="RESERVE"
          >
            <Sparkles className="w-4 h-4" />
            <span>DISCOVER TASTING MENU</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onContact}
            className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full border text-[11px] sm:text-xs font-mono-tech tracking-[0.18em] sm:tracking-[0.25em] uppercase transition-colors ${
              isLight
                ? 'border-stone-400 text-stone-800 hover:border-himalayan-amber hover:text-himalayan-amber bg-stone-200/50'
                : 'border-himalayan-ivory/20 text-himalayan-ivory hover:border-himalayan-amber hover:text-himalayan-amber bg-himalayan-charcoal/40'
            }`}
            data-cursor="CONTACT"
          >
            EXPEDITION CONCIERGE
          </button>
        </div>

        {/* Seating Availability Note */}
        <div className={`mt-8 sm:mt-12 flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-mono-tech tracking-wider sm:tracking-widest ${
          isLight ? 'text-stone-600' : 'text-himalayan-fog'
        }`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <span>BESPOKE TASTING SEATINGS OPEN • GATE VILLAGE, DIFC DUBAI</span>
        </div>
      </div>
    </section>
  );
}
