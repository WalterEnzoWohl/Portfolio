import { useEffect, useRef, useState, type ComponentType, type SVGProps } from "react";
import { AnimatePresence, MotionConfig, motion, type Variants } from "motion/react";
import {
  TbArrowRight,
  TbChartBar,
  TbChartLine,
  TbCode,
  TbDatabase,
  TbExternalLink,
  TbFileCertificate,
  TbMessageCircle,
  TbServer,
  TbX
} from "react-icons/tb";
import type { Language } from "../config/navigation";
import {
  certificationSectionCopy,
  certifications,
  type Certification,
  type CertificationCompetency,
  type CertificationIconKey
} from "../data/certifications";
import ZoomableMedia from "./ZoomableMedia";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const easeOut = [0.22, 1, 0.36, 1] as const;

const competencyIcons: Record<CertificationIconKey, IconComponent> = {
  prepare: TbDatabase,
  analyze: TbChartBar,
  communicate: TbMessageCircle,
  frontend: TbCode,
  backend: TbServer,
  database: TbDatabase,
  excel: TbChartBar,
  automation: TbCode,
  visualization: TbChartLine
};

const reveal: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: easeOut } }
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.065, delayChildren: 0.04 } }
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.24, ease: easeOut } }
};

function InstitutionLogo({ certification, language }: { certification: Certification; language: Language }) {
  return (
    <motion.div className="certification-institution-logo" variants={staggerItem} aria-label={certification.institution[language]}>
      {certification.logo ? (
        <img src={certification.logo.src} alt={certification.logo.alt[language]} />
      ) : (
        <span aria-hidden="true">{certification.logoFallback}</span>
      )}
    </motion.div>
  );
}

function CompetencyItem({ competency, language, compact = false }: { competency: CertificationCompetency; language: Language; compact?: boolean }) {
  const Icon = competencyIcons[competency.icon];

  return (
    <motion.div className={`certification-competency${compact ? " certification-competency--compact" : ""}`} variants={staggerItem}>
      <Icon aria-hidden="true" />
      <div>
        <strong>{competency.title[language]}</strong>
        {competency.description ? <span>{competency.description[language]}</span> : null}
      </div>
    </motion.div>
  );
}

function TechnologyBadge({ technology }: { technology: string }) {
  return <motion.span variants={staggerItem}>{technology}</motion.span>;
}

function CertificatePreview({ certification, language }: { certification: Certification; language: Language }) {
  const copy = certificationSectionCopy[language];

  return certification.certificateImage ? (
    <img src={certification.certificateImage} alt={`${copy.certificatePreview}: ${certification.title[language]}`} />
  ) : certification.certificateUrl ? (
    <div className="certificate-placeholder certificate-placeholder--available" aria-label={`${copy.certificatePreview}: ${certification.title[language]}`}>
      <TbFileCertificate aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </div>
  ) : (
    <div className="certificate-placeholder" aria-label={copy.certificatePending}>
      <TbFileCertificate aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </div>
  );
}

function CertificationIllustration() {
  return (
    <div className="certification-data-illustration" aria-hidden="true">
      <svg viewBox="0 0 520 250" role="presentation">
        <g className="certification-illustration-muted">
          <path d="M34 42h76M34 61h44M350 45h52M350 64h82M444 65h46M350 112h110M34 214h120M34 229h96" />
        </g>
        <g className="certification-bars">
          <rect x="43" y="158" width="24" height="43" rx="2" />
          <rect x="78" y="140" width="24" height="61" rx="2" />
          <rect x="113" y="120" width="24" height="81" rx="2" />
        </g>
        <motion.path
          className="certification-chart-path"
          d="M43 104 78 75 113 92 148 55 183 81 218 49"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.65, delay: 0.14, ease: easeOut }}
        />
        <g className="certification-chart-points">
          <circle cx="43" cy="104" r="5" /><circle cx="78" cy="75" r="5" /><circle cx="113" cy="92" r="5" />
          <circle cx="148" cy="55" r="5" /><circle cx="183" cy="81" r="5" /><circle cx="218" cy="49" r="5" />
        </g>
        <motion.g className="certification-donut" initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.28, delay: 0.48 }}>
          <circle cx="230" cy="160" r="45" />
          <circle cx="230" cy="160" r="45" pathLength="100" strokeDasharray="34 66" />
        </motion.g>
        <motion.g className="certification-rosette" initial={{ opacity: 0, y: 5 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.28, delay: 0.58 }}>
          <circle cx="430" cy="169" r="34" />
          <path d="m411 195-9 37 28-16 28 16-9-37M417 169l9 9 18-20" />
        </motion.g>
      </svg>
    </div>
  );
}

function CertificateModal({ certification, language, onClose, returnFocusTo }: { certification: Certification; language: Language; onClose: () => void; returnFocusTo: HTMLElement | null }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const copy = certificationSectionCopy[language];

  useEffect(() => {
    document.body.classList.add("certificate-modal-open");
    const backgroundRegions = [
      document.querySelector<HTMLElement>(".dashboard-sidebar"),
      document.querySelector<HTMLElement>(".dashboard-topbar"),
      document.querySelector<HTMLElement>(".certifications-dashboard-shell")
    ].filter((element): element is HTMLElement => Boolean(element));
    const previousInert = backgroundRegions.map((element) => element.inert);
    backgroundRegions.forEach((element) => { element.inert = true; });
    const frame = requestAnimationFrame(() => closeRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex]:not([tabindex="-1"])');
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
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("certificate-modal-open");
      backgroundRegions.forEach((element, index) => { element.inert = previousInert[index]; });
      returnFocusTo?.focus();
    };
  }, [onClose, returnFocusTo]);

  if (!certification.certificateImage) return null;

  return (
    <motion.div className="certificate-modal" role="dialog" aria-modal="true" aria-label={`${copy.certificatePreview}: ${certification.title[language]}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button className="certificate-modal-backdrop" type="button" tabIndex={-1} aria-label={copy.closeCertificate} onClick={onClose} />
      <motion.figure ref={dialogRef} layoutId={`certificate-${certification.id}`} initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.985 }} transition={{ duration: 0.22 }}>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={copy.closeCertificate}><TbX aria-hidden="true" /></button>
        <ZoomableMedia
          className="certificate-zoom-media"
          resetKey={certification.id}
          labels={{ region: copy.zoomRegion, zoomIn: copy.zoomIn, zoomOut: copy.zoomOut, reset: copy.resetZoom }}
        >
          <img src={certification.certificateImage} alt={`${copy.certificatePreview}: ${certification.title[language]}`} draggable={false} />
        </ZoomableMedia>
        <figcaption>{certification.title[language]}</figcaption>
      </motion.figure>
    </motion.div>
  );
}

function FeaturedCertification({ certification, language }: { certification: Certification; language: Language }) {
  const copy = certificationSectionCopy[language];

  return (
    <motion.article className="certification-featured-card" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }}>
      <motion.span className="certification-featured-line" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.42, ease: easeOut }} />
      <div className="certification-featured-content">
        <motion.div className="certification-featured-identity" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}>
          <InstitutionLogo certification={certification} language={language} />
          <motion.div className="certification-heading" variants={staggerItem}>
            <span className="certification-status certification-status--progress">{certification.statusLabel[language]}</span>
            <h3>{certification.title[language]}</h3>
            <p>{certification.institution[language]} <span aria-hidden="true">•</span> {certification.period[language]}</p>
          </motion.div>
        </motion.div>
        <p className="certification-description">{certification.description[language]}</p>
        <motion.div className="certification-competency-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.45 }}>
          {certification.competencies.map((competency) => <CompetencyItem key={competency.title.en} competency={competency} language={language} />)}
        </motion.div>
        <div className="certification-technologies-block">
          <strong>{copy.relatedTechnologies}</strong>
          <motion.div className="certification-technologies" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {certification.technologies.map((technology) => <TechnologyBadge key={technology} technology={technology} />)}
          </motion.div>
        </div>
      </div>
      <div className="certification-featured-visual">
        <CertificationIllustration />
        {certification.programUrl ? (
          <a className="certification-cta" href={certification.programUrl} target="_blank" rel="noopener noreferrer">
            {copy.viewProgram}<TbArrowRight aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </motion.article>
  );
}

function CertificationCard({ certification, language, onPreview }: { certification: Certification; language: Language; onPreview: (certification: Certification, trigger: HTMLElement) => void }) {
  const copy = certificationSectionCopy[language];
  const isInteractive = Boolean(certification.certificateImage || certification.certificateUrl);

  return (
    <motion.article className={`certification-card${isInteractive ? " certification-card--interactive" : ""}`} variants={staggerItem} whileHover={isInteractive ? { y: -2 } : undefined} transition={{ duration: 0.2 }}>
      {certification.certificateImage ? (
        <button
          className="certification-card-action"
          type="button"
          aria-label={`${copy.viewCertificate}: ${certification.title[language]}`}
          onClick={(event) => onPreview(certification, event.currentTarget)}
        />
      ) : certification.certificateUrl ? (
        <a
          className="certification-card-action"
          href={certification.certificateUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${copy.viewCertificate}: ${certification.title[language]}`}
        />
      ) : null}
      <div className="certification-card-main">
        <InstitutionLogo certification={certification} language={language} />
        <div className="certification-heading">
          <span className="certification-status">{certification.statusLabel[language]}</span>
          <h3>{certification.title[language]}</h3>
          <p>{certification.institution[language]} <span aria-hidden="true">•</span> {certification.period[language]}</p>
          <p className="certification-description">{certification.description[language]}</p>
        </div>
      </div>
      <motion.div className="certification-card-competencies" variants={stagger}>
        {certification.competencies.map((competency) => <CompetencyItem key={competency.title.en} competency={competency} language={language} compact />)}
      </motion.div>
      <motion.div className="certification-card-preview" layoutId={certification.certificateImage ? `certificate-${certification.id}` : undefined}>
        <CertificatePreview certification={certification} language={language} />
      </motion.div>
      <div className="certification-card-footer">
        <div className="certification-technologies-block">
          <strong>{copy.technologies}</strong>
          <motion.div className="certification-technologies" variants={stagger}>
            {certification.technologies.map((technology) => <TechnologyBadge key={technology} technology={technology} />)}
          </motion.div>
        </div>
        {isInteractive ? (
          <span className="certification-cta certification-cta--display" aria-hidden="true">
            {copy.viewCertificate}{certification.certificateImage ? <TbArrowRight aria-hidden="true" /> : <TbExternalLink aria-hidden="true" />}
          </span>
        ) : null}
      </div>
    </motion.article>
  );
}

function CertificationsSection({ language }: { language: Language }) {
  const copy = certificationSectionCopy[language];
  const featured = certifications.find((certification) => certification.featured);
  const completed = certifications.filter((certification) => !certification.featured && certification.status === "completed");
  const [activeCertificate, setActiveCertificate] = useState<Certification | null>(null);
  const previewTriggerRef = useRef<HTMLElement | null>(null);

  const openPreview = (certification: Certification, trigger: HTMLElement) => {
    previewTriggerRef.current = trigger;
    setActiveCertificate(certification);
  };

  return (
    <MotionConfig reducedMotion="user">
      <section id="certifications" className="certifications-dashboard">
        <div className="certifications-dashboard-shell">
          <motion.header className="certifications-dashboard-header" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
            <h2>{copy.title}</h2>
            <p>{copy.subtitle}</p>
          </motion.header>

          {featured ? (
            <section className="certifications-featured-group" aria-labelledby="featured-certification-title">
              <h3 id="featured-certification-title">{copy.featuredTitle}</h3>
              <FeaturedCertification certification={featured} language={language} />
            </section>
          ) : null}

          {completed.length ? (
            <section className="certifications-completed-group" aria-labelledby="completed-certifications-title">
              <h3 id="completed-certifications-title">{copy.completedTitle}</h3>
              <motion.div className="certifications-completed-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }}>
                {completed.map((certification) => (
                  <CertificationCard key={certification.id} certification={certification} language={language} onPreview={openPreview} />
                ))}
              </motion.div>
            </section>
          ) : null}
        </div>

        <AnimatePresence>
          {activeCertificate ? (
            <CertificateModal certification={activeCertificate} language={language} onClose={() => setActiveCertificate(null)} returnFocusTo={previewTriggerRef.current} />
          ) : null}
        </AnimatePresence>
      </section>
    </MotionConfig>
  );
}

export default CertificationsSection;
