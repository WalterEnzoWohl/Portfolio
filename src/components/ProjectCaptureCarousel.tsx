import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import type { Language } from "../config/navigation";
import type { ProjectCaptureLetter } from "../data/projectCaptures";
import ProjectCapture from "./ProjectCapture";
import ZoomableMedia from "./ZoomableMedia";

export type ProjectCaptureSlide = {
  capture: ProjectCaptureLetter;
  title: string;
  description: string;
  alt: string;
};

type ProjectCaptureCarouselProps = {
  projectNumber: number;
  projectTitle: string;
  slides: ProjectCaptureSlide[];
  activeIndex: number;
  language: Language;
  pendingLabel: string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

const viewerCopy = {
  es: {
    dialog: "Galería de capturas",
    close: "Cerrar galería",
    previous: "Captura anterior",
    next: "Captura siguiente",
    goTo: "Ir a la captura",
    zoomRegion: "Imagen ampliable. Usá la rueda, doble clic o los controles para cambiar el zoom.",
    zoomIn: "Acercar imagen",
    zoomOut: "Alejar imagen",
    resetZoom: "Restablecer zoom"
  },
  en: {
    dialog: "Screenshot gallery",
    close: "Close gallery",
    previous: "Previous screenshot",
    next: "Next screenshot",
    goTo: "Go to screenshot",
    zoomRegion: "Zoomable image. Use the wheel, double-click or controls to change zoom.",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    resetZoom: "Reset zoom"
  }
} as const;

function ProjectCaptureCarousel({
  projectNumber,
  projectTitle,
  slides,
  activeIndex,
  language,
  pendingLabel,
  onIndexChange,
  onClose
}: ProjectCaptureCarouselProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const activeIndexRef = useRef(activeIndex);
  const onIndexChangeRef = useRef(onIndexChange);
  const onCloseRef = useRef(onClose);
  const isZoomedRef = useRef(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const reducedMotion = useReducedMotion();
  const text = viewerCopy[language];
  const slide = slides[activeIndex];

  activeIndexRef.current = activeIndex;
  onIndexChangeRef.current = onIndexChange;
  onCloseRef.current = onClose;
  isZoomedRef.current = isZoomed;

  const handleZoomChange = useCallback((zoom: number) => {
    setIsZoomed(zoom > 1);
  }, []);

  const move = (direction: -1 | 1) => {
    const nextIndex = (activeIndexRef.current + direction + slides.length) % slides.length;
    onIndexChangeRef.current(nextIndex);
  };

  useEffect(() => {
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const appRoot = document.getElementById("root");
    const previousInert = appRoot?.inert ?? false;
    const previousOverflow = document.body.style.overflow;

    if (appRoot) appRoot.inert = true;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => closeRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key === "ArrowLeft") {
        if (isZoomedRef.current) return;
        event.preventDefault();
        move(-1);
        return;
      }
      if (event.key === "ArrowRight") {
        if (isZoomedRef.current) return;
        event.preventDefault();
        move(1);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
      if (appRoot) appRoot.inert = previousInert;
      document.body.style.overflow = previousOverflow;
      restoreFocusRef.current?.focus();
    };
  }, [slides.length]);

  if (!slide) return null;

  return createPortal(
    <motion.div
      className="project-gallery-overlay"
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.2 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.section
        ref={dialogRef}
        className="project-gallery-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-gallery-title"
        aria-describedby="project-gallery-description"
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
        transition={{ duration: reducedMotion ? 0 : 0.22 }}
      >
        <header className="project-gallery-header">
          <div>
            <small>{projectTitle}</small>
            <h2 id="project-gallery-title">{slide.title}</h2>
          </div>
          <span aria-live="polite">{activeIndex + 1} / {slides.length}</span>
          <button ref={closeRef} type="button" onClick={onClose} aria-label={text.close}>
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </header>

        <div className="project-gallery-stage">
          {slides.length > 1 ? (
            <button className="project-gallery-control is-previous" type="button" onClick={() => move(-1)} aria-label={text.previous}>
              <i className="fa-solid fa-chevron-left" aria-hidden="true" />
            </button>
          ) : null}

          <motion.div
            key={`${projectNumber}-${slide.capture}`}
            className="project-capture-carousel-media"
            drag={reducedMotion || slides.length < 2 || isZoomed ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x <= -55) move(1);
              if (info.offset.x >= 55) move(-1);
            }}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0.35 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}
          >
            <ZoomableMedia
              resetKey={`${projectNumber}-${slide.capture}`}
              labels={{
                region: text.zoomRegion,
                zoomIn: text.zoomIn,
                zoomOut: text.zoomOut,
                reset: text.resetZoom
              }}
              onZoomChange={handleZoomChange}
            >
              <ProjectCapture
                projectNumber={projectNumber}
                capture={slide.capture}
                alt={slide.alt}
                fit="contain"
                loading="eager"
                pendingLabel={pendingLabel}
              />
            </ZoomableMedia>
          </motion.div>

          {slides.length > 1 ? (
            <button className="project-gallery-control is-next" type="button" onClick={() => move(1)} aria-label={text.next}>
              <i className="fa-solid fa-chevron-right" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <footer className="project-gallery-footer">
          <p id="project-gallery-description">{slide.description}</p>
          {slides.length > 1 ? (
            <div className="project-gallery-dots" aria-label={text.dialog}>
              {slides.map((item, index) => (
                <button
                  key={item.capture}
                  type="button"
                  className={index === activeIndex ? "is-active" : ""}
                  onClick={() => onIndexChange(index)}
                  aria-label={`${text.goTo} ${index + 1}: ${item.title}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                />
              ))}
            </div>
          ) : null}
        </footer>
      </motion.section>
    </motion.div>,
    document.body
  );
}

export default ProjectCaptureCarousel;
