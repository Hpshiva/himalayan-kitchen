import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { HimalayanCanvas } from './components/canvas/HimalayanCanvas';
import { CinematicLoader } from './components/ui/CinematicLoader';
import { Navbar } from './components/ui/Navbar';
import { CustomCursor } from './components/ui/CustomCursor';
import { HeroSection } from './components/sections/HeroSection';
import { JourneySection } from './components/sections/JourneySection';
import { CuisineSection } from './components/sections/CuisineSection';
import { FoodStorySection } from './components/sections/FoodStorySection';
import { LifestyleSection } from './components/sections/LifestyleSection';
import { AtmosphereSection } from './components/sections/AtmosphereSection';
import { FinalCtaSection } from './components/sections/FinalCtaSection';
import { Footer } from './components/ui/Footer';
import { soundEngine } from './utils/audio';
import type { Dish } from './types';

// Code splitting & on-demand lazy loading for heavy sub-pages and interactive modals
const ContactPage = lazy(() =>
  import('./components/pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const DishModal = lazy(() =>
  import('./components/ui/DishModal').then((m) => ({ default: m.DishModal }))
);
const ReservationModal = lazy(() =>
  import('./components/ui/ReservationModal').then((m) => ({ default: m.ReservationModal }))
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroProgress, setHeroProgress] = useState(0);
  const [activeCategory, setActiveCategory] = useState<'nepali' | 'indochinese' | 'botanical'>('nepali');
  const [currentChapter, setCurrentChapter] = useState('01 SUMMIT');
  const [activePage, setActivePage] = useState<'home' | 'contact'>('home');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [reservationOpen, setReservationOpen] = useState(false);

  const lenisRef = useRef<Lenis | null>(null);

  // Sync theme with document element classes
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Auto-start continuous alpine audio on user interaction
  useEffect(() => {
    const handleGesture = () => {
      soundEngine.enableSound();
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('scroll', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      soundEngine.updateMouseModulation(normX, normY);
    };

    window.addEventListener('click', handleGesture, { passive: true });
    window.addEventListener('scroll', handleGesture, { passive: true });
    window.addEventListener('touchstart', handleGesture, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('scroll', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Shared scroll event processor
  const handleScrollUpdate = (scrollY: number, progress: number) => {
    setScrollProgress(progress);

    // Hero section scroll track calculation (h-[360vh] has ~2.6 * innerHeight scroll range)
    const heroTrack = window.innerHeight * 2.6;
    const currentHeroProgress = Math.min(1, Math.max(0, scrollY / heroTrack));
    setHeroProgress(currentHeroProgress);

    // Modulate audio continuous layers: altar cooking in Hero, constant wind + stream water + falling snow post-Hero
    soundEngine.updateScrollModulation(progress, currentHeroProgress);

    // Determine active chapter based on scroll position
    if (progress < 0.18) {
      setCurrentChapter('01 SUMMIT');
    } else if (progress < 0.38) {
      setCurrentChapter('02 GENESIS');
    } else if (progress < 0.58) {
      setCurrentChapter('03 DUAL CUISINE');
    } else if (progress < 0.74) {
      setCurrentChapter('04 HARVEST');
    } else if (progress < 0.88) {
      setCurrentChapter('05 ARCHIVE');
    } else {
      setCurrentChapter('06 HEARTH');
    }
  };

  // Initialize Pure Lenis Smooth Scroll Engine (Normal Speed, Native Mobile Touch)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0, // Normal, snappy smooth scroll duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0, // Normal 1:1 scroll responsiveness
      touchMultiplier: 1.0,
      syncTouch: false, // Pure native hardware-accelerated touch momentum on mobile
      autoResize: true,
    });
    lenisRef.current = lenis;

    const unsubscribe = lenis.on('scroll', (e) => {
      handleScrollUpdate(e.scroll, e.progress);
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    lenis.resize();

    return () => {
      cancelAnimationFrame(rafId);
      if (typeof unsubscribe === 'function') unsubscribe();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActivePage('home');
    setTimeout(() => {
      const targetId = sectionId === 'mountain-emergence' ? 'journey' : sectionId;
      const el = document.getElementById(targetId);
      if (el) {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(el, { offset: -60, duration: 1.0 });
        } else {
          el.scrollIntoView();
        }
      }
    }, 50);
  };

  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.0 });
    } else {
      window.scrollTo(0, 0);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isLight = theme === 'light';

  return (
    <div
      className={`relative min-h-screen w-full transition-colors duration-500 ${
        isLight
          ? 'bg-stone-50 text-stone-900 selection:bg-himalayan-amber selection:text-white'
          : 'bg-himalayan-void text-himalayan-ivory selection:bg-himalayan-amber selection:text-white'
      }`}
    >
      {/* Mountain Grain Overlay for raw tactile stone aesthetic */}
      <div className="mountain-grain" />

      {/* Interactive Trailing Cursor */}
      <CustomCursor />

      {/* 01: Unique Cinematic Mountain Elevation Loader */}
      {loading && (
        <CinematicLoader onComplete={() => setLoading(false)} theme={theme} />
      )}

      {/* Real-time 3D Three.js / React Three Fiber Himalayan Landscape */}
      <HimalayanCanvas
        scrollProgress={scrollProgress}
        heroProgress={heroProgress}
        theme={theme}
        activeDishCategory={activeCategory}
      />

      {/* Minimal Luxury Navigation */}
      <Navbar
        currentChapter={currentChapter}
        onNavigate={scrollToSection}
        onOpenReservation={() => setReservationOpen(true)}
        activePage={activePage}
        setActivePage={setActivePage}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main View Router */}
      {activePage === 'home' ? (
        <main className="relative z-10 flex flex-col w-full">
          {/* 02 — HERO: PINNED 3-ACT SCROLL CHOREOGRAPHY & GASTRONOMIC ALTAR */}
          <HeroSection
            onExplore={() => scrollToSection('journey')}
            onStory={() => scrollToSection('journey')}
            onReserve={() => setReservationOpen(true)}
            onSelectDish={setSelectedDish}
            theme={theme}
            heroProgress={heroProgress}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* 03 — THE HIMALAYAN JOURNEY */}
          <JourneySection theme={theme} />

          {/* 04 — THE CUISINE (MODIFIED NEPALI + INDIAN CHINESE) */}
          <CuisineSection onSelectDish={setSelectedDish} theme={theme} />

          {/* 05 — FOOD STORY (EDITORIAL DISH SHOWCASE) */}
          <FoodStorySection onSelectDish={setSelectedDish} theme={theme} />

          {/* 06 — HIMALAYAN LIFESTYLE & MATERIALITY */}
          <LifestyleSection theme={theme} />

          {/* 07 — THE RESTAURANT & SPATIAL ARCHITECTURE */}
          <AtmosphereSection onReserve={() => setReservationOpen(true)} theme={theme} />

          {/* 08 — FINAL CTA & EXPEDITION INVITATION */}
          <FinalCtaSection
            onReserve={() => setReservationOpen(true)}
            onContact={() => setActivePage('contact')}
            theme={theme}
          />

          {/* 09 — MINIMAL LUXURY FOOTER */}
          <Footer
            onScrollToTop={scrollToTop}
            onContact={() => setActivePage('contact')}
            theme={theme}
          />
        </main>
      ) : (
        <Suspense fallback={<div className="min-h-screen bg-stone-900" />}>
          <ContactPage onBack={() => setActivePage('home')} theme={theme} />
        </Suspense>
      )}

      {/* Code-split Interactive Modals (Loaded on-demand) */}
      <Suspense fallback={null}>
        {selectedDish && (
          <DishModal
            dish={selectedDish}
            onClose={() => setSelectedDish(null)}
            onReserve={() => setReservationOpen(true)}
            theme={theme}
          />
        )}
        {reservationOpen && (
          <ReservationModal
            isOpen={reservationOpen}
            onClose={() => setReservationOpen(false)}
            theme={theme}
          />
        )}
      </Suspense>
    </div>
  );
}
