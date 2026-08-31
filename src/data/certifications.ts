import type { Language } from "../config/navigation";
import crehanaLogo from "../assets/certificaciones/crehana.png";
import crehanaCertificate from "../assets/certificaciones/crehana_certificado.jpg";
import googleLogo from "../assets/certificaciones/google.png";
import utnLogo from "../assets/certificaciones/utn.png";
import utnCertificate from "../assets/certificaciones/utn_certificado.png";

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
    certificatePending: "Certificado pendiente de incorporar",
    zoomRegion: "Certificado ampliable. Usá la rueda, doble clic o los controles para cambiar el zoom.",
    zoomIn: "Acercar certificado",
    zoomOut: "Alejar certificado",
    resetZoom: "Restablecer zoom"
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
    certificatePending: "Certificate asset pending",
    zoomRegion: "Zoomable certificate. Use the wheel, double-click or controls to change zoom.",
    zoomIn: "Zoom in on certificate",
    zoomOut: "Zoom out from certificate",
    resetZoom: "Reset zoom"
  }
} as const;

export const certifications: Certification[] = [
  {
    id: "google-data-analytics",
    featured: true,
    status: "in-progress",
    statusLabel: { es: "En curso", en: "In progress" },
    title: {
      es: "Certificado Profesional de Análisis de Datos de Google",
      en: "Google Data Analytics Professional Certificate"
    },
    institution: { es: "Google | Coursera", en: "Google | Coursera" },
    period: { es: "2025 — Actualidad", en: "2025 — Present" },
    description: {
      es: "Formación en análisis, limpieza y visualización de datos mediante Python, SQL, Google Sheets y Tableau. Incluye estructuras de datos, pandas, NumPy, validación de datos y creación de tableros para la toma de decisiones.",
      en: "Training in data analysis, cleaning and visualization using Python, SQL, Google Sheets and Tableau. It covers data structures, pandas, NumPy, data validation and dashboard creation for decision-making."
    },
    logo: {
      src: googleLogo,
      alt: { es: "Logo de Google", en: "Google logo" }
    },
    logoFallback: "Google\nCoursera",
    technologies: ["Python", "SQL", "Tableau", "Google Sheets", "Excel", "pandas", "NumPy"],
    competencies: [
      {
        icon: "prepare",
        title: { es: "Estructuras y calidad", en: "Structures and quality" },
        description: { es: "Limpieza, validación y estructura de datos", en: "Data cleaning, validation and structure" }
      },
      {
        icon: "database",
        title: { es: "SQL y transformación", en: "SQL and transformation" },
        description: { es: "Consultas, integración y transformación", en: "Queries, integration and transformation" }
      },
      {
        icon: "analyze",
        title: { es: "Python para análisis", en: "Python for analysis" },
        description: { es: "pandas, NumPy y manipulación de datos", en: "pandas, NumPy and data manipulation" }
      },
      {
        icon: "excel",
        title: { es: "Hojas de cálculo", en: "Spreadsheets" },
        description: { es: "Google Sheets, Excel y tablas dinámicas", en: "Google Sheets, Excel and pivot tables" }
      },
      {
        icon: "visualization",
        title: { es: "Tableau", en: "Tableau" },
        description: { es: "Visualización y tableros interactivos", en: "Visualization and interactive dashboards" }
      },
      {
        icon: "communicate",
        title: { es: "Análisis responsable", en: "Responsible analysis" },
        description: { es: "Estadística, pensamiento analítico y ética", en: "Statistics, analytical thinking and ethics" }
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
    certificateImage: utnCertificate,
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
