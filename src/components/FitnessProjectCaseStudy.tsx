import { useMemo, useState, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  TbBarbell,
  TbChartLine,
  TbChartRadar,
  TbClipboardList,
  TbCode,
  TbDatabase,
  TbListDetails,
  TbShieldCheck
} from "react-icons/tb";
import {
  SiCapacitor,
  SiGoogleplay,
  SiReact,
  SiSupabase,
  SiTypescript
} from "react-icons/si";
import type { IconType } from "react-icons";
import { interactiveMotion, sectionReveal, staggerContainer, staggerItem } from "../animations/motion";
import type { Language } from "../config/navigation";
import type {
  FitnessCaseStudyDetail,
  FitnessFocusIcon,
  FitnessStoryIcon
} from "../data/fitnessCaseStudy";
import ProjectCapture from "./ProjectCapture";
import ProjectCaptureCarousel, { type ProjectCaptureSlide } from "./ProjectCaptureCarousel";
import type { CaseStudyProject } from "./ProjectCaseStudy";

type IconComponent = IconType;

const copy = {
  es: {
    story: "La historia detrás de WOHL",
    focus: "Enfoque de WOHL",
    value: "Valor principal",
    openStore: "Ver en Google Play",
    dataAndAnalytics: "Datos y analítica",
    technical: "Aspectos técnicos",
    architecture: "Arquitectura",
    featuresEyebrow: "Entrenamiento → datos → producto",
    features: "Funciones principales",
    related: "Proyectos relacionados",
    viewRelated: "Ver caso de estudio",
    pendingCapture: "Captura pendiente",
    expandImage: "Ampliar captura",
    notFound: "Proyecto no encontrado",
    notFoundBody: "El caso de estudio solicitado no está disponible.",
    returnToProjects: "Volver a Proyectos"
  },
  en: {
    story: "The story behind WOHL",
    focus: "WOHL's focus",
    value: "Core value",
    openStore: "View on Google Play",
    dataAndAnalytics: "Data and analytics",
    technical: "Technical highlights",
    architecture: "Architecture",
    featuresEyebrow: "Training → data → product",
    features: "Core features",
    related: "Related projects",
    viewRelated: "View case study",
    pendingCapture: "Capture pending",
    expandImage: "Expand screenshot",
    notFound: "Project not found",
    notFoundBody: "The requested case study is not available.",
    returnToProjects: "Back to Projects"
  }
} as const;

const storyIcons: Record<FitnessStoryIcon, IconComponent> = {
  training: TbBarbell,
  analytics: TbChartRadar,
  development: TbCode
};

const focusIcons: Record<FitnessFocusIcon, IconComponent> = {
  routines: TbListDetails,
  logging: TbClipboardList,
  metrics: TbChartLine
};

const technologyIcons: Record<string, IconComponent> = {
  React: SiReact,
  TypeScript: SiTypescript,
  Capacitor: SiCapacitor,
  Supabase: SiSupabase,
  IndexedDB: TbDatabase,
  Recharts: TbChartLine
};

function FitnessProjectNotFound({ language }: { language: Language }) {
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

function FitnessProjectCaseStudy({
  detail,
  project,
  projects,
  language,
  onImageError
}: {
  detail?: FitnessCaseStudyDetail;
  project?: CaseStudyProject;
  projects: CaseStudyProject[];
  language: Language;
  onImageError: (event: SyntheticEvent<HTMLImageElement>) => void;
}) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const text = copy[language];
  const relatedProjects = useMemo(() => {
    if (!detail) return [];
    const ids = new Set(detail.relatedProjectIds);
    return projects.filter((item) => ids.has(item.id) && item.caseStudyPath);
  }, [detail, projects]);
  const captureSlides = useMemo<ProjectCaptureSlide[]>(() => {
    if (!detail || !project) return [];
    return [
      {
        capture: "A",
        title: project.title[language],
        description: detail.heroDescription[language],
        alt: project.imageAlt[language]
      },
      ...detail.features.map((feature) => ({
        capture: feature.capture,
        title: feature.title[language],
        description: feature.description[language],
        alt: `${feature.title[language]}: ${project.title[language]}`
      }))
    ];
  }, [detail, language, project]);

  if (!detail || !project) return <FitnessProjectNotFound language={language} />;

  return (
    <MotionConfig reducedMotion="user">
      <main className="fitness-case-page" id="case-study-top">
        <motion.div className="fitness-case-shell" initial="hidden" animate="visible" variants={sectionReveal}>
          <section className="fitness-case-hero" aria-labelledby="fitness-case-title">
            <article className="fitness-case-intro">
              <div className="fitness-case-meta">
                <span className="fitness-case-category"><TbBarbell aria-hidden="true" />{detail.category[language]}</span>
                <span className="fitness-case-platforms">{detail.platforms[language]}</span>
              </div>
              <h1 id="fitness-case-title">{project.title[language]}</h1>
              <p className="fitness-case-lead">{detail.heroLead[language]}</p>
              <p className="fitness-case-description">{detail.heroDescription[language]}</p>
              <div className="fitness-case-tools" aria-label={language === "es" ? "Tecnologías" : "Technologies"}>
                {project.tools.map((tool) => {
                  const Icon = technologyIcons[tool] ?? TbDatabase;
                  return <span key={tool}><Icon aria-hidden />{tool}</span>;
                })}
              </div>
              <a className="fitness-case-store-link" href={detail.storeUrl} target="_blank" rel="noopener noreferrer">
                <SiGoogleplay aria-hidden="true" />
                <span>{text.openStore}</span>
                <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
              </a>
            </article>

            <motion.figure className="fitness-case-main-visual" variants={staggerItem}>
              <span className="fitness-case-visual-orbit" aria-hidden="true" />
              <ProjectCapture
                projectNumber={project.projectNumber}
                capture="A"
                alt={project.imageAlt[language]}
                fit="contain"
                loading="eager"
                pendingLabel={text.pendingCapture}
                onOpen={() => setViewerIndex(0)}
                openLabel={`${text.expandImage}: ${project.title[language]}`}
              />
            </motion.figure>

            <aside className="fitness-case-rail">
              <section aria-labelledby="fitness-focus-title">
                <h2 id="fitness-focus-title">{text.focus}</h2>
                <div>
                  {detail.focus.map((item) => {
                    const Icon = focusIcons[item.icon];
                    return (
                      <article key={item.id}>
                        <Icon aria-hidden />
                        <span><strong>{item.title[language]}</strong><small>{item.description[language]}</small></span>
                      </article>
                    );
                  })}
                </div>
              </section>
              <section aria-labelledby="fitness-value-title">
                <h2 id="fitness-value-title">{text.value}</h2>
                <ul>
                  {detail.value.map((item) => <li key={item.es}><i className="fa-solid fa-check" aria-hidden="true" /><span>{item[language]}</span></li>)}
                </ul>
              </section>
            </aside>

            <section className="fitness-case-story" aria-labelledby="fitness-story-title">
              <h2 id="fitness-story-title">{text.story}</h2>
              <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                {detail.story.map((item) => {
                  const Icon = storyIcons[item.icon];
                  return (
                    <motion.article key={item.id} variants={staggerItem}>
                      <Icon aria-hidden />
                      <div><h3>{item.title[language]}</h3><p>{item.description[language]}</p></div>
                    </motion.article>
                  );
                })}
              </motion.div>
            </section>
          </section>

          <section className="fitness-case-insights" aria-label={`${text.dataAndAnalytics} · ${text.technical}`}>
            <motion.article className="fitness-case-analytics" variants={staggerItem}>
              <header>
                <TbChartLine aria-hidden="true" />
                <div><small>WOHL</small><h2>{text.dataAndAnalytics}</h2></div>
              </header>
              <p>{detail.analyticsIntro[language]}</p>
              <div>
                {detail.analytics.map((metric) => (
                  <article key={metric.id}>
                    <strong>{metric.title[language]}</strong>
                    <span>{metric.description[language]}</span>
                  </article>
                ))}
              </div>
            </motion.article>

            <motion.article className="fitness-case-technical" variants={staggerItem}>
              <header>
                <TbShieldCheck aria-hidden="true" />
                <div><small>{text.architecture}</small><h2>{text.technical}</h2></div>
              </header>
              <p>{detail.architecture[language]}</p>
              <ul>
                {detail.technicalHighlights.map((item) => (
                  <li key={item.es}><i className="fa-solid fa-check" aria-hidden="true" /><span>{item[language]}</span></li>
                ))}
              </ul>
            </motion.article>
          </section>

          <section className="fitness-case-features" aria-labelledby="fitness-features-title">
            <header>
              <small>{text.featuresEyebrow}</small>
              <h2 id="fitness-features-title">{text.features}</h2>
            </header>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }}>
              {detail.features.map((feature, index) => (
                <motion.article key={feature.id} variants={staggerItem} whileHover={interactiveMotion.hover}>
                  <div className="fitness-case-feature-heading">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{feature.title[language]}</h3>
                  </div>
                  <ProjectCapture
                    projectNumber={project.projectNumber}
                    capture={feature.capture}
                    alt={`${feature.title[language]}: ${project.title[language]}`}
                    fit="contain"
                    pendingLabel={text.pendingCapture}
                    onOpen={() => setViewerIndex(index + 1)}
                    openLabel={`${text.expandImage}: ${feature.title[language]}`}
                  />
                  <p>{feature.description[language]}</p>
                </motion.article>
              ))}
            </motion.div>
          </section>

          {relatedProjects.length ? (
            <section className="fitness-case-related" aria-labelledby="fitness-related-title">
              <h2 id="fitness-related-title">{text.related}</h2>
              <div>
                {relatedProjects.map((related) => (
                  <Link key={related.id} to={related.caseStudyPath ?? ""}>
                    <img src={related.image} alt={related.imageAlt[language]} loading="lazy" onError={onImageError} />
                    <span><strong>{related.title[language]}</strong><small>{text.viewRelated}<i className="fa-solid fa-arrow-right" aria-hidden="true" /></small></span>
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

export default FitnessProjectCaseStudy;
