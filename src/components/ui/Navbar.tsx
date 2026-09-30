import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ArrowUpRight, Compass, Sparkles, Sun, Moon } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface NavbarProps {
  currentChapter: string;
  onNavigate: (sectionId: string) => void;
  onOpenReservation: () => void;
  activePage: 'home' | 'contact';
  setActivePage: (page: 'home' | 'contact') => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function Navbar({
  currentChapter,
  onNavigate,
  onOpenReservation,
  activePage,
  setActivePage,
  theme,
  onToggleTheme,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(!soundEngine.getMuted());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const unsubscribe = soundEngine.subscribe((active) => {
      setIsAudioActive(active);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const toggleAudio = () => {
    const active = soundEngine.toggleMute();
    setIsAudioActive(active);
  };

  const handleNavClick = (sectionId: string) => {
    setMenuOpen(false);
    if (activePage !== 'home') {
      setActivePage('home');
      setTimeout(() => {
        onNavigate(sectionId);
      }, 100);
    } else {
      onNavigate(sectionId);
    }
  };

  const isLight = theme === 'light';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? isLight
              ? 'py-1.5 sm:py-2 md:py-2.5 bg-stone-100/90 backdrop-blur-md border-b border-stone-300 shadow-md text-stone-900'
              : 'py-1.5 sm:py-2 md:py-2.5 bg-himalayan-void/85 backdrop-blur-md border-b border-himalayan-ivory/10 shadow-2xl text-himalayan-ivory'
            : isLight
            ? 'py-2.5 sm:py-3 md:py-3.5 bg-transparent text-stone-900'
            : 'py-2.5 sm:py-3 md:py-3.5 bg-transparent text-himalayan-ivory'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo & Altitude Coordinate */}
          <div
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-2 sm:gap-3 group cursor-pointer shrink-0"
            data-cursor="SUMMIT"
          >
            {/* Minimal Mountain Monogram */}
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
              isLight
                ? 'border-stone-400 group-hover:border-himalayan-amber bg-stone-200/60'
                : 'border-himalayan-ivory/20 group-hover:border-himalayan-amber bg-himalayan-charcoal/40'
            }`}>
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-himalayan-amber" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 20L12 4L21 20H3Z" />
                <path d="M8 20L12 11L16 20" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="font-display text-xs sm:text-sm md:text-base tracking-[0.16em] sm:tracking-[0.22em] uppercase font-bold group-hover:text-himalayan-amber transition-colors">
                Himalayan Kitchen
              </span>
              <span className={`font-mono-tech text-[8px] sm:text-[9px] tracking-[0.15em] sm:tracking-[0.2em] hidden sm:block ${isLight ? 'text-stone-500' : 'text-himalayan-fog'}`}>
                8,848M ELEVATION
              </span>
            </div>
          </div>

          {/* Center: Live Narrative Chapter Indicator */}
          <div className={`hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-sm text-xs font-mono-tech ${
            isLight
              ? 'border-stone-300 bg-stone-200/50 text-stone-600'
              : 'border-himalayan-ivory/10 bg-himalayan-charcoal/30 text-himalayan-fog'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-himalayan-amber animate-pulse" />
            <span className="text-himalayan-amber font-semibold tracking-wider">CHAPTER:</span>
            <span className={`tracking-widest uppercase font-medium ${isLight ? 'text-stone-900' : 'text-himalayan-ivory'}`}>
              {currentChapter}
            </span>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
            {/* Theme Toggle: Sun / Moon */}
            <button
              onClick={onToggleTheme}
              className={`p-1.5 sm:p-2 rounded-full border transition-all ${
                isLight
                  ? 'border-stone-300 text-stone-700 hover:text-himalayan-amber hover:border-himalayan-amber bg-stone-200/40'
                  : 'border-himalayan-ivory/15 text-himalayan-ivory/70 hover:text-himalayan-amber hover:border-himalayan-amber bg-himalayan-charcoal/30'
              }`}
              title={isLight ? 'Switch to Himalayan Night (Dark Mode)' : 'Switch to Alpine Daylight (Light Mode)'}
              data-cursor="THEME"
              aria-label="Toggle Theme"
            >
              {isLight ? <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-himalayan-amber" /> : <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-himalayan-amber" />}
            </button>

            {/* Audio Toggle with Audio Wave Bars */}
            <button
              onClick={toggleAudio}
              className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-all ${
                isAudioActive
                  ? 'border-himalayan-amber bg-himalayan-amber/15 text-himalayan-amber'
                  : isLight
                  ? 'border-stone-300 text-stone-600 hover:border-himalayan-amber bg-stone-200/40'
                  : 'border-himalayan-ivory/15 text-himalayan-ivory/70 hover:border-himalayan-amber bg-himalayan-charcoal/30'
              }`}
              title={isAudioActive ? 'Mute Mountain Ambiance' : 'Enable Mountain Wind, Glacial Stream & Droplets'}
              data-cursor="SOUND"
              aria-label="Toggle Audio"
            >
              {isAudioActive ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-himalayan-amber animate-pulse" />
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-himalayan-amber rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
                    <span className="w-0.5 bg-himalayan-amber rounded-full animate-bounce h-3" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 bg-himalayan-amber rounded-full animate-bounce h-1.5" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[10px] font-mono-tech tracking-wider hidden sm:inline">SOUND ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono-tech tracking-wider hidden sm:inline">ENABLE SOUND</span>
                </>
              )}
            </button>

            {/* Contact / Inquiry Button */}
            <button
              onClick={() => setActivePage(activePage === 'contact' ? 'home' : 'contact')}
              className={`hidden sm:flex items-center gap-1.5 text-xs font-mono-tech tracking-[0.18em] uppercase px-3.5 py-1.5 md:py-2 rounded-full border transition-all ${
                activePage === 'contact'
                  ? 'border-himalayan-amber bg-himalayan-amber text-white'
                  : isLight
                  ? 'border-stone-300 text-stone-800 hover:border-stone-600'
                  : 'border-himalayan-ivory/20 text-himalayan-ivory hover:border-himalayan-ivory'
              }`}
              data-cursor="CONTACT"
            >
              <span>{activePage === 'contact' ? 'EXPEDITION' : 'CONTACT'}</span>
            </button>

            {/* Reserve Table Magnetic Button */}
            <button
              onClick={onOpenReservation}
              className="group relative px-2.5 sm:px-4 md:px-5 py-1 sm:py-1.5 md:py-2 overflow-hidden rounded-full border border-himalayan-amber bg-himalayan-amber/15 hover:bg-himalayan-amber text-himalayan-amber hover:text-white text-[9px] sm:text-[11px] md:text-xs font-mono-tech tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-1.5 sm:gap-2"
              data-cursor="BOOK"
            >
              <Sparkles className="w-3 h-3 group-hover:text-white transition-colors" />
              <span>RESERVE</span>
            </button>

            {/* Fullscreen Menu Trigger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 sm:p-2 hover:text-himalayan-amber transition-colors"
              aria-label="Open Navigation"
              data-cursor="MENU"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Luxury Editorial Menu Drawer */}
      <div
        className={`fixed inset-0 z-40 backdrop-blur-2xl transition-all duration-700 flex flex-col justify-between px-4 sm:px-8 md:px-16 pt-[88px] sm:pt-[96px] md:pt-[108px] pb-6 sm:pb-8 md:pb-12 overflow-y-auto max-h-screen ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } ${
          isLight ? 'bg-stone-100/98 text-stone-900' : 'bg-himalayan-void/98 text-himalayan-ivory'
        }`}
      >
        {/* Top Header inside drawer */}
        <div className={`flex justify-between items-center text-[10px] sm:text-xs font-mono-tech tracking-[0.2em] sm:tracking-[0.25em] border-b pb-3.5 sm:pb-5 mb-4 sm:mb-6 ${
          isLight ? 'text-stone-500 border-stone-300' : 'text-himalayan-fog border-himalayan-ivory/10'
        }`}>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-himalayan-amber" />
            <span>NAVIGATION ARCHIVE</span>
          </div>
          <span className="hidden sm:inline">DIFC DUBAI / HIMALAYAN PROVENANCE</span>
        </div>

        {/* Major Editorial Links */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 my-auto max-w-6xl mx-auto w-full py-6">
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
            <div className="text-[10px] sm:text-[11px] font-mono-tech tracking-[0.3em] text-himalayan-amber uppercase">
              JOURNEY SECTIONS
            </div>
            {[
              { id: 'hero', label: '01 The High Summit', sub: 'Arrival & Panorama' },
              { id: 'journey', label: '02 The Journey', sub: 'Altitude, Salt & Nomads' },
              { id: 'cuisine', label: '03 Dual Cuisine', sub: 'Modified Nepali & Hakka' },
              { id: 'food-story', label: '04 Culinary Harvest', sub: 'Morels, Prawns & Timur' },
              { id: 'lifestyle', label: '05 Materiality & Craft', sub: 'Slate, Charred Pine & Wool' },
              { id: 'atmosphere', label: '06 The Restaurant', sub: 'Hearth Sanctuary & Overlook' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`group text-left flex items-baseline justify-between border-b pb-2.5 sm:pb-3 hover:border-himalayan-amber transition-colors ${
                  isLight ? 'border-stone-300' : 'border-himalayan-ivory/10'
                }`}
                data-cursor="JUMP"
              >
                <div>
                  <span className={`font-display text-lg sm:text-2xl md:text-4xl group-hover:text-himalayan-amber group-hover:translate-x-2 sm:group-hover:translate-x-3 transition-all inline-block ${
                    isLight ? 'text-stone-900' : 'text-himalayan-ivory'
                  }`}>
                    {item.label}
                  </span>
                  <span className={`block text-[10px] sm:text-xs font-mono-tech tracking-wider mt-0.5 sm:mt-1 ${
                    isLight ? 'text-stone-500' : 'text-himalayan-fog'
                  }`}>
                    {item.sub}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-himalayan-amber group-hover:translate-x-1 group-hover:-translate-y-1 transition-all shrink-0" />
              </button>
            ))}
          </div>

          {/* Right Column: Culinary Details & Practical Information */}
          <div className={`flex flex-col justify-between border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-12 ${
            isLight ? 'border-stone-300' : 'border-himalayan-ivory/10'
          }`}>
            <div>
              <div className="text-[10px] sm:text-[11px] font-mono-tech tracking-[0.3em] text-himalayan-amber uppercase mb-3 sm:mb-4">
                THE SANCTUARY
              </div>
              <p className={`font-editorial text-base sm:text-lg md:text-xl leading-relaxed italic mb-6 sm:mb-8 ${
                isLight ? 'text-stone-800' : 'text-himalayan-bone'
              }`}>
                “We do not conquer the mountain; we bring its silent, eternal elements to your table. Every dish is a dialogue between Himalayan fire and ancient stone.”
              </p>
            </div>

            <div className={`grid grid-cols-2 gap-4 sm:gap-6 font-mono-tech text-[11px] sm:text-xs ${
              isLight ? 'text-stone-600' : 'text-himalayan-fog'
            }`}>
              <div>
                <span className={`block tracking-widest font-semibold mb-1 ${
                  isLight ? 'text-stone-900' : 'text-himalayan-ivory'
                }`}>
                  SEATINGS (GST)
                </span>
                <p>Lunch: 12:00 – 15:30</p>
                <p>Dinner: 18:30 & 21:15</p>
                <p>Tuesday – Sunday</p>
              </div>
              <div>
                <span className={`block tracking-widest font-semibold mb-1 ${
                  isLight ? 'text-stone-900' : 'text-himalayan-ivory'
                }`}>
                  LOCATION
                </span>
                <p>Gate Village 08, DIFC</p>
                <p>Dubai, UAE</p>
                <p>VIP Valet Parking</p>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setActivePage('contact');
                }}
                className={`w-full py-3 sm:py-4 border text-[10px] sm:text-xs font-mono-tech tracking-[0.2em] sm:tracking-[0.25em] uppercase hover:text-himalayan-amber hover:border-himalayan-amber transition-colors text-center ${
                  isLight ? 'border-stone-400 text-stone-900' : 'border-himalayan-ivory/20 text-himalayan-ivory'
                }`}
              >
                EXPEDITION DESK
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenReservation();
                }}
                className="w-full py-3 sm:py-4 bg-himalayan-amber hover:bg-himalayan-ember text-[10px] sm:text-xs font-mono-tech tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white transition-colors text-center font-semibold"
              >
                REQUEST SEATS
              </button>
            </div>
          </div>
        </div>

        {/* Footer status inside drawer */}
        <div className={`flex justify-between items-center text-[10px] font-mono-tech tracking-[0.2em] border-t pt-4 ${
          isLight ? 'text-stone-500 border-stone-300' : 'text-himalayan-fog/60 border-himalayan-ivory/10'
        }`}>
          <span>HIMALAYAN KITCHEN © 2026</span>
          <span>ALL RIGHTS RESERVED</span>
        </div>
      </div>
    </>
  );
}
