import type { Language } from "../config/navigation";
import type { ProjectCaptureLetter } from "./projectCaptures";

type LocalizedText = Record<Language, string>;

export type WebCaseStudyDetail = {
  projectId: string;
  slug: string;
  variant?: "ugc-platform" | "commercial-landing";
  mainViewLabel?: LocalizedText;
  featuresEyebrow?: LocalizedText;
  featuresTitle?: LocalizedText;
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
  },
  {
    projectId: "riki-wohl",
    slug: "riki-wohl",
    variant: "commercial-landing",
    mainViewLabel: { es: "Vista principal", en: "Main view" },
    featuresEyebrow: {
      es: "Propuesta comercial → experiencia visual → consulta",
      en: "Commercial proposal → visual experience → enquiry"
    },
    featuresTitle: { es: "Presentación visual del proyecto", en: "Visual project presentation" },
    fullDescription: {
      es: "Centraliza la propuesta comercial, los packs, la carta y las vías de contacto en una experiencia visual orientada a la conversión.",
      en: "It centralizes the commercial offering, packages, menu and contact channels in a visual experience designed to encourage enquiries."
    },
    quickFacts: {
      context: {
        es: "Sitio comercial para un servicio de barra móvil y eventos.",
        en: "Commercial website for a mobile bar and event service."
      },
      objective: {
        es: "Presentar la propuesta, ordenar la oferta y generar consultas de cotización.",
        en: "Present the offering, organize the services and generate quote enquiries."
      },
      participation: {
        es: "Diseño de estructura, desarrollo frontend, contenido visual e implementación responsive.",
        en: "Information architecture, frontend development, visual content and responsive implementation."
      }
    },
    journey: [
      {
        id: "problem",
        icon: "fa-solid fa-triangle-exclamation",
        title: { es: "Problema", en: "Problem" },
        description: {
          es: "El servicio necesitaba una presencia digital clara para mostrar su propuesta, diferenciar sus packs y concentrar la información clave antes de la consulta.",
          en: "The service needed a clear digital presence to showcase its offering, differentiate packages and gather key information before an enquiry."
        }
      },
      {
        id: "process",
        icon: "fa-solid fa-gears",
        title: { es: "Proceso", en: "Process" },
        description: {
          es: "Se estructuró el contenido comercial y se desarrolló una landing responsive con navegación, packs, carta, galería, preguntas frecuentes y contacto.",
          en: "The commercial content was structured into a responsive landing page with navigation, packages, menu, gallery, FAQs and contact."
        }
      },
      {
        id: "solution",
        icon: "fa-regular fa-circle-check",
        title: { es: "Solución", en: "Solution" },
        description: {
          es: "Una landing comercial que presenta el servicio de forma visual, organiza la oferta y guía al usuario hacia la cotización.",
          en: "A commercial landing page that presents the service visually, organizes the offering and guides users toward requesting a quote."
        }
      }
    ],
    highlights: [
      { es: "Navegación interna con desplazamiento suave.", en: "Internal navigation with smooth scrolling." },
      { es: "Presentación estructurada de servicios y packs.", en: "Structured presentation of services and packages." },
      { es: "Carta interactiva organizada por categorías.", en: "Interactive cocktail menu organized by category." },
      { es: "Galería visual orientada a reforzar la experiencia del servicio.", en: "Visual gallery designed to reinforce the service experience." },
      { es: "Preguntas frecuentes desplegables.", en: "Expandable frequently asked questions." },
      { es: "Formulario de consulta para eventos.", en: "Event enquiry form." },
      { es: "Adaptación a escritorio, tablet y móvil.", en: "Desktop, tablet and mobile adaptation." },
      { es: "Animaciones e interacciones de interfaz.", en: "Interface animations and interactions." }
    ],
    features: [
      {
        id: "services",
        capture: "B",
        title: { es: "Propuesta y servicios", en: "Offering and services" },
        description: {
          es: "Packs organizados por nivel de propuesta para facilitar la comparación y dirigir al usuario hacia la consulta.",
          en: "Packages organized by service level to simplify comparison and guide users toward an enquiry."
        }
      },
      {
        id: "visual-experience",
        capture: "C",
        title: { es: "Experiencia visual", en: "Visual experience" },
        description: {
          es: "Composición editorial y galería fotográfica para transmitir la experiencia del servicio y reforzar su identidad.",
          en: "Editorial composition and photo gallery that communicate the service experience and reinforce its identity."
        }
      },
      {
        id: "event-enquiry",
        capture: "D",
        title: { es: "Consulta de evento", en: "Event enquiry" },
        description: {
          es: "Formulario estructurado para recopilar los principales datos de un evento antes de iniciar una conversación comercial.",
          en: "Structured form for gathering key event details before starting a commercial conversation."
        }
      }
    ],
    relatedProjectIds: ["jenny-ugc", "wohl-fitness"]
  }
];

export function getWebCaseStudy(slug?: string) {
  return webCaseStudies.find((study) => study.slug === slug);
}
