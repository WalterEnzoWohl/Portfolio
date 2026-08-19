import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { TbChevronLeft, TbChevronRight, TbPlayerPause, TbPlayerPlay } from "react-icons/tb";
import type { Language } from "../config/navigation";
import { workAreas, type WorkArea } from "../data/workAreas";
import WorkAreaCard from "./WorkAreaCard";

type MobileWorkAreasCarouselProps = {
  language: Language;
  onOpen: (area: WorkArea, trigger: HTMLButtonElement) => void;
};

const carouselCopy = {
  es: {
    label: "Áreas de trabajo",
    previous: "Ver área anterior",
    next: "Ver área siguiente",
    pause: "Pausar rotación automática",
    play: "Reanudar rotación automática",
    reduced: "La rotación automática está desactivada por la preferencia de movimiento reducido",
    goTo: "Ir al área",
    slide: "diapositiva"
  },
  en: {
    label: "Work areas",
    previous: "Show previous area",
    next: "Show next area",
    pause: "Pause automatic rotation",
    play: "Resume automatic rotation",
    reduced: "Automatic rotation is disabled by the reduced motion preference",
    goTo: "Go to area",
    slide: "slide"
  }
} as const;

const AUTO_ROTATION_MS = 3000;
const MANUAL_PAUSE_MS = 8000;

function wrapIndex(index: number) {
  return (index + workAreas.length) % workAreas.length;
}

function MobileWorkAreasCarousel({ language, onOpen }: MobileWorkAreasCarouselProps) {
  const copy = carouselCopy[language];
  const reduceMotion = useReducedMotion();
  const manualResumeTimerRef = useRef<number | null>(null);
  const suppressClickTimerRef = useRef<number | null>(null);
  const suppressCardClickRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPageVisible, setIsPageVisible] = useState(!document.hidden);
  const [isPointerActive, setIsPointerActive] = useState(false);
  const [isManualPause, setIsManualPause] = useState(false);
  const [isFocusPaused, setIsFocusPaused] = useState(false);
  const [autoplayEnabled, setAutoplayEnabled] = useState(!reduceMotion);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (reduceMotion) setAutoplayEnabled(false);
  }, [reduceMotion]);

  useEffect(() => {
    const handleVisibility = () => setIsPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => () => {
    if (manualResumeTimerRef.current !== null) window.clearTimeout(manualResumeTimerRef.current);
    if (suppressClickTimerRef.current !== null) window.clearTimeout(suppressClickTimerRef.current);
  }, []);

  const announceArea = useCallback((index: number) => {
    const area = workAreas[index];
    setAnnouncement(`${area.title[language]}, ${index + 1} ${language === "es" ? "de" : "of"} ${workAreas.length}`);
  }, [language]);

  const scheduleManualResume = useCallback(() => {
    setIsManualPause(true);
    if (manualResumeTimerRef.current !== null) window.clearTimeout(manualResumeTimerRef.current);
    manualResumeTimerRef.current = window.setTimeout(() => {
      setIsManualPause(false);
      manualResumeTimerRef.current = null;
    }, MANUAL_PAUSE_MS - AUTO_ROTATION_MS);
  }, []);

  const moveTo = useCallback((nextIndex: number, nextDirection: number, announce = true) => {
    const wrappedIndex = wrapIndex(nextIndex);
    setDirection(nextDirection);
    setActiveIndex(wrappedIndex);
    if (announce) {
      announceArea(wrappedIndex);
      scheduleManualResume();
    }
  }, [announceArea, scheduleManualResume]);

  useEffect(() => {
    const canRotate = autoplayEnabled
      && !reduceMotion
      && isPageVisible
      && !isPointerActive
      && !isManualPause
      && !isFocusPaused;

    if (!canRotate) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((current) => wrapIndex(current + 1));
    }, AUTO_ROTATION_MS);
    return () => window.clearInterval(timer);
  }, [autoplayEnabled, isFocusPaused, isManualPause, isPageVisible, isPointerActive, reduceMotion]);

  const suppressNextCardClick = () => {
    suppressCardClickRef.current = true;
    if (suppressClickTimerRef.current !== null) window.clearTimeout(suppressClickTimerRef.current);
    suppressClickTimerRef.current = window.setTimeout(() => {
      suppressCardClickRef.current = false;
      suppressClickTimerRef.current = null;
    }, 220);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number }; velocity: { x: number } }) => {
    setIsPointerActive(false);
    const shouldMove = Math.abs(info.offset.x) > 48 || Math.abs(info.velocity.x) > 450;
    if (!shouldMove) return;
    suppressNextCardClick();
    if (info.offset.x < 0) moveTo(activeIndex + 1, 1);
    else moveTo(activeIndex - 1, -1);
  };

  const rotationIsPaused = !autoplayEnabled || isFocusPaused || isManualPause;

  const toggleAutoplay = () => {
    if (reduceMotion) return;
    if (manualResumeTimerRef.current !== null) {
      window.clearTimeout(manualResumeTimerRef.current);
      manualResumeTimerRef.current = null;
    }
    if (rotationIsPaused) {
      setIsManualPause(false);
      setIsFocusPaused(false);
      setAutoplayEnabled(true);
    } else {
      setAutoplayEnabled(false);
    }
  };

  const activeArea = workAreas[activeIndex];
  const animationDistance = reduceMotion ? 0 : 34;

  return (
    <div
      className="mobile-work-carousel"
      role="region"
      aria-roledescription={language === "es" ? "carrusel" : "carousel"}
      aria-label={copy.label}
      onFocusCapture={(event) => {
        const focusEnteredCarousel = !event.relatedTarget || !event.currentTarget.contains(event.relatedTarget as Node);
        if (focusEnteredCarousel && event.target instanceof HTMLElement && event.target.matches(":focus-visible")) {
          setIsFocusPaused(true);
        }
      }}
      onBlurCapture={(event) => {
        const focusLeftCarousel = !event.relatedTarget || !event.currentTarget.contains(event.relatedTarget as Node);
        if (focusLeftCarousel) setIsFocusPaused(false);
      }}
    >
      <div className="mobile-work-carousel-viewport">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeArea.id}
            className="mobile-work-carousel-slide"
            custom={direction}
            role="group"
            aria-roledescription={copy.slide}
            aria-label={`${activeArea.title[language]}, ${activeIndex + 1} ${language === "es" ? "de" : "of"} ${workAreas.length}`}
            initial={{ opacity: 0, x: direction * animationDistance }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -animationDistance }}
            transition={{ duration: reduceMotion ? 0.01 : 0.36, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            dragMomentum={false}
            onPointerDown={() => {
              setIsPointerActive(true);
              scheduleManualResume();
            }}
            onPointerUp={() => setIsPointerActive(false)}
            onPointerCancel={() => setIsPointerActive(false)}
            onDragStart={() => setIsPointerActive(true)}
            onDragEnd={handleDragEnd}
          >
            <WorkAreaCard
              area={activeArea}
              language={language}
              standalone
              onOpen={(trigger) => {
                if (!suppressCardClickRef.current) onOpen(activeArea, trigger);
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mobile-work-carousel-controls">
        <button type="button" className="mobile-carousel-arrow" onClick={() => moveTo(activeIndex - 1, -1)} aria-label={copy.previous}>
          <TbChevronLeft aria-hidden="true" />
        </button>

        <div className="mobile-carousel-dots" role="group" aria-label={copy.label}>
          {workAreas.map((area, index) => (
            <button
              key={area.id}
              type="button"
              className={index === activeIndex ? "is-active" : ""}
              aria-label={`${copy.goTo}: ${area.title[language]}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => moveTo(index, index >= activeIndex ? 1 : -1)}
            />
          ))}
        </div>

        <button type="button" className="mobile-carousel-arrow" onClick={() => moveTo(activeIndex + 1, 1)} aria-label={copy.next}>
          <TbChevronRight aria-hidden="true" />
        </button>
        <button
          type="button"
          className="mobile-carousel-toggle"
          onClick={toggleAutoplay}
          disabled={Boolean(reduceMotion)}
          aria-label={reduceMotion ? copy.reduced : rotationIsPaused ? copy.play : copy.pause}
          title={reduceMotion ? copy.reduced : rotationIsPaused ? copy.play : copy.pause}
        >
          {!rotationIsPaused && !reduceMotion ? <TbPlayerPause aria-hidden="true" /> : <TbPlayerPlay aria-hidden="true" />}
        </button>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
    </div>
  );
}

export default MobileWorkAreasCarousel;
