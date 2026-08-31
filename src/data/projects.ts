import type { ProjectGalleryCategory } from "../components/ProjectsGallery";
import type { Language } from "../config/navigation";
import { getProjectCaptureOrPlaceholder, getRequiredProjectCapture } from "./projectCaptures";

type LocalizedText = Record<Language, string>;

export type PortfolioProject = {
  id: string;
  projectNumber: number;
  title: LocalizedText;
  categoryLabel?: LocalizedText;
  category: "powerbi" | "web";
  description: LocalizedText;
  tools: string[];
  highlights: Record<Language, string[]>;
  image: string;
  imageAlt: LocalizedText;
  link: string;
  linkKind?: "project" | "dashboard" | "repository";
  caseStudySlug?: string;
  caseStudyPath?: string;
  galleryCategories: ProjectGalleryCategory[];
  order: number;
};

export const projects: PortfolioProject[] = [
  {
    id: "sigo",
    projectNumber: 9,
    title: { es: "SIGO", en: "SIGO" },
    category: "web",
    categoryLabel: { es: "Herramienta interna", en: "Internal tool" },
    description: {
      es: "Sistema interno para gestionar metas e indicadores clave por área, registrar avances y analizar el cumplimiento.",
      en: "Internal system for managing goals and key indicators by area, recording progress and analyzing performance."
    },
    tools: ["Apps Script", "Google Sheets", "JavaScript", "HTML/CSS"],
    highlights: {
      es: ["Seguimiento de áreas, metas e indicadores clave", "Carga, validación y analítica de avances"],
      en: ["Tracking areas, goals and key indicators", "Progress entry, validation and analytics"]
    },
    image: getProjectCaptureOrPlaceholder(9, "A"),
    imageAlt: {
      es: "Inicio de SIGO con resumen de áreas, metas, indicadores clave y cumplimiento global.",
      en: "SIGO home screen with a summary of areas, goals, key indicators and global performance."
    },
    link: "https://script.google.com/macros/s/AKfycbz9HuvCLFW4pJJZijTmTimlLamt8FpRshj0i4oFW69m4LZxakg_FHD3lSHlAgrEVIoL/exec",
    linkKind: "project",
    caseStudySlug: "sigo",
    caseStudyPath: "/proyectos/sigo",
    galleryCategories: ["data", "web", "automation"],
    order: -1
  },
  {
    id: "tablero-eventos-interno",
    projectNumber: 8,
    title: { es: "Tablero de Eventos Interno", en: "Internal Events Workspace" },
    category: "web",
    categoryLabel: { es: "Herramienta interna", en: "Internal tool" },
    description: {
      es: "Herramienta web para registrar, organizar y analizar eventos mediante calendario, gestión operativa, métricas y análisis territorial.",
      en: "Web tool for recording, organizing and analyzing events through a calendar, operational management, metrics and territorial analysis."
    },
    tools: ["Calendario", "Métricas", "Gestión", "Reportes"],
    highlights: {
      es: ["Registro y seguimiento operativo", "Métricas, mapas y reportes exportables"],
      en: ["Operational recording and monitoring", "Metrics, maps and exportable reports"]
    },
    image: getProjectCaptureOrPlaceholder(8, "B"),
    imageAlt: {
      es: "Resumen ejecutivo del Tablero de Eventos Interno con indicadores y visualizaciones.",
      en: "Internal Events Workspace executive summary with indicators and visualizations."
    },
    link: "https://script.google.com/macros/s/AKfycbyENTtvZNK4rAKzEWzJ_BV-JL05CABV2FYogjzx8FTVqfjuvgM7VUeONmpkDk_HnN8N/exec",
    linkKind: "project",
    caseStudySlug: "tablero-eventos-interno",
    caseStudyPath: "/proyectos/tablero-eventos-interno",
    galleryCategories: ["data", "web", "automation"],
    order: 0
  },
  {
    id: "wohl-fitness",
    projectNumber: 7,
    title: { es: "WOHL — App fitness", en: "WOHL — Fitness app" },
    category: "web",
    categoryLabel: { es: "Aplicación móvil", en: "Mobile application" },
    description: {
      es: "Aplicación móvil para organizar rutinas, registrar entrenamientos y transformar cada sesión en métricas de progreso.",
      en: "Mobile application for organizing routines, logging workouts and turning every session into progress metrics."
    },
    tools: ["React", "TypeScript", "Capacitor", "Supabase", "IndexedDB", "Recharts"],
    highlights: {
      es: ["Registro offline-first de entrenamientos", "Métricas de progreso y carga muscular"],
      en: ["Offline-first workout logging", "Progress and muscle-load metrics"]
    },
    image: getRequiredProjectCapture(7, "H"),
    imageAlt: {
      es: "Presentación de WOHL, aplicación móvil para organizar y analizar entrenamientos.",
      en: "WOHL presentation, a mobile application for organizing and analyzing workouts."
    },
    link: "/proyectos/wohl-fitness",
    linkKind: "project",
    caseStudySlug: "wohl-fitness",
    caseStudyPath: "/proyectos/wohl-fitness",
    galleryCategories: ["web", "automation"],
    order: 1
  },
  {
    id: "riki-wohl",
    projectNumber: 6,
    title: { es: "RikiWohl.com", en: "RikiWohl.com" },
    category: "web",
    description: {
      es: "Landing comercial para un servicio de barra móvil y coctelería, diseñada para presentar la propuesta, organizar los servicios y facilitar consultas.",
      en: "Commercial landing page for a mobile bar and cocktail service, designed to present the offering, organize services and facilitate enquiries."
    },
    tools: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    highlights: {
      es: ["Servicios, packs y carta organizados", "Experiencia responsive orientada a consultas"],
      en: ["Organized services, packages and menu", "Responsive experience focused on enquiries"]
    },
    image: getProjectCaptureOrPlaceholder(6, "A"),
    imageAlt: {
      es: "Página principal de RikiWohl.com para un servicio de barra móvil y coctelería.",
      en: "RikiWohl.com home page for a mobile bar and cocktail service."
    },
    link: "https://www.rikiwohl.com/",
    linkKind: "project",
    caseStudySlug: "riki-wohl",
    caseStudyPath: "/proyectos/riki-wohl",
    galleryCategories: ["web"],
    order: 2
  },
  {
    id: "jenny-ugc",
    projectNumber: 5,
    title: { es: "JennyUGC.com", en: "JennyUGC.com" },
    category: "web",
    description: {
      es: "Portfolio web autoadministrable para una creadora UGC, con sitio público y panel privado para gestionar contenido multimedia sin modificar código.",
      en: "Self-managed web portfolio for a UGC creator, with a public site and private dashboard for managing multimedia content without editing code."
    },
    tools: ["React", "TypeScript", "Supabase", "Vercel"],
    highlights: {
      es: ["Sitio público y administración privada", "Gestión de contenido multimedia sin redespliegues"],
      en: ["Public site and private administration", "Multimedia content management without redeployments"]
    },
    image: getRequiredProjectCapture(5, "A"),
    imageAlt: {
      es: "Página principal del portfolio web JennyUGC.com.",
      en: "JennyUGC.com web portfolio home page."
    },
    link: "https://www.jennyugc.com/",
    linkKind: "project",
    caseStudySlug: "jenny-ugc",
    caseStudyPath: "/proyectos/jenny-ugc",
    galleryCategories: ["web"],
    order: 3
  },
  {
    id: "gastos-rrhh",
    projectNumber: 1,
    title: { es: "Análisis de Gastos RRHH", en: "HR Expense Analysis" },
    category: "powerbi",
    description: {
      es: "Dashboard de control presupuestario para RRHH que permite monitorear gasto real, detectar desvíos mensuales y encontrar oportunidades de optimización por categoría.",
      en: "Budget control dashboard for HR that monitors actual spending, detects monthly variances and identifies optimization opportunities by category."
    },
    tools: ["Power BI", "Excel"],
    highlights: {
      es: ["Seguimiento de presupuesto vs. gasto real", "Desvíos por categoría y período"],
      en: ["Budget vs. actual spend tracking", "Variance by category and period"]
    },
    image: getRequiredProjectCapture(1, "A"),
    imageAlt: { es: "Dashboard de gastos de recursos humanos con indicadores de presupuesto y gasto.", en: "Human resources expense dashboard with budget and spend indicators." },
    link: "https://app.powerbi.com/view?r=eyJrIjoiNzkzN2M5NDctNGFiMC00NmU3LTg1NzQtYjdiZmRlMDU0MzQ4IiwidCI6ImUwODdhZTVmLTQ2YjQtNDBiOS04ZGZkLTE1MTA4MTQwMTc3MyIsImMiOjR9",
    linkKind: "dashboard",
    caseStudySlug: "gastos-rrhh",
    caseStudyPath: "/proyectos/analisis-de-gastos-rrhh",
    galleryCategories: ["data"],
    order: 4
  },
  {
    id: "ventas-appol",
    projectNumber: 2,
    title: { es: "Informe de Ventas Appol", en: "Appol Sales Report" },
    category: "powerbi",
    description: {
      es: "Dashboard comercial para analizar utilidad, márgenes y desempeño por producto, país y continente, facilitando decisiones sobre mix y performance.",
      en: "Commercial dashboard to analyze profit, margins and performance by product, country and continent, supporting decisions on mix and performance."
    },
    tools: ["Power BI", "Excel", "DAX"],
    highlights: {
      es: ["Utilidad y margen por mercado", "Seguimiento por producto y período"],
      en: ["Profit and margin by market", "Tracking by product and period"]
    },
    image: getRequiredProjectCapture(2, "A"),
    imageAlt: { es: "Dashboard comercial Appol con utilidad, margen y análisis geográfico.", en: "Appol commercial dashboard with profit, margin and geographic analysis." },
    link: "https://app.powerbi.com/view?r=eyJrIjoiYmZkOTYwMDYtNWU1NS00MjZkLTg2MWYtZDAxZmRkYzVhZGUwIiwidCI6ImUwODdhZTVmLTQ2YjQtNDBiOS04ZGZkLTE1MTA4MTQwMTc3MyIsImMiOjR9",
    linkKind: "dashboard",
    caseStudySlug: "ventas-appol",
    caseStudyPath: "/proyectos/informe-de-ventas-appol",
    galleryCategories: ["data"],
    order: 5
  },
  {
    id: "mailing-gcba",
    projectNumber: 3,
    title: { es: "Métricas de Mailing GCBA", en: "GCBA Mailing Metrics" },
    category: "powerbi",
    description: {
      es: "Dashboard para monitorear campañas de mailing del GCBA con foco en entregabilidad, aperturas, clics y rendimiento por envío.",
      en: "Dashboard to monitor GCBA mailing campaigns with a focus on deliverability, opens, clicks and send-level performance."
    },
    tools: ["Looker Studio", "Google Sheets"],
    highlights: {
      es: ["Comparación por campaña, fecha y volumen enviado", "KPIs de aperturas, clics, rebotes y no abiertos"],
      en: ["Comparison by campaign, date and send volume", "Open, click, bounce and unopened KPIs"]
    },
    image: getRequiredProjectCapture(3, "A"),
    imageAlt: { es: "Dashboard de mailing del GCBA con métricas de envíos, aperturas, clics y rebotes.", en: "GCBA mailing dashboard with send, open, click and bounce metrics." },
    link: "https://lookerstudio.google.com/reporting/ad58b1c2-d02e-4557-8634-537b8314354a",
    linkKind: "dashboard",
    caseStudySlug: "mailing-gcba",
    caseStudyPath: "/proyectos/metricas-de-mailing-gcba",
    galleryCategories: ["data"],
    order: 6
  },
  {
    id: "nomina-rrhh",
    projectNumber: 4,
    title: { es: "Gestión de Nómina RRHH", en: "HR Payroll Management" },
    category: "powerbi",
    description: {
      es: "Dashboard de RRHH para entender la composición de la nómina, la distribución por área y la antigüedad del personal con una mirada operativa.",
      en: "HR dashboard to understand payroll composition, area distribution and employee tenure from an operational perspective."
    },
    tools: ["Looker Studio", "Google Sheets"],
    highlights: {
      es: ["Distribución de dotación por género y dirección", "Mapa de empleados y evolución de antigüedad"],
      en: ["Headcount distribution by gender and management", "Employee map and tenure evolution"]
    },
    image: getRequiredProjectCapture(4, "A"),
    imageAlt: { es: "Dashboard de nómina de recursos humanos con distribución y antigüedad del personal.", en: "Human resources payroll dashboard with workforce distribution and tenure." },
    link: "https://lookerstudio.google.com/reporting/26b9eca6-822c-41f9-836f-f16b76ab2acd",
    linkKind: "dashboard",
    caseStudySlug: "nomina-rrhh",
    caseStudyPath: "/proyectos/gestion-de-nomina-rrhh",
    galleryCategories: ["data"],
    order: 7
  },

];

export const featuredOverviewProjectSlug = "wohl-fitness";
export const recentOverviewProjectSlugs = ["mailing-gcba", "jenny-ugc", "riki-wohl"];
