import { useEffect, useMemo, useRef, useState, type SyntheticEvent } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import OverviewDashboard from "./components/OverviewDashboard";
import ProjectsGallery from "./components/ProjectsGallery";
import ProjectCaseStudy from "./components/ProjectCaseStudy";
import ExperienceSection from "./components/ExperienceSection";
import CertificationsSection from "./components/CertificationsSection";
import ContactSection from "./components/ContactSection";
import { getDataCaseStudy } from "./data/projectCaseStudies";
import { projects, recentOverviewProjectSlugs } from "./data/projects";
import "./style.css";
import "./dashboard.css";
import "./overview.css";
import "./projects.css";
import "./project-case-study.css";
import "./experience.css";
import "./certifications.css";
import "./contact.css";
import "./density.css";

type Language = "es" | "en";
type Theme = "dark" | "light";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => {
    finished: Promise<void>;
  };
};

const uiCopy = {
  es: {
    nav: {
      home: "Inicio",
      about: "SobreMi",
      portfolio: "Portfolio",
      curriculum: "Experiencia",
      certifications: "Certificaciones",
      contact: "Contacto"
    },
    languageSwitcherAria: "Cambiar idioma",
    heroRole: "Analista de Datos especializado en resolución de problemas, automatización de reportes, desarrollo de herramientas internas y dashboards para operación y gestión.",
    heroSummary:
      "Transformo información dispersa en decisiones claras: diseño soluciones de datos, circuitos internos y visualizaciones que ordenan procesos y reducen trabajo manual.",
    about: {
      title: "Sobre mí",
      body:
        "Hola, soy Walter Enzo Wohl. Soy Analista de Datos IT con experiencia en análisis, reporting y visualización para acompañar decisiones de negocio y operación. Trabajo con Excel, SQL, Power BI, Looker y Python para convertir información dispersa en indicadores claros, dashboards accionables y procesos más ordenados. También cuento con base en desarrollo web y herramientas de colaboración como Git, GitHub y MySQL, lo que me permite moverme con comodidad entre datos, producto y ejecución.",
      download: "Descargar CV",
      contact: "Contactarme",
      valueTitle: "Lo que puedo aportar",
      values: [
        {
          title: "Reporting y seguimiento de KPIs",
          description: "Diseño reportes y tableros para ordenar información y mejorar el control operativo."
        },
        {
          title: "Visualización para toma de decisiones",
          description: "Presento hallazgos de forma clara para que equipos y referentes puedan actuar más rápido."
        },
        {
          title: "Ejecución transversal",
          description: "Combino analítica, automatización y criterio técnico para resolver necesidades de punta a punta."
        }
      ],
      pillars: [
        {
          title: "Toma de decisiones",
          description: "Datos claros para priorizar mejor y decidir con más contexto."
        },
        {
          title: "Storytelling de datos",
          description: "Contexto, visualización y síntesis para comunicar mejor cada hallazgo."
        },
        {
          title: "Ejecución",
          description: "Implementación práctica con foco en impacto, orden y continuidad operativa."
        }
      ]
    },
    curriculum: {
      title: "Experiencia",
      subtitle: "Análisis de datos, automatización y desarrollo aplicados a resolver necesidades operativas reales.",
      experience: "Experiencia",
      downloadCv: "Descargar CV",
      currentBadge: "Actualidad",
      spotlightCurrent: "Rol actual",
      spotlightExperience: "Trayectoria",
      spotlightExperienceUnit: "Datos, automatización y desarrollo",
      spotlightFocus: "Enfoque",
      spotlightFocusValue: "Herramientas internas y visualización",
      showMore: "Ver más",
      showLess: "Ver menos"
    },
    certifications: {
      title: "Certificaciones",
      subtitle: "Certificaciones, formación y habilidades incorporadas en cada etapa.",
      showMore: "Ver más",
      showLess: "Ver menos"
    },
    portfolio: {
      title: "Proyectos",
      subtitle: "",
      published: "Proyectos publicados",
      searchLabel: "Buscar proyectos",
      searchPlaceholder: "Buscar proyecto",
      clearSearch: "Limpiar búsqueda",
      filtersLabel: "Filtrar proyectos",
      filters: {
        all: "Todos",
        data: "Datos y visualización",
        web: "Desarrollo web",
        automation: "Automatización"
      },
      sortLabel: "Ordenar proyectos",
      sortOptions: {
        recent: "Más recientes",
        "alphabetical-asc": "A a la Z",
        "alphabetical-desc": "Z a la A"
      },
      viewCaseStudy: "Ver caso de estudio",
      comingSoon: "Próximamente",
      empty: "No encontramos proyectos con estos filtros.",
      clearFilters: "Limpiar filtros"
    },
    footer: "Todos los derechos reservados."
  },
  en: {
    nav: {
      home: "Home",
      about: "AboutMe",
      portfolio: "Portfolio",
      curriculum: "Experience",
      certifications: "Certifications",
      contact: "Contact"
    },
    languageSwitcherAria: "Change language",
    heroRole: "Data Analyst specialized in problem solving, report automation, internal tools and visual dashboards for operations and management.",
    heroSummary:
      "I turn scattered information into clear decisions by building data solutions, internal workflows and visual systems that reduce manual work and improve execution.",
    about: {
      title: "About Me",
      body:
        "Hi, I'm Walter Enzo Wohl. I'm an IT Data Analyst with experience in analytics, reporting and visualization to support business and operational decisions. I work with Excel, SQL, Power BI, Looker and Python to turn scattered information into clear indicators, actionable dashboards and more organized processes. I also have a web development foundation and collaboration tools such as Git, GitHub and MySQL, which allows me to move comfortably between data, product and execution.",
      download: "Download CV",
      contact: "Contact me",
      valueTitle: "What I bring",
      values: [
        {
          title: "Reporting and KPI tracking",
          description: "I design reports and dashboards that organize information and improve operational control."
        },
        {
          title: "Decision-oriented visualization",
          description: "I present findings clearly so teams and stakeholders can act faster."
        },
        {
          title: "Cross-functional execution",
          description: "I combine analytics, automation and technical judgment to solve needs end to end."
        }
      ],
      pillars: [
        {
          title: "Decision making",
          description: "Clear data to prioritize better and make decisions with stronger context."
        },
        {
          title: "Data storytelling",
          description: "Context, visualization and synthesis to communicate each finding more effectively."
        },
        {
          title: "Execution",
          description: "Practical implementation focused on impact, clarity and operational continuity."
        }
      ]
    },
    curriculum: {
      title: "Experience",
      subtitle: "Data analysis, automation and development applied to real operational needs.",
      experience: "Experience",
      downloadCv: "Download CV",
      currentBadge: "Present",
      spotlightCurrent: "Current role",
      spotlightExperience: "Background",
      spotlightExperienceUnit: "Data, automation and development",
      spotlightFocus: "Focus",
      spotlightFocusValue: "Internal tools and visualization",
      showMore: "Show more",
      showLess: "Show less"
    },
    certifications: {
      title: "Certifications",
      subtitle: "Certifications, training and the skills I developed at each stage.",
      showMore: "Show more",
      showLess: "Show less"
    },
    portfolio: {
      title: "Projects",
      subtitle: "",
      published: "Published projects",
      searchLabel: "Search projects",
      searchPlaceholder: "Search project",
      clearSearch: "Clear search",
      filtersLabel: "Filter projects",
      filters: {
        all: "All",
        data: "Data & visualization",
        web: "Web development",
        automation: "Automation"
      },
      sortLabel: "Sort projects",
      sortOptions: {
        recent: "Most recent",
        "alphabetical-asc": "A to Z",
        "alphabetical-desc": "Z to A"
      },
      viewCaseStudy: "View case study",
      comingSoon: "Coming soon",
      empty: "We couldn't find projects with these filters.",
      clearFilters: "Clear filters"
    },
    footer: "All rights reserved."
  }
} as const;

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (location.hash) {
        const element = document.getElementById(location.hash.slice(1));

        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [location.pathname, location.hash]);

  return null;
}

type LandingPageProps = {
  language: Language;
  copy: (typeof uiCopy)[Language];
  handleProjectImageError: (event: SyntheticEvent<HTMLImageElement>) => void;
};
function LandingPage({
  language,
  copy,
  handleProjectImageError
}: LandingPageProps) {
  const featuredProject = projects.find((project) => project.caseStudySlug === "mailing-gcba") ?? projects[0];
  const recentProjects = recentOverviewProjectSlugs.flatMap((slug) => {
    const project = projects.find((item) => item.caseStudySlug === slug);
    return project ? [project] : [];
  });
  return (
    <main className="dashboard-main">
      <OverviewDashboard
        language={language}
        featuredProject={featuredProject}
        recentProjects={recentProjects}
        projects={projects}
        onImageError={handleProjectImageError}
      />

      <ProjectsGallery language={language} projects={projects} copy={copy.portfolio} onImageError={handleProjectImageError} />

      <ExperienceSection language={language} />
      <CertificationsSection language={language} />
      <ContactSection language={language} />
    </main>
  );
}
type DataProjectCaseStudyPageProps = {
  language: Language;
  handleProjectImageError: (event: SyntheticEvent<HTMLImageElement>) => void;
  theme: Theme;
  themeToggleRef: React.RefObject<HTMLButtonElement | null>;
  themeToggleLabel: string;
  onThemeToggle: () => void;
  onLanguageChange: (language: Language) => void;
};

function DataProjectCaseStudyPage({ language, theme, themeToggleRef, themeToggleLabel, onThemeToggle, onLanguageChange, handleProjectImageError }: DataProjectCaseStudyPageProps) {
  const { slug } = useParams();
  const detail = getDataCaseStudy(slug);
  const project = detail ? projects.find((item) => item.id === detail.projectId) : undefined;

  return (
    <DashboardLayout
      language={language}
      theme={theme}
      themeToggleRef={themeToggleRef}
      themeToggleLabel={themeToggleLabel}
      onThemeToggle={onThemeToggle}
      onLanguageChange={onLanguageChange}
      activeSectionOverride="portfolio"
      breadcrumbDetails={project ? [{ label: project.title[language] }] : []}
    >
      <ProjectCaseStudy detail={detail} project={project} projects={projects} language={language} onImageError={handleProjectImageError} />
    </DashboardLayout>
  );
}

function App() {
  const location = useLocation();
  const themeToggleRef = useRef<HTMLButtonElement | null>(null);
  const [language, setLanguage] = useState<Language>("es");
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const savedTheme = window.localStorage.getItem("portfolio-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });
  const copy = uiCopy[language];
  const isDataCaseStudyRoute = location.pathname.startsWith("/proyectos/");
  const currentDataCaseStudyProject = useMemo(() => {
    if (!isDataCaseStudyRoute) return null;
    const slug = location.pathname.split("/").filter(Boolean).at(-1);
    const detail = getDataCaseStudy(slug);
    return detail ? projects.find((item) => item.id === detail.projectId) ?? null : null;
  }, [isDataCaseStudyRoute, location.pathname]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.title = currentDataCaseStudyProject
      ? `${currentDataCaseStudyProject.title[language]} | Walter Enzo Wohl`
      : `Portfolio | Walter Enzo Wohl`;
  }, [currentDataCaseStudyProject, language]);

  const handleProjectImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;

    image.onerror = null;
    image.src = "/img/WIP.png";
  };

  const switchThemeWithTransition = async () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    const trigger = themeToggleRef.current;
    const rect = trigger?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    root.style.setProperty("--theme-transition-x", `${(x / window.innerWidth) * 100}%`);
    root.style.setProperty("--theme-transition-y", `${(y / window.innerHeight) * 100}%`);
    root.setAttribute("data-theme-transition", nextTheme === "dark" ? "to-dark" : "to-light");

    const clearTransitionState = () => {
      root.removeAttribute("data-theme-transition");
      root.style.removeProperty("--theme-transition-x");
      root.style.removeProperty("--theme-transition-y");
    };

    const transitionDocument = document as ViewTransitionDocument;

    if (!transitionDocument.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTheme(nextTheme);
      window.setTimeout(clearTransitionState, 350);
      return;
    }

    try {
      const transition = transitionDocument.startViewTransition(() => {
        setTheme(nextTheme);
      });

      await transition.finished;
    } finally {
      clearTransitionState();
    }
  };

  const themeToggleLabel =
    language === "es"
      ? theme === "dark"
        ? "Activar modo claro"
        : "Activar modo oscuro"
      : theme === "dark"
        ? "Enable light mode"
        : "Enable dark mode";

  return (
    <>
      <ScrollManager />

      <Routes>
        <Route
          path="/"
          element={
            <DashboardLayout
              language={language}
              theme={theme}
              themeToggleRef={themeToggleRef}
              themeToggleLabel={themeToggleLabel}
              onThemeToggle={() => void switchThemeWithTransition()}
              onLanguageChange={setLanguage}
            >
              <LandingPage
                language={language}
                copy={copy}
                handleProjectImageError={handleProjectImageError}
              />
            </DashboardLayout>
          }
        />
        <Route path="/proyectos/:slug" element={<DataProjectCaseStudyPage language={language} theme={theme} themeToggleRef={themeToggleRef} themeToggleLabel={themeToggleLabel} onThemeToggle={() => void switchThemeWithTransition()} onLanguageChange={setLanguage} handleProjectImageError={handleProjectImageError} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="dashboard-page-footer">
        <a href={isDataCaseStudyRoute ? "#case-study-top" : "#home"} className="arriba"><i className="fa-solid fa-angles-up" /></a>
        <div className="redes">
          <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/walterenzowohl" aria-label="LinkedIn de Walter Enzo Wohl"><i className="fa-brands fa-linkedin" /></a>
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/WalterEnzoWohl" aria-label="GitHub de Walter Enzo Wohl"><i className="fa-brands fa-github" /></a>
        </div>
        <p className="copyright">
          &copy; {new Date().getFullYear()} Walter Enzo Wohl. {copy.footer}
          {currentDataCaseStudyProject ? ` · ${currentDataCaseStudyProject.title[language]}` : ""}
        </p>
      </footer>
    </>
  );
}

export default App;

