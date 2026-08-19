import type { Language } from "../config/navigation";
import arbustaLogo from "../assets/experiencia/arbusta-logo.png";
import gcbaLogo from "../assets/experiencia/gcba-logo.svg";
import msaLogo from "../assets/experiencia/msa-logo.png";

export type LocalizedExperienceText = Record<Language, string>;

export type ContributionIconKey = "analysis" | "visualization" | "tools";

export type TechnologyIconKey =
  | "python"
  | "pandas"
  | "sql"
  | "looker"
  | "sheets"
  | "apps-script"
  | "power-bi"
  | "excel"
  | "etl"
  | "react"
  | "javascript"
  | "html"
  | "css"
  | "ubuntu";

export type ExperienceContribution = {
  title: LocalizedExperienceText;
  description?: LocalizedExperienceText;
  icon?: ContributionIconKey;
};

export type ExperienceTechnology = {
  name: string;
  icon: TechnologyIconKey;
};

export type ProfessionalExperience = {
  id: string;
  sequence: string;
  featured?: boolean;
  current?: boolean;
  role: LocalizedExperienceText;
  company: LocalizedExperienceText;
  period: LocalizedExperienceText;
  description: LocalizedExperienceText;
  logo: {
    initials: string;
    alt: LocalizedExperienceText;
    image?: string;
    format?: "compact" | "wide";
  };
  contributions: ExperienceContribution[];
  technologies: ExperienceTechnology[];
  relatedProjectsHref?: string;
};

export const experienceSectionCopy = {
  es: {
    title: "Experiencia",
    subtitle: "Datos, automatización y desarrollo aplicados a resolver necesidades operativas reales.",
    downloadCv: "Descargar CV",
    current: "ACTUAL",
    relatedProjects: "Ver proyectos relacionados",
    relatedProjectsAria: "Ver proyectos relacionados con la experiencia en GCBA",
    technologyList: "Tecnologías utilizadas"
  },
  en: {
    title: "Experience",
    subtitle: "Data, automation and development applied to real operational needs.",
    downloadCv: "Download CV",
    current: "CURRENT",
    relatedProjects: "View related projects",
    relatedProjectsAria: "View projects related to the GCBA experience",
    technologyList: "Technologies used"
  }
} as const;

export const professionalExperiences: ProfessionalExperience[] = [
  {
    id: "gcba-data-analyst",
    sequence: "03",
    featured: true,
    current: true,
    role: { es: "Analista de Datos", en: "Data Analyst" },
    company: {
      es: "Gobierno de la Ciudad de Buenos Aires (GCBA)",
      en: "City Government of Buenos Aires (GCBA)"
    },
    period: { es: "Septiembre 2025 — Actualidad", en: "September 2025 — Present" },
    description: {
      es: "Desarrollo reportes, indicadores y herramientas internas para ordenar información y facilitar el seguimiento de la gestión.",
      en: "I develop reports, indicators and internal tools to organize information and make management follow-up easier."
    },
    logo: {
      initials: "BA",
      image: gcbaLogo,
      format: "wide",
      alt: {
        es: "Logo del Gobierno de la Ciudad de Buenos Aires",
        en: "City Government of Buenos Aires logo"
      }
    },
    contributions: [
      {
        title: { es: "Análisis y seguimiento", en: "Analysis and monitoring" },
        description: {
          es: "Indicadores, controles y reportes para acompañar decisiones.",
          en: "Indicators, controls and reports that support decision-making."
        },
        icon: "analysis"
      },
      {
        title: { es: "Visualización", en: "Visualization" },
        description: {
          es: "Tableros y vistas para comunicar información operativa.",
          en: "Dashboards and views that communicate operational information."
        },
        icon: "visualization"
      },
      {
        title: { es: "Herramientas internas", en: "Internal tools" },
        description: {
          es: "Soluciones para centralizar datos y reducir tareas manuales.",
          en: "Solutions that centralize data and reduce manual work."
        },
        icon: "tools"
      }
    ],
    technologies: [
      { name: "Python", icon: "python" },
      { name: "Pandas", icon: "pandas" },
      { name: "SQL", icon: "sql" },
      { name: "Looker Studio", icon: "looker" },
      { name: "Google Sheets", icon: "sheets" },
      { name: "Apps Script", icon: "apps-script" },
      { name: "Power BI", icon: "power-bi" }
    ],
    relatedProjectsHref: "#portfolio"
  },
  {
    id: "arbusta-junior-data-analyst",
    sequence: "02",
    role: { es: "Analista de Datos Junior", en: "Junior Data Analyst" },
    company: { es: "ARBUSTA S.A.", en: "ARBUSTA S.A." },
    period: { es: "Agosto 2024 — Septiembre 2025", en: "August 2024 — September 2025" },
    description: {
      es: "Análisis operativo para el proyecto MTC de Mercado Libre, con foco en calidad de datos, indicadores y automatización de reportes.",
      en: "Operational analysis for Mercado Libre's MTC project, focused on data quality, indicators and report automation."
    },
    logo: {
      initials: "A",
      image: arbustaLogo,
      format: "compact",
      alt: { es: "Logo de ARBUSTA S.A.", en: "ARBUSTA S.A. logo" }
    },
    contributions: [
      { title: { es: "Control y análisis de publicaciones", en: "Publication control and analysis" } },
      { title: { es: "Seguimiento de indicadores y calidad", en: "Indicator and quality monitoring" } },
      { title: { es: "Automatización y mejora de reportes", en: "Report automation and improvement" } }
    ],
    technologies: [
      { name: "Google Sheets", icon: "sheets" },
      { name: "Excel", icon: "excel" },
      { name: "SQL", icon: "sql" },
      { name: "Power BI", icon: "power-bi" },
      { name: "ETL", icon: "etl" }
    ]
  },
  {
    id: "msa-iot-intern",
    sequence: "01",
    role: { es: "Desarrollador IoT en Pasantía", en: "IoT Development Intern" },
    company: { es: "Grupo MSA S.A.", en: "Grupo MSA S.A." },
    period: { es: "Febrero 2024 — Marzo 2024", en: "February 2024 — March 2024" },
    description: {
      es: "Participación en una aplicación de validación de identidad mediante DNI y huella, dentro de un entorno técnico colaborativo.",
      en: "Contributed to an identity validation application using an ID card and fingerprint within a collaborative technical environment."
    },
    logo: {
      initials: "MSA",
      image: msaLogo,
      format: "wide",
      alt: { es: "Logo de Grupo MSA S.A.", en: "Grupo MSA S.A. logo" }
    },
    contributions: [
      { title: { es: "Desarrollo de interfaz web", en: "Web interface development" } },
      { title: { es: "Integración con una solución IoT", en: "Integration with an IoT solution" } },
      { title: { es: "Trabajo técnico en Ubuntu", en: "Technical work in Ubuntu" } }
    ],
    technologies: [
      { name: "React", icon: "react" },
      { name: "JavaScript", icon: "javascript" },
      { name: "HTML", icon: "html" },
      { name: "CSS", icon: "css" },
      { name: "Ubuntu", icon: "ubuntu" }
    ]
  }
];
