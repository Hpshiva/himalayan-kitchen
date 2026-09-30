import { useState } from 'react';
import { Compass, Mail, Phone, MapPin, Send, CheckCircle2, ArrowLeft, Clock, ShieldCheck, Globe } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface ContactPageProps {
  onBack: () => void;
  theme?: 'dark' | 'light';
}

export function ContactPage({ onBack, theme = 'dark' }: ContactPageProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'reservation',
    guests: '2',
    date: '',
    message: '',
  });

  const isLight = theme === 'light';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playSingingBowl(440, 2.5);
    setSubmitted(true);
  };

  return (
    <div className={`min-h-screen w-full pt-20 sm:pt-28 pb-12 sm:pb-20 px-4 sm:px-6 md:px-12 relative z-30 transition-colors ${
      isLight ? 'bg-stone-50 text-stone-900' : 'bg-himalayan-void text-himalayan-ivory'
    }`}>
      <div className="max-w-6xl mx-auto w-full">
        {/* Top Back Navigation */}
        <button
          onClick={onBack}
          className={`group inline-flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono-tech tracking-[0.2em] sm:tracking-[0.25em] uppercase transition-colors mb-6 sm:mb-12 border-b border-transparent hover:border-himalayan-amber pb-1 ${
            isLight ? 'text-stone-600 hover:text-himalayan-amber' : 'text-himalayan-fog hover:text-himalayan-amber'
          }`}
          data-cursor="BACK"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform text-himalayan-amber" />
          <span>RETURN TO SANCTUARY EXPEDITION</span>
        </button>

        {/* Header Masthead */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between border-b pb-4 sm:pb-8 mb-8 sm:mb-16 gap-4 sm:gap-6 ${
          isLight ? 'border-stone-300' : 'border-himalayan-ivory/10'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-himalayan-amber text-[10px] sm:text-xs font-mono-tech tracking-[0.25em] sm:tracking-[0.3em] uppercase mb-1.5 sm:mb-2">
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>COMMUNICATION ARCHIVE</span>
            </div>
            <h1 className={`font-display text-3xl sm:text-5xl md:text-7xl uppercase tracking-tight ${
              isLight ? 'text-stone-900' : 'text-himalayan-ivory'
            }`}>
              Expedition Desk
            </h1>
          </div>

          <div className={`max-w-sm text-[11px] sm:text-xs font-mono-tech tracking-wider sm:tracking-widest uppercase ${
            isLight ? 'text-stone-600' : 'text-himalayan-fog'
          }`}>
            RESERVATIONS, PRIVATE HEARTH BUYOUTS & FORAGED CULINARY INQUIRIES AT 8,848 METERS.
          </div>
        </div>

        {/* 2-Column Architectural Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Sanctuary Dossier & Logistics */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-10">
            {/* Architectural Dossier */}
            <div className={`p-5 sm:p-8 rounded-xl sm:rounded-2xl border backdrop-blur-md space-y-4 sm:space-y-6 ${
              isLight ? 'border-stone-300 bg-stone-200/50' : 'border-himalayan-ivory/15 bg-himalayan-charcoal/40'
            }`}>
              <span className="text-xs font-mono-tech tracking-[0.25em] text-himalayan-amber uppercase block font-semibold">
                THE PHYSICAL SANCTUARY
              </span>

              <div className="space-y-4 text-xs font-mono-tech">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-himalayan-amber mt-0.5 shrink-0" />
                  <div>
                    <span className={`block font-semibold ${isLight ? 'text-stone-900' : 'text-himalayan-ivory'}`}>
                      SANCTUARY LOCATION & ADDRESS
                    </span>
                    <p className={isLight ? 'text-stone-700' : 'text-himalayan-bone'}>Podium Level, Gate Village 08, DIFC</p>
                    <p className={isLight ? 'text-stone-500' : 'text-himalayan-fog'}>Dubai International Financial Centre, Dubai, UAE</p>
                    <p className="text-himalayan-amber text-[10px] mt-0.5">25°12′18″N 55°16′38″E • Provenance: Solukhumbu 8,848m</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-himalayan-amber mt-0.5 shrink-0" />
                  <div>
                    <span className={`block font-semibold ${isLight ? 'text-stone-900' : 'text-himalayan-ivory'}`}>
                      SERVICE SEATINGS (GST)
                    </span>
                    <p className={isLight ? 'text-stone-700' : 'text-himalayan-bone'}>Tuesday – Sunday</p>
                    <p className={isLight ? 'text-stone-500' : 'text-himalayan-fog'}>Lunch: 12:00 – 15:30 | Dinner: 18:30 & 21:15</p>
                    <p className="text-himalayan-amber text-[10px] mt-0.5">Late Hearth Lounge: Until 02:00 AM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-himalayan-amber mt-0.5 shrink-0" />
                  <div>
                    <span className={`block font-semibold ${isLight ? 'text-stone-900' : 'text-himalayan-ivory'}`}>
                      DIRECT DISPATCH
                    </span>
                    <a href="mailto:concierge@himalayankitchen.ae" className="text-himalayan-amber hover:underline">
                      concierge@himalayankitchen.ae
                    </a>
                    <span className="block opacity-60 text-[10px]">Reservations: reservations@himalayankitchen.ae</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-himalayan-amber mt-0.5 shrink-0" />
                  <div>
                    <span className={`block font-semibold ${isLight ? 'text-stone-900' : 'text-himalayan-ivory'}`}>
                      CONCIERGE & WHATSAPP
                    </span>
                    <a href="tel:+97143988848" className={`hover:text-himalayan-amber block ${isLight ? 'text-stone-700' : 'text-himalayan-bone'}`}>
                      +971 4 398 8848 (Landline)
                    </a>
                    <a href="tel:+971508488848" className={`hover:text-himalayan-amber text-[11px] block ${isLight ? 'text-stone-500' : 'text-himalayan-fog'}`}>
                      +971 50 848 8848 (VIP Concierge)
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrival Protocol */}
            <div className={`p-5 sm:p-8 rounded-xl sm:rounded-2xl border space-y-3 sm:space-y-4 ${
              isLight ? 'border-amber-300 bg-amber-50/40' : 'border-himalayan-amber/20 bg-himalayan-void/60'
            }`}>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono-tech text-himalayan-amber uppercase tracking-wider sm:tracking-widest font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>EXPEDITION ARRIVAL PROTOCOL</span>
              </div>
              <p className={`text-[11px] sm:text-xs font-sans-clean leading-relaxed ${
                isLight ? 'text-stone-700' : 'text-himalayan-fog'
              }`}>
                Complimentary VIP Valet Parking is provided at the DIFC Gate Village 08 main drop-off on Al Sukook Street. Private dining suites, bespoke tasting menus, and helipad transfer coordination are available upon advance inquiry with our Dubai Concierge.
              </p>
              <div className={`pt-1 sm:pt-2 flex items-center gap-2 text-[10px] sm:text-[11px] font-mono-tech ${
                isLight ? 'text-stone-800' : 'text-himalayan-bone'
              }`}>
                <Globe className="w-3.5 h-3.5 text-himalayan-amber" />
                <a href="#instagram" className="hover:text-himalayan-amber transition-colors">
                  @himalayankitchen.ae (Journal of Highland Gastronomy)
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Dispatch Form */}
          <div className="lg:col-span-7">
            <div className={`p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border backdrop-blur-xl shadow-2xl relative overflow-hidden ${
              isLight ? 'border-stone-300 bg-stone-100' : 'border-himalayan-ivory/15 bg-himalayan-charcoal/60'
            }`}>
              {submitted ? (
                <div className="py-12 sm:py-16 text-center space-y-4 sm:space-y-6 flex flex-col items-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-himalayan-amber bg-himalayan-amber/20 flex items-center justify-center text-himalayan-amber animate-pulse">
                    <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className={`font-display text-xl sm:text-2xl md:text-3xl uppercase tracking-wide ${
                    isLight ? 'text-stone-900' : 'text-himalayan-ivory'
                  }`}>
                    Dispatch Received
                  </h3>
                  <p className={`font-editorial text-base sm:text-lg italic max-w-md ${
                    isLight ? 'text-stone-700' : 'text-himalayan-bone'
                  }`}>
                    “Our Expedition Concierge will contact you within 6 hours to confirm your seating and mountain logistics.”
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full border border-himalayan-amber text-[10px] sm:text-xs font-mono-tech tracking-widest uppercase transition-colors text-himalayan-amber hover:bg-himalayan-amber hover:text-white"
                  >
                    SEND ANOTHER INQUIRY
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <span className="text-[10px] font-mono-tech tracking-[0.2em] sm:tracking-[0.25em] text-himalayan-amber uppercase block mb-2 font-semibold">
                      INQUIRY SPECIFICATION
                    </span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        { id: 'reservation', label: 'TABLE SEATS' },
                        { id: 'private', label: 'HEARTH BUYOUT' },
                        { id: 'press', label: 'EDITORIAL' },
                        { id: 'forager', label: 'PURVEYOR' },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setFormData({ ...formData, inquiryType: item.id })}
                          className={`py-2 px-2 sm:px-3 text-[9px] sm:text-[10px] font-mono-tech tracking-wider rounded-lg border transition-all text-center ${
                            formData.inquiryType === item.id
                              ? 'border-himalayan-amber bg-himalayan-amber/20 text-himalayan-amber font-bold'
                              : isLight
                              ? 'border-stone-300 text-stone-600 hover:border-stone-500'
                              : 'border-himalayan-ivory/10 text-himalayan-fog hover:border-himalayan-ivory/30'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Email Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className={`text-[10px] sm:text-[11px] font-mono-tech tracking-wider block uppercase ${
                        isLight ? 'text-stone-700' : 'text-himalayan-fog'
                      }`}>
                        GUEST FULL NAME *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Tenzing Norgay"
                        className={`w-full border rounded-lg px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs font-mono-tech focus:outline-none focus:border-himalayan-amber transition-colors ${
                          isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-himalayan-void/80 border-himalayan-ivory/15 text-himalayan-ivory'
                        }`}
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <label className={`text-[10px] sm:text-[11px] font-mono-tech tracking-wider block uppercase ${
                        isLight ? 'text-stone-700' : 'text-himalayan-fog'
                      }`}>
                        EMAIL DISPATCH *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="guest@sanctuary.com"
                        className={`w-full border rounded-lg px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs font-mono-tech focus:outline-none focus:border-himalayan-amber transition-colors ${
                          isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-himalayan-void/80 border-himalayan-ivory/15 text-himalayan-ivory'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Phone & Party Count */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className={`text-[10px] sm:text-[11px] font-mono-tech tracking-wider block uppercase ${
                        isLight ? 'text-stone-700' : 'text-himalayan-fog'
                      }`}>
                        CONTACT TELEPHONE
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 019-2834"
                        className={`w-full border rounded-lg px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs font-mono-tech focus:outline-none focus:border-himalayan-amber transition-colors ${
                          isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-himalayan-void/80 border-himalayan-ivory/15 text-himalayan-ivory'
                        }`}
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <label className={`text-[10px] sm:text-[11px] font-mono-tech tracking-wider block uppercase ${
                        isLight ? 'text-stone-700' : 'text-himalayan-fog'
                      }`}>
                        PARTY SIZE / GUESTS
                      </label>
                      <select
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        className={`w-full border rounded-lg px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs font-mono-tech focus:outline-none focus:border-himalayan-amber transition-colors ${
                          isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-himalayan-void/80 border-himalayan-ivory/15 text-himalayan-ivory'
                        }`}
                      >
                        <option value="2">2 GUESTS (INTIMATE HEARTH)</option>
                        <option value="4">4 GUESTS (RIDGE TABLE)</option>
                        <option value="6">6 GUESTS (CHEF’S BENCH)</option>
                        <option value="12+">12+ GUESTS (PRIVATE SANCTUARY)</option>
                      </select>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className={`text-[10px] sm:text-[11px] font-mono-tech tracking-wider block uppercase ${
                      isLight ? 'text-stone-700' : 'text-himalayan-fog'
                    }`}>
                      DIETARY PREFERENCES & EXPEDITION NOTES
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please note any allergies, special anniversary celebrations, or helicopter transfer requests..."
                      className={`w-full border rounded-lg p-3.5 sm:p-4 text-xs font-mono-tech focus:outline-none focus:border-himalayan-amber transition-colors resize-none ${
                        isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-himalayan-void/80 border-himalayan-ivory/15 text-himalayan-ivory'
                      }`}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 sm:py-4 rounded-xl bg-himalayan-amber hover:bg-himalayan-ember text-white text-[11px] sm:text-xs font-mono-tech tracking-[0.2em] sm:tracking-[0.25em] uppercase transition-all duration-300 shadow-xl shadow-himalayan-amber/25 flex items-center justify-center gap-2.5 sm:gap-3 group"
                    data-cursor="TRANSMIT"
                  >
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    <span>TRANSMIT EXPEDITION INQUIRY</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
