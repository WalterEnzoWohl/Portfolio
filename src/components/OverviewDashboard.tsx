import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { drawerBackdrop, drawerPanel, drawerSheet, sectionReveal, staggerContainer, staggerItem } from "../animations/motion";
import { workAreas, type WorkArea } from "../data/workAreas";
import type { Language } from "../config/navigation";
import { useMediaQuery } from "../hooks/useMediaQuery";
import MobileWorkAreasCarousel from "./MobileWorkAreasCarousel";
import WorkAreaCard from "./WorkAreaCard";
import profileImage from "../assets/branding/foto-perfil.webp";

export type OverviewProject = {
  title: { es: string; en: string };
  description: { es: string; en: string };
  image: string;
  tools: string[];
  category: "powerbi" | "web";
  caseStudySlug?: string;
  caseStudyPath?: string;
};

type OverviewDashboardProps = {
  language: Language;
  featuredProject: OverviewProject;
  recentProjects: OverviewProject[];
  projects: OverviewProject[];
  onImageError: (event: SyntheticEvent<HTMLImageElement>) => void;
};

const overviewCopy = {
  es: {
    title: "Analista de datos y desarrollador web especializado en herramientas internas.",
    projects: "Ver proyectos",
    contact: "Contactarme",
    featured: "Proyecto destacado",
    caseStudy: "Ver caso de estudio",
    workAreas: "Áreas de trabajo",
    recent: "Proyectos recientes",
    openProject: "Abrir proyecto",
    closePanel: "Cerrar detalle del área",
    technologies: "Tecnologías",
    tools: "Herramientas",
    capabilities: "Capacidades",
    relatedProjects: "Proyectos vinculados",
    noProjects: "Esta área se aplica de forma transversal en mi trabajo.",
    categories: { powerbi: "Datos y visualización", web: "Desarrollo web" }
  },
  en: {
    title: "Data analyst and web developer specialized in internal tools.",
    projects: "View projects",
    contact: "Contact me",
    featured: "Featured project",
    caseStudy: "View case study",
    workAreas: "Work areas",
    recent: "Recent projects",
    openProject: "Open project",
    closePanel: "Close area details",
    technologies: "Technologies",
    tools: "Tools",
    capabilities: "Capabilities",
    relatedProjects: "Related projects",
    noProjects: "This area applies across my professional work.",
    categories: { powerbi: "Data & visualization", web: "Web development" }
  }
} as const;

function ProjectLink({ project, label, className }: { project: OverviewProject; label: string; className: string }) {
  if (!project.caseStudyPath) return null;
  return (
    <Link className={className} to={project.caseStudyPath}>
      <span>{label}</span>
      <i className="fa-solid fa-arrow-right" aria-hidden="true" />
    </Link>
  );
}

function AreaPanel({
  area,
  language,
  projects,
  onClose
}: {
  area: WorkArea;
  language: Language;
  projects: OverviewProject[];
  onClose: () => void;
}) {
  const copy = overviewCopy[language];
  const linkedProjects = area.projectSlugs.flatMap((slug) => {
    const project = projects.find((item) => item.caseStudySlug === slug);
    return project ? [project] : [];
  });

  return (
    <>
      <header className="area-panel-header">
        <span className="area-panel-icon"><i className={area.icon} aria-hidden="true" /></span>
        <div>
          <span>{copy.workAreas}</span>
          <h2 id="area-panel-title">{area.title[language]}</h2>
        </div>
        <button type="button" className="area-panel-close" onClick={onClose} aria-label={copy.closePanel}>
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>
      </header>

      <p id="area-panel-description" className="area-panel-description">{area.detail[language]}</p>

      <section className="area-panel-section" aria-labelledby="area-technologies-title">
        <h3 id="area-technologies-title">{copy.technologies}</h3>
        <div className="area-panel-tags">{area.technologies.map((item) => <span key={item.name}>{item.name}</span>)}</div>
      </section>

      <section className="area-panel-section" aria-labelledby="area-tools-title">
        <h3 id="area-tools-title">{copy.tools}</h3>
        <div className="area-panel-tags">{area.tools.map((item) => <span key={item}>{item}</span>)}</div>
      </section>

      <section className="area-panel-section" aria-labelledby="area-capabilities-title">
        <h3 id="area-capabilities-title">{copy.capabilities}</h3>
        <ul>{area.capabilities[language].map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="area-panel-section area-panel-projects" aria-labelledby="area-projects-title">
        <h3 id="area-projects-title">{copy.relatedProjects}</h3>
        {linkedProjects.length ? linkedProjects.map((project) => (
          <ProjectLink key={project.title.en} project={project} label={project.title[language]} className="area-panel-project-link" />
        )) : <p>{copy.noProjects}</p>}
      </section>
    </>
  );
}

function OverviewDashboard({ language, featuredProject, recentProjects, projects, onImageError }: OverviewDashboardProps) {
  const copy = overviewCopy[language];
  const [selectedArea, setSelectedArea] = useState<WorkArea | null>(null);
  const panelRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const isMobileSheet = useMediaQuery("(max-width: 767px)");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!selectedArea) return;

    const background = [contentRef.current, document.querySelector<HTMLElement>(".dashboard-sidebar"), document.querySelector<HTMLElement>(".dashboard-topbar")];
    background.forEach((element) => element?.setAttribute("inert", ""));
    document.body.classList.add("area-panel-open");

    const focusPanel = window.requestAnimationFrame(() => panelRef.current?.querySelector<HTMLButtonElement>(".area-panel-close")?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSelectedArea(null);
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

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
      window.cancelAnimationFrame(focusPanel);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("area-panel-open");
      background.forEach((element) => element?.removeAttribute("inert"));
      openerRef.current?.focus();
    };
  }, [selectedArea]);

  const openArea = (area: WorkArea, trigger: HTMLButtonElement) => {
    openerRef.current = trigger;
    setSelectedArea(area);
  };

  return (
    <MotionConfig reducedMotion="user">
      <section className="overview-dashboard" id="home" aria-labelledby="overview-title">
        <div ref={contentRef} className="overview-dashboard-content">
          <motion.div className="overview-hero-grid" initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.article className="overview-hero" variants={sectionReveal}>
              <div className="overview-data-art" aria-hidden="true">
                <svg viewBox="0 0 640 240" focusable="false">
                  <defs>
                    <linearGradient id="overview-line" x1="0" y1="1" x2="1" y2="0">
                      <stop offset="0" stopColor="#1fc8ab" stopOpacity="0.04" />
                      <stop offset="1" stopColor="#35e1c7" stopOpacity="0.9" />
                    </linearGradient>
                    <pattern id="overview-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(91, 207, 190, .12)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="640" height="240" fill="url(#overview-grid)" />
                  <motion.path
                    d="M18 220 C92 200 116 212 164 166 S248 176 300 126 386 148 438 96 520 114 622 28"
                    fill="none"
                    stroke="url(#overview-line)"
                    strokeWidth="2"
                    initial={{ pathLength: reduceMotion ? 1 : 0, opacity: reduceMotion ? 1 : 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: reduceMotion ? 0 : 0.9, delay: reduceMotion ? 0 : 0.18 }}
                  />
                  <g fill="#2dd4bf"><circle cx="164" cy="166" r="4" /><circle cx="300" cy="126" r="5" /><circle cx="438" cy="96" r="4" /><circle cx="622" cy="28" r="5" /></g>
                </svg>
              </div>

              <div className="overview-hero-copy">
                <h1 id="overview-title">{copy.title}</h1>
                <div className="overview-actions">
                  <a className="overview-primary-action" href="#portfolio">{copy.projects}<i className="fa-solid fa-arrow-right" aria-hidden="true" /></a>
                  <a className="overview-secondary-action" href="#contacto">{copy.contact}<i className="fa-regular fa-envelope" aria-hidden="true" /></a>
                </div>
              </div>
            </motion.article>

            <motion.aside className="overview-profile" variants={sectionReveal}>
              <div className="overview-profile-image">
                <img src={profileImage} alt="Walter Enzo Wohl" width="220" height="220" fetchPriority="high" />
              </div>
              <div className="overview-profile-copy">
                <h2>Walter Enzo Wohl</h2>
                <p className="overview-profile-location">Buenos Aires, Argentina</p>
                <p className="overview-profile-availability"><span aria-hidden="true" />{language === "es" ? "Disponible para propuestas" : "Available for opportunities"}</p>
              </div>
              <div className="overview-profile-links">
                <a href="https://www.linkedin.com/in/walterenzowohl" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fa-brands fa-linkedin" aria-hidden="true" /><span>LinkedIn</span></a>
                <a href="https://github.com/WalterEnzoWohl" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i className="fa-brands fa-github" aria-hidden="true" /><span>GitHub</span></a>
              </div>
            </motion.aside>
          </motion.div>

          <motion.section className="overview-panel overview-areas" aria-labelledby="work-areas-title" initial="hidden" animate="visible" variants={sectionReveal}>
            <header className="overview-panel-heading">
              <span className="overview-heading-icon"><i className="fa-solid fa-briefcase" aria-hidden="true" /></span>
              <h2 id="work-areas-title">{copy.workAreas}</h2>
            </header>
            {isMobileSheet ? (
              <MobileWorkAreasCarousel language={language} onOpen={openArea} />
            ) : (
              <motion.div className="overview-area-grid" variants={staggerContainer}>
                {workAreas.map((area) => (
                  <WorkAreaCard
                    key={area.id}
                    area={area}
                    language={language}
                    onOpen={(trigger) => openArea(area, trigger)}
                  />
                ))}
              </motion.div>
            )}
          </motion.section>

          <motion.div className="overview-project-grid" initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.article className="overview-panel overview-featured" variants={staggerItem}>
              <header className="overview-panel-heading">
                <span className="overview-heading-icon"><i className="fa-regular fa-star" aria-hidden="true" /></span>
                <h2>{copy.featured}</h2>
              </header>
              <div className="overview-featured-content">
                <div className="overview-featured-media"><img src={featuredProject.image} alt={featuredProject.title[language]} loading="eager" onError={onImageError} /></div>
                <div className="overview-featured-copy">
                  <h3>{featuredProject.title[language]}</h3>
                  <p>{featuredProject.description[language]}</p>
                  <div className="overview-tools">{featuredProject.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
                  <ProjectLink project={featuredProject} label={copy.caseStudy} className="overview-case-link" />
                </div>
              </div>
            </motion.article>

            <motion.article className="overview-panel overview-recent" variants={staggerItem}>
              <header className="overview-panel-heading">
                <span className="overview-heading-icon"><i className="fa-regular fa-folder" aria-hidden="true" /></span>
                <h2>{copy.recent}</h2>
              </header>
              <div className="overview-recent-list">
                {recentProjects.map((project) => (
                  <div className="overview-recent-card" key={project.title.en}>
                    <div className="overview-recent-image"><img src={project.image} alt={project.title[language]} loading="lazy" decoding="async" onError={onImageError} /></div>
                    <div className="overview-recent-copy"><h3>{project.title[language]}</h3><span>{copy.categories[project.category]}</span></div>
                    <ProjectLink project={project} label={copy.openProject} className="overview-project-arrow" />
                  </div>
                ))}
              </div>
            </motion.article>
          </motion.div>
        </div>

        <AnimatePresence>
          {selectedArea ? (
            <div className="area-panel-layer">
              <motion.button
                type="button"
                className="area-panel-backdrop"
                aria-label={copy.closePanel}
                variants={drawerBackdrop}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => setSelectedArea(null)}
              />
              <motion.aside
                ref={panelRef}
                className="area-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="area-panel-title"
                aria-describedby="area-panel-description"
                variants={isMobileSheet ? drawerSheet : drawerPanel}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <AreaPanel area={selectedArea} language={language} projects={projects} onClose={() => setSelectedArea(null)} />
              </motion.aside>
            </div>
          ) : null}
        </AnimatePresence>
      </section>
    </MotionConfig>
  );
}

export default OverviewDashboard;
