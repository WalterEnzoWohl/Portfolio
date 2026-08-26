import type { Language } from "../config/navigation";
import type { ProjectCaptureLetter } from "./projectCaptures";

type LocalizedText = Record<Language, string>;

export type FitnessStoryIcon = "training" | "analytics" | "development";
export type FitnessFocusIcon = "routines" | "logging" | "metrics";

export type FitnessCaseStudyDetail = {
  projectId: string;
  slug: string;
  category: LocalizedText;
  platforms: LocalizedText;
  storeUrl: string;
  heroLead: LocalizedText;
  heroDescription: LocalizedText;
  story: Array<{
    id: string;
    icon: FitnessStoryIcon;
    title: LocalizedText;
    description: LocalizedText;
  }>;
  focus: Array<{
    id: string;
    icon: FitnessFocusIcon;
    title: LocalizedText;
    description: LocalizedText;
  }>;
  value: LocalizedText[];
  analyticsIntro: LocalizedText;
  analytics: Array<{
    id: string;
    title: LocalizedText;
    description: LocalizedText;
  }>;
  architecture: LocalizedText;
  technicalHighlights: LocalizedText[];
  features: Array<{
    id: string;
    capture: ProjectCaptureLetter;
    title: LocalizedText;
    description: LocalizedText;
  }>;
  relatedProjectIds: string[];
};

export const fitnessCaseStudies: FitnessCaseStudyDetail[] = [
  {
    projectId: "wohl-fitness",
    slug: "wohl-fitness",
    category: { es: "Aplicación móvil", en: "Mobile application" },
    platforms: { es: "Android + Web SPA", en: "Android + Web SPA" },
    storeUrl: "https://play.google.com/store/apps/details?id=com.wohl.app&pcampaignid=web_share",
    heroLead: {
      es: "Uní mi pasión por el entrenamiento, mi perfil analítico y mi amor por programar para crear lo que necesitaba: registrar y entender mis propios entrenamientos.",
      en: "I combined my passion for training, my analytical mindset and my love of programming to build what I needed: a way to log and understand my own workouts."
    },
    heroDescription: {
      es: "WOHL permite organizar rutinas, registrar entrenamientos serie por serie, consultar el historial y transformar esos datos en métricas de progreso, fuerza y carga muscular.",
      en: "WOHL lets users organize routines, log workouts set by set, review their history and turn that data into progress, strength and muscle-load metrics."
    },
    story: [
      {
        id: "training",
        icon: "training",
        title: { es: "Hobby + entrenamiento", en: "Training as a hobby" },
        description: {
          es: "Entreno de forma constante y necesitaba una herramienta flexible para organizar mis rutinas y registrar lo que realmente hacía en cada sesión.",
          en: "I train consistently and needed a flexible tool to organize my routines and record what I actually did in every session."
        }
      },
      {
        id: "analytics",
        icon: "analytics",
        title: { es: "Perfil analítico", en: "Analytical mindset" },
        description: {
          es: "Quise convertir cada entrenamiento en datos útiles para seguir volumen, frecuencia, fuerza, carga muscular y evolución a lo largo del tiempo.",
          en: "I wanted to turn every workout into useful data for tracking volume, frequency, strength, muscle load and progress over time."
        }
      },
      {
        id: "development",
        icon: "development",
        title: { es: "Desarrollo", en: "Development" },
        description: {
          es: "Transformé esa necesidad personal en una aplicación completa para Android y web, combinando frontend, almacenamiento offline, backend y funcionalidades nativas.",
          en: "I turned that personal need into a complete Android and web application, combining frontend, offline storage, backend and native capabilities."
        }
      }
    ],
    focus: [
      {
        id: "routines",
        icon: "routines",
        title: { es: "Rutinas", en: "Routines" },
        description: { es: "Planificación y organización flexible del entrenamiento.", en: "Flexible workout planning and organization." }
      },
      {
        id: "logging",
        icon: "logging",
        title: { es: "Registro", en: "Logging" },
        description: { es: "Series, pesos, repeticiones, descansos y notas durante la sesión.", en: "Sets, weights, repetitions, rest times and notes during the session." }
      },
      {
        id: "metrics",
        icon: "metrics",
        title: { es: "Métricas", en: "Metrics" },
        description: { es: "Datos históricos transformados en indicadores claros de progreso.", en: "Historical data turned into clear progress indicators." }
      }
    ],
    value: [
      { es: "Creación y gestión completa de rutinas.", en: "Complete routine creation and management." },
      { es: "Registro de series, pesos y repeticiones.", en: "Set, weight and repetition logging." },
      { es: "Historial detallado de entrenamientos.", en: "Detailed workout history." },
      { es: "Seguimiento de fuerza y récords personales.", en: "Strength and personal-record tracking." },
      { es: "Métricas de volumen, frecuencia y evolución.", en: "Volume, frequency and progress metrics." },
      { es: "Visualización de carga y balance muscular.", en: "Muscle-load and balance visualization." }
    ],
    analyticsIntro: {
      es: "WOHL transforma los datos granulares de cada serie en información útil para entender el progreso.",
      en: "WOHL turns granular set-level data into useful information for understanding progress."
    },
    analytics: [
      {
        id: "volume",
        title: { es: "Volumen", en: "Volume" },
        description: { es: "Peso × repeticiones.", en: "Weight × repetitions." }
      },
      {
        id: "frequency",
        title: { es: "Frecuencia", en: "Frequency" },
        description: { es: "Sesiones por período.", en: "Sessions per period." }
      },
      {
        id: "progression",
        title: { es: "Progresión", en: "Progression" },
        description: { es: "Evolución por ejercicio.", en: "Progress by exercise." }
      },
      {
        id: "strength",
        title: { es: "Fuerza", en: "Strength" },
        description: { es: "Estimación de 1RM.", en: "Estimated 1RM." }
      },
      {
        id: "records",
        title: { es: "Récords personales", en: "Personal records" },
        description: { es: "Peso, repeticiones y volumen.", en: "Weight, repetitions and volume." }
      },
      {
        id: "muscle-load",
        title: { es: "Carga muscular", en: "Muscle load" },
        description: { es: "Series directas, indirectas y balance.", en: "Direct, indirect sets and balance." }
      }
    ],
    architecture: {
      es: "Frontend modular en React y TypeScript, backend en Supabase, almacenamiento local offline-first con IndexedDB e integración Android mediante Capacitor y Java nativo.",
      en: "Modular React and TypeScript frontend, Supabase backend, offline-first local storage with IndexedDB and Android integration through Capacitor and native Java."
    },
    technicalHighlights: [
      { es: "Sesiones disponibles sin conexión mediante IndexedDB.", en: "Offline workout sessions through IndexedDB." },
      { es: "Sincronización y reconciliación con Supabase al recuperar la conexión.", en: "Synchronization and reconciliation with Supabase when connectivity returns." },
      { es: "Aplicación híbrida Android construida con Capacitor.", en: "Hybrid Android application built with Capacitor." },
      { es: "Métricas derivadas de los datos registrados en cada serie.", en: "Metrics derived from the data logged in every set." },
      { es: "Radar y mapa anatómico para visualizar la carga muscular.", en: "Radar chart and anatomical map for muscle-load visualization." },
      { es: "Catálogo local de 429 ejercicios con búsqueda, filtros e instrucciones.", en: "Local catalog of 429 exercises with search, filters and instructions." }
    ],
    features: [
      {
        id: "focused-training",
        capture: "B",
        title: { es: "Entrená con enfoque", en: "Train with focus" },
        description: {
          es: "Inicio y ejecución de sesiones con rutina activa, próximo entrenamiento y seguimiento durante la sesión.",
          en: "Start and run sessions with an active routine, next workout and in-session tracking."
        }
      },
      {
        id: "routine-planning",
        capture: "C",
        title: { es: "Organizá tus rutinas", en: "Organize your routines" },
        description: {
          es: "Creación, edición y organización de rutinas, días, ejercicios, series, descansos y frecuencia semanal.",
          en: "Create, edit and organize routines, days, exercises, sets, rest times and weekly frequency."
        }
      },
      {
        id: "set-logging",
        capture: "D",
        title: { es: "Registrá cada serie", en: "Log every set" },
        description: {
          es: "Registro en vivo de pesos, repeticiones, series completadas, notas y descansos.",
          en: "Live logging of weights, repetitions, completed sets, notes and rest times."
        }
      },
      {
        id: "session-history",
        capture: "E",
        title: { es: "Reviví cada sesión", en: "Review every session" },
        description: {
          es: "Historial editable para consultar cuándo entrenaste, qué ejercicios realizaste y qué cargas utilizaste.",
          en: "Editable history for reviewing when you trained, which exercises you performed and the loads you used."
        }
      },
      {
        id: "progress-metrics",
        capture: "F",
        title: { es: "Medí tu progreso real", en: "Measure real progress" },
        description: {
          es: "Métricas de volumen, frecuencia, fuerza, récords y evolución histórica para analizar el progreso.",
          en: "Volume, frequency, strength, record and historical progress metrics for analyzing improvement."
        }
      },
      {
        id: "muscle-load",
        capture: "G",
        title: { es: "Visualizá tu carga muscular", en: "Visualize muscle load" },
        description: {
          es: "Análisis de series directas e indirectas por músculo mediante gráficos y un mapa anatómico interactivo.",
          en: "Analysis of direct and indirect sets per muscle through charts and an interactive anatomical map."
        }
      }
    ],
    relatedProjectIds: ["jenny-ugc", "riki-wohl"]
  }
];

export function getFitnessCaseStudy(slug?: string) {
  return fitnessCaseStudies.find((study) => study.slug === slug);
}
