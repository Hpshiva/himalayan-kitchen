import { useState } from 'react';
import { X, Sparkles, CheckCircle2, Compass } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export function ReservationModal({ isOpen, onClose, theme = 'dark' }: ReservationModalProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [reservationCode, setReservationCode] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '2',
    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    seating: '18:00',
    experience: 'sagarmatha-8',
    notes: '',
  });

  if (!isOpen) return null;
  const isLight = theme === 'light';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = 'HK-' + Math.floor(100000 + Math.random() * 900000);
    setReservationCode(code);
    soundEngine.playSingingBowl(528, 3.5);
    setConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-6 md:p-10 pointer-events-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={`relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl shadow-2xl z-10 p-5 sm:p-8 md:p-10 border ${
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

        {confirmed ? (
          <div className="py-12 text-center space-y-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border border-himalayan-amber bg-himalayan-amber/20 flex items-center justify-center text-himalayan-amber animate-pulse">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono-tech text-himalayan-amber tracking-[0.25em] uppercase block font-semibold">
                EXPEDITION CONFIRMED
              </span>
              <h3 className={`font-display text-2xl sm:text-4xl uppercase tracking-wide ${
                isLight ? 'text-stone-900' : 'text-himalayan-ivory'
              }`}>
                Sanctuary Reserved
              </h3>
            </div>

            <div className={`p-6 rounded-2xl border w-full max-w-md text-left font-mono-tech text-xs space-y-3 ${
              isLight ? 'border-stone-300 bg-stone-200/60' : 'border-himalayan-ivory/15 bg-himalayan-charcoal/60'
            }`}>
              <div className={`flex justify-between border-b pb-2 ${isLight ? 'border-stone-300' : 'border-himalayan-ivory/10'}`}>
                <span className={isLight ? 'text-stone-600' : 'text-himalayan-fog'}>EXPEDITION CODE:</span>
                <span className="text-himalayan-amber font-bold">{reservationCode}</span>
              </div>
              <div className={`flex justify-between border-b pb-2 ${isLight ? 'border-stone-300' : 'border-himalayan-ivory/10'}`}>
                <span className={isLight ? 'text-stone-600' : 'text-himalayan-fog'}>GUEST:</span>
                <span className={isLight ? 'text-stone-900 font-medium' : 'text-himalayan-ivory'}>{formData.name}</span>
              </div>
              <div className={`flex justify-between border-b pb-2 ${isLight ? 'border-stone-300' : 'border-himalayan-ivory/10'}`}>
                <span className={isLight ? 'text-stone-600' : 'text-himalayan-fog'}>SEATING DATE:</span>
                <span className={isLight ? 'text-stone-900 font-medium' : 'text-himalayan-ivory'}>{formData.date} at {formData.seating}</span>
              </div>
              <div className="flex justify-between">
                <span className={isLight ? 'text-stone-600' : 'text-himalayan-fog'}>GUESTS:</span>
                <span className={isLight ? 'text-stone-900 font-medium' : 'text-himalayan-ivory'}>{formData.guests} Persons</span>
              </div>
            </div>

            <p className={`font-editorial text-sm md:text-base italic max-w-sm ${
              isLight ? 'text-stone-700' : 'text-himalayan-bone'
            }`}>
              “A digital courier dispatch has been sent to {formData.email}. We await your ascent to our Dubai hearth at Gate Village, DIFC.”
            </p>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-himalayan-amber hover:bg-himalayan-ember text-white text-xs font-mono-tech tracking-widest uppercase transition-colors shadow-lg"
            >
              CLOSE DOSSIER
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`border-b pb-4 ${isLight ? 'border-stone-300' : 'border-himalayan-ivory/10'}`}>
              <div className="flex items-center gap-2 text-himalayan-amber text-xs font-mono-tech tracking-[0.25em] uppercase mb-1 font-semibold">
                <Compass className="w-3.5 h-3.5" />
                <span>SANCTUARY RESERVATION • DIFC DUBAI</span>
              </div>
              <h3 className={`font-display text-2xl sm:text-3xl uppercase tracking-wide ${
                isLight ? 'text-stone-900' : 'text-himalayan-ivory'
              }`}>
                Book The Hearth Journey
              </h3>
            </div>

            {/* Experience Selector */}
            <div className="space-y-2">
              <label className={`text-[10px] font-mono-tech tracking-widest uppercase block font-semibold ${
                isLight ? 'text-stone-600' : 'text-himalayan-fog'
              }`}>
                GASTRONOMIC EXPERIENCE
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'sagarmatha-8',
                    title: 'SAGARMATHA TASTING',
                    sub: '8 Courses • AED 750 / guest',
                  },
                  {
                    id: 'hearth-10',
                    title: 'HEARTH & EMBER TASTING',
                    sub: '10 Courses + Pairings • AED 1,150 / guest',
                  },
                ].map((exp) => (
                  <div
                    key={exp.id}
                    onClick={() => setFormData({ ...formData, experience: exp.id })}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.experience === exp.id
                        ? 'border-himalayan-amber bg-himalayan-amber/15 shadow-lg'
                        : isLight
                        ? 'border-stone-300 bg-stone-200/50 hover:border-stone-500'
                        : 'border-himalayan-ivory/10 hover:border-himalayan-ivory/30 bg-himalayan-charcoal/30'
                    }`}
                  >
                    <span className={`font-display text-sm block uppercase font-bold ${
                      isLight ? 'text-stone-900' : 'text-himalayan-ivory'
                    }`}>
                      {exp.title}
                    </span>
                    <span className={`text-xs font-mono-tech ${isLight ? 'text-stone-600' : 'text-himalayan-fog'}`}>
                      {exp.sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Date, Seating & Party Size */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className={`text-[10px] font-mono-tech tracking-widest uppercase block font-semibold ${
                  isLight ? 'text-stone-600' : 'text-himalayan-fog'
                }`}>
                  EXPEDITION DATE
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full border rounded-lg p-2.5 text-xs font-mono-tech focus:outline-none focus:border-himalayan-amber ${
                    isLight
                      ? 'bg-stone-50 border-stone-300 text-stone-900'
                      : 'bg-himalayan-charcoal/60 border-himalayan-ivory/15 text-himalayan-ivory'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] font-mono-tech tracking-widest uppercase block font-semibold ${
                  isLight ? 'text-stone-600' : 'text-himalayan-fog'
                }`}>
                  HEARTH SEATING
                </label>
                <select
                  value={formData.seating}
                  onChange={(e) => setFormData({ ...formData, seating: e.target.value })}
                  className={`w-full border rounded-lg p-2.5 text-xs font-mono-tech focus:outline-none focus:border-himalayan-amber ${
                    isLight
                      ? 'bg-stone-50 border-stone-300 text-stone-900'
                      : 'bg-himalayan-charcoal/60 border-himalayan-ivory/15 text-himalayan-ivory'
                  }`}
                >
                  <option value="18:00">18:00 (SUNSET OVER PEAKS)</option>
                  <option value="20:30">20:30 (MIDNIGHT HEARTH)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] font-mono-tech tracking-widest uppercase block font-semibold ${
                  isLight ? 'text-stone-600' : 'text-himalayan-fog'
                }`}>
                  GUESTS
                </label>
                <select
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className={`w-full border rounded-lg p-2.5 text-xs font-mono-tech focus:outline-none focus:border-himalayan-amber ${
                    isLight
                      ? 'bg-stone-50 border-stone-300 text-stone-900'
                      : 'bg-himalayan-charcoal/60 border-himalayan-ivory/15 text-himalayan-ivory'
                  }`}
                >
                  <option value="1">1 GUEST</option>
                  <option value="2">2 GUESTS (INTIMATE)</option>
                  <option value="4">4 GUESTS (RIDGE TABLE)</option>
                  <option value="6">6 GUESTS (CHEF’S BENCH)</option>
                  <option value="8">8 GUESTS (ALCOVE)</option>
                </select>
              </div>
            </div>

            {/* Guest Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={`text-[10px] font-mono-tech tracking-widest uppercase block font-semibold ${
                  isLight ? 'text-stone-600' : 'text-himalayan-fog'
                }`}>
                  PRIMARY GUEST NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Pasang Lhamu"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full border rounded-lg p-2.5 text-xs font-mono-tech focus:outline-none focus:border-himalayan-amber ${
                    isLight
                      ? 'bg-stone-50 border-stone-300 text-stone-900'
                      : 'bg-himalayan-charcoal/60 border-himalayan-ivory/15 text-himalayan-ivory'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] font-mono-tech tracking-widest uppercase block font-semibold ${
                  isLight ? 'text-stone-600' : 'text-himalayan-fog'
                }`}>
                  DISPATCH EMAIL *
                </label>
                <input
                  type="email"
                  required
                  placeholder="guest@sanctuary.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full border rounded-lg p-2.5 text-xs font-mono-tech focus:outline-none focus:border-himalayan-amber ${
                    isLight
                      ? 'bg-stone-50 border-stone-300 text-stone-900'
                      : 'bg-himalayan-charcoal/60 border-himalayan-ivory/15 text-himalayan-ivory'
                  }`}
                />
              </div>
            </div>

            {/* Special Request */}
            <div className="space-y-2">
              <label className={`text-[10px] font-mono-tech tracking-widest uppercase block font-semibold ${
                isLight ? 'text-stone-600' : 'text-himalayan-fog'
              }`}>
                ALLERGIES & HIGH ALTITUDE TRANSPORTATION
              </label>
              <textarea
                rows={2}
                placeholder="Shellfish allergy, helicopter pad reservation request..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className={`w-full border rounded-lg p-2.5 text-xs font-mono-tech focus:outline-none focus:border-himalayan-amber resize-none ${
                  isLight
                    ? 'bg-stone-50 border-stone-300 text-stone-900'
                    : 'bg-himalayan-charcoal/60 border-himalayan-ivory/15 text-himalayan-ivory'
                }`}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-himalayan-amber hover:bg-himalayan-ember text-white text-xs font-mono-tech tracking-[0.25em] uppercase transition-all duration-300 shadow-xl shadow-himalayan-amber/25 flex items-center justify-center gap-2"
              data-cursor="RESERVE"
            >
              <Sparkles className="w-4 h-4" />
              <span>CONFIRM SANCTUARY SEATS</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
