import { useEffect, useMemo, useRef, useState, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { drawerBackdrop, interactiveMotion, sectionReveal, staggerContainer, staggerItem } from "../animations/motion";
import type { Language } from "../config/navigation";
import type { DataCaseStudyDetail } from "../data/projectCaseStudies";

type LocalizedText = Record<Language, string>;

export type CaseStudyProject = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  image: string;
  imageAlt: LocalizedText;
  tools: string[];
  link: string;
  caseStudyPath?: string;
  galleryCategories: Array<"data" | "web" | "automation">;
};

const caseCopy = {
  es: {
    category: "Datos y visualización",
    mainView: "Vista principal",
    expandImage: "Ampliar captura",
    closeImage: "Cerrar captura ampliada",
    openDashboard: "Abrir dashboard",
    back: "Volver a proyectos",
    facts: { context: "Contexto", objective: "Objetivo", participation: "Mi participación", tools: "Herramientas" },
    journey: "Del problema a la solución",
    analysis: "Qué permite analizar",
    detection: "Qué permite detectar",
    related: "Proyectos relacionados",
    openRelated: "Abrir caso de estudio",
    notFound: "Proyecto no encontrado",
    notFoundBody: "El caso de estudio solicitado no está disponible.",
    returnToProjects: "Volver a Proyectos"
  },
  en: {
    category: "Data & visualization",
    mainView: "Main view",
    expandImage: "Expand image",
    closeImage: "Close expanded image",
    openDashboard: "Open dashboard",
    back: "Back to projects",
    facts: { context: "Context", objective: "Objective", participation: "My role", tools: "Tools" },
    journey: "From problem to solution",
    analysis: "What it helps analyze",
    detection: "What it helps detect",
    related: "Related projects",
    openRelated: "Open case study",
    notFound: "Project not found",
    notFoundBody: "The requested case study is not available.",
    returnToProjects: "Back to Projects"
  }
} as const;

function ImageViewer({ project, language, onClose, returnFocusTo }: { project: CaseStudyProject; language: Language; onClose: () => void; returnFocusTo: HTMLButtonElement | null }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.classList.add("case-viewer-open");
    const backgroundRegions = [
      document.querySelector<HTMLElement>(".dashboard-sidebar"),
      document.querySelector<HTMLElement>(".dashboard-topbar"),
      document.querySelector<HTMLElement>(".data-case-shell")
    ].filter((element): element is HTMLElement => Boolean(element));
    const priorInertValues = backgroundRegions.map((element) => element.inert);
    backgroundRegions.forEach((element) => { element.inert = true; });
    const frame = requestAnimationFrame(() => closeRef.current?.focus());
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKey);
      document.body.classList.remove("case-viewer-open");
      backgroundRegions.forEach((element, index) => { element.inert = priorInertValues[index]; });
      returnFocusTo?.focus();
    };
  }, [onClose, returnFocusTo]);

  return (
    <motion.div className="data-case-viewer" role="dialog" aria-modal="true" aria-label={caseCopy[language].expandImage}>
      <motion.button className="data-case-viewer-backdrop" type="button" tabIndex={-1} aria-label={caseCopy[language].closeImage} variants={drawerBackdrop} initial="hidden" animate="visible" exit="exit" onClick={onClose} />
      <motion.figure initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.985 }} transition={{ duration: 0.22 }}>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={caseCopy[language].closeImage}><i className="fa-solid fa-xmark" aria-hidden="true" /></button>
        <img src={project.image} alt={project.imageAlt[language]} />
        <figcaption>{project.title[language]}</figcaption>
      </motion.figure>
    </motion.div>
  );
}

function ProjectNotFound({ language }: { language: Language }) {
  const copy = caseCopy[language];
  return <main className="data-case-not-found"><i className="fa-regular fa-folder-open" aria-hidden="true" /><h1>{copy.notFound}</h1><p>{copy.notFoundBody}</p><Link to="/#portfolio">{copy.returnToProjects}</Link></main>;
}

function ProjectCaseStudy({ detail, project, projects, language, onImageError }: { detail?: DataCaseStudyDetail; project?: CaseStudyProject; projects: CaseStudyProject[]; language: Language; onImageError: (event: SyntheticEvent<HTMLImageElement>) => void }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const expandButtonRef = useRef<HTMLButtonElement>(null);
  const copy = caseCopy[language];
  const relatedProjects = useMemo(() => {
    if (!project) return [];
    return projects
      .filter((item) => item.id !== project.id && item.galleryCategories.some((category) => project.galleryCategories.includes(category)) && item.caseStudyPath?.startsWith("/proyectos/"))
      .sort((a, b) => b.tools.filter((tool) => project.tools.includes(tool)).length - a.tools.filter((tool) => project.tools.includes(tool)).length)
      .slice(0, 2);
  }, [project, projects]);

  if (!detail || !project) return <ProjectNotFound language={language} />;

  const facts = [
    { icon: "fa-regular fa-file-lines", label: copy.facts.context, value: detail.quickFacts.context[language] },
    { icon: "fa-solid fa-bullseye", label: copy.facts.objective, value: detail.quickFacts.objective[language] },
    { icon: "fa-regular fa-user", label: copy.facts.participation, value: detail.quickFacts.participation[language] },
    { icon: "fa-solid fa-screwdriver-wrench", label: copy.facts.tools, value: project.tools.join(" · ") }
  ];

  return (
    <MotionConfig reducedMotion="user">
      <main className="data-case-page" id="case-study-top">
        <motion.div className="data-case-shell" initial="hidden" animate="visible" variants={sectionReveal}>
          <section className="data-case-hero" aria-labelledby="data-case-title">
            <article className="data-case-intro">
              <span className="data-case-category">{copy.category}</span>
              <h1 id="data-case-title">{project.title[language]}</h1>
              <p className="data-case-lead">{project.description[language]}</p>
              <p className="data-case-description">{detail.fullDescription[language]}</p>
              <div className="data-case-tools">{project.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
              <div className="data-case-actions">
                {project.link ? <a href={project.link} target="_blank" rel="noopener noreferrer">{copy.openDashboard}<i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" /></a> : null}
                <Link to="/#portfolio"><i className="fa-solid fa-arrow-left" aria-hidden="true" />{copy.back}</Link>
              </div>
            </article>

            <aside className="data-case-main-visual">
              <span>{copy.mainView}</span>
              <button ref={expandButtonRef} type="button" onClick={() => setViewerOpen(true)} aria-label={copy.expandImage}><i className="fa-solid fa-up-right-and-down-left-from-center" aria-hidden="true" /></button>
              <img src={project.image} alt={project.imageAlt[language]} loading="eager" width="960" height="540" onError={onImageError} />
            </aside>
          </section>

          <motion.section className="data-case-facts" variants={staggerContainer} initial="hidden" animate="visible" aria-label={language === "es" ? "Ficha rápida" : "Quick facts"}>
            {facts.map((fact) => <motion.article key={fact.label} variants={staggerItem}><i className={fact.icon} aria-hidden="true" /><div><small>{fact.label}</small><p>{fact.value}</p></div></motion.article>)}
          </motion.section>

          <section className="data-case-journey" aria-labelledby="data-case-journey-title">
            <h2 id="data-case-journey-title">{copy.journey}</h2>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              {detail.journey.map((step, index) => (
                <motion.article key={step.id} variants={staggerItem} whileHover={interactiveMotion.hover}>
                  <i className={step.icon} aria-hidden="true" />
                  <div><small>{String(index + 1).padStart(2, "0")} · {step.title[language]}</small><p>{step.description[language]}</p></div>
                  {index < detail.journey.length - 1 ? <i className="data-case-connector fa-solid fa-arrow-right" aria-hidden="true" /> : null}
                </motion.article>
              ))}
            </motion.div>
          </section>

          <div className="data-case-insights">
            <section className="data-case-analysis" aria-labelledby="data-case-analysis-title">
              <h2 id="data-case-analysis-title">{copy.analysis}</h2>
              <div>{detail.analysisCards.map((card) => <article key={card.title.en}><h3>{card.title[language]}</h3><div className="data-case-crop"><img src={project.image} alt="" aria-hidden="true" loading="lazy" style={{ objectPosition: card.objectPosition }} onError={onImageError} /></div><p>{card.description[language]}</p></article>)}</div>
            </section>
            <section className="data-case-detection" aria-labelledby="data-case-detection-title"><h2 id="data-case-detection-title">{copy.detection}</h2><ul>{detail.detectionItems[language].map((item) => <li key={item}><i className="fa-solid fa-circle-check" aria-hidden="true" /><span>{item}</span></li>)}</ul></section>
          </div>

          {relatedProjects.length ? <section className="data-case-related" aria-labelledby="related-projects-title"><h2 id="related-projects-title">{copy.related}</h2><div>{relatedProjects.map((related) => <Link key={related.id} to={related.caseStudyPath ?? ""}><img src={related.image} alt={related.imageAlt[language]} loading="lazy" onError={onImageError} /><span><strong>{related.title[language]}</strong><small>{copy.openRelated}<i className="fa-solid fa-arrow-right" aria-hidden="true" /></small></span></Link>)}</div></section> : null}
        </motion.div>

        <AnimatePresence>{viewerOpen ? <ImageViewer project={project} language={language} onClose={() => setViewerOpen(false)} returnFocusTo={expandButtonRef.current} /> : null}</AnimatePresence>
      </main>
    </MotionConfig>
  );
}

export default ProjectCaseStudy;
