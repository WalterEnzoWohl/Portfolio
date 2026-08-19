import type { Language } from "../config/navigation";
import type { ProjectCaptureLetter } from "./projectCaptures";

type LocalizedText = Record<Language, string>;

export type DataCaseStudyDetail = {
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
  analysisCards: Array<{
    capture: Exclude<ProjectCaptureLetter, "A">;
    title: LocalizedText;
    description: LocalizedText;
  }>;
  detectionItems: Record<Language, string[]>;
};

export const dataCaseStudies: DataCaseStudyDetail[] = [
  {
    projectId: "gastos-rrhh",
    slug: "analisis-de-gastos-rrhh",
    fullDescription: {
      es: "Convierte información presupuestaria en una lectura útil para identificar dónde aparecen los desvíos y qué categorías requieren revisión.",
      en: "It turns budget information into a useful view for identifying where variances appear and which categories require review."
    },
    quickFacts: {
      context: { es: "Control presupuestario de Recursos Humanos.", en: "Human Resources budget control." },
      objective: { es: "Comparar presupuesto y gasto real.", en: "Compare budget and actual spend." },
      participation: { es: "Análisis, modelado y visualización.", en: "Analysis, modeling and visualization." }
    },
    journey: [
      { id: "problem", icon: "fa-solid fa-triangle-exclamation", title: { es: "Problema", en: "Problem" }, description: { es: "La información no permitía identificar rápidamente dónde aparecían los desvíos.", en: "The information did not make it easy to quickly identify where variances appeared." } },
      { id: "process", icon: "fa-solid fa-gears", title: { es: "Proceso", en: "Process" }, description: { es: "Preparación de datos, definición de indicadores y diseño de visualizaciones.", en: "Data preparation, indicator definition and visualization design." } },
      { id: "solution", icon: "fa-regular fa-circle-check", title: { es: "Solución", en: "Solution" }, description: { es: "Un tablero para comparar presupuesto, gasto y saldo por categoría y período.", en: "A dashboard to compare budget, spend and balance by category and period." } }
    ],
    analysisCards: [
      { capture: "B", title: { es: "Presupuesto frente a gasto", en: "Budget versus spend" }, description: { es: "Compara el gasto real contra el presupuesto total.", en: "Compares actual spend against the total budget." } },
      { capture: "C", title: { es: "Desvíos por categoría", en: "Variance by category" }, description: { es: "Permite revisar diferencias por categoría de gasto.", en: "Supports reviewing differences by expense category." } },
      { capture: "D", title: { es: "Evolución mensual", en: "Monthly evolution" }, description: { es: "Facilita observar la evolución del gasto a lo largo de los meses.", en: "Makes it easier to observe spending evolution over time." } }
    ],
    detectionItems: {
      es: ["Categorías con mayor participación en el gasto.", "Períodos con mayores desvíos.", "Diferencias entre presupuesto y ejecución.", "Puntos que requieren una revisión más detallada."],
      en: ["Categories with a larger share of spending.", "Periods with larger variances.", "Differences between budget and execution.", "Items that require a more detailed review."]
    }
  },
  {
    projectId: "ventas-appol",
    slug: "informe-de-ventas-appol",
    fullDescription: {
      es: "Integra ventas, gastos, utilidad y margen para comparar productos y mercados desde una lectura comercial unificada.",
      en: "It brings sales, costs, profit and margin together to compare products and markets through a unified commercial view."
    },
    quickFacts: {
      context: { es: "Seguimiento comercial por producto y mercado.", en: "Commercial tracking by product and market." },
      objective: { es: "Analizar utilidad, márgenes y desempeño.", en: "Analyze profit, margins and performance." },
      participation: { es: "Análisis, modelado y visualización.", en: "Analysis, modeling and visualization." }
    },
    journey: [
      { id: "problem", icon: "fa-solid fa-triangle-exclamation", title: { es: "Problema", en: "Problem" }, description: { es: "La información comercial no ofrecía una lectura integrada de ventas, utilidad y margen por mercado.", en: "Commercial information did not provide an integrated view of sales, profit and margin by market." } },
      { id: "process", icon: "fa-solid fa-gears", title: { es: "Proceso", en: "Process" }, description: { es: "Preparación y relación de datos por producto, período, país y continente, con medidas DAX.", en: "Preparation and connection of data by product, period, country and continent, using DAX measures." } },
      { id: "solution", icon: "fa-regular fa-circle-check", title: { es: "Solución", en: "Solution" }, description: { es: "Un dashboard para comparar utilidad, margen y desempeño entre productos y mercados.", en: "A dashboard to compare profit, margin and performance across products and markets." } }
    ],
    analysisCards: [
      { capture: "B", title: { es: "Utilidad y margen", en: "Profit and margin" }, description: { es: "Permite revisar los principales indicadores comerciales.", en: "Supports reviewing the main commercial indicators." } },
      { capture: "C", title: { es: "Desempeño por producto", en: "Product performance" }, description: { es: "Facilita comparar productos y categorías.", en: "Makes it easier to compare products and categories." } },
      { capture: "D", title: { es: "Países y continentes", en: "Countries and continents" }, description: { es: "Ayuda a observar la distribución geográfica del desempeño.", en: "Helps observe the geographic distribution of performance." } }
    ],
    detectionItems: {
      es: ["Mercados con diferente participación.", "Cambios en el desempeño a través del tiempo.", "Diferencias entre productos o categorías.", "Resultados que requieren una revisión más detallada."],
      en: ["Markets with different levels of participation.", "Changes in performance over time.", "Differences between products or categories.", "Results that require a more detailed review."]
    }
  },
  {
    projectId: "mailing-gcba",
    slug: "metricas-de-mailing-gcba",
    fullDescription: {
      es: "Centraliza los principales indicadores para comparar campañas, seguir su evolución e identificar diferencias de desempeño.",
      en: "It centralizes the main indicators to compare campaigns, follow their evolution and identify performance differences."
    },
    quickFacts: {
      context: { es: "Seguimiento de campañas de mailing.", en: "Mailing campaign monitoring." },
      objective: { es: "Comparar envíos, aperturas y clics.", en: "Compare sends, opens and clicks." },
      participation: { es: "Análisis, modelado y visualización.", en: "Analysis, modeling and visualization." }
    },
    journey: [
      { id: "problem", icon: "fa-solid fa-triangle-exclamation", title: { es: "Problema", en: "Problem" }, description: { es: "Los indicadores estaban dispersos y dificultaban comparar el rendimiento entre campañas.", en: "Indicators were scattered, making campaign performance difficult to compare." } },
      { id: "process", icon: "fa-solid fa-gears", title: { es: "Proceso", en: "Process" }, description: { es: "Organización de datos, definición de métricas y diseño de vistas para seguimiento.", en: "Data organization, metric definition and design of monitoring views." } },
      { id: "solution", icon: "fa-regular fa-circle-check", title: { es: "Solución", en: "Solution" }, description: { es: "Un dashboard que centraliza envíos, aperturas, clics y evolución por campaña.", en: "A dashboard that centralizes sends, opens, clicks and campaign evolution." } }
    ],
    analysisCards: [
      { capture: "B", title: { es: "Volumen de envíos", en: "Send volume" }, description: { es: "Compara la cantidad enviada entre períodos y campañas.", en: "Compares send volume across periods and campaigns." } },
      { capture: "C", title: { es: "Aperturas y clics", en: "Opens and clicks" }, description: { es: "Permite revisar la respuesta obtenida por cada pieza.", en: "Supports reviewing response by campaign piece." } },
      { capture: "D", title: { es: "Evolución mensual", en: "Monthly evolution" }, description: { es: "Ayuda a observar cambios de rendimiento a lo largo del tiempo.", en: "Helps observe performance changes over time." } }
    ],
    detectionItems: {
      es: ["Campañas con mayor nivel de interacción.", "Períodos con cambios en aperturas y clics.", "Piezas con comportamientos diferentes.", "Resultados que requieren una revisión más detallada."],
      en: ["Campaigns with higher interaction levels.", "Periods with changes in opens and clicks.", "Campaign pieces with different behavior.", "Results that require a more detailed review."]
    }
  },
  {
    projectId: "nomina-rrhh",
    slug: "gestion-de-nomina-rrhh",
    fullDescription: {
      es: "Organiza información agregada de dotación para consultar composición, distribución organizacional y antigüedad desde una única vista.",
      en: "It organizes aggregated workforce information to review composition, organizational distribution and tenure in one view."
    },
    quickFacts: {
      context: { es: "Seguimiento de la composición de Recursos Humanos.", en: "Human Resources workforce composition monitoring." },
      objective: { es: "Comprender la distribución de la nómina.", en: "Understand workforce distribution." },
      participation: { es: "Análisis, preparación y visualización.", en: "Analysis, preparation and visualization." }
    },
    journey: [
      { id: "problem", icon: "fa-solid fa-triangle-exclamation", title: { es: "Problema", en: "Problem" }, description: { es: "La información fragmentada dificultaba comprender la composición y distribución agregada del personal.", en: "Fragmented information made it difficult to understand aggregate workforce composition and distribution." } },
      { id: "process", icon: "fa-solid fa-gears", title: { es: "Proceso", en: "Process" }, description: { es: "Organización de atributos, preparación de categorías y diseño de vistas para explorar la nómina.", en: "Organization of attributes, category preparation and design of views to explore the workforce." } },
      { id: "solution", icon: "fa-regular fa-circle-check", title: { es: "Solución", en: "Solution" }, description: { es: "Un tablero para consultar composición, rangos etarios, antigüedad y distribución organizacional.", en: "A dashboard to review composition, age ranges, tenure and organizational distribution." } }
    ],
    analysisCards: [
      { capture: "B", title: { es: "Composición por género", en: "Gender composition" }, description: { es: "Permite revisar la distribución agregada por género.", en: "Supports reviewing aggregate gender distribution." } },
      { capture: "C", title: { es: "Distribución etaria", en: "Age distribution" }, description: { es: "Facilita observar la composición por rango etario.", en: "Makes it easier to observe composition by age range." } },
      { capture: "D", title: { es: "Antigüedad y organización", en: "Tenure and organization" }, description: { es: "Ayuda a revisar antigüedad y distribución por área.", en: "Helps review tenure and distribution by area." } }
    ],
    detectionItems: {
      es: ["Grupos con mayor o menor representación agregada.", "Diferencias de composición entre áreas.", "Concentración por rango etario o antigüedad.", "Segmentos que requieren una revisión más detallada."],
      en: ["Groups with higher or lower aggregate representation.", "Composition differences across areas.", "Concentration by age range or tenure.", "Segments that require a more detailed review."]
    }
  }
];

export function getDataCaseStudy(slug?: string) {
  return dataCaseStudies.find((study) => study.slug === slug);
}
