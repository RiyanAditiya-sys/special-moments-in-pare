"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

/* ─────────────────────────────────────────────────────── */
/* Types                                                    */
/* ─────────────────────────────────────────────────────── */
interface Slide {
  id: string;
  category: string;
  image: string;
  caption: string;
  date?: string;
  location?: string;
}

/* ─────────────────────────────────────────────────────── */
/* Constants                                               */
/* ─────────────────────────────────────────────────────── */
const AUTOPLAY_DURATION = 5000; // ms
const AUTOPLAY_RESUME_DELAY = 3500; // ms after manual change
const PROGRESS_STEP = 50; // ms tick

/* ─────────────────────────────────────────────────────── */
/* Swipe hook                                              */
/* ─────────────────────────────────────────────────────── */
function useSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  threshold = 50
) {
  const touchStartX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) >= threshold) {
      delta < 0 ? onSwipeLeft() : onSwipeRight();
    }
    touchStartX.current = null;
  };

  return { onTouchStart, onTouchEnd };
}

/* ─────────────────────────────────────────────────────── */
/* Main Gallery Component                                  */
/* ─────────────────────────────────────────────────────── */
export default function Gallery() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1); // for slide direction
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const thumbnailStripRef = useRef<HTMLDivElement | null>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /* ── Load slides ── */
  useEffect(() => {
    fetch("/data/gallery.json")
      .then((r) => r.json())
      .then((data: any[]) => {
        const enriched = data.map((s, idx) => ({
          ...s,
          date:
            s.date ||
            (idx < 9
              ? `July ${5 + idx * 3}, 2026`
              : `August ${1 + (idx - 8) * 5}, 2026`),
          location: s.location || "Kampung Inggris, Pare",
        }));
        setSlides(enriched);
        thumbnailRefs.current = new Array(enriched.length).fill(null);
      })
      .catch(console.error);
  }, []);

  /* ── Navigation ── */
  const goTo = useCallback(
    (idx: number, dir?: 1 | -1) => {
      if (slides.length === 0) return;
      const clamped = ((idx % slides.length) + slides.length) % slides.length;
      setDirection(dir ?? (clamped > currentIndex ? 1 : -1));
      setCurrentIndex(clamped);
      setProgress(0);
    },
    [slides.length, currentIndex]
  );

  const next = useCallback(() => {
    goTo(currentIndex + 1, 1);
  }, [currentIndex, goTo]);

  const prev = useCallback(() => {
    goTo(currentIndex - 1, -1);
  }, [currentIndex, goTo]);

  /* ── Pause autoplay + schedule resume ── */
  const pauseAndScheduleResume = useCallback(() => {
    setIsPlaying(false);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPlaying(true);
    }, AUTOPLAY_RESUME_DELAY);
  }, []);

  const handleManualNext = useCallback(() => {
    next();
    pauseAndScheduleResume();
  }, [next, pauseAndScheduleResume]);

  const handleManualPrev = useCallback(() => {
    prev();
    pauseAndScheduleResume();
  }, [prev, pauseAndScheduleResume]);

  const handleThumbnailClick = useCallback(
    (idx: number) => {
      goTo(idx);
      pauseAndScheduleResume();
    },
    [goTo, pauseAndScheduleResume]
  );

  /* ── Autoplay engine ── */
  useEffect(() => {
    if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    const canPlay = isPlaying && !isHovering && !lightboxOpen && slides.length > 1;

    if (canPlay) {
      autoplayTimerRef.current = setInterval(() => {
        setDirection(1);
        setCurrentIndex((p) => (p + 1) % slides.length);
        setProgress(0);
      }, AUTOPLAY_DURATION);

      progressTimerRef.current = setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + (PROGRESS_STEP / AUTOPLAY_DURATION) * 100));
      }, PROGRESS_STEP);
    }

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying, isHovering, lightboxOpen, slides.length, currentIndex]);

  /* ── Scroll active thumbnail into view (strip-only, never touches page scroll) ── */
  useEffect(() => {
    const el = thumbnailRefs.current[currentIndex];
    const strip = thumbnailStripRef.current;
    if (!el || !strip) return;

    // Calculate target scrollLeft so the thumb is centered in the strip
    const thumbLeft = el.offsetLeft;
    const thumbWidth = el.offsetWidth;
    const stripWidth = strip.offsetWidth;
    const targetScroll = thumbLeft - stripWidth / 2 + thumbWidth / 2;

    strip.scrollTo({ left: targetScroll, behavior: "smooth" });
  }, [currentIndex]);

  /* ── Keyboard controls ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { lightboxOpen ? next() : handleManualNext(); }
      if (e.key === "ArrowLeft") { lightboxOpen ? prev() : handleManualPrev(); }
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, next, prev, handleManualNext, handleManualPrev]);

  /* ── Swipe handlers ── */
  const mainSwipe = useSwipe(handleManualNext, handleManualPrev);
  const lightboxSwipe = useSwipe(next, prev);

  if (slides.length === 0) return null;
  const slide = slides[currentIndex];

  /* ── Slide animation variants ── */
  const variants = {
    enter: (d: number) => ({ opacity: 0, scale: 1.04, filter: "blur(8px)", x: d * 30 }),
    center: { opacity: 1, scale: 1, filter: "blur(0px)", x: 0 },
    exit: (d: number) => ({ opacity: 0, scale: 0.97, filter: "blur(8px)", x: d * -30 }),
  };

  return (
    <section
      id="gallery"
      className="w-full bg-bg-primary border-b border-accent-gray flex flex-col"
      style={{
        paddingTop: "clamp(4rem, 10vw, 8rem)",
        paddingBottom: "clamp(4rem, 10vw, 8rem)",
        gap: "clamp(2rem, 4vw, 3rem)",
      }}
    >
      {/* ── Header ── */}
      <div className="chapter-container">
        <div className="flex items-end justify-between" style={{ gap: "1rem" }}>
          <div className="flex flex-col" style={{ gap: "0.6rem" }}>
            <span className="section-label">Flipping Memories</span>
            <h2
              className="font-serif font-light text-text-primary"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
              }}
            >
              Scrapbook Snapshot
            </h2>
          </div>

          {/* Counter — top right of header */}
          <span
            className="font-serif italic text-text-secondary shrink-0 self-end pb-1"
            style={{ fontSize: "clamp(1rem, 2vw, 1.375rem)", opacity: 0.55 }}
          >
            {String(currentIndex + 1).padStart(2, "0")}
            <span className="mx-1.5 opacity-40">—</span>
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* ── Main Slideshow Stage ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "21/9" }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        {...mainSwipe}
      >
        {/* Slide images with crossfade + zoom + blur */}
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <motion.div
            key={slide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.75, ease: [0.32, 0, 0.67, 0] }}
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{ backgroundImage: `url("${slide.image}")` }}
          />
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

        {/* Left nav arrow */}
        <button
          onClick={handleManualPrev}
          aria-label="Previous photo"
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10
                     flex items-center justify-center
                     w-10 h-10 md:w-12 md:h-12 rounded-full
                     bg-black/30 hover:bg-black/55
                     text-white backdrop-blur-md
                     border border-white/15 hover:border-white/30
                     transition-all duration-250 cursor-pointer
                     opacity-70 hover:opacity-100
                     hover:scale-105 active:scale-95"
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>

        {/* Right nav arrow */}
        <button
          onClick={handleManualNext}
          aria-label="Next photo"
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10
                     flex items-center justify-center
                     w-10 h-10 md:w-12 md:h-12 rounded-full
                     bg-black/30 hover:bg-black/55
                     text-white backdrop-blur-md
                     border border-white/15 hover:border-white/30
                     transition-all duration-250 cursor-pointer
                     opacity-70 hover:opacity-100
                     hover:scale-105 active:scale-95"
        >
          <ChevronRight size={20} strokeWidth={1.5} />
        </button>

        {/* Fullscreen button — top right */}
        <button
          onClick={() => setLightboxOpen(true)}
          aria-label="View fullscreen"
          className="absolute top-4 right-4 md:top-5 md:right-5 z-10
                     flex items-center justify-center
                     w-8 h-8 md:w-9 md:h-9 rounded-full
                     bg-black/30 hover:bg-black/55
                     text-white backdrop-blur-md
                     border border-white/15 hover:border-white/30
                     transition-all duration-250 cursor-pointer
                     opacity-0 hover:opacity-100 group-hover:opacity-100
                     [.relative:hover_&]:opacity-100"
        >
          <Maximize2 size={13} strokeWidth={1.5} />
        </button>

        {/* Bottom-left: caption overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-5 md:px-8 pb-4 md:pb-6 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.p
              key={slide.id + "-caption"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 0.9, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.4 }}
              className="font-serif italic text-white/90 max-w-xl"
              style={{ fontSize: "clamp(0.8rem, 1.5vw, 0.95rem)" }}
            >
              "{slide.caption}"
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-20 pointer-events-none">
          <motion.div
            className="h-full bg-accent-gold"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0 }}
          />
        </div>
      </div>

      {/* ── Thumbnail Strip ── */}
      <div className="w-full" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div
          ref={thumbnailStripRef}
          className="flex gap-2 md:gap-2.5 overflow-x-auto scroll-smooth pb-1"
          style={{
            paddingLeft: "clamp(1.5rem, 5vw, 6rem)",
            paddingRight: "clamp(1.5rem, 5vw, 6rem)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {slides.map((s, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={s.id}
                ref={(el) => { thumbnailRefs.current[idx] = el; }}
                onClick={() => handleThumbnailClick(idx)}
                aria-label={`Go to photo ${idx + 1}`}
                className="relative shrink-0 overflow-hidden rounded-sm cursor-pointer transition-all duration-300"
                style={{
                  width: "clamp(56px, 7.5vw, 96px)",
                  aspectRatio: "3/2",
                  opacity: isActive ? 1 : 0.45,
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                  outline: isActive ? "2px solid var(--accent-gold)" : "2px solid transparent",
                  outlineOffset: "2px",
                }}
              >
                <img
                  src={s.image}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
                {/* Active dot indicator */}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-gold" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Caption & Meta row ── */}
      <div className="chapter-container">
        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-center"
          style={{ gap: "0.75rem" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + "-meta"}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col"
              style={{ gap: "0.3rem", maxWidth: "52ch" }}
            >
              <div className="flex flex-wrap gap-x-3 gap-y-1 items-center section-label opacity-55">
                <span
                  className="px-1.5 py-0.5 rounded border border-accent-gray text-text-secondary"
                  style={{ fontSize: "0.55rem", letterSpacing: "0.2em" }}
                >
                  {slide.category}
                </span>
                <span>{slide.date}</span>
                <span className="opacity-40">·</span>
                <span>{slide.location}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Keyboard hint — desktop only */}
          <span
            className="hidden md:flex items-center gap-3 section-label opacity-35 shrink-0"
          >
            <span className="flex items-center gap-1">
              <kbd
                className="px-1.5 py-0.5 rounded border border-accent-gray text-text-secondary"
                style={{ fontSize: "0.55rem" }}
              >
                ←
              </kbd>
              <kbd
                className="px-1.5 py-0.5 rounded border border-accent-gray text-text-secondary"
                style={{ fontSize: "0.55rem" }}
              >
                →
              </kbd>
            </span>
            <span>Navigate</span>
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────── */}
      {/* Fullscreen Lightbox                                 */}
      {/* ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 flex flex-col bg-[#050505]"
            {...lightboxSwipe}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4 md:px-10 md:py-5 shrink-0">
              <div className="flex items-center gap-4">
                <span
                  className="px-2 py-0.5 rounded border border-neutral-700 text-neutral-400"
                  style={{ fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
                >
                  {slide.category}
                </span>
                <span
                  className="font-serif italic text-neutral-400"
                  style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)" }}
                >
                  {String(currentIndex + 1).padStart(2, "0")}
                  <span className="mx-1.5 opacity-40">—</span>
                  {String(slides.length).padStart(2, "0")}
                </span>
              </div>

              <button
                onClick={() => setLightboxOpen(false)}
                aria-label="Close fullscreen"
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors cursor-pointer group"
              >
                <X size={18} strokeWidth={1.5} className="transition-transform group-hover:rotate-90 duration-300" />
                <span
                  className="hidden md:block"
                  style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
                >
                  ESC to close
                </span>
              </button>
            </div>

            {/* Image area */}
            <div className="relative flex-1 flex items-center justify-center px-4 md:px-20 min-h-0">
              <AnimatePresence initial={false} custom={direction} mode="sync">
                <motion.img
                  key={slide.id + "-lb"}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.65, ease: [0.32, 0, 0.67, 0] }}
                  src={slide.image}
                  alt={slide.caption}
                  className="max-w-full max-h-full object-contain rounded-sm select-none"
                  style={{ maxHeight: "calc(100vh - 180px)" }}
                  draggable={false}
                />
              </AnimatePresence>

              {/* Lightbox Left arrow */}
              <button
                onClick={prev}
                aria-label="Previous photo"
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2
                           flex items-center justify-center
                           w-11 h-11 md:w-13 md:h-13 rounded-full
                           bg-white/8 hover:bg-white/18
                           text-white backdrop-blur-md
                           border border-white/10 hover:border-white/25
                           transition-all duration-200 cursor-pointer
                           hover:scale-105 active:scale-95"
              >
                <ChevronLeft size={22} strokeWidth={1.5} />
              </button>

              {/* Lightbox Right arrow */}
              <button
                onClick={next}
                aria-label="Next photo"
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2
                           flex items-center justify-center
                           w-11 h-11 md:w-13 md:h-13 rounded-full
                           bg-white/8 hover:bg-white/18
                           text-white backdrop-blur-md
                           border border-white/10 hover:border-white/25
                           transition-all duration-200 cursor-pointer
                           hover:scale-105 active:scale-95"
              >
                <ChevronRight size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Bottom bar — caption + thumbnail dots */}
            <div
              className="shrink-0 flex flex-col items-center px-6 py-5 md:px-10 md:py-6"
              style={{ gap: "0.75rem" }}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={slide.id + "-lb-caption"}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="font-serif italic text-neutral-300 text-center max-w-lg"
                  style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)" }}
                >
                  "{slide.caption}"
                </motion.p>
              </AnimatePresence>

              {/* Dot navigation */}
              <div className="flex items-center gap-1.5 flex-wrap justify-center" style={{ maxWidth: "80vw" }}>
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    aria-label={`Go to photo ${idx + 1}`}
                    className="rounded-full transition-all duration-300 cursor-pointer"
                    style={{
                      width: idx === currentIndex ? "20px" : "6px",
                      height: "6px",
                      background: idx === currentIndex ? "var(--accent-gold)" : "rgba(255,255,255,0.25)",
                    }}
                  />
                ))}
              </div>

              {/* Swipe hint — mobile only */}
              <p
                className="md:hidden text-neutral-600"
                style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
              >
                Swipe to navigate
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
