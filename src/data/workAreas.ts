import type { Language } from "../config/navigation";

type LocalizedValue = Record<Language, string>;

export type WorkArea = {
  id: "analysis" | "visualization" | "etl" | "web" | "automation";
  icon: string;
  title: LocalizedValue;
  summary: LocalizedValue;
  detail: LocalizedValue;
  technologies: WorkAreaTechnology[];
  tools: string[];
  capabilities: Record<Language, string[]>;
  projectSlugs: string[];
};

export type TechnologyIconKey =
  | "sql"
  | "python"
  | "excel"
  | "powerbi"
  | "looker"
  | "sheets"
  | "pandas"
  | "powerquery"
  | "bigquery"
  | "htmlcss"
  | "javascript"
  | "react"
  | "appsscript"
  | "n8n"
  | "nodejs";

export type WorkAreaTechnology = {
  name: string;
  icon: TechnologyIconKey;
};

const workAreaDefinitions: WorkArea[] = [
  {
    id: "analysis",
    icon: "fa-solid fa-chart-column",
    title: { es: "Análisis de datos", en: "Data analysis" },
    summary: { es: "Indicadores, reportes y hallazgos para facilitar decisiones.", en: "Indicators, reports and findings that support decisions." },
    detail: { es: "Transformo información dispersa en análisis comparables, indicadores claros y reportes orientados a necesidades operativas.", en: "I turn scattered information into comparable analyses, clear indicators and reports focused on operational needs." },
    technologies: [
      { name: "SQL", icon: "sql" },
      { name: "Python", icon: "python" },
      { name: "Excel", icon: "excel" }
    ],
    tools: ["Excel", "Google Sheets", "PostgreSQL"],
    capabilities: {
      es: ["Análisis exploratorio", "Seguimiento de KPIs", "Reporting operativo"],
      en: ["Exploratory analysis", "KPI monitoring", "Operational reporting"]
    },
    projectSlugs: ["mailing-gcba", "nomina-rrhh", "gastos-rrhh", "ventas-appol"]
  },
  {
    id: "visualization",
    icon: "fa-solid fa-chart-pie",
    title: { es: "Visualización", en: "Visualization" },
    summary: { es: "Tableros claros para seguimiento operativo y de gestión.", en: "Clear dashboards for operational and management follow-up." },
    detail: { es: "Diseño tableros que jerarquizan indicadores, comparaciones y hallazgos para que la información sea rápida de interpretar.", en: "I design dashboards that prioritize indicators, comparisons and findings so information is quick to interpret." },
    technologies: [
      { name: "Power BI", icon: "powerbi" },
      { name: "Looker Studio", icon: "looker" },
      { name: "Google Sheets", icon: "sheets" }
    ],
    tools: ["Power BI", "Looker Studio", "Excel"],
    capabilities: {
      es: ["Diseño de dashboards", "Storytelling de datos", "Visualización de KPIs"],
      en: ["Dashboard design", "Data storytelling", "KPI visualization"]
    },
    projectSlugs: ["mailing-gcba", "nomina-rrhh", "gastos-rrhh", "ventas-appol"]
  },
  {
    id: "etl",
    icon: "fa-solid fa-database",
    title: { es: "ETL y preparación de datos", en: "ETL and data preparation" },
    summary: { es: "Extracción, transformación, limpieza y carga de datos.", en: "Data extraction, transformation, cleaning and loading." },
    detail: { es: "Preparo fuentes consistentes para análisis y reporting, desde la limpieza hasta la organización de estructuras reutilizables.", en: "I prepare consistent sources for analysis and reporting, from cleaning to reusable data structures." },
    technologies: [
      { name: "Pandas", icon: "pandas" },
      { name: "Power Query", icon: "powerquery" },
      { name: "BigQuery", icon: "bigquery" }
    ],
    tools: ["Google Sheets", "Excel", "PostgreSQL"],
    capabilities: {
      es: ["Limpieza de datos", "Transformación de fuentes", "Control de consistencia"],
      en: ["Data cleaning", "Source transformation", "Consistency checks"]
    },
    projectSlugs: ["mailing-gcba", "nomina-rrhh", "gastos-rrhh"]
  },
  {
    id: "web",
    icon: "fa-solid fa-code",
    title: { es: "Desarrollo web", en: "Web development" },
    summary: { es: "Aplicaciones y herramientas internas orientadas a procesos.", en: "Applications and internal tools designed around processes." },
    detail: { es: "Construyo interfaces y aplicaciones internas que convierten circuitos manuales en experiencias más claras y trazables.", en: "I build interfaces and internal applications that turn manual workflows into clearer, traceable experiences." },
    technologies: [
      { name: "HTML/CSS", icon: "htmlcss" },
      { name: "JavaScript", icon: "javascript" },
      { name: "React", icon: "react" }
    ],
    tools: ["Git", "GitHub", "MySQL", "Ubuntu"],
    capabilities: {
      es: ["Interfaces responsive", "Flujos internos", "Integración con datos"],
      en: ["Responsive interfaces", "Internal workflows", "Data integration"]
    },
    projectSlugs: []
  },
  {
    id: "automation",
    icon: "fa-solid fa-gears",
    title: { es: "Automatización", en: "Automation" },
    summary: { es: "Flujos y reportes que reducen tareas manuales repetitivas.", en: "Workflows and reports that reduce repetitive manual tasks." },
    detail: { es: "Desarrollo automatizaciones y herramientas livianas para reducir carga manual, ordenar estados y sostener procesos recurrentes.", en: "I build automations and lightweight tools that reduce manual work, organize statuses and support recurring processes." },
    technologies: [
      { name: "Apps Script", icon: "appsscript" },
      { name: "n8n", icon: "n8n" },
      { name: "Node.js", icon: "nodejs" }
    ],
    tools: ["Google Sheets", "Clasp", "Git"],
    capabilities: {
      es: ["Automatización de reportes", "Validaciones y estados", "Flujos de gestión"],
      en: ["Report automation", "Validations and statuses", "Management workflows"]
    },
    projectSlugs: []
  }
];

const workAreaOrder: WorkArea["id"][] = ["etl", "analysis", "visualization", "automation", "web"];

export const workAreas = workAreaOrder.map((id) => {
  const area = workAreaDefinitions.find((item) => item.id === id);
  if (!area) throw new Error(`Missing work area configuration: ${id}`);
  return area;
});
