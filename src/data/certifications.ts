import type { Language } from "../config/navigation";
import crehanaLogo from "../assets/certificaciones/crehana.png";
import crehanaCertificate from "../assets/certificaciones/crehana_certificado.jpg";
import googleLogo from "../assets/certificaciones/google.png";
import utnLogo from "../assets/certificaciones/utn.png";
import utnCertificate from "../assets/certificaciones/utn_certificado.pdf";

type LocalizedText = Record<Language, string>;

export type CertificationIconKey = "prepare" | "analyze" | "communicate" | "frontend" | "backend" | "database" | "excel" | "automation" | "visualization";

export type CertificationCompetency = {
  icon: CertificationIconKey;
  title: LocalizedText;
  description?: LocalizedText;
};

export type Certification = {
  id: string;
  featured: boolean;
  status: "in-progress" | "completed";
  statusLabel: LocalizedText;
  title: LocalizedText;
  institution: LocalizedText;
  period: LocalizedText;
  description: LocalizedText;
  technologies: string[];
  competencies: CertificationCompetency[];
  logo?: {
    src: string;
    alt: LocalizedText;
  };
  logoFallback: string;
  programUrl?: string;
  certificateUrl?: string;
  certificateImage?: string;
};

export const certificationSectionCopy = {
  es: {
    title: "Certificaciones",
    subtitle: "Formación aplicada a datos, automatización y desarrollo.",
    featuredTitle: "Formación destacada",
    completedTitle: "Formaciones completadas",
    relatedTechnologies: "Tecnologías relacionadas",
    technologies: "Tecnologías",
    viewProgram: "Ver programa",
    viewCertificate: "Ver certificado",
    closeCertificate: "Cerrar certificado",
    certificatePreview: "Vista previa del certificado",
    certificatePending: "Certificado pendiente de incorporar"
  },
  en: {
    title: "Certifications",
    subtitle: "Applied learning in data, automation and development.",
    featuredTitle: "Featured learning",
    completedTitle: "Completed programs",
    relatedTechnologies: "Related technologies",
    technologies: "Technologies",
    viewProgram: "View program",
    viewCertificate: "View certificate",
    closeCertificate: "Close certificate",
    certificatePreview: "Certificate preview",
    certificatePending: "Certificate asset pending"
  }
} as const;

export const certifications: Certification[] = [
  {
    id: "google-data-analytics",
    featured: true,
    status: "in-progress",
    statusLabel: { es: "En curso", en: "In progress" },
    title: { es: "Google Data Analytics", en: "Google Data Analytics" },
    institution: { es: "Google | Coursera", en: "Google | Coursera" },
    period: { es: "2025 — Actualidad", en: "2025 — Present" },
    description: {
      es: "Formación orientada a preparar, analizar y comunicar datos para apoyar decisiones.",
      en: "Training focused on preparing, analyzing and communicating data to support decisions."
    },
    logo: {
      src: googleLogo,
      alt: { es: "Logo de Google", en: "Google logo" }
    },
    logoFallback: "Google\nCoursera",
    technologies: ["SQL", "Spreadsheets", "Tableau", "R"],
    competencies: [
      {
        icon: "prepare",
        title: { es: "Preparar y limpiar", en: "Prepare and clean" },
        description: { es: "Calidad y estructura de datos", en: "Data quality and structure" }
      },
      {
        icon: "analyze",
        title: { es: "Analizar", en: "Analyze" },
        description: { es: "Indicadores y hallazgos", en: "Indicators and findings" }
      },
      {
        icon: "communicate",
        title: { es: "Comunicar", en: "Communicate" },
        description: { es: "Visualizaciones y conclusiones", en: "Visualizations and conclusions" }
      }
    ]
  },
  {
    id: "utn-full-stack",
    featured: false,
    status: "completed",
    statusLabel: { es: "Completada", en: "Completed" },
    title: { es: "Diplomatura en Desarrollo Web Full Stack", en: "Full Stack Web Development Diploma" },
    institution: { es: "Universidad Tecnológica Nacional", en: "National Technological University" },
    period: { es: "Marzo 2023 — Diciembre 2023", en: "March 2023 — December 2023" },
    description: {
      es: "Formación integral en desarrollo de interfaces, lógica de aplicaciones y bases de datos.",
      en: "Comprehensive training in interface development, application logic and databases."
    },
    logo: {
      src: utnLogo,
      alt: { es: "Logo del Centro de e-Learning de UTN.BA", en: "UTN.BA e-Learning Center logo" }
    },
    logoFallback: "UTN",
    certificateUrl: utnCertificate,
    technologies: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MySQL"],
    competencies: [
      { icon: "frontend", title: { es: "Desarrollo frontend", en: "Frontend development" } },
      { icon: "backend", title: { es: "Lógica y backend", en: "Logic and backend" } },
      { icon: "database", title: { es: "Bases de datos", en: "Databases" } }
    ]
  },
  {
    id: "crehana-analisis-datos",
    featured: false,
    status: "completed",
    statusLabel: { es: "Completado", en: "Completed" },
    title: { es: "Curso de Análisis de Datos", en: "Data Analysis Course" },
    institution: { es: "CREHANA", en: "CREHANA" },
    period: { es: "2025", en: "2025" },
    description: {
      es: "Análisis con hojas de cálculo, automatización y construcción de tableros.",
      en: "Spreadsheet analysis, automation and dashboard development."
    },
    logo: {
      src: crehanaLogo,
      alt: { es: "Logo de Crehana", en: "Crehana logo" }
    },
    logoFallback: "C",
    certificateImage: crehanaCertificate,
    technologies: ["Excel avanzado", "Macros", "Power BI", "SQL"],
    competencies: [
      { icon: "excel", title: { es: "Análisis con Excel", en: "Excel analysis" } },
      { icon: "automation", title: { es: "Automatización con macros", en: "Macro automation" } },
      { icon: "visualization", title: { es: "Visualización de indicadores", en: "Indicator visualization" } }
    ]
  }
];
