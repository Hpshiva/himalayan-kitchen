import { ArrowUp, Compass, Globe, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onScrollToTop: () => void;
  onContact: () => void;
  theme?: 'dark' | 'light';
}

export function Footer({ onScrollToTop, onContact, theme = 'dark' }: FooterProps) {
  const isLight = theme === 'light';

  return (
    <footer className={`relative w-full border-t pt-12 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-6 md:px-12 pointer-events-auto z-10 transition-colors ${
      isLight ? 'bg-stone-200/60 border-stone-300 text-stone-600' : 'bg-himalayan-void border-himalayan-ivory/10 text-himalayan-fog'
    }`}>
      <div className="max-w-7xl mx-auto w-full">
        {/* Top Tier: Monogram & Press Quote */}
        <div className={`flex flex-col lg:flex-row justify-between items-start pb-8 sm:pb-16 border-b gap-6 sm:gap-10 ${
          isLight ? 'border-stone-300' : 'border-himalayan-ivory/10'
        }`}>
          <div className="max-w-md">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-himalayan-amber/50 flex items-center justify-center shrink-0 ${
                isLight ? 'bg-stone-100' : 'bg-himalayan-charcoal'
              }`}>
                <Compass className="w-4 h-4 text-himalayan-amber" />
              </div>
              <span className={`font-display text-base sm:text-lg tracking-[0.2em] sm:tracking-[0.25em] uppercase font-bold ${
                isLight ? 'text-stone-900' : 'text-himalayan-ivory'
              }`}>
                Himalayan Kitchen
              </span>
            </div>
            <p className={`font-editorial text-lg sm:text-xl italic leading-relaxed ${
              isLight ? 'text-stone-800' : 'text-himalayan-bone'
            }`}>
              “An unprecedented collision of high-altitude Himalayan botanicals and the scorched iron woks of Tangra.”
            </p>
            <span className="text-[10px] font-mono-tech tracking-widest text-himalayan-amber mt-2 block uppercase font-semibold">
              — Global Culinary Chronicle, 2026 Preview
            </span>
          </div>

          {/* Quick Newsletter / Highland Dispatch */}
          <div className="w-full lg:w-96 min-w-0">
            <span className={`text-xs font-mono-tech tracking-[0.2em] sm:tracking-[0.25em] uppercase block mb-2 sm:mb-3 font-semibold ${
              isLight ? 'text-stone-900' : 'text-himalayan-ivory'
            }`}>
              THE HIGHLAND DISPATCH
            </span>
            <p className={`text-xs font-sans-clean mb-3 sm:mb-4 leading-relaxed ${
              isLight ? 'text-stone-600' : 'text-himalayan-fog'
            }`}>
              Receive private notifications when seasonal foraging menus and private hearth seatings open.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("You are subscribed to The Highland Dispatch."); }} className="flex gap-2 w-full">
              <input
                type="email"
                required
                placeholder="YOUR EMAIL ADDRESS"
                className={`w-full min-w-0 border rounded-lg px-3.5 py-2.5 text-xs font-mono-tech focus:outline-none focus:border-himalayan-amber ${
                  isLight
                    ? 'bg-stone-100 border-stone-300 text-stone-900'
                    : 'bg-himalayan-charcoal/60 border-himalayan-ivory/15 text-himalayan-ivory'
                }`}
              />
              <button
                type="submit"
                className="px-4 sm:px-5 py-2.5 bg-himalayan-amber hover:bg-himalayan-ember text-white text-xs font-mono-tech tracking-widest rounded-lg transition-colors uppercase shrink-0 font-semibold"
                data-cursor="JOIN"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* Center Grid: Contact & Practical Details */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 py-8 sm:py-12 border-b text-xs font-mono-tech ${
          isLight ? 'border-stone-300' : 'border-himalayan-ivory/10'
        }`}>
          {/* Col 1: Location */}
          <div className="space-y-1.5 sm:space-y-2">
            <span className="text-himalayan-amber tracking-widest uppercase block mb-2 sm:mb-3 font-semibold">
              SANCTUARY LOCATION
            </span>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-himalayan-amber mt-0.5 shrink-0" />
              <div>
                <p className={isLight ? 'text-stone-900' : 'text-himalayan-bone'}>Gate Village 08, Podium Level</p>
                <p className={isLight ? 'text-stone-700' : 'text-himalayan-fog'}>DIFC, Dubai, United Arab Emirates</p>
                <p className="text-himalayan-amber mt-1">25°12′18″N 55°16′38″E • 8,848M PROVENANCE</p>
              </div>
            </div>
          </div>

          {/* Col 2: Service Hours */}
          <div className="space-y-1.5 sm:space-y-2">
            <span className="text-himalayan-amber tracking-widest uppercase block mb-2 sm:mb-3 font-semibold">
              TASTING SEATINGS
            </span>
            <p className={isLight ? 'text-stone-900' : 'text-himalayan-bone'}>Tuesday – Sunday</p>
            <p>Lunch: 12:00 – 15:30 (Alpine Light)</p>
            <p>Dinner: 18:30 – 23:00 (Midnight Embers)</p>
            <p className="text-himalayan-amber text-[10px]">Late Hearth Lounge: Until 02:00 AM</p>
          </div>

          {/* Col 3: Direct Inquiries */}
          <div className="space-y-1.5 sm:space-y-2">
            <span className="text-himalayan-amber tracking-widest uppercase block mb-2 sm:mb-3 font-semibold">
              EXPEDITION DESK
            </span>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-himalayan-amber shrink-0" />
              <a href="mailto:concierge@himalayankitchen.ae" className="hover:text-himalayan-amber transition-colors truncate">
                concierge@himalayankitchen.ae
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-himalayan-amber shrink-0" />
              <a href="tel:+97143988848" className="hover:text-himalayan-amber transition-colors">
                +971 4 398 8848
              </a>
            </div>
            <button
              onClick={onContact}
              className="text-himalayan-amber underline hover:text-stone-900 dark:hover:text-white transition-colors block pt-1 sm:pt-2"
            >
              Send Direct Inquiry Form →
            </button>
          </div>

          {/* Col 4: Digital Channels */}
          <div className="space-y-1.5 sm:space-y-2">
            <span className="text-himalayan-amber tracking-widest uppercase block mb-2 sm:mb-3 font-semibold">
              DIGITAL ARCHIVE
            </span>
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-himalayan-amber shrink-0" />
              <a href="#instagram" className="hover:text-himalayan-amber transition-colors">
                @himalayankitchen.ae
              </a>
            </div>
            <p className={isLight ? 'text-stone-500' : 'text-himalayan-fog'}>
              Press: press@himalayankitchen.ae
            </p>
          </div>
        </div>

        {/* Bottom Tier: Copyright & Back To Top */}
        <div className={`pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] font-mono-tech gap-3 sm:gap-4 ${
          isLight ? 'text-stone-500' : 'text-himalayan-fog/60'
        }`}>
          <div className="text-center sm:text-left">
            <span>© 2026 HIMALAYAN KITCHEN DUBAI. ALL RIGHTS RESERVED.</span>
          </div>

          <button
            onClick={onScrollToTop}
            className={`flex items-center gap-2 hover:text-himalayan-amber transition-colors group shrink-0 ${
              isLight ? 'text-stone-800' : 'text-himalayan-ivory'
            }`}
            data-cursor="SUMMIT"
          >
            <span className="tracking-widest uppercase font-semibold">ASCEND TO SUMMIT</span>
            <div className={`w-6 h-6 rounded-full border group-hover:border-himalayan-amber flex items-center justify-center transition-colors ${
              isLight ? 'border-stone-400' : 'border-himalayan-ivory/20'
            }`}>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
