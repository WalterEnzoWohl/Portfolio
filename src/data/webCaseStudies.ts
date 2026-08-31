import type { Language } from "../config/navigation";
import type { ProjectCaptureLetter } from "./projectCaptures";

type LocalizedText = Record<Language, string>;

export type WebCaseStudyDetail = {
  projectId: string;
  slug: string;
  variant?: "ugc-platform" | "commercial-landing" | "internal-tool";
  categoryLabel?: LocalizedText;
  ctaLabel?: LocalizedText;
  heroCapture?: ProjectCaptureLetter;
  mainViewLabel?: LocalizedText;
  journeyTitle?: LocalizedText;
  highlightsPlacement?: "before-features" | "after-features";
  splitFooter?: boolean;
  featuresEyebrow?: LocalizedText;
  featuresTitle?: LocalizedText;
  leadDescription?: LocalizedText;
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
    capture: ProjectCaptureLetter;
    title: LocalizedText;
    description: LocalizedText;
  }>;
  relatedProjectIds: string[];
};

export const webCaseStudies: WebCaseStudyDetail[] = [
  {
    projectId: "sigo",
    slug: "sigo",
    variant: "internal-tool",
    categoryLabel: { es: "Herramienta interna", en: "Internal tool" },
    ctaLabel: { es: "Abrir sistema", en: "Open system" },
    heroCapture: "A",
    mainViewLabel: { es: "Inicio y resumen", en: "Home and overview" },
    journeyTitle: { es: "Del problema a la solución", en: "From problem to solution" },
    highlightsPlacement: "after-features",
    splitFooter: true,
    featuresEyebrow: {
      es: "Área → meta → indicador clave → carga → validación → análisis",
      en: "Area → goal → key indicator → entry → validation → analysis"
    },
    featuresTitle: { es: "Qué permite hacer", en: "What it enables" },
    leadDescription: {
      es: "Sistema interno de indicadores y objetivos para equipos, áreas, metas e indicadores clave.",
      en: "Internal indicators and objectives system for teams, areas, goals and key indicators."
    },
    fullDescription: {
      es: "Centraliza la carga de indicadores clave, el seguimiento de avances, la validación de envíos y el análisis de cumplimiento en una única herramienta interna.",
      en: "It centralizes key indicator entry, progress tracking, submission validation and performance analysis in a single internal tool."
    },
    quickFacts: {
      context: {
        es: "Seguimiento de KPIs, áreas y objetivos.",
        en: "Tracking KPIs, areas and objectives."
      },
      objective: {
        es: "Ordenar el seguimiento de metas e indicadores clave por área.",
        en: "Organize the tracking of goals and key indicators by area."
      },
      participation: {
        es: "Rediseño conceptual, estructura de datos, interfaz, métricas y experiencia de uso.",
        en: "Concept redesign, data structure, interface, metrics and user experience."
      }
    },
    journey: [
      {
        id: "problem",
        icon: "fa-solid fa-diagram-project",
        title: { es: "Problema", en: "Problem" },
        description: {
          es: "La información y el seguimiento de indicadores podían quedar dispersos y dificultar el control del avance real.",
          en: "Indicator information and tracking could become scattered, making actual progress difficult to control."
        }
      },
      {
        id: "process",
        icon: "fa-solid fa-gears",
        title: { es: "Proceso", en: "Process" },
        description: {
          es: "Se redefinió el sistema alrededor de áreas, metas e indicadores clave, incorporando carga periódica, validación, trazabilidad y análisis.",
          en: "The system was redefined around areas, goals and key indicators, incorporating periodic entry, validation, traceability and analysis."
        }
      },
      {
        id: "solution",
        icon: "fa-regular fa-circle-check",
        title: { es: "Solución", en: "Solution" },
        description: {
          es: "Una aplicación interna para registrar avances, monitorear el cumplimiento y analizar resultados desde una vista centralizada.",
          en: "An internal application for recording progress, monitoring performance and analyzing results from a centralized view."
        }
      }
    ],
    highlights: [
      { es: "Seguimiento de áreas, metas e indicadores clave.", en: "Tracking areas, goals and key indicators." },
      { es: "Carga periódica de avances.", en: "Periodic progress entry." },
      { es: "Validación y trazabilidad de envíos.", en: "Submission validation and traceability." },
      { es: "Analítica de cumplimiento por área.", en: "Performance analytics by area." },
      { es: "Filtros y vistas ejecutivas.", en: "Filters and executive views." },
      { es: "Roles de administrador y usuario.", en: "Administrator and user roles." },
      { es: "Arquitectura sobre Apps Script y Google Sheets.", en: "Architecture built on Apps Script and Google Sheets." },
      { es: "Datos demo para explorar el sistema.", en: "Demo data for exploring the system." }
    ],
    features: [
      {
        id: "home-overview",
        capture: "A",
        title: { es: "Inicio y resumen", en: "Home and overview" },
        description: {
          es: "Panel inicial con áreas activas, metas, indicadores clave, cumplimiento global y accesos rápidos.",
          en: "Home dashboard with active areas, goals, key indicators, global performance and quick actions."
        }
      },
      {
        id: "indicator-entry",
        capture: "B",
        title: { es: "Carga de indicadores", en: "Indicator entry" },
        description: {
          es: "Formulario para registrar avances periódicos, valores alcanzados, responsables y metadatos del indicador.",
          en: "Form for recording periodic progress, achieved values, owners and indicator metadata."
        }
      },
      {
        id: "my-submissions",
        capture: "C",
        title: { es: "Mis envíos", en: "My submissions" },
        description: {
          es: "Listado consultable de cargas realizadas con valores, fechas, estados y acceso al detalle.",
          en: "Searchable list of submitted entries with values, dates, statuses and detail access."
        }
      },
      {
        id: "analytics",
        capture: "D",
        title: { es: "Analytics", en: "Analytics" },
        description: {
          es: "Panel ejecutivo con cumplimiento por área, distribución de estados, evolución temporal y métricas globales.",
          en: "Executive dashboard with performance by area, status distribution, time evolution and global metrics."
        }
      },
      {
        id: "management",
        capture: "E",
        title: { es: "Gestión", en: "Management" },
        description: {
          es: "Administración centralizada de áreas, metas e indicadores clave con filtros, relaciones y estados.",
          en: "Centralized administration of areas, goals and key indicators with filters, relationships and statuses."
        }
      }
    ],
    relatedProjectIds: ["tablero-eventos-interno", "wohl-fitness"]
  },
  {
    projectId: "tablero-eventos-interno",
    slug: "tablero-eventos-interno",
    variant: "internal-tool",
    categoryLabel: { es: "Herramienta interna", en: "Internal tool" },
    ctaLabel: { es: "Abrir tablero", en: "Open dashboard" },
    heroCapture: "B",
    mainViewLabel: { es: "Resumen ejecutivo", en: "Executive summary" },
    journeyTitle: { es: "Del registro al análisis", en: "From record to analysis" },
    highlightsPlacement: "after-features",
    featuresEyebrow: {
      es: "Registro → organización → seguimiento → análisis",
      en: "Record → organization → monitoring → analysis"
    },
    featuresTitle: { es: "Qué permite hacer", en: "What it enables" },
    leadDescription: {
      es: "Herramienta interna para registrar, organizar y analizar eventos, entidades y articulaciones en un solo flujo de trabajo.",
      en: "Internal tool for recording, organizing and analyzing events, entities and collaborations in a single workflow."
    },
    fullDescription: {
      es: "Centraliza el calendario, la carga de nuevos eventos, el seguimiento operativo y un tablero de métricas con filtros, mapas y reportes exportables.",
      en: "It centralizes the calendar, new event registration, operational monitoring and a metrics workspace with filters, maps and exportable reports."
    },
    quickFacts: {
      context: {
        es: "Seguimiento y organización de eventos internos.",
        en: "Monitoring and organization of internal events."
      },
      objective: {
        es: "Ordenar la operación y facilitar el análisis de eventos, estados, entidades y distribución territorial.",
        en: "Organize operations and simplify the analysis of events, statuses, entities and territorial distribution."
      },
      participation: {
        es: "Diseño de la herramienta, estructura de datos, desarrollo de interfaz y visualización de métricas.",
        en: "Tool design, data structure, interface development and metrics visualization."
      }
    },
    journey: [
      {
        id: "problem",
        icon: "fa-solid fa-folder-tree",
        title: { es: "Problema", en: "Problem" },
        description: {
          es: "La información de eventos estaba dispersa en distintos archivos y el seguimiento requería procesos manuales.",
          en: "Event information was scattered across different files and monitoring required manual processes."
        }
      },
      {
        id: "process",
        icon: "fa-solid fa-arrows-to-circle",
        title: { es: "Proceso", en: "Process" },
        description: {
          es: "Se centralizaron el calendario, los formularios de registro, los filtros y los paneles de métricas dentro de una misma herramienta.",
          en: "The calendar, registration forms, filters and metrics panels were centralized in a single tool."
        }
      },
      {
        id: "solution",
        icon: "fa-regular fa-circle-check",
        title: { es: "Solución", en: "Solution" },
        description: {
          es: "Una aplicación interna para registrar, consultar y analizar eventos con información centralizada, métricas y reportes exportables.",
          en: "An internal application for recording, reviewing and analyzing events with centralized information, metrics and exportable reports."
        }
      }
    ],
    highlights: [
      { es: "Calendario mensual, semanal y listado.", en: "Monthly, weekly and list calendar views." },
      { es: "Registro y edición de eventos.", en: "Event registration and editing." },
      { es: "Gestión de entidades participantes.", en: "Management of participating entities." },
      { es: "Búsquedas y filtros combinados.", en: "Combined search and filters." },
      { es: "Indicadores y evolución temporal.", en: "Indicators and evolution over time." },
      { es: "Mapas y análisis territorial.", en: "Maps and territorial analysis." },
      { es: "Exportación de información a PDF y Excel.", en: "Information export to PDF and Excel." },
      { es: "Vista detallada de cada evento.", en: "Detailed view of each event." }
    ],
    features: [
      {
        id: "calendar-monitoring",
        capture: "A",
        title: { es: "Calendario y seguimiento", en: "Calendar and monitoring" },
        description: {
          es: "Vista mensual de eventos con búsqueda, filtros por estado y tipo, y seguimiento de su evolución.",
          en: "Monthly event view with search, status and type filters, and progress monitoring."
        }
      },
      {
        id: "executive-metrics",
        capture: "B",
        title: { es: "Reporte ejecutivo y métricas", en: "Executive report and metrics" },
        description: {
          es: "Resumen de eventos, estados y evolución temporal mediante indicadores y visualizaciones.",
          en: "Summary of events, statuses and evolution over time through indicators and visualizations."
        }
      },
      {
        id: "territorial-analysis",
        capture: "C",
        title: { es: "Análisis territorial y composición", en: "Territorial and composition analysis" },
        description: {
          es: "Distribución territorial, composición de eventos, rankings de entidades y análisis por comuna.",
          en: "Territorial distribution, event composition, entity rankings and district analysis."
        }
      },
      {
        id: "event-registration",
        capture: "D",
        title: { es: "Registro de nuevos eventos", en: "New event registration" },
        description: {
          es: "Formulario estructurado para registrar eventos, clasificarlos y vincular entidades y áreas participantes.",
          en: "Structured form to register and classify events and link participating entities and areas."
        }
      },
      {
        id: "event-management",
        capture: "E",
        title: { es: "Gestión y detalle", en: "Management and detail" },
        description: {
          es: "Listado consultable con filtros y panel de detalle para revisar información, participación e impacto de cada evento.",
          en: "Searchable list with filters and a detail panel to review each event's information, participation and impact."
        }
      }
    ],
    relatedProjectIds: []
  },
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
