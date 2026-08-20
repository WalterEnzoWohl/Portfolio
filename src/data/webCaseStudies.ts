import type { Language } from "../config/navigation";
import type { ProjectCaptureLetter } from "./projectCaptures";

type LocalizedText = Record<Language, string>;

export type WebCaseStudyDetail = {
  projectId: string;
  slug: string;
  fullDescription: LocalizedText;
  quickFacts: {
    context: LocalizedText;
    objective: LocalizedText;
    participation: LocalizedText;
  };
  journey: Array<{
    id: "problem" | "process" | "solution";
    icon: string;
    title: LocalizedText;
    description: LocalizedText;
  }>;
  highlights: LocalizedText[];
  features: Array<{
    id: string;
    capture: Exclude<ProjectCaptureLetter, "A">;
    title: LocalizedText;
    description: LocalizedText;
  }>;
  relatedProjectIds: string[];
};

export const webCaseStudies: WebCaseStudyDetail[] = [
  {
    projectId: "jenny-ugc",
    slug: "jenny-ugc",
    fullDescription: {
      es: "El sitio conecta una experiencia pública profesional con una administración privada que permite mantener videos, textos y portadas sin depender de cambios en el código ni de un nuevo despliegue.",
      en: "The site connects a professional public experience with private administration that keeps videos, copy and covers up to date without code changes or a new deployment."
    },
    quickFacts: {
      context: {
        es: "Portfolio profesional para una creadora de contenido UGC.",
        en: "Professional portfolio for a UGC content creator."
      },
      objective: {
        es: "Centralizar trabajos, servicios y contenido en una plataforma autoadministrable.",
        en: "Centralize work, services and content in a self-managed platform."
      },
      participation: {
        es: "Diseño de solución, desarrollo frontend, integración backend y despliegue.",
        en: "Solution design, frontend development, backend integration and deployment."
      }
    },
    journey: [
      {
        id: "problem",
        icon: "fa-solid fa-link-slash",
        title: { es: "Problema", en: "Problem" },
        description: {
          es: "El portfolio necesitaba actualizarse frecuentemente y depender del código para cada cambio generaba fricción.",
          en: "The portfolio needed frequent updates, and relying on code for every change created friction."
        }
      },
      {
        id: "process",
        icon: "fa-solid fa-bezier-curve",
        title: { es: "Proceso", en: "Process" },
        description: {
          es: "Diseño del sitio público, modelado del contenido y desarrollo de un sistema privado de administración multimedia.",
          en: "Public site design, content modeling and development of a private multimedia administration system."
        }
      },
      {
        id: "solution",
        icon: "fa-solid fa-code-branch",
        title: { es: "Solución", en: "Solution" },
        description: {
          es: "Una plataforma web donde el contenido puede actualizarse desde un panel protegido sin modificar ni volver a desplegar el código.",
          en: "A web platform where content can be updated from a protected dashboard without editing or redeploying code."
        }
      }
    ],
    highlights: [
      { es: "Edición de contenido sin modificar código.", en: "Content editing without code changes." },
      { es: "Acceso administrativo autenticado.", en: "Authenticated administrative access." },
      { es: "Gestión y almacenamiento multimedia con Supabase.", en: "Multimedia management and storage with Supabase." },
      { es: "Compresión automática de videos en el navegador.", en: "Automatic in-browser video compression." },
      { es: "Generación y edición de portadas.", en: "Cover generation and editing." },
      { es: "Diseño responsive y sitio desplegado con dominio propio.", en: "Responsive design and deployment on a custom domain." }
    ],
    features: [
      {
        id: "multimedia-portfolio",
        capture: "B",
        title: { es: "Portfolio multimedia", en: "Multimedia portfolio" },
        description: {
          es: "Galería de videos organizada por categorías para mostrar trabajos y piezas UGC.",
          en: "Video gallery organized by category to showcase work and UGC pieces."
        }
      },
      {
        id: "admin-dashboard",
        capture: "C",
        title: { es: "Panel de administración", en: "Administration dashboard" },
        description: {
          es: "Panel privado para editar contenido, gestionar videos y organizar el portfolio.",
          en: "Private dashboard for editing content, managing videos and organizing the portfolio."
        }
      },
      {
        id: "video-upload",
        capture: "D",
        title: { es: "Carga de videos", en: "Video upload" },
        description: {
          es: "Carga de nuevos videos con título, categoría, portada y configuración visual.",
          en: "Upload new videos with title, category, cover and visual settings."
        }
      }
    ],
    relatedProjectIds: ["wohl-fitness", "riki-wohl"]
  }
];

export function getWebCaseStudy(slug?: string) {
  return webCaseStudies.find((study) => study.slug === slug);
}
