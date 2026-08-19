import type { ProjectGalleryCategory } from "../components/ProjectsGallery";
import type { Language } from "../config/navigation";
import { getRequiredProjectCapture } from "./projectCaptures";

type LocalizedText = Record<Language, string>;

export type PortfolioProject = {
  id: string;
  projectNumber: number;
  title: LocalizedText;
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
    order: 1
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
    order: 2
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
    order: 3
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
    order: 4
  },

];

export const recentOverviewProjectSlugs = ["nomina-rrhh", "gastos-rrhh", "ventas-appol"];
