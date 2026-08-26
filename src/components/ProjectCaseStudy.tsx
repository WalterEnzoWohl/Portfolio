import { useMemo, useState, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { interactiveMotion, sectionReveal, staggerContainer, staggerItem } from "../animations/motion";
import type { Language } from "../config/navigation";
import type { DataCaseStudyDetail } from "../data/projectCaseStudies";
import ProjectCapture from "./ProjectCapture";
import ProjectCaptureCarousel, { type ProjectCaptureSlide } from "./ProjectCaptureCarousel";

type LocalizedText = Record<Language, string>;

export type CaseStudyProject = {
  id: string;
  projectNumber: number;
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
    returnToProjects: "Volver a Proyectos",
    pendingCapture: "Captura pendiente"
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
    returnToProjects: "Back to Projects",
    pendingCapture: "Capture pending"
  }
} as const;

function ProjectNotFound({ language }: { language: Language }) {
  const copy = caseCopy[language];
  return <main className="data-case-not-found"><i className="fa-regular fa-folder-open" aria-hidden="true" /><h1>{copy.notFound}</h1><p>{copy.notFoundBody}</p><Link to="/#portfolio">{copy.returnToProjects}</Link></main>;
}

function ProjectCaseStudy({ detail, project, projects, language, onImageError }: { detail?: DataCaseStudyDetail; project?: CaseStudyProject; projects: CaseStudyProject[]; language: Language; onImageError: (event: SyntheticEvent<HTMLImageElement>) => void }) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const copy = caseCopy[language];
  const relatedProjects = useMemo(() => {
    if (!project) return [];
    return projects
      .filter((item) => item.id !== project.id && item.galleryCategories.some((category) => project.galleryCategories.includes(category)) && item.caseStudyPath?.startsWith("/proyectos/"))
      .sort((a, b) => b.tools.filter((tool) => project.tools.includes(tool)).length - a.tools.filter((tool) => project.tools.includes(tool)).length)
      .slice(0, 2);
  }, [project, projects]);
  const captureSlides = useMemo<ProjectCaptureSlide[]>(() => {
    if (!detail || !project) return [];
    return [
      {
        capture: "A",
        title: copy.mainView,
        description: detail.fullDescription[language],
        alt: project.imageAlt[language]
      },
      ...detail.analysisCards.map((card) => ({
        capture: card.capture,
        title: card.title[language],
        description: card.description[language],
        alt: `${card.title[language]}: ${project.title[language]}`
      }))
    ];
  }, [copy.mainView, detail, language, project]);

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
              <ProjectCapture
                projectNumber={project.projectNumber}
                capture="A"
                alt={project.imageAlt[language]}
                fit="contain"
                loading="eager"
                pendingLabel={copy.pendingCapture}
                onOpen={() => setViewerIndex(0)}
                openLabel={`${copy.expandImage}: ${project.title[language]}`}
              />
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
              <div>
                {detail.analysisCards.map((card, index) => (
                  <article key={card.capture}>
                    <h3>{card.title[language]}</h3>
                    <div className="data-case-crop">
                      <ProjectCapture
                        projectNumber={project.projectNumber}
                        capture={card.capture}
                        alt={`${card.title[language]}: ${project.title[language]}`}
                        fit="contain"
                        pendingLabel={copy.pendingCapture}
                        onOpen={() => setViewerIndex(index + 1)}
                        openLabel={`${copy.expandImage}: ${card.title[language]}`}
                      />
                    </div>
                    <p>{card.description[language]}</p>
                  </article>
                ))}
              </div>
            </section>
            <section className="data-case-detection" aria-labelledby="data-case-detection-title"><h2 id="data-case-detection-title">{copy.detection}</h2><ul>{detail.detectionItems[language].map((item) => <li key={item}><i className="fa-solid fa-circle-check" aria-hidden="true" /><span>{item}</span></li>)}</ul></section>
          </div>

          {relatedProjects.length ? <section className="data-case-related" aria-labelledby="related-projects-title"><h2 id="related-projects-title">{copy.related}</h2><div>{relatedProjects.map((related) => <Link key={related.id} to={related.caseStudyPath ?? ""}><img src={related.image} alt={related.imageAlt[language]} loading="lazy" onError={onImageError} /><span><strong>{related.title[language]}</strong><small>{copy.openRelated}<i className="fa-solid fa-arrow-right" aria-hidden="true" /></small></span></Link>)}</div></section> : null}
        </motion.div>

        <AnimatePresence>
          {viewerIndex !== null ? (
            <ProjectCaptureCarousel
              projectNumber={project.projectNumber}
              projectTitle={project.title[language]}
              slides={captureSlides}
              activeIndex={viewerIndex}
              language={language}
              pendingLabel={copy.pendingCapture}
              onIndexChange={setViewerIndex}
              onClose={() => setViewerIndex(null)}
            />
          ) : null}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}

export default ProjectCaseStudy;
