import { X, Wine, Sparkles, MapPin } from 'lucide-react';
import type { Dish } from '../../types';

interface DishModalProps {
  dish: Dish | null;
  onClose: () => void;
  onReserve: () => void;
  theme?: 'dark' | 'light';
}

export function DishModal({ dish, onClose, onReserve, theme = 'dark' }: DishModalProps) {
  if (!dish) return null;
  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl shadow-2xl z-10 p-5 sm:p-8 md:p-10 border ${
        isLight
          ? 'bg-stone-100 border-stone-300 text-stone-900'
          : 'bg-himalayan-black border-himalayan-ivory/20 text-himalayan-ivory'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 sm:top-6 sm:right-6 p-1.5 sm:p-2 rounded-full border transition-colors z-20 ${
            isLight
              ? 'border-stone-400 text-stone-600 hover:text-stone-900 hover:border-himalayan-amber bg-stone-200/50'
              : 'border-himalayan-ivory/20 text-himalayan-fog hover:text-white hover:border-himalayan-amber bg-black/50'
          }`}
          data-cursor="CLOSE"
          aria-label="Close"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Dish Image Frame */}
          <div className="md:col-span-6 relative rounded-xl sm:rounded-2xl overflow-hidden border border-black/20 bg-black">
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-56 sm:h-80 md:h-[420px] object-cover"
            />
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[9px] sm:text-[10px] font-mono-tech tracking-widest text-himalayan-amber uppercase">
              {dish.elevation}
            </div>
          </div>

          {/* Dossier Information */}
          <div className="md:col-span-6 space-y-4 sm:space-y-6">
            <div>
              <span className="text-[10px] sm:text-xs font-mono-tech text-himalayan-amber tracking-[0.2em] sm:tracking-[0.25em] uppercase block mb-1 font-semibold">
                {dish.indigenousName} • {dish.category.toUpperCase()} DIALECT
              </span>
              <h3 className={`font-display text-xl sm:text-3xl uppercase tracking-wide font-bold ${
                isLight ? 'text-stone-900' : 'text-himalayan-ivory'
              }`}>
                {dish.name}
              </h3>
            </div>

            <p className={`font-sans-clean text-xs sm:text-sm leading-relaxed ${
              isLight ? 'text-stone-700' : 'text-himalayan-fog'
            }`}>
              {dish.description}
            </p>

            {/* Provenance Box */}
            <div className={`p-4 rounded-xl border space-y-2 ${
              isLight ? 'border-stone-300 bg-stone-200/50' : 'border-himalayan-ivory/10 bg-himalayan-charcoal/40'
            }`}>
              <div className="flex items-center gap-2 text-xs font-mono-tech text-himalayan-amber uppercase tracking-wider font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>FORAGING & ORIGIN</span>
              </div>
              <p className={`text-xs font-editorial italic ${isLight ? 'text-stone-800' : 'text-himalayan-bone'}`}>
                {dish.provenance}
              </p>
            </div>

            {/* Flavor Notes */}
            <div>
              <span className={`text-[10px] font-mono-tech tracking-widest uppercase block mb-2 font-semibold ${
                isLight ? 'text-stone-600' : 'text-himalayan-fog'
              }`}>
                TASTING NOTES
              </span>
              <div className="flex flex-wrap gap-2">
                {dish.notes.map((note) => (
                  <span
                    key={note}
                    className="px-2.5 py-1 rounded-md text-[10px] font-mono-tech border border-himalayan-amber/40 bg-himalayan-amber/15 text-himalayan-amber font-semibold"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Sommelier Pairing */}
            <div className={`flex items-start gap-3 pt-2 border-t text-xs ${
              isLight ? 'border-stone-300' : 'border-himalayan-ivory/10'
            }`}>
              <Wine className="w-4 h-4 text-himalayan-amber mt-0.5 shrink-0" />
              <div>
                <span className={`font-mono-tech text-[10px] tracking-widest uppercase block font-semibold ${
                  isLight ? 'text-stone-900' : 'text-himalayan-ivory'
                }`}>
                  RECOMMENDED PAIRING
                </span>
                <span className={`font-editorial italic ${isLight ? 'text-stone-800' : 'text-himalayan-bone'}`}>
                  {dish.pairing}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex gap-4">
              <button
                onClick={() => {
                  onClose();
                  onReserve();
                }}
                className="w-full py-3.5 rounded-full bg-himalayan-amber hover:bg-himalayan-ember text-white text-xs font-mono-tech tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>EXPERIENCE IN TASTING MENU</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
