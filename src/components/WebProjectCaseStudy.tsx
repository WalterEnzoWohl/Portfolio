import { useMemo, useState, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { interactiveMotion, sectionReveal, staggerContainer, staggerItem } from "../animations/motion";
import type { Language } from "../config/navigation";
import type { ProjectCaptureLetter } from "../data/projectCaptures";
import type { WebCaseStudyDetail } from "../data/webCaseStudies";
import ProjectCapture from "./ProjectCapture";
import ProjectCaptureCarousel, { type ProjectCaptureSlide } from "./ProjectCaptureCarousel";
import type { CaseStudyProject } from "./ProjectCaseStudy";

const copy = {
  es: {
    category: "Desarrollo web",
    openSite: "Abrir sitio",
    back: "Volver a proyectos",
    mainView: "Sitio público",
    expandImage: "Ampliar captura",
    facts: {
      context: "Contexto",
      objective: "Objetivo",
      participation: "Mi participación"
    },
    journey: "Del problema a la solución",
    highlights: "Aspectos destacados",
    featuresEyebrow: "Sitio público → contenido multimedia → administración privada",
    features: "Funcionalidades principales",
    related: "Proyectos relacionados",
    openRelated: "Ver caso de estudio",
    pendingCapture: "Captura pendiente",
    notFound: "Proyecto no encontrado",
    notFoundBody: "El caso de estudio solicitado no está disponible.",
    returnToProjects: "Volver a Proyectos"
  },
  en: {
    category: "Web development",
    openSite: "Open site",
    back: "Back to projects",
    mainView: "Public site",
    expandImage: "Expand screenshot",
    facts: {
      context: "Context",
      objective: "Objective",
      participation: "My role"
    },
    journey: "From problem to solution",
    highlights: "Key features",
    featuresEyebrow: "Public site → multimedia content → private administration",
    features: "Core features",
    related: "Related projects",
    openRelated: "View case study",
    pendingCapture: "Capture pending",
    notFound: "Project not found",
    notFoundBody: "The requested case study is not available.",
    returnToProjects: "Back to Projects"
  }
} as const;

const factIcons = ["fa-regular fa-window-maximize", "fa-solid fa-bullseye", "fa-regular fa-user"];

function WebProjectNotFound({ language }: { language: Language }) {
  const text = copy[language];

  return (
    <main className="data-case-not-found">
      <i className="fa-regular fa-folder-open" aria-hidden="true" />
      <h1>{text.notFound}</h1>
      <p>{text.notFoundBody}</p>
      <Link to="/#portfolio">{text.returnToProjects}</Link>
    </main>
  );
}

function WebProjectCaseStudy({
  detail,
  project,
  projects,
  language,
  onImageError
}: {
  detail?: WebCaseStudyDetail;
  project?: CaseStudyProject;
  projects: CaseStudyProject[];
  language: Language;
  onImageError: (event: SyntheticEvent<HTMLImageElement>) => void;
}) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const text = copy[language];
  const relatedProjects = useMemo(() => {
    if (!detail) return [];
    const relatedIds = new Set(detail.relatedProjectIds);
    return projects.filter((item) => relatedIds.has(item.id) && item.caseStudyPath);
  }, [detail, projects]);
  const captureSlides = useMemo<ProjectCaptureSlide[]>(() => {
    if (!detail || !project) return [];
    const candidates: ProjectCaptureSlide[] = [
      {
        capture: detail.heroCapture ?? "A",
        title: detail.mainViewLabel?.[language] ?? text.mainView,
        description: detail.fullDescription[language],
        alt: project.imageAlt[language]
      },
      ...detail.features.map((feature) => ({
        capture: feature.capture,
        title: feature.title[language],
        description: feature.description[language],
        alt: `${feature.title[language]}: ${project.title[language]}`
      }))
    ];

    const seen = new Set<ProjectCaptureLetter>();
    return candidates.filter((slide) => {
      if (seen.has(slide.capture)) return false;
      seen.add(slide.capture);
      return true;
    });
  }, [detail, language, project, text.mainView]);

  if (!detail || !project) return <WebProjectNotFound language={language} />;

  const variant = detail.variant ?? "ugc-platform";
  const heroCapture = detail.heroCapture ?? "A";
  const getViewerIndex = (capture: ProjectCaptureLetter) => Math.max(
    captureSlides.findIndex((slide) => slide.capture === capture),
    0
  );

  const facts = [
    { label: text.facts.context, value: detail.quickFacts.context[language] },
    { label: text.facts.objective, value: detail.quickFacts.objective[language] },
    { label: text.facts.participation, value: detail.quickFacts.participation[language] }
  ];

  const highlightsSection = (
    <section className="web-case-highlights" aria-labelledby="web-case-highlights-title">
      <div className="web-case-highlights-heading">
        <span><i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" /></span>
        <div><small>{project.title[language]}</small><h2 id="web-case-highlights-title">{text.highlights}</h2></div>
      </div>
      <motion.ul variants={staggerContainer} initial="hidden" animate="visible">
        {detail.highlights.map((item) => (
          <motion.li key={item.es} variants={staggerItem}><i className="fa-solid fa-check" aria-hidden="true" /><span>{item[language]}</span></motion.li>
        ))}
      </motion.ul>
    </section>
  );

  return (
    <MotionConfig reducedMotion="user">
      <main className={`web-case-page web-case-page--${variant}`} id="case-study-top">
        <motion.div className="web-case-shell" initial="hidden" animate="visible" variants={sectionReveal}>
          <section className="web-case-hero" aria-labelledby="web-case-title">
            <article className="web-case-intro">
              <span className="web-case-category">{detail.categoryLabel?.[language] ?? text.category}</span>
              <h1 id="web-case-title">{project.title[language]}</h1>
              <p className="web-case-lead">{detail.leadDescription?.[language] ?? project.description[language]}</p>
              <p className="web-case-description">{detail.fullDescription[language]}</p>
              <div className="web-case-tools" aria-label={language === "es" ? "Tecnologías" : "Technologies"}>
                {project.tools.map((tool) => <span key={tool}>{tool}</span>)}
              </div>
              <div className="web-case-actions">
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  {detail.ctaLabel?.[language] ?? text.openSite}<i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
                </a>
                <Link to="/#portfolio"><i className="fa-solid fa-arrow-left" aria-hidden="true" />{text.back}</Link>
              </div>
            </article>

            <motion.figure className="web-case-main-visual" variants={staggerItem}>
              <figcaption>{detail.mainViewLabel?.[language] ?? text.mainView}</figcaption>
              <ProjectCapture
                projectNumber={project.projectNumber}
                capture={heroCapture}
                alt={project.imageAlt[language]}
                fit="contain"
                loading="eager"
                pendingLabel={text.pendingCapture}
                onOpen={() => setViewerIndex(0)}
                openLabel={`${text.expandImage}: ${project.title[language]}`}
              />
            </motion.figure>
          </section>

          <motion.section className="web-case-facts" variants={staggerContainer} initial="hidden" animate="visible" aria-label={language === "es" ? "Información general" : "General information"}>
            {facts.map((fact, index) => (
              <motion.article key={fact.label} variants={staggerItem}>
                <i className={factIcons[index]} aria-hidden="true" />
                <div><small>{fact.label}</small><p>{fact.value}</p></div>
              </motion.article>
            ))}
          </motion.section>

          <section className="web-case-journey" aria-labelledby="web-case-journey-title">
            <header>
              <small>01—03</small>
              <h2 id="web-case-journey-title">{detail.journeyTitle?.[language] ?? text.journey}</h2>
            </header>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              {detail.journey.map((step, index) => (
                <motion.article key={step.id} variants={staggerItem} whileHover={interactiveMotion.hover}>
                  <span className="web-case-step-number">{String(index + 1).padStart(2, "0")}</span>
                  <i className={step.icon} aria-hidden="true" />
                  <div><h3>{step.title[language]}</h3><p>{step.description[language]}</p></div>
                  {index < detail.journey.length - 1 ? <i className="web-case-step-connector fa-solid fa-arrow-right" aria-hidden="true" /> : null}
                </motion.article>
              ))}
            </motion.div>
          </section>

          {detail.highlightsPlacement !== "after-features" ? highlightsSection : null}

          <section className="web-case-features" aria-labelledby="web-case-features-title">
            <header>
              <small>{detail.featuresEyebrow?.[language] ?? text.featuresEyebrow}</small>
              <h2 id="web-case-features-title">{detail.featuresTitle?.[language] ?? text.features}</h2>
            </header>
            <div className="web-case-feature-layout">
              {detail.features.map((feature, index) => (
                <motion.article
                  key={feature.id}
                  className={`web-case-feature web-case-feature--${index + 1}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.18 }}
                  variants={staggerItem}
                >
                  <div className="web-case-feature-copy">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{feature.title[language]}</h3>
                    {variant !== "internal-tool" ? <p>{feature.description[language]}</p> : null}
                  </div>
                  <ProjectCapture
                    projectNumber={project.projectNumber}
                    capture={feature.capture}
                    alt={`${feature.title[language]}: ${project.title[language]}`}
                    fit="contain"
                    pendingLabel={text.pendingCapture}
                    onOpen={() => setViewerIndex(getViewerIndex(feature.capture))}
                    openLabel={`${text.expandImage}: ${feature.title[language]}`}
                  />
                  {variant === "internal-tool" ? <p className="web-case-feature-description">{feature.description[language]}</p> : null}
                </motion.article>
              ))}
            </div>
          </section>

          {detail.highlightsPlacement === "after-features" ? highlightsSection : null}

          {relatedProjects.length > 0 ? (
            <section className="web-case-related" aria-labelledby="web-related-projects-title">
              <h2 id="web-related-projects-title">{text.related}</h2>
              <div>
                {relatedProjects.map((related) => (
                  <Link key={related.id} to={related.caseStudyPath ?? ""}>
                    <img src={related.image} alt={related.imageAlt[language]} loading="lazy" onError={onImageError} />
                    <span><strong>{related.title[language]}</strong><small>{text.openRelated}<i className="fa-solid fa-arrow-right" aria-hidden="true" /></small></span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </motion.div>
        <AnimatePresence>
          {viewerIndex !== null ? (
            <ProjectCaptureCarousel
              projectNumber={project.projectNumber}
              projectTitle={project.title[language]}
              slides={captureSlides}
              activeIndex={viewerIndex}
              language={language}
              pendingLabel={text.pendingCapture}
              onIndexChange={setViewerIndex}
              onClose={() => setViewerIndex(null)}
            />
          ) : null}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}

export default WebProjectCaseStudy;
