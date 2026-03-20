import { useEffect, useMemo, useState, type CSSProperties, type Dispatch, type SetStateAction, type SyntheticEvent } from "react";
import { Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";
import "./style.css";

type Language = "es" | "en";
type Theme = "dark" | "light";

type LocalizedText = {
  es: string;
  en: string;
};

type LocalizedList = {
  es: string[];
  en: string[];
};

type ContactFormValues = {
  name: string;
  phonenumber: string;
  email: string;
  title: string;
  message: string;
};

type ContactCopyField = "email" | "phone" | null;

type SubmitState = {
  type: "success" | "error";
  message: string;
} | null;

type ProjectCategory = "all" | "powerbi" | "web";
type ProjectLinkKind = "project" | "dashboard" | "repository";

type Certification = {
  title: LocalizedText;
  provider: LocalizedText;
  year: LocalizedText;
  link: string;
  icon: string;
  skills: string[];
  description: LocalizedText;
};

type Project = {
  title: LocalizedText;
  category: Exclude<ProjectCategory, "all">;
  description: LocalizedText;
  tools: string[];
  highlights: LocalizedList;
  image: string;
  link: string;
  linkKind?: ProjectLinkKind;
  caseStudySlug?: string;
};

type CurriculumItem = {
  title: LocalizedText;
  place: LocalizedText;
  date: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  highlights: LocalizedList;
  stack: string[];
  current?: boolean;
};

type CaseStudyFact = {
  label: LocalizedText;
  value: LocalizedText;
};

type CaseStudySection = {
  id: string;
  icon: string;
  title: LocalizedText;
  body: LocalizedText;
  bullets: LocalizedList;
};

type CaseStudy = {
  slug: string;
  title: LocalizedText;
  eyebrow: LocalizedText;
  summary: LocalizedText;
  narrative: LocalizedText;
  image: string;
  imageAlt: LocalizedText;
  category: Exclude<ProjectCategory, "all">;
  stack: string[];
  externalLink: string;
  externalLabel: LocalizedText;
  quickFacts: CaseStudyFact[];
  outcomes: LocalizedList;
  quote: LocalizedText;
  sections: CaseStudySection[];
};

const uiCopy = {
  es: {
    nav: {
      home: "Inicio",
      about: "SobreMi",
      portfolio: "Portfolio",
      curriculum: "Currículum",
      certifications: "Certificaciones",
      contact: "Contacto"
    },
    languageSwitcherAria: "Cambiar idioma",
    heroRole: "Analista de Datos especializado en resolución de problemas, automatización de reportes, desarrollo de herramientas internas y dashboards para operación y gestión.",
    heroSummary:
      "Transformo información dispersa en decisiones claras: diseño soluciones de datos, circuitos internos y visualizaciones que ordenan procesos y reducen trabajo manual.",
    about: {
      title: "Sobre mí",
      body:
        "Hola, soy Walter Enzo Wohl. Soy Analista de Datos IT con experiencia en análisis, reporting y visualización para acompañar decisiones de negocio y operación. Trabajo con Excel, SQL, Power BI, Looker y Python para convertir información dispersa en indicadores claros, dashboards accionables y procesos más ordenados. También cuento con base en desarrollo web y herramientas de colaboración como Git, GitHub y MySQL, lo que me permite moverme con comodidad entre datos, producto y ejecución.",
      download: "Descargar CV",
      contact: "Contactarme",
      valueTitle: "Lo que puedo aportar",
      values: [
        {
          title: "Reporting y seguimiento de KPIs",
          description: "Diseño reportes y tableros para ordenar información y mejorar el control operativo."
        },
        {
          title: "Visualización para toma de decisiones",
          description: "Presento hallazgos de forma clara para que equipos y referentes puedan actuar más rápido."
        },
        {
          title: "Ejecución transversal",
          description: "Combino analítica, automatización y criterio técnico para resolver necesidades de punta a punta."
        }
      ],
      pillars: [
        {
          title: "Toma de decisiones",
          description: "Datos claros para priorizar mejor y decidir con más contexto."
        },
        {
          title: "Storytelling de datos",
          description: "Contexto, visualización y síntesis para comunicar mejor cada hallazgo."
        },
        {
          title: "Ejecución",
          description: "Implementación práctica con foco en impacto, orden y continuidad operativa."
        }
      ]
    },
    curriculum: {
      title: "Currículum",
      subtitle: "Experiencia profesional con foco en analítica, mejora operativa y desarrollo.",
      experience: "Experiencia",
      downloadCv: "Descargar CV",
      currentBadge: "Actualidad",
      spotlightCurrent: "Rol actual",
      spotlightExperience: "Recorrido",
      spotlightExperienceUnit: "experiencias recientes",
      spotlightFocus: "Enfoque",
      spotlightFocusValue: "BI, automatización y herramientas internas",
      showMore: "Ver más",
      showLess: "Ver menos"
    },
    certifications: {
      title: "Certificaciones",
      subtitle: "Certificaciones, formación y habilidades incorporadas en cada etapa.",
      showMore: "Ver más",
      showLess: "Ver menos"
    },
    portfolio: {
      title: "Portfolio",
      subtitle: "Proyectos orientados a análisis de datos y desarrollo web con foco en impacto real.",
      filters: {
        all: "Todos los proyectos",
        powerbi: "BI y Dashboards",
        web: "Desarrollo Web"
      },
      badges: {
        powerbi: "BI y Dashboards",
        web: "Desarrollo Web"
      },
      viewProject: "Ver proyecto",
      viewCaseStudy: "Ver case study",
      openDashboard: "Abrir dashboard",
      openRepository: "Abrir repositorio",
      openProject: "Abrir proyecto"
    },
    caseStudy: {
      backToPortfolio: "Volver al portfolio",
      summaryTitle: "Qué resolvió este proyecto",
      factsTitle: "Ficha rápida",
      storyTitle: "Proceso, decisiones y hallazgos",
      imageTitle: "Vista principal",
      moreProjects: "Explorar más proyectos"
    },
    contact: {
      title: "Contacto",
      subtitle:
        "Contame tu objetivo y te respondo con una propuesta clara para ayudarte con análisis, BI, reporting o automatización.",
      pill: "Disponible para proyectos y propuestas laborales",
      heading: "Construyamos algo que tenga impacto real",
      body:
        "Si necesitás ordenar información, crear dashboards o mejorar el seguimiento de indicadores, conversemos. Trabajo con foco en resultados, claridad y ejecución prolija.",
      emailLabel: "Email",
      phoneLabel: "Teléfono",
      copyEmail: "Copiar email",
      copyPhone: "Copiar teléfono",
      github: "GitHub",
      linkedin: "LinkedIn",
      location: "GBA | Buenos Aires | Argentina",
      response: "Respuesta habitual: dentro de 24 horas",
      form: {
        name: "Nombre",
        namePlaceholder: "Tu nombre",
        phone: "Teléfono",
        phonePlaceholder: "Número de teléfono",
        email: "Email",
        emailPlaceholder: "Dirección de correo",
        title: "Asunto",
        titlePlaceholder: "Asunto",
        message: "Mensaje",
        messagePlaceholder: "Mensaje"
      },
      sending: "Enviando...",
      send: "Enviar mensaje",
      success: "Mensaje enviado con éxito.",
      error: "No se pudo enviar el mensaje. Probá nuevamente en unos minutos.",
      validation: {
        nameRequired: "El nombre es obligatorio.",
        phoneRequired: "El teléfono es obligatorio.",
        phoneInvalid: "Ingresá un teléfono válido.",
        emailRequired: "El email es obligatorio.",
        emailInvalid: "Ingresá un email válido.",
        titleRequired: "El asunto es obligatorio.",
        messageRequired: "El mensaje es obligatorio."
      }
    },
    footer: "Todos los derechos reservados."
  },
  en: {
    nav: {
      home: "Home",
      about: "AboutMe",
      portfolio: "Portfolio",
      curriculum: "Resume",
      certifications: "Certifications",
      contact: "Contact"
    },
    languageSwitcherAria: "Change language",
    heroRole: "Data Analyst specialized in problem solving, report automation, internal tools and visual dashboards for operations and management.",
    heroSummary:
      "I turn scattered information into clear decisions by building data solutions, internal workflows and visual systems that reduce manual work and improve execution.",
    about: {
      title: "About Me",
      body:
        "Hi, I'm Walter Enzo Wohl. I'm an IT Data Analyst with experience in analytics, reporting and visualization to support business and operational decisions. I work with Excel, SQL, Power BI, Looker and Python to turn scattered information into clear indicators, actionable dashboards and more organized processes. I also have a web development foundation and collaboration tools such as Git, GitHub and MySQL, which allows me to move comfortably between data, product and execution.",
      download: "Download CV",
      contact: "Contact me",
      valueTitle: "What I bring",
      values: [
        {
          title: "Reporting and KPI tracking",
          description: "I design reports and dashboards that organize information and improve operational control."
        },
        {
          title: "Decision-oriented visualization",
          description: "I present findings clearly so teams and stakeholders can act faster."
        },
        {
          title: "Cross-functional execution",
          description: "I combine analytics, automation and technical judgment to solve needs end to end."
        }
      ],
      pillars: [
        {
          title: "Decision making",
          description: "Clear data to prioritize better and make decisions with stronger context."
        },
        {
          title: "Data storytelling",
          description: "Context, visualization and synthesis to communicate each finding more effectively."
        },
        {
          title: "Execution",
          description: "Practical implementation focused on impact, clarity and operational continuity."
        }
      ]
    },
    curriculum: {
      title: "Resume",
      subtitle: "Professional experience focused on analytics, operational improvement and development.",
      experience: "Experience",
      downloadCv: "Download CV",
      currentBadge: "Present",
      spotlightCurrent: "Current role",
      spotlightExperience: "Track record",
      spotlightExperienceUnit: "recent roles",
      spotlightFocus: "Focus",
      spotlightFocusValue: "BI, automation and internal tools",
      showMore: "Show more",
      showLess: "Show less"
    },
    certifications: {
      title: "Certifications",
      subtitle: "Certifications, training and the skills I developed at each stage.",
      showMore: "Show more",
      showLess: "Show less"
    },
    portfolio: {
      title: "Portfolio",
      subtitle: "Projects focused on data analysis and web development with an emphasis on real impact.",
      filters: {
        all: "All projects",
        powerbi: "BI & Dashboards",
        web: "Web Development"
      },
      badges: {
        powerbi: "BI & Dashboards",
        web: "Web Development"
      },
      viewProject: "View project",
      viewCaseStudy: "View case study",
      openDashboard: "Open dashboard",
      openRepository: "Open repository",
      openProject: "Open project"
    },
    caseStudy: {
      backToPortfolio: "Back to portfolio",
      summaryTitle: "What this project solved",
      factsTitle: "Quick facts",
      storyTitle: "Process, decisions and insights",
      imageTitle: "Main view",
      moreProjects: "Explore more projects"
    },
    contact: {
      title: "Contact",
      subtitle:
        "Tell me about your goal and I'll reply with a clear proposal to help you with analytics, BI, reporting or automation.",
      pill: "Available for projects and job opportunities",
      heading: "Let's build something with real impact",
      body:
        "If you need to organize information, build dashboards or improve KPI tracking, let's talk. I work with a focus on results, clarity and clean execution.",
      emailLabel: "Email",
      phoneLabel: "Phone",
      copyEmail: "Copy email",
      copyPhone: "Copy phone",
      github: "GitHub",
      linkedin: "LinkedIn",
      location: "Greater Buenos Aires | Argentina",
      response: "Typical response time: within 24 hours",
      form: {
        name: "Name",
        namePlaceholder: "Your name",
        phone: "Phone",
        phonePlaceholder: "Phone number",
        email: "Email",
        emailPlaceholder: "Email address",
        title: "Subject",
        titlePlaceholder: "Subject",
        message: "Message",
        messagePlaceholder: "Message"
      },
      sending: "Sending...",
      send: "Send message",
      success: "Message sent successfully.",
      error: "The message could not be sent. Please try again in a few minutes.",
      validation: {
        nameRequired: "Name is required.",
        phoneRequired: "Phone number is required.",
        phoneInvalid: "Enter a valid phone number.",
        emailRequired: "Email is required.",
        emailInvalid: "Enter a valid email address.",
        titleRequired: "Subject is required.",
        messageRequired: "Message is required."
      }
    },
    footer: "All rights reserved."
  }
} as const;

const certifications: Certification[] = [
  {
    title: { es: "Google Data Analytics", en: "Google Data Analytics" },
    provider: { es: "Google | Coursera", en: "Google | Coursera" },
    year: { es: "2025 - Actualidad", en: "2025 - Present" },
    link: "/img/Walter Enzo Wohl CV.pdf",
    icon: "fa-solid fa-chart-line",
    skills: ["Python", "Pandas", "NumPy", "Looker", "Google Sheets", "AppScript", "PostgreSQL"],
    description: {
      es: "Certificación orientada a análisis de datos, limpieza y preparación de información, uso de spreadsheets, SQL, visualización y toma de decisiones basada en datos.",
      en: "Certification focused on data analysis, data cleaning and preparation, spreadsheets, SQL, visualization and data-driven decision making."
    }
  },
  {
    title: { es: "Diplomatura en Desarrollo Web Full Stack", en: "Full Stack Web Development Diploma" },
    provider: { es: "Universidad Tecnológica Nacional", en: "National Technological University" },
    year: { es: "Marzo 2023 - Diciembre 2023", en: "March 2023 - December 2023" },
    link: "/img/Walter Enzo Wohl CV.pdf",
    icon: "fa-solid fa-code",
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Git", "GitHub", "MySQL"],
    description: {
      es: "Formación integral orientada al desarrollo de aplicaciones web frontend y backend. Incorporé HTML, CSS, JavaScript, Git, GitHub, Node.js y bases de datos, trabajando con proyectos prácticos y metodologías ágiles.",
      en: "Comprehensive training focused on front-end and back-end web application development. I worked with HTML, CSS, JavaScript, Git, GitHub, Node.js and databases through hands-on projects and agile methodologies."
    }
  },
  {
    title: { es: "Curso de Análisis de Datos", en: "Data Analysis Course" },
    provider: { es: "CREHANA", en: "CREHANA" },
    year: { es: "2025", en: "2025" },
    link: "/img/Walter Enzo Wohl CV.pdf",
    icon: "fa-solid fa-database",
    skills: ["Excel avanzado", "Macros", "Power BI", "SQL"],
    description: {
      es: "Análisis y visualización de datos usando Excel, SQL, Power BI y Python. Manipulación de grandes volúmenes de información y toma de decisiones basadas en datos.",
      en: "Data analysis and visualization using Excel, SQL, Power BI and Python. Handling large data volumes and supporting data-driven decisions."
    }
  }
];

const projects: Project[] = [
  {
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
    image: "/img/dashboard-rrhh.png",
    link: "https://app.powerbi.com/view?r=eyJrIjoiNzkzN2M5NDctNGFiMC00NmU3LTg1NzQtYjdiZmRlMDU0MzQ4IiwidCI6ImUwODdhZTVmLTQ2YjQtNDBiOS04ZGZkLTE1MTA4MTQwMTc3MyIsImMiOjR9",
    linkKind: "dashboard",
    caseStudySlug: "gastos-rrhh"
  },
  {
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
    image: "/img/dashboard-appol.png",
    link: "https://app.powerbi.com/view?r=eyJrIjoiYmZkOTYwMDYtNWU1NS00MjZkLTg2MWYtZDAxZmRkYzVhZGUwIiwidCI6ImUwODdhZTVmLTQ2YjQtNDBiOS04ZGZkLTE1MTA4MTQwMTc3MyIsImMiOjR9",
    linkKind: "dashboard",
    caseStudySlug: "ventas-appol"
  },
  {
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
    image: "/img/dashboard-mailing.png",
    link: "https://lookerstudio.google.com/reporting/ad58b1c2-d02e-4557-8634-537b8314354a",
    linkKind: "dashboard",
    caseStudySlug: "mailing-gcba"
  },
  {
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
    image: "/img/dashboard-nomina.png",
    link: "https://lookerstudio.google.com/reporting/26b9eca6-822c-41f9-836f-f16b76ab2acd",
    linkKind: "dashboard",
    caseStudySlug: "nomina-rrhh"
  },
  {
    title: { es: "WebApp de Gestión de Empleados", en: "Employee Management WebApp" },
    category: "web",
    description: {
      es: "Aplicación interna para centralizar solicitudes de vacaciones, licencias médicas y otras ausencias, reduciendo seguimiento manual y ordenando aprobaciones.",
      en: "Internal application to centralize vacation requests, medical leave and other absences, reducing manual follow-up and organizing approvals."
    },
    tools: ["AppScript", "JavaScript", "Git", "Clasp"],
    highlights: {
      es: ["Autogestión de ausencias en un único flujo", "Gestión interna apoyada en Google Workspace"],
      en: ["Self-service absence management in a single flow", "Internal management powered by Google Workspace"]
    },
    image: "/img/WIP.png",
    link: "https://github.com/WalterEnzoWohl",
    linkKind: "repository",
    caseStudySlug: "webapp-gestion-empleados"
  }
];

const caseStudies: CaseStudy[] = [
  {
    slug: "gastos-rrhh",
    title: { es: "Análisis de Gastos RRHH", en: "HR Expense Analysis" },
    eyebrow: { es: "Case study | Control presupuestario", en: "Case study | Budget control" },
    summary: {
      es: "Dashboard de RRHH para monitorear presupuesto, gasto real y desvíos por categoría con foco en control operativo.",
      en: "HR dashboard to monitor budget, actual spend and category variances with a focus on operational control."
    },
    narrative: {
      es: "Este proyecto se enfocó en convertir información presupuestaria en una lectura útil para seguimiento mensual. La meta no era solo ver cuánto se gastó, sino entender dónde aparecían desvíos y qué categorías merecían revisión.",
      en: "This project focused on turning budget information into a useful monthly tracking view. The goal was not only to see how much was spent, but to understand where variances appeared and which categories deserved review."
    },
    image: "/img/dashboard-rrhh.png",
    imageAlt: {
      es: "Dashboard de gastos de recursos humanos con KPIs de presupuesto y gasto real.",
      en: "Human resources expense dashboard with budget and actual spend KPIs."
    },
    category: "powerbi",
    stack: ["Power BI", "Excel"],
    externalLink: "https://app.powerbi.com/view?r=eyJrIjoiNzkzN2M5NDctNGFiMC00NmU3LTg1NzQtYjdiZmRlMDU0MzQ4IiwidCI6ImUwODdhZTVmLTQ2YjQtNDBiOS04ZGZkLTE1MTA4MTQwMTc3MyIsImMiOjR9",
    externalLabel: { es: "Abrir dashboard", en: "Open dashboard" },
    quickFacts: [
      {
        label: { es: "Contexto", en: "Context" },
        value: { es: "Control de gasto y presupuesto RRHH", en: "HR spend and budget control" }
      },
      {
        label: { es: "Fuente principal", en: "Main source" },
        value: { es: "Excel con datos presupuestarios y gasto real", en: "Excel with budget and actual spend data" }
      },
      {
        label: { es: "Usuarios", en: "Users" },
        value: { es: "RRHH y referentes de gestión", en: "HR and management stakeholders" }
      },
      {
        label: { es: "Decisión clave", en: "Key decision" },
        value: { es: "Detectar desvíos y priorizar ajustes", en: "Detect variances and prioritize adjustments" }
      }
    ],
    outcomes: {
      es: [
        "Consolidó presupuesto, gasto real y saldo en una sola vista.",
        "Permitió revisar categorías con mayor peso y mayor desvío.",
        "Mejoró la lectura mensual del gasto para seguimiento operativo."
      ],
      en: [
        "Consolidated budget, actual spend and remaining balance into one view.",
        "Made it easier to review categories with the highest weight and variance.",
        "Improved monthly expense reading for operational tracking."
      ]
    },
    quote: {
      es: "El valor del tablero fue pasar de mirar gasto aislado a entender dónde estaba el verdadero desvío.",
      en: "The value of the dashboard was moving from isolated spend tracking to understanding where the real variance lived."
    },
    sections: [
      {
        id: "contexto",
        icon: "fa-solid fa-sack-dollar",
        title: { es: "Contexto", en: "Context" },
        body: {
          es: "El tablero nació para dar visibilidad al uso del presupuesto de RRHH y permitir un seguimiento más claro del gasto por categoría y período.",
          en: "The dashboard was created to provide visibility into HR budget usage and allow clearer tracking of spending by category and period."
        },
        bullets: {
          es: ["Seguimiento mensual de gasto", "Enfoque en control presupuestario"],
          en: ["Monthly expense tracking", "Budget control focus"]
        }
      },
      {
        id: "problema",
        icon: "fa-solid fa-triangle-exclamation",
        title: { es: "Problema", en: "Problem" },
        body: {
          es: "Sin una lectura integrada era más difícil comparar presupuesto vs. gasto real y detectar rápidamente qué rubros estaban explicando los desvíos.",
          en: "Without an integrated view it was harder to compare budget vs. actual spend and quickly detect which categories were driving variances."
        },
        bullets: {
          es: ["Comparaciones manuales entre presupuesto y ejecución", "Poca claridad sobre categorías críticas"],
          en: ["Manual comparisons between budget and execution", "Low clarity on critical categories"]
        }
      },
      {
        id: "fuentes",
        icon: "fa-solid fa-database",
        title: { es: "Fuente de datos", en: "Data source" },
        body: {
          es: "Trabajé con datos consolidados en Excel que reunían presupuesto, gasto y saldo. La prioridad fue ordenar la base para sostener una lectura clara en Power BI.",
          en: "I worked with consolidated Excel data that gathered budget, spend and remaining balance. The priority was to organize the dataset to support a clear Power BI reading."
        },
        bullets: {
          es: ["Presupuesto, gasto real y saldo", "Categorías y cortes temporales"],
          en: ["Budget, actual spend and remaining balance", "Categories and time periods"]
        }
      },
      {
        id: "proceso",
        icon: "fa-solid fa-gears",
        title: { es: "Proceso y modelado", en: "Process and modeling" },
        body: {
          es: "Modelé una estructura simple para comparar ejecución contra presupuesto y navegar entre categorías, meses y acumulados sin perder contexto.",
          en: "I modeled a simple structure to compare execution against budget and navigate categories, months and accumulated values without losing context."
        },
        bullets: {
          es: ["Modelo orientado a comparación y variación", "Jerarquía pensada para análisis operativo"],
          en: ["Model focused on comparison and variance", "Hierarchy designed for operational analysis"]
        }
      },
      {
        id: "metricas",
        icon: "fa-solid fa-chart-column",
        title: { es: "Métricas", en: "Metrics" },
        body: {
          es: "El foco estuvo en KPIs que explicaran cuánto se gastó, cuánto presupuesto quedaba y qué porcentaje de ejecución representaba cada categoría.",
          en: "The focus was on KPIs explaining how much was spent, how much budget remained and what execution percentage each category represented."
        },
        bullets: {
          es: ["Presupuesto total, gasto total y saldo", "Porcentaje de gasto y desvío por categoría"],
          en: ["Total budget, total spend and remaining balance", "Spend percentage and category variance"]
        }
      },
      {
        id: "visualizacion",
        icon: "fa-solid fa-display",
        title: { es: "Visualización", en: "Visualization" },
        body: {
          es: "Diseñé el dashboard para combinar una lectura de KPIs generales con desgloses por categoría, período y composición del gasto.",
          en: "I designed the dashboard to combine a reading of overall KPIs with breakdowns by category, period and spend composition."
        },
        bullets: {
          es: ["KPIs arriba para lectura rápida", "Desglose por categoría y temporalidad"],
          en: ["Top-line KPIs for quick reading", "Breakdown by category and time"]
        }
      },
      {
        id: "hallazgos",
        icon: "fa-solid fa-lightbulb",
        title: { es: "Hallazgos", en: "Insights" },
        body: {
          es: "El tablero hace visible qué rubros concentran mayor peso y cuáles explican mejor las diferencias contra presupuesto, facilitando el seguimiento mensual.",
          en: "The dashboard makes it visible which categories carry the most weight and which ones best explain differences against budget, making monthly tracking easier."
        },
        bullets: {
          es: ["Detección rápida de categorías relevantes", "Mejor lectura de evolución mensual"],
          en: ["Fast detection of relevant categories", "Better reading of monthly evolution"]
        }
      },
      {
        id: "impacto",
        icon: "fa-solid fa-bullseye",
        title: { es: "Impacto y decisión", en: "Impact and decisions" },
        body: {
          es: "El resultado fue una herramienta más útil para controlar ejecución y conversar con más claridad sobre oportunidades de ajuste presupuestario.",
          en: "The result was a more useful tool for controlling execution and having clearer conversations about budget adjustment opportunities."
        },
        bullets: {
          es: ["Mejor control del gasto RRHH", "Soporte para revisión y ajuste"],
          en: ["Better HR expense control", "Support for review and adjustment"]
        }
      }
    ]
  },
  {
    slug: "ventas-appol",
    title: { es: "Informe de Ventas Appol", en: "Appol Sales Report" },
    eyebrow: { es: "Case study | Análisis comercial", en: "Case study | Commercial analytics" },
    summary: {
      es: "Dashboard comercial para analizar utilidad, márgenes y comportamiento de ventas por producto, país y continente.",
      en: "Commercial dashboard to analyze profit, margins and sales behavior by product, country and continent."
    },
    narrative: {
      es: "El proyecto se pensó para ordenar métricas comerciales en una lectura ejecutiva. La prioridad fue conectar ventas, gasto y margen para que la conversación pasara de volumen a rentabilidad.",
      en: "The project was designed to organize commercial metrics into an executive reading. The priority was to connect sales, cost and margin so the conversation could move from volume to profitability."
    },
    image: "/img/dashboard-appol.png",
    imageAlt: {
      es: "Dashboard comercial de Appol con utilidad, margen y análisis por mercado.",
      en: "Appol commercial dashboard with profit, margin and market analysis."
    },
    category: "powerbi",
    stack: ["Power BI", "Excel", "DAX"],
    externalLink: "https://app.powerbi.com/view?r=eyJrIjoiYmZkOTYwMDYtNWU1NS00MjZkLTg2MWYtZDAxZmRkYzVhZGUwIiwidCI6ImUwODdhZTVmLTQ2YjQtNDBiOS04ZGZkLTE1MTA4MTQwMTc3MyIsImMiOjR9",
    externalLabel: { es: "Abrir dashboard", en: "Open dashboard" },
    quickFacts: [
      {
        label: { es: "Contexto", en: "Context" },
        value: { es: "Seguimiento comercial y rentabilidad", en: "Commercial performance and profitability tracking" }
      },
      {
        label: { es: "Fuente principal", en: "Main source" },
        value: { es: "Excel con ventas, gastos y margen", en: "Excel with sales, costs and margin" }
      },
      {
        label: { es: "Usuarios", en: "Users" },
        value: { es: "Perfiles comerciales y de análisis", en: "Commercial and analytical stakeholders" }
      },
      {
        label: { es: "Decisión clave", en: "Key decision" },
        value: { es: "Comparar mercados y mix de producto", en: "Compare markets and product mix" }
      }
    ],
    outcomes: {
      es: [
        "Conectó ventas, utilidad y margen en una sola vista.",
        "Permitió comparar países, continentes y productos.",
        "Mejoró la lectura de performance más allá del volumen vendido."
      ],
      en: [
        "Connected sales, profit and margin into one view.",
        "Made it possible to compare countries, continents and products.",
        "Improved performance reading beyond sales volume alone."
      ]
    },
    quote: {
      es: "No alcanza con saber cuánto se vende; lo importante es entender dónde se gana mejor.",
      en: "It is not enough to know how much is sold; what matters is understanding where profitability is stronger."
    },
    sections: [
      {
        id: "contexto",
        icon: "fa-solid fa-briefcase",
        title: { es: "Contexto", en: "Context" },
        body: {
          es: "El tablero se planteó como una herramienta para seguir el desempeño comercial con una lectura más estratégica de utilidad y margen.",
          en: "The dashboard was conceived as a tool to track commercial performance with a more strategic reading of profit and margin."
        },
        bullets: {
          es: ["Seguimiento de ventas y rentabilidad", "Comparación entre mercados y productos"],
          en: ["Sales and profitability tracking", "Comparison across markets and products"]
        }
      },
      {
        id: "problema",
        icon: "fa-solid fa-triangle-exclamation",
        title: { es: "Problema", en: "Problem" },
        body: {
          es: "Ver ventas sin contexto de utilidad o margen puede llevar a decisiones incompletas. El desafío fue unificar esa lectura para comparar mejor el negocio.",
          en: "Looking at sales without profit or margin context can lead to incomplete decisions. The challenge was to unify that reading to compare the business more effectively."
        },
        bullets: {
          es: ["Enfoque excesivo en volumen", "Falta de lectura integrada de rentabilidad"],
          en: ["Overfocus on volume", "Lack of integrated profitability reading"]
        }
      },
      {
        id: "fuentes",
        icon: "fa-solid fa-database",
        title: { es: "Fuente de datos", en: "Data source" },
        body: {
          es: "La base consolidaba ventas, gastos y cálculos de margen. A partir de eso estructuré una fuente lista para visualización y comparación entre regiones y categorías.",
          en: "The dataset consolidated sales, costs and margin calculations. From there I structured a source ready for visualization and comparison across regions and categories."
        },
        bullets: {
          es: ["Ventas, utilidad y margen", "Productos, países y continentes"],
          en: ["Sales, profit and margin", "Products, countries and continents"]
        }
      },
      {
        id: "proceso",
        icon: "fa-solid fa-gears",
        title: { es: "Proceso y modelado", en: "Process and modeling" },
        body: {
          es: "Armé un modelo que permitiera cruzar geografía, período y producto sin perder la lectura de utilidad. DAX ayudó a sostener comparaciones y medidas más ricas.",
          en: "I built a model that allowed crossing geography, period and product without losing sight of profit. DAX helped support richer comparisons and measures."
        },
        bullets: {
          es: ["Modelo pensado para análisis comercial", "Medidas orientadas a utilidad y margen"],
          en: ["Model designed for commercial analysis", "Measures focused on profit and margin"]
        }
      },
      {
        id: "metricas",
        icon: "fa-solid fa-chart-line",
        title: { es: "Métricas", en: "Metrics" },
        body: {
          es: "Las métricas principales fueron ingresos, gastos, utilidad y margen, complementadas con vistas por mercado y período para entender evolución.",
          en: "The main metrics were revenue, costs, profit and margin, complemented by views by market and period to understand evolution."
        },
        bullets: {
          es: ["Ingresos, gastos, utilidad y margen", "Comparación por mercado y temporalidad"],
          en: ["Revenue, costs, profit and margin", "Comparison by market and time"]
        }
      },
      {
        id: "visualizacion",
        icon: "fa-solid fa-display",
        title: { es: "Visualización", en: "Visualization" },
        body: {
          es: "La interfaz combina KPIs, mapas y gráficos comparativos para leer tanto performance global como comportamiento específico por región y producto.",
          en: "The interface combines KPIs, maps and comparative charts to read both overall performance and specific behavior by region and product."
        },
        bullets: {
          es: ["KPIs de síntesis y gráficos comparativos", "Mapa para lectura geográfica"],
          en: ["Summary KPIs and comparative charts", "Map for geographic reading"]
        }
      },
      {
        id: "hallazgos",
        icon: "fa-solid fa-lightbulb",
        title: { es: "Hallazgos", en: "Insights" },
        body: {
          es: "El tablero facilita detectar mercados con buena rentabilidad y otros donde el volumen no necesariamente se traduce en mejor margen.",
          en: "The dashboard helps detect markets with stronger profitability and others where volume does not necessarily translate into stronger margin."
        },
        bullets: {
          es: ["Comparación entre volumen y rentabilidad", "Lectura más estratégica del mix comercial"],
          en: ["Comparison between volume and profitability", "A more strategic reading of commercial mix"]
        }
      },
      {
        id: "impacto",
        icon: "fa-solid fa-bullseye",
        title: { es: "Impacto y decisión", en: "Impact and decisions" },
        body: {
          es: "El resultado es una herramienta que ayuda a mirar el negocio con más profundidad y a priorizar mercados o productos con mejor comportamiento económico.",
          en: "The result is a tool that helps assess the business more deeply and prioritize markets or products with stronger economic performance."
        },
        bullets: {
          es: ["Mejor base para decisiones comerciales", "Lectura clara de utilidad y margen"],
          en: ["Better basis for commercial decisions", "Clear reading of profit and margin"]
        }
      }
    ]
  },
  {
    slug: "mailing-gcba",
    title: { es: "Métricas de Mailing GCBA", en: "GCBA Mailing Metrics" },
    eyebrow: { es: "Case study | Reporting operativo", en: "Case study | Operational reporting" },
    summary: {
      es: "Dashboard para seguir campañas de mailing del GCBA, comparar envíos y leer aperturas, clics y rebotes desde una sola vista ejecutiva.",
      en: "Dashboard to track GCBA mailing campaigns, compare sends and read opens, clicks and bounces from a single executive view."
    },
    narrative: {
      es: "El proyecto buscó transformar métricas dispersas en una herramienta simple para monitorear rendimiento por campaña y período. La prioridad no era solo mostrar volumen, sino entender respuesta, detectar caídas y facilitar decisiones para próximos envíos.",
      en: "The project turned scattered campaign metrics into a simple tool for tracking performance by campaign and period. The priority was not only to show volume, but to understand response, detect drops and support decisions for upcoming sends."
    },
    image: "/img/dashboard-mailing.png",
    imageAlt: {
      es: "Dashboard de mailing con KPIs de envíos, aperturas, clics y rebotes.",
      en: "Mailing dashboard with send, open, click and bounce KPIs."
    },
    category: "powerbi",
    stack: ["Looker Studio", "Google Sheets"],
    externalLink: "https://lookerstudio.google.com/reporting/ad58b1c2-d02e-4557-8634-537b8314354a",
    externalLabel: { es: "Abrir dashboard", en: "Open dashboard" },
    quickFacts: [
      {
        label: { es: "Contexto", en: "Context" },
        value: { es: "Campañas de mailing en sector público", en: "Public-sector mailing campaigns" }
      },
      {
        label: { es: "Fuente principal", en: "Main source" },
        value: { es: "Google Sheets con métricas consolidadas", en: "Google Sheets with consolidated metrics" }
      },
      {
        label: { es: "Usuarios", en: "Users" },
        value: { es: "Equipos de comunicación y seguimiento", en: "Communication and monitoring teams" }
      },
      {
        label: { es: "Decisión clave", en: "Key decision" },
        value: { es: "Priorizar campañas y ajustar envíos futuros", en: "Prioritize campaigns and adjust future sends" }
      }
    ],
    outcomes: {
      es: [
        "Concentró envíos, aperturas, clics, rebotes y no abiertos en una sola lectura.",
        "Permitió comparar campañas, períodos y volúmenes sin cruces manuales.",
        "Facilitó detectar campañas con menor respuesta y revisar estrategia de comunicación."
      ],
      en: [
        "Concentrated sends, opens, clicks, bounces and unopened emails into one reading.",
        "Made it possible to compare campaigns, periods and volumes without manual cross-checks.",
        "Helped detect lower-response campaigns and revisit communication strategy."
      ]
    },
    quote: {
      es: "Un dashboard de mailing útil no solo informa aperturas: ayuda a decidir qué campaña merece iteración y cuál necesita ajuste.",
      en: "A useful mailing dashboard does more than report opens: it helps decide which campaign deserves iteration and which one needs adjustment."
    },
    sections: [
      {
        id: "contexto",
        icon: "fa-solid fa-layer-group",
        title: { es: "Contexto", en: "Context" },
        body: {
          es: "El tablero nació para dar seguimiento operativo a campañas de mailing del Gobierno de la Ciudad de Buenos Aires. La necesidad principal era tener una lectura rápida y consistente del rendimiento de cada envío.",
          en: "The dashboard was created to provide operational follow-up for mailing campaigns at the Government of the City of Buenos Aires. The main need was a fast and consistent reading of the performance of each send."
        },
        bullets: {
          es: ["Seguimiento periódico de newsletters y campañas", "Lectura ejecutiva para equipos no técnicos"],
          en: ["Periodic monitoring of newsletters and campaigns", "Executive-friendly reading for non-technical teams"]
        }
      },
      {
        id: "problema",
        icon: "fa-solid fa-triangle-exclamation",
        title: { es: "Problema", en: "Problem" },
        body: {
          es: "La información relevante estaba repartida entre registros y revisiones manuales. Eso hacía más lenta la comparación entre campañas y dificultaba detectar rápidamente caídas de rendimiento o diferencias por período.",
          en: "Relevant information was spread across records and manual reviews. That slowed comparisons between campaigns and made it harder to quickly detect performance drops or period-to-period differences."
        },
        bullets: {
          es: ["Métricas separadas por envío y campaña", "Comparaciones manuales para responder preguntas simples"],
          en: ["Metrics separated by send and campaign", "Manual comparisons to answer simple questions"]
        }
      },
      {
        id: "fuentes",
        icon: "fa-solid fa-database",
        title: { es: "Fuente de datos", en: "Data source" },
        body: {
          es: "Trabajé con una base consolidada en Google Sheets que reunía fecha, campaña, volumen enviado y principales métricas de interacción. La prioridad fue ordenar el insumo para que el dashboard partiera de una fuente simple y controlable.",
          en: "I worked with a Google Sheets consolidated dataset containing date, campaign, sent volume and main interaction metrics. The priority was to organize the input so the dashboard started from a simple, controlled source."
        },
        bullets: {
          es: ["Fecha, campaña y volumen enviado", "Aperturas, clics, rebotes y no abiertos"],
          en: ["Date, campaign and sent volume", "Opens, clicks, bounces and unopened emails"]
        }
      },
      {
        id: "proceso",
        icon: "fa-solid fa-gears",
        title: { es: "Proceso y modelado", en: "Process and modeling" },
        body: {
          es: "Preparé una estructura lo suficientemente clara para filtrar por fecha y campaña sin perder contexto. También cuidé nomenclaturas y consistencia para que cada corte del tablero devolviera lecturas comparables.",
          en: "I prepared a structure clear enough to filter by date and campaign without losing context. I also standardized naming and consistency so every dashboard cut returned comparable readings."
        },
        bullets: {
          es: ["Normalización de campañas y períodos", "Modelo liviano pensado para exploración rápida"],
          en: ["Campaign and period normalization", "Lightweight model designed for fast exploration"]
        }
      },
      {
        id: "metricas",
        icon: "fa-solid fa-chart-column",
        title: { es: "Métricas", en: "Metrics" },
        body: {
          es: "Definí una lectura centrada en los indicadores que mejor explicaban el rendimiento del mailing: volumen enviado, tasa de apertura, clics, rebotes y no abiertos. La intención fue que el tablero respondiera tanto preguntas de volumen como de calidad de respuesta.",
          en: "I defined a reading centered on the indicators that best explained mailing performance: sent volume, open rate, clicks, bounces and unopened emails. The intention was for the dashboard to answer both volume and response-quality questions."
        },
        bullets: {
          es: ["KPIs de respuesta y entregabilidad", "Comparación por campaña, fecha y período"],
          en: ["Response and deliverability KPIs", "Comparison by campaign, date and period"]
        }
      },
      {
        id: "visualizacion",
        icon: "fa-solid fa-display",
        title: { es: "Visualización", en: "Visualization" },
        body: {
          es: "Diseñé una interfaz orientada a lectura ejecutiva: KPIs destacados arriba, filtros claros y vistas complementarias para entender tendencia y distribución. Eso permite entrar por una señal rápida y después profundizar sin fricción.",
          en: "I designed an executive-oriented interface: highlighted KPIs at the top, clear filters and complementary views to understand trend and distribution. That lets users start from a quick signal and go deeper without friction."
        },
        bullets: {
          es: ["Filtros por año, mes y campaña", "Jerarquía visual para detectar variaciones rápido"],
          en: ["Filters by year, month and campaign", "Visual hierarchy to detect variations quickly"]
        }
      },
      {
        id: "hallazgos",
        icon: "fa-solid fa-lightbulb",
        title: { es: "Hallazgos", en: "Insights" },
        body: {
          es: "La estructura del tablero ayuda a ver que no todas las campañas responden igual aunque tengan volúmenes parecidos. También hace más fácil identificar envíos con baja apertura o alto rebote que merecen revisión puntual.",
          en: "The dashboard structure helps show that not every campaign performs equally even with similar volumes. It also makes it easier to identify sends with low open rates or high bounce levels that deserve review."
        },
        bullets: {
          es: ["Diferencias claras entre campañas comparables", "Detección rápida de envíos con menor respuesta"],
          en: ["Clear differences between comparable campaigns", "Fast detection of lower-response sends"]
        }
      },
      {
        id: "impacto",
        icon: "fa-solid fa-bullseye",
        title: { es: "Impacto y decisión", en: "Impact and decisions" },
        body: {
          es: "El resultado fue una herramienta más accionable para revisar performance y orientar próximos envíos. Más que un tablero descriptivo, funciona como un punto de apoyo para ajustar campañas y conversar con una base común.",
          en: "The outcome was a more actionable tool for reviewing performance and guiding upcoming sends. More than a descriptive dashboard, it works as a support point for adjusting campaigns and creating a shared basis for discussion."
        },
        bullets: {
          es: ["Mejor seguimiento del rendimiento de mailing", "Base común para tomar decisiones sobre campañas futuras"],
          en: ["Better mailing performance tracking", "Shared basis for decisions about future campaigns"]
        }
      }
    ]
  },
  {
    slug: "nomina-rrhh",
    title: { es: "Gestión de Nómina RRHH", en: "HR Payroll Management" },
    eyebrow: { es: "Case study | People analytics", en: "Case study | People analytics" },
    summary: {
      es: "Dashboard de RRHH para leer composición de dotación, distribución por áreas y antigüedad con una vista más operativa de la nómina.",
      en: "HR dashboard to read workforce composition, area distribution and tenure with a more operational view of payroll."
    },
    narrative: {
      es: "El foco estuvo en convertir una base de personal en una herramienta que sirviera para conversar sobre estructura, distribución y experiencia del equipo. La meta era pasar de una foto estática a una lectura útil para gestión.",
      en: "The focus was to turn a personnel dataset into a tool useful for discussing structure, distribution and team experience. The goal was to move from a static picture to a reading that supports management."
    },
    image: "/img/dashboard-nomina.png",
    imageAlt: {
      es: "Dashboard de recursos humanos con composición de plantilla, distribución y antigüedad.",
      en: "Human resources dashboard with workforce composition, distribution and tenure."
    },
    category: "powerbi",
    stack: ["Looker Studio", "Google Sheets"],
    externalLink: "https://lookerstudio.google.com/reporting/26b9eca6-822c-41f9-836f-f16b76ab2acd",
    externalLabel: { es: "Abrir dashboard", en: "Open dashboard" },
    quickFacts: [
      {
        label: { es: "Contexto", en: "Context" },
        value: { es: "Gestión de dotación y estructura RRHH", en: "HR staffing and structure management" }
      },
      {
        label: { es: "Fuente principal", en: "Main source" },
        value: { es: "Google Sheets con base de empleados", en: "Google Sheets employee master data" }
      },
      {
        label: { es: "Usuarios", en: "Users" },
        value: { es: "RRHH y referentes de gestión", en: "HR and management leads" }
      },
      {
        label: { es: "Decisión clave", en: "Key decision" },
        value: { es: "Monitorear composición, distribución y antigüedad", en: "Monitor composition, distribution and tenure" }
      }
    ],
    outcomes: {
      es: [
        "Hizo visible la distribución de personal por género, área y dirección.",
        "Organizó una lectura única sobre dotación, ubicación y antigüedad.",
        "Aportó una base más clara para conversaciones de RRHH y seguimiento operativo."
      ],
      en: [
        "Made workforce distribution by gender, area and management visible.",
        "Organized a single reading of headcount, location and tenure.",
        "Provided a clearer basis for HR conversations and operational follow-up."
      ]
    },
    quote: {
      es: "El valor estuvo en transformar una base de personal en una vista operativa, no en dejarla como una foto aislada del momento.",
      en: "The value came from turning a personnel database into an operational view, not leaving it as a static snapshot."
    },
    sections: [
      {
        id: "contexto",
        icon: "fa-solid fa-users",
        title: { es: "Contexto", en: "Context" },
        body: {
          es: "El dashboard se pensó para tener una lectura más clara de la nómina y la estructura interna. El objetivo era mirar distribución de personal, composición y antigüedad desde una perspectiva de gestión.",
          en: "The dashboard was designed to provide a clearer reading of payroll and internal structure. The objective was to view workforce distribution, composition and tenure from a management perspective."
        },
        bullets: {
          es: ["Enfoque en dotación y organización", "Necesidad de conversación entre RRHH y gestión"],
          en: ["Focus on staffing and organization", "Need for conversations between HR and management"]
        }
      },
      {
        id: "problema",
        icon: "fa-solid fa-triangle-exclamation",
        title: { es: "Problema", en: "Problem" },
        body: {
          es: "Sin una vista integrada era más difícil entender composición de plantilla, distribución territorial y experiencia acumulada. Eso complica detectar desbalances y sostener una conversación compartida sobre la estructura del equipo.",
          en: "Without an integrated view it was harder to understand workforce composition, territorial distribution and accumulated experience. That makes it harder to detect imbalances and sustain a shared conversation about team structure."
        },
        bullets: {
          es: ["Información útil dispersa en registros", "Poca trazabilidad visual para comparar áreas y perfiles"],
          en: ["Useful information spread across records", "Limited visual traceability to compare areas and profiles"]
        }
      },
      {
        id: "fuentes",
        icon: "fa-solid fa-database",
        title: { es: "Fuente de datos", en: "Data source" },
        body: {
          es: "La base principal se consolidó en Google Sheets con atributos de empleados, distribución por área y referencias para leer antigüedad y composición. La meta fue llevar esa base a una estructura simple para consulta diaria.",
          en: "The main dataset was consolidated in Google Sheets with employee attributes, area distribution and reference fields to read tenure and composition. The goal was to move that data into a simple structure for daily consultation."
        },
        bullets: {
          es: ["Atributos de empleados y áreas", "Variables para género, ubicación y antigüedad"],
          en: ["Employee and area attributes", "Variables for gender, location and tenure"]
        }
      },
      {
        id: "proceso",
        icon: "fa-solid fa-gears",
        title: { es: "Proceso y modelado", en: "Process and modeling" },
        body: {
          es: "Organicé las dimensiones necesarias para filtrar por área, leer composición y mantener consistencia en recuentos. La prioridad fue que la exploración fuese rápida, clara y sin ambigüedades para usuarios de negocio.",
          en: "I organized the dimensions needed to filter by area, read composition and keep counts consistent. The priority was to make exploration fast, clear and unambiguous for business users."
        },
        bullets: {
          es: ["Modelo liviano orientado a filtros", "Consistencia en categorías y cortes de análisis"],
          en: ["Lightweight model oriented around filters", "Consistency in categories and analytical cuts"]
        }
      },
      {
        id: "metricas",
        icon: "fa-solid fa-chart-simple",
        title: { es: "Métricas", en: "Metrics" },
        body: {
          es: "El tablero concentra indicadores de total de empleados, composición por género, distribución por dirección y señales de antigüedad. Eso permite combinar una lectura macro con preguntas más concretas por área o segmento.",
          en: "The dashboard concentrates indicators for total employees, gender composition, management distribution and tenure signals. That enables a macro reading together with more concrete questions by area or segment."
        },
        bullets: {
          es: ["Dotación total y composición", "Distribución por dirección y experiencia acumulada"],
          en: ["Total headcount and composition", "Distribution by management and accumulated experience"]
        }
      },
      {
        id: "visualizacion",
        icon: "fa-solid fa-display",
        title: { es: "Visualización", en: "Visualization" },
        body: {
          es: "La interfaz combina KPIs, gráficos comparativos y mapa para dar contexto. La idea fue que RRHH pudiera leer tanto la foto general como patrones específicos sin cambiar de herramienta ni revisar tablas extensas.",
          en: "The interface combines KPIs, comparative charts and a map to add context. The idea was for HR to read both the general picture and specific patterns without changing tools or reviewing long tables."
        },
        bullets: {
          es: ["KPIs destacados para lectura rápida", "Gráficos comparativos y mapa para profundizar"],
          en: ["Highlighted KPIs for quick reading", "Comparative charts and a map for deeper analysis"]
        }
      },
      {
        id: "hallazgos",
        icon: "fa-solid fa-lightbulb",
        title: { es: "Hallazgos", en: "Insights" },
        body: {
          es: "La visualización ayuda a detectar concentraciones por área, diferencias de composición y señales vinculadas a antigüedad. Más que cerrar una conclusión única, organiza la conversación correcta para gestión de personas.",
          en: "The visualization helps detect concentration by area, composition differences and signals tied to tenure. Rather than forcing a single conclusion, it organizes the right conversation for people management."
        },
        bullets: {
          es: ["Lectura más clara de estructura y distribución", "Identificación de focos para profundizar con RRHH"],
          en: ["Clearer reading of structure and distribution", "Identification of areas worth exploring with HR"]
        }
      },
      {
        id: "impacto",
        icon: "fa-solid fa-bullseye",
        title: { es: "Impacto y decisión", en: "Impact and decisions" },
        body: {
          es: "El resultado fue una herramienta de consulta más útil para revisar estructura y apoyar decisiones de seguimiento. El tablero ordena una conversación que antes estaba fragmentada y la vuelve más comparable en el tiempo.",
          en: "The result was a more useful consultation tool for reviewing structure and supporting follow-up decisions. The dashboard organizes a conversation that was previously fragmented and makes it easier to compare over time."
        },
        bullets: {
          es: ["Mejor lectura de la nómina con foco operativo", "Base más consistente para seguimiento y conversación interna"],
          en: ["Better operational reading of payroll", "More consistent basis for follow-up and internal discussion"]
        }
      }
    ]
  },
  {
    slug: "webapp-gestion-empleados",
    title: { es: "WebApp de Gestión de Empleados", en: "Employee Management WebApp" },
    eyebrow: { es: "Case study | Herramienta interna", en: "Case study | Internal tool" },
    summary: {
      es: "Aplicación interna para autogestión de vacaciones, licencias médicas y otras ausencias, pensada para ordenar solicitudes, aprobaciones y seguimiento.",
      en: "Internal application for self-service vacation requests, medical leave and other absences, designed to organize requests, approvals and follow-up."
    },
    narrative: {
      es: "El proyecto apuntó a resolver una fricción cotidiana: pedir una ausencia no debería depender de cadenas manuales, registros dispersos o seguimiento informal. La propuesta fue construir un circuito claro, centralizado y trazable para empleados y referentes.",
      en: "The project addressed an everyday friction point: requesting time off should not depend on manual chains, scattered records or informal follow-up. The proposal was to build a clear, centralized and traceable flow for employees and team leads."
    },
    image: "/img/WIP.png",
    imageAlt: {
      es: "Vista conceptual de la WebApp de gestión de empleados.",
      en: "Conceptual view of the employee management WebApp."
    },
    category: "web",
    stack: ["AppScript", "JavaScript", "Git", "Clasp"],
    externalLink: "https://github.com/WalterEnzoWohl",
    externalLabel: { es: "Abrir repositorio", en: "Open repository" },
    quickFacts: [
      {
        label: { es: "Contexto", en: "Context" },
        value: { es: "Gestión interna de ausencias", en: "Internal absence management" }
      },
      {
        label: { es: "Fuente principal", en: "Main source" },
        value: { es: "Google Sheets como registro operativo", en: "Google Sheets as the operational registry" }
      },
      {
        label: { es: "Usuarios", en: "Users" },
        value: { es: "Empleados y referentes internos", en: "Employees and internal managers" }
      },
      {
        label: { es: "Decisión clave", en: "Key decision" },
        value: { es: "Ordenar el flujo de solicitud y aprobación", en: "Organize the request and approval flow" }
      }
    ],
    outcomes: {
      es: [
        "Centralizó pedidos de vacaciones, licencias y otras ausencias en un solo flujo.",
        "Redujo seguimiento manual y dependencia de mensajes dispersos.",
        "Creó una base más trazable para revisar estados, historial y pendientes."
      ],
      en: [
        "Centralized vacation, leave and other absence requests into one flow.",
        "Reduced manual follow-up and dependence on scattered messages.",
        "Created a more traceable basis for reviewing status, history and pending items."
      ]
    },
    quote: {
      es: "El cambio importante no fue solo digitalizar un pedido, sino volver visible y trazable todo el circuito de ausencias.",
      en: "The key change was not just digitizing a request, but making the entire absence flow visible and traceable."
    },
    sections: [
      {
        id: "contexto",
        icon: "fa-solid fa-briefcase",
        title: { es: "Contexto", en: "Context" },
        body: {
          es: "La WebApp surge como respuesta a una necesidad interna de ordenar solicitudes de ausencias. El objetivo fue dar una experiencia más clara para empleados y, al mismo tiempo, más control para quienes gestionan aprobaciones y seguimiento.",
          en: "The WebApp emerged in response to an internal need to organize absence requests. The goal was to provide a clearer experience for employees while giving more control to those managing approvals and follow-up."
        },
        bullets: {
          es: ["Solicitud de vacaciones, licencias médicas y otras ausencias", "Uso interno con foco en trazabilidad y orden"],
          en: ["Vacation, medical leave and other absence requests", "Internal use focused on traceability and order"]
        }
      },
      {
        id: "problema",
        icon: "fa-solid fa-triangle-exclamation",
        title: { es: "Problema", en: "Problem" },
        body: {
          es: "Cuando el circuito depende de mensajes, documentos o registros informales, es fácil perder contexto: qué se pidió, en qué estado quedó y quién debe intervenir. El desafío fue ordenar ese flujo sin volverlo pesado para el usuario final.",
          en: "When the process depends on messages, documents or informal records, it is easy to lose context: what was requested, which status it reached and who needs to act. The challenge was to organize that flow without making it heavy for the end user."
        },
        bullets: {
          es: ["Seguimiento manual de solicitudes", "Poca visibilidad de estados, historial y responsables"],
          en: ["Manual follow-up of requests", "Low visibility into status, history and ownership"]
        }
      },
      {
        id: "fuentes",
        icon: "fa-solid fa-database",
        title: { es: "Fuente de datos", en: "Data source" },
        body: {
          es: "La solución se apoyó en Google Sheets como registro operativo y en Apps Script para conectar formularios, lógica y persistencia. Esa combinación permitió resolver un backend liviano y fácil de mantener dentro del entorno ya utilizado por el equipo.",
          en: "The solution relied on Google Sheets as the operational registry and Apps Script to connect forms, logic and persistence. That combination made it possible to build a lightweight backend that fit the tools already used by the team."
        },
        bullets: {
          es: ["Sheets como base de solicitudes y estados", "Apps Script para lógica y automatización"],
          en: ["Sheets as the requests and status database", "Apps Script for logic and automation"]
        }
      },
      {
        id: "proceso",
        icon: "fa-solid fa-gears",
        title: { es: "Proceso y modelado", en: "Process and modeling" },
        body: {
          es: "Definí un flujo con estados claros, datos mínimos necesarios y validaciones para reducir errores. La idea fue mantener una experiencia simple para el empleado, pero con suficiente estructura para que el seguimiento interno no dependa de memoria o mensajes sueltos.",
          en: "I defined a flow with clear states, the minimum required data and validations to reduce errors. The idea was to keep the employee experience simple while giving internal follow-up enough structure to avoid relying on memory or scattered messages."
        },
        bullets: {
          es: ["Estados y reglas para ordenar el circuito", "Validaciones para mantener consistencia de la información"],
          en: ["Statuses and rules to organize the flow", "Validations to keep information consistent"]
        }
      },
      {
        id: "metricas",
        icon: "fa-solid fa-list-check",
        title: { es: "Métricas y estados del flujo", en: "Workflow metrics and statuses" },
        body: {
          es: "Aunque es una herramienta operativa y no un dashboard tradicional, el proyecto necesitó definir información crítica para seguimiento: tipo de ausencia, fechas, estado, historial y pendientes. Esa estructura es la que vuelve útil el sistema para gestión diaria.",
          en: "Although it is an operational tool rather than a traditional dashboard, the project still required defining critical follow-up information: absence type, dates, status, history and pending items. That structure is what makes the system useful for daily management."
        },
        bullets: {
          es: ["Estados claros para cada solicitud", "Trazabilidad de historial y pendientes"],
          en: ["Clear statuses for every request", "Traceability for history and pending items"]
        }
      },
      {
        id: "visualizacion",
        icon: "fa-solid fa-window-maximize",
        title: { es: "Interfaz y visualización", en: "Interface and presentation" },
        body: {
          es: "La WebApp se pensó para que el usuario entienda rápido qué puede hacer, qué datos tiene que cargar y cuál es el estado de su solicitud. La claridad visual es clave porque la adopción de una herramienta interna depende mucho de que el flujo se sienta simple.",
          en: "The WebApp was designed so users quickly understand what they can do, what data they need to submit and the status of their request. Visual clarity is crucial because adoption of an internal tool depends heavily on whether the flow feels simple."
        },
        bullets: {
          es: ["Flujo simple para autogestión", "Lectura clara del estado de cada pedido"],
          en: ["Simple self-service flow", "Clear reading of each request status"]
        }
      },
      {
        id: "desafios",
        icon: "fa-solid fa-screwdriver-wrench",
        title: { es: "Desafíos", en: "Challenges" },
        body: {
          es: "El desafío principal fue equilibrar simplicidad y control. Una herramienta de ausencias tiene que ser fácil para el empleado, pero al mismo tiempo robusta para quienes administran aprobaciones, historial y consistencia de registros.",
          en: "The main challenge was balancing simplicity and control. An absence management tool has to be easy for employees while also being robust for the people managing approvals, history and record consistency."
        },
        bullets: {
          es: ["No sobrecargar el flujo del usuario", "Mantener orden interno y trazabilidad"],
          en: ["Avoid overloading the user flow", "Maintain internal order and traceability"]
        }
      },
      {
        id: "impacto",
        icon: "fa-solid fa-bullseye",
        title: { es: "Impacto y decisión", en: "Impact and decisions" },
        body: {
          es: "La WebApp aporta orden, autonomía y mejor seguimiento. El valor más fuerte del proyecto es que convierte un proceso cotidiano en un circuito más claro, con menos fricción y con mejor base para gestión interna.",
          en: "The WebApp adds order, autonomy and better follow-up. The strongest value of the project is that it turns an everyday process into a clearer workflow with less friction and a stronger basis for internal management."
        },
        bullets: {
          es: ["Menor dependencia de seguimiento manual", "Base más ordenada para gestión de ausencias"],
          en: ["Less dependence on manual follow-up", "More structured basis for absence management"]
        }
      }
    ]
  }
];

const curriculumData: { experience: CurriculumItem[] } = {
  experience: [
    {
      title: { es: "Analista de Datos", en: "Data Analyst" },
      place: { es: "Gobierno de la Ciudad de Buenos Aires (GCBA)", en: "City Government of Buenos Aires (GCBA)" },
      date: { es: "Septiembre 2025 -", en: "September 2025 - Present" },
      summary: {
        es: "Generación de reportes, indicadores y herramientas para ordenar información y sostener decisiones en entornos de gestión pública.",
        en: "Reporting, KPI tracking and internal tools to organize information and support decisions in public management environments."
      },
      description: {
        es: "Análisis de datos y generación de reportes para entornos de gestión pública, con foco en seguimiento de información, visualización de indicadores y soporte a la toma de decisiones.",
        en: "Data analysis and reporting for public management environments, focused on information tracking, KPI visualization and decision support."
      },
      highlights: {
        es: [
          "Construcción de dashboards y reportes para seguimiento operativo.",
          "Visualización de indicadores para conversaciones de gestión más claras.",
          "Soporte analítico para áreas que necesitan ordenar información dispersa."
        ],
        en: [
          "Built dashboards and reports for operational follow-up.",
          "Visualized indicators to support clearer management conversations.",
          "Provided analytical support for teams that need to organize scattered information."
        ]
      },
      stack: ["Python", "Pandas", "SQL", "Looker", "Google Sheets", "AppScript", "Power BI"],
      current: true
    },
    {
      title: { es: "Analista de Datos Junior", en: "Junior Data Analyst" },
      place: { es: "ARBUSTA S.A.", en: "ARBUSTA S.A." },
      date: { es: "Agosto 2024 - Septiembre 2025", en: "August 2024 - September 2025" },
      summary: {
        es: "Análisis para el proyecto MTC de Mercado Libre, con foco en control de publicaciones, KPIs y automatización de reportes.",
        en: "Analytics for Mercado Libre's MTC project, focused on publication control, KPIs and report automation."
      },
      description: {
        es: "Responsable de análisis de datos en el proyecto MTC para Mercado Libre, control de publicaciones y seguimiento de KPIs. Desarrollo de reportes automatizados en Google Sheets, trabajo con Excel, SQL, Power BI y participación en procesos ETL.",
        en: "Responsible for data analysis in the MTC project for Mercado Libre, publication control and KPI monitoring. Built automated reports in Google Sheets, worked with Excel, SQL, Power BI and supported ETL processes."
      },
      highlights: {
        es: [
          "Automatización de reportes para reducir trabajo manual.",
          "Seguimiento de publicaciones y métricas clave para operación.",
          "Trabajo con Excel, SQL, Power BI y apoyo en procesos ETL."
        ],
        en: [
          "Automated reports to reduce manual work.",
          "Tracked publications and key operational metrics.",
          "Worked with Excel, SQL, Power BI and supported ETL processes."
        ]
      },
      stack: ["Google Sheets", "Excel", "SQL", "Power BI", "ETL"]
    },
    {
      title: { es: "Desarrollador IoT en Pasantía", en: "IoT Development Intern" },
      place: { es: "Grupo MSA S.A", en: "Grupo MSA S.A" },
      date: { es: "Febrero 2024 - Marzo 2024", en: "February 2024 - March 2024" },
      summary: {
        es: "Desarrollo front-end para una solución IoT de validación de identidad con trabajo colaborativo en entorno técnico.",
        en: "Front-end development for an IoT identity validation solution in a collaborative technical environment."
      },
      description: {
        es: "Desarrollo de una aplicación IoT para validación de identidad con DNI y huella. Trabajo colaborativo en entorno Ubuntu usando HTML, CSS, JavaScript y React para el frontend.",
        en: "Developed an IoT application for identity validation using ID card and fingerprint. Collaborative work in an Ubuntu environment using HTML, CSS, JavaScript and React for the frontend."
      },
      highlights: {
        es: [
          "Participación en una solución de validación de identidad.",
          "Trabajo colaborativo con tecnologías front-end modernas.",
          "Experiencia práctica en un entorno técnico con Ubuntu."
        ],
        en: [
          "Contributed to an identity validation solution.",
          "Worked collaboratively with modern front-end technologies.",
          "Gained hands-on experience in a technical Ubuntu environment."
        ]
      },
      stack: ["React", "JavaScript", "HTML", "CSS", "Ubuntu"]
    }
  ]
};

const animationDelay = (delay: number): CSSProperties => ({ "--delay": `${delay}s` } as CSSProperties);

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (location.hash) {
        const element = document.getElementById(location.hash.slice(1));

        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [location.pathname, location.hash]);

  return null;
}

type LandingPageProps = {
  language: Language;
  copy: (typeof uiCopy)[Language];
  activeCategory: ProjectCategory;
  setActiveCategory: (value: ProjectCategory) => void;
  openExperience: number | null;
  setOpenExperience: Dispatch<SetStateAction<number | null>>;
  handleProjectImageError: (event: SyntheticEvent<HTMLImageElement>) => void;
  copiedContact: ContactCopyField;
  copyToClipboard: (field: Exclude<ContactCopyField, null>, value: string) => Promise<void>;
  contactEmail: string;
  contactPhone: string;
  contactPhoneHref: string;
  register: ReturnType<typeof useForm<ContactFormValues>>["register"];
  handleSubmit: ReturnType<typeof useForm<ContactFormValues>>["handleSubmit"];
  onSubmit: (values: ContactFormValues) => Promise<void>;
  errors: ReturnType<typeof useForm<ContactFormValues>>["formState"]["errors"];
  isSending: boolean;
  submitState: SubmitState;
};
function LandingPage({
  language,
  copy,
  activeCategory,
  setActiveCategory,
  openExperience,
  setOpenExperience,
  handleProjectImageError,
  copiedContact,
  copyToClipboard,
  contactEmail,
  contactPhone,
  contactPhoneHref,
  register,
  handleSubmit,
  onSubmit,
  errors,
  isSending,
  submitState
}: LandingPageProps) {
  const [openCertification, setOpenCertification] = useState<number | null>(null);
  const filteredProjects =
    activeCategory === "all" ? projects : projects.filter((project) => project.category === activeCategory);
  const latestExperience = curriculumData.experience[0];
  const curriculumSpotlights = [
    {
      label: copy.curriculum.spotlightCurrent,
      value: `${latestExperience.title[language]} · ${latestExperience.place[language]}`
    },
    {
      label: copy.curriculum.spotlightExperience,
      value: `${curriculumData.experience.length} ${copy.curriculum.spotlightExperienceUnit}`
    },
    {
      label: copy.curriculum.spotlightFocus,
      value: copy.curriculum.spotlightFocusValue
    }
  ];

  const projectCategories = [
    { id: "all" as const, label: copy.portfolio.filters.all, icon: "fa-solid fa-layer-group" },
    { id: "powerbi" as const, label: copy.portfolio.filters.powerbi, icon: "fa-solid fa-chart-simple" },
    { id: "web" as const, label: copy.portfolio.filters.web, icon: "fa-solid fa-code" }
  ];

  return (
    <main>
      <section className="home" id="home">
        <div className="contenedor-banner">
          <div className="contenedor-img">
            <img src="/img/foto-perfil.webp" alt="Foto de perfil de Walter Enzo Wohl" width={320} height={320} fetchPriority="high" />
          </div>
          <div className="contenedor-info">
            <h1>Walter Enzo Wohl</h1>
            <h2>{copy.heroRole}</h2>
            <p className="hero-summary">{copy.heroSummary}</p>
            <div className="redes">
              <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/walterenzowohl" aria-label="LinkedIn de Walter Enzo Wohl"><i className="fa-brands fa-linkedin" /></a>
              <a target="_blank" rel="noopener noreferrer" href="https://github.com/WalterEnzoWohl" aria-label="GitHub de Walter Enzo Wohl"><i className="fa-brands fa-github" /></a>
            </div>
          </div>
        </div>
      </section>

      <section id="aboutme" className="aboutme">
        <div className="contenedor-seccion">
          <div className="aboutme-header">
            <h2>{copy.about.title}</h2>
          </div>

          <div className="aboutme-layout">
            <article className="aboutme-story">
              <p>{copy.about.body}</p>

              <div className="aboutme-actions">
                <a className="btn-descarga" href="/img/Walter Enzo Wohl CV.pdf" download="WalterEnzoWohl.pdf">
                  {copy.about.download} <i className="fa-solid fa-download" />
                  <span className="overlay" />
                </a>
                <Link className="aboutme-contact-link" to={{ pathname: "/", hash: "#contacto" }}>
                  {copy.about.contact} <i className="fa-solid fa-arrow-up-right-from-square" />
                </Link>
              </div>
            </article>

            <aside className="aboutme-value">
              <h3>{copy.about.valueTitle}</h3>
              <ul className="aboutme-value-list">
                {copy.about.values.map((item) => (
                  <li key={item.title}>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <div className="aboutme-pillars">
            {copy.about.pillars.map((pillar, index) => (
              <article className="aboutme-pillar" key={pillar.title}>
                <i className={index === 0 ? "fa-solid fa-chart-line" : index === 1 ? "fa-solid fa-layer-group" : "fa-solid fa-rocket"} />
                <h4>{pillar.title}</h4>
                <p>{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="portfolio" className="portfolio-modern">
        <div className="contenedor-seccion">
          <h2>{copy.portfolio.title}</h2>
          <p className="portfolio-modern-subtitle">{copy.portfolio.subtitle}</p>

          <div className="portfolio-modern-filters">
            {projectCategories.map((category) => (
              <button key={category.id} type="button" onClick={() => setActiveCategory(category.id)} className={activeCategory === category.id ? "is-active" : ""}>
                <i className={category.icon} />
                {category.label}
              </button>
            ))}
          </div>

          <div className="portfolio-modern-grid">
            {filteredProjects.map((project, index) => (
              <article className="portfolio-modern-card portfolio-story-card" key={project.title.en} style={animationDelay(index * 0.08)}>
                <div className="portfolio-modern-media">
                  <img src={project.image} alt={project.title[language]} loading="lazy" decoding="async" onError={handleProjectImageError} />
                  <span className="portfolio-modern-badge">{project.category === "powerbi" ? copy.portfolio.badges.powerbi : copy.portfolio.badges.web}</span>
                </div>
                <div className="portfolio-modern-content">
                  <h3>{project.title[language]}</h3>
                  <p>{project.description[language]}</p>
                  <div className="portfolio-modern-tools">
                    {project.tools.map((tool) => (
                      <span key={`${project.title.en}-${tool}`}>{tool}</span>
                    ))}
                  </div>
                  <ul>
                    {project.highlights[language].map((highlight) => (
                      <li key={`${project.title.en}-${highlight}`}>{highlight}</li>
                    ))}
                  </ul>
                  <div className="portfolio-modern-actions">
                    <Link to={`/case-studies/${project.caseStudySlug}`}>
                      {copy.portfolio.viewCaseStudy} <i className="fa-solid fa-arrow-right" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="curriculum" className="curriculum-modern">
        <div className="contenedor-seccion">
          <div className="curriculum-modern-head">
            <div className="curriculum-modern-copy">
              <h2>{copy.curriculum.title}</h2>
              <p className="curriculum-modern-subtitle">{copy.curriculum.subtitle}</p>
            </div>
          </div>

          <div className="curriculum-modern-snapshot">
            {curriculumSpotlights.map((spotlight) => (
              <article className="curriculum-spotlight-card" key={`${spotlight.label}-${spotlight.value}`}>
                <small>{spotlight.label}</small>
                <strong>{spotlight.value}</strong>
              </article>
            ))}
          </div>

          <div className="curriculum-timeline">
            {curriculumData.experience.map((item, index) => {
              const isOpen = openExperience === index;
              const itemNumber = String(index + 1).padStart(2, "0");

              return (
                <article className={`curriculum-modern-item ${item.current ? "is-current" : ""}`} key={`${item.title.en}-${item.date.en}-${index}`}>
                  <div className="curriculum-item-rail">
                    <span className="curriculum-item-marker">{itemNumber}</span>
                  </div>
                  <div className="curriculum-item-body">
                    <div className="curriculum-item-heading">
                      <h3>{item.title[language]}</h3>
                      <p className="curriculum-item-details">
                        <span className="casa">{item.place[language]}</span>
                        <span className="curriculum-item-separator" aria-hidden>•</span>
                        <span className="fecha">{item.date[language]}</span>
                        {item.current ? <span className="curriculum-current-badge">{copy.curriculum.currentBadge}</span> : null}
                      </p>
                    </div>

                    <p className="curriculum-item-summary">{item.summary[language]}</p>

                    <div className="curriculum-item-stack">
                      {item.stack.map((skill) => (
                        <span key={`${item.title.en}-${skill}`}>{skill}</span>
                      ))}
                    </div>

                    <div className={`descripcion-wrapper ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
                      <p className="descripcion">{item.description[language]}</p>
                      <ul className="curriculum-item-highlights">
                        {item.highlights[language].map((highlight) => (
                          <li key={`${item.title.en}-${highlight}`}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button className="toggle-btn curriculum-toggle" type="button" aria-expanded={isOpen} onClick={() => setOpenExperience((prev) => (prev === index ? null : index))}>
                    {isOpen ? copy.curriculum.showLess : copy.curriculum.showMore}
                    <i className={`fa-solid fa-chevron-down chevron ${isOpen ? "rotated" : ""}`} aria-hidden />
                  </button>
                </article>
              );
            })}
          </div>

          <div className="curriculum-footer-actions">
            <a className="btn-descarga curriculum-download" href="/img/Walter Enzo Wohl CV.pdf" download="WalterEnzoWohl.pdf">
              {copy.curriculum.downloadCv}
              <i className="fa-solid fa-download" />
            </a>
          </div>
        </div>
      </section>
      <section id="certifications" className="certifications-modern">
        <div className="contenedor-seccion">
          <h2>{copy.certifications.title}</h2>
          <p className="certifications-modern-subtitle">{copy.certifications.subtitle}</p>
          <div className="certifications-modern-list">
            {certifications.map((certification, index) => {
              const isOpen = openCertification === index;
              return (
              <article className="certifications-modern-item" key={certification.title.en}>
                <div className="certifications-modern-icon"><i className={certification.icon} /></div>
                <div className="certifications-modern-content">
                  <h3>{certification.title[language]}</h3>
                  <p>{certification.provider[language]} • {certification.year[language]}</p>
                  <div className="certifications-modern-skills">
                    {certification.skills.map((skill) => (
                      <span key={`${certification.title.en}-${skill}`}>{skill}</span>
                    ))}
                  </div>
                  <div className={`certification-description-wrapper ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
                    <p className="certification-description">{certification.description[language]}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="certification-toggle"
                  aria-expanded={isOpen}
                  onClick={() => setOpenCertification((prev) => (prev === index ? null : index))}
                >
                  {isOpen ? copy.certifications.showLess : copy.certifications.showMore}
                  <i className={`fa-solid fa-chevron-down chevron ${isOpen ? "rotated" : ""}`} aria-hidden />
                </button>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contacto" className="contact-modern">
        <div className="contenedor-seccion">
          <h2>{copy.contact.title}</h2>
          <p className="contact-modern-subtitle">{copy.contact.subtitle}</p>
          <div className="contact-atelier">
            <div className="contact-spotlight">
              <span className="contact-pill">{copy.contact.pill}</span>
              <h3>{copy.contact.heading}</h3>
              <p>{copy.contact.body}</p>

              <div className="contact-cards">
                <button
                  type="button"
                  className={`contact-card-link contact-copy-card ${copiedContact === "email" ? "is-copied" : ""}`}
                  onClick={() => void copyToClipboard("email", contactEmail)}
                  aria-label={copy.contact.copyEmail}
                  title={contactEmail}
                >
                  <i className="fa-solid fa-envelope" />
                  <div>
                    <small>{copy.contact.emailLabel}</small>
                    <strong>{contactEmail}</strong>
                  </div>
                  <span className="contact-copy-badge" aria-hidden="true">
                    <i className={`fa-solid ${copiedContact === "email" ? "fa-check" : "fa-copy"}`} />
                  </span>
                </button>
                <button
                  type="button"
                  className={`contact-card-link contact-copy-card ${copiedContact === "phone" ? "is-copied" : ""}`}
                  onClick={() => void copyToClipboard("phone", contactPhoneHref)}
                  aria-label={copy.contact.copyPhone}
                  title={contactPhone}
                >
                  <i className="fa-solid fa-phone" />
                  <div>
                    <small>{copy.contact.phoneLabel}</small>
                    <strong>{contactPhone}</strong>
                  </div>
                  <span className="contact-copy-badge" aria-hidden="true">
                    <i className={`fa-solid ${copiedContact === "phone" ? "fa-check" : "fa-copy"}`} />
                  </span>
                </button>
              </div>

              <div className="contact-modern-socials">
                <a href="https://github.com/WalterEnzoWohl" target="_blank" rel="noopener noreferrer" aria-label="GitHub de Walter Enzo Wohl">
                  <i className="fa-brands fa-github" />
                  <span>{copy.contact.github}</span>
                </a>
                <a href="https://www.linkedin.com/in/walterenzowohl" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de Walter Enzo Wohl">
                  <i className="fa-brands fa-linkedin" />
                  <span>{copy.contact.linkedin}</span>
                </a>
              </div>

              <div className="contact-modern-info">
                <ul>
                  <li><i className="fa-solid fa-location-dot" /> {copy.contact.location}</li>
                  <li><i className="fa-solid fa-clock" /> {copy.contact.response}</li>
                </ul>
              </div>
            </div>

            <div className="contact-modern-form-wrap">
              <form id="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <label className="form-label" htmlFor="name">{copy.contact.form.name}</label>
                <input type="text" id="name" placeholder={copy.contact.form.namePlaceholder} {...register("name", { required: copy.contact.validation.nameRequired })} />
                {errors.name ? <small className="error-message">{errors.name.message}</small> : null}

                <label className="form-label" htmlFor="phonenumber">{copy.contact.form.phone}</label>
                <input
                  type="text"
                  id="phonenumber"
                  placeholder={copy.contact.form.phonePlaceholder}
                  inputMode="numeric"
                  {...register("phonenumber", {
                    required: copy.contact.validation.phoneRequired,
                    pattern: { value: /^[0-9+\s()-]+$/, message: copy.contact.validation.phoneInvalid }
                  })}
                />
                {errors.phonenumber ? <small className="error-message">{errors.phonenumber.message}</small> : null}

                <label className="form-label" htmlFor="email">{copy.contact.form.email}</label>
                <input
                  type="email"
                  id="email"
                  placeholder={copy.contact.form.emailPlaceholder}
                  {...register("email", {
                    required: copy.contact.validation.emailRequired,
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: copy.contact.validation.emailInvalid }
                  })}
                />
                {errors.email ? <small className="error-message">{errors.email.message}</small> : null}

                <label className="form-label" htmlFor="title">{copy.contact.form.title}</label>
                <input type="text" id="title" placeholder={copy.contact.form.titlePlaceholder} {...register("title", { required: copy.contact.validation.titleRequired })} />
                {errors.title ? <small className="error-message">{errors.title.message}</small> : null}

                <label className="form-label" htmlFor="message">{copy.contact.form.message}</label>
                <textarea id="message" cols={30} rows={8} placeholder={copy.contact.form.messagePlaceholder} {...register("message", { required: copy.contact.validation.messageRequired })} />
                {errors.message ? <small className="error-message">{errors.message.message}</small> : null}

                <button type="submit" id="button" disabled={isSending}>
                  {isSending ? copy.contact.sending : copy.contact.send}
                  <i className="fa-solid fa-paper-plane" />
                  <span className="overlay" />
                </button>

                {submitState ? <p className={`status-message ${submitState.type}`}>{submitState.message}</p> : null}
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
type CaseStudyPageProps = {
  language: Language;
  handleProjectImageError: (event: SyntheticEvent<HTMLImageElement>) => void;
};

function CaseStudyPage({ language, handleProjectImageError }: CaseStudyPageProps) {
  const { slug } = useParams();
  const copy = uiCopy[language];
  const study = caseStudies.find((item) => item.slug === slug);

  if (!study) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="case-study-page" id="case-study-top">
      <div className="case-study-shell">
        <div className="case-study-breadcrumb case-animate" style={animationDelay(0.04)}>
          <Link to={{ pathname: "/", hash: "#portfolio" }}>
            <i className="fa-solid fa-arrow-left" />
            {copy.caseStudy.backToPortfolio}
          </Link>
        </div>

        <section className="case-study-hero">
          <div className="case-study-hero-grid">
            <article className="case-study-copy case-animate" style={animationDelay(0.08)}>
              <span className="case-study-kicker">{study.eyebrow[language]}</span>
              <h1>{study.title[language]}</h1>
              <p className="case-study-summary">{study.summary[language]}</p>
              <p className="case-study-narrative">{study.narrative[language]}</p>
              <div className="case-study-stack">
                {study.stack.map((tool) => (
                  <span key={`${study.slug}-${tool}`}>{tool}</span>
                ))}
              </div>
              <div className="case-study-actions">
                <a href={study.externalLink} target="_blank" rel="noopener noreferrer">
                  {study.externalLabel[language]}
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                </a>
                <Link className="case-study-secondary-link" to={{ pathname: "/", hash: "#portfolio" }}>
                  {copy.caseStudy.moreProjects}
                  <i className="fa-solid fa-table-cells-large" />
                </Link>
              </div>
            </article>

            <aside className="case-study-media case-animate" style={animationDelay(0.14)}>
              <div className="case-study-media-frame">
                <img src={study.image} alt={study.imageAlt[language]} loading="eager" onError={handleProjectImageError} />
              </div>
              <div className="case-study-quote">
                <i className="fa-solid fa-quote-left" />
                <p>{study.quote[language]}</p>
              </div>
            </aside>
          </div>
        </section>

        <section className="case-study-overview">
          <article className="case-study-panel case-animate" style={animationDelay(0.18)}>
            <div className="case-study-panel-header">
              <span>{copy.caseStudy.summaryTitle}</span>
            </div>
            <ul className="case-study-outcomes">
              {study.outcomes[language].map((item) => (
                <li key={`${study.slug}-${item}`}>
                  <i className="fa-solid fa-check" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <aside className="case-study-panel case-study-facts case-animate" style={animationDelay(0.24)}>
            <div className="case-study-panel-header">
              <span>{copy.caseStudy.factsTitle}</span>
            </div>
            <div className="case-study-facts-grid">
              {study.quickFacts.map((fact) => (
                <article className="case-study-fact" key={`${study.slug}-${fact.label.en}`}>
                  <small>{fact.label[language]}</small>
                  <strong>{fact.value[language]}</strong>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="case-study-story">
          <div className="case-study-story-header case-animate" style={animationDelay(0.28)}>
            <span className="aboutme-eyebrow">{copy.caseStudy.storyTitle}</span>
            <h2>{study.title[language]}</h2>
          </div>
          <div className="case-study-story-grid">
            {study.sections.map((section, index) => (
              <article className="case-study-card case-animate" key={`${study.slug}-${section.id}`} style={animationDelay(0.32 + index * 0.06)}>
                <div className="case-study-card-header">
                  <span className="case-study-card-icon"><i className={section.icon} /></span>
                  <h3>{section.title[language]}</h3>
                </div>
                <p>{section.body[language]}</p>
                <ul>
                  {section.bullets[language].map((bullet) => (
                    <li key={`${study.slug}-${section.id}-${bullet}`}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="case-study-showcase case-animate" style={animationDelay(0.42)}>
          <div className="case-study-showcase-copy">
            <span>{copy.caseStudy.imageTitle}</span>
            <h2>{study.title[language]}</h2>
            <p>{study.summary[language]}</p>
          </div>
          <div className="case-study-showcase-media">
            <img src={study.image} alt={study.imageAlt[language]} loading="lazy" onError={handleProjectImageError} />
          </div>
        </section>
      </div>
    </main>
  );
}

function App() {
  const location = useLocation();
  const contactEmail = "walterenzowohl@gmail.com";
  const contactPhone = "+54 11 4141 9407";
  const contactPhoneHref = "+541141419407";
  const [language, setLanguage] = useState<Language>("es");
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const savedTheme = window.localStorage.getItem("portfolio-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");
  const [isSending, setIsSending] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>(null);
  const [openExperience, setOpenExperience] = useState<number | null>(null);
  const [copiedContact, setCopiedContact] = useState<ContactCopyField>(null);

  const copy = uiCopy[language];
  const isCaseStudyRoute = location.pathname.startsWith("/case-studies/");
  const currentCaseStudy = useMemo(
    () => caseStudies.find((item) => location.pathname === `/case-studies/${item.slug}`) ?? null,
    [location.pathname]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormValues>();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    setMenuVisible(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.title = currentCaseStudy
      ? `${currentCaseStudy.title[language]} | Walter Enzo Wohl`
      : `Portfolio | Walter Enzo Wohl`;
  }, [currentCaseStudy, language]);

  const onSubmit = async (data: ContactFormValues) => {
    setIsSending(true);
    setSubmitState(null);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "default_service";
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "template_bixc80n";
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "lhs0IH3WpDcnuUKOr";

    try {
      await emailjs.send(serviceId, templateId, data, { publicKey });
      setSubmitState({ type: "success", message: copy.contact.success });
      reset();
    } catch {
      setSubmitState({ type: "error", message: copy.contact.error });
    } finally {
      setIsSending(false);
    }
  };

  const selectMenu = () => {
    setMenuVisible(false);
  };

  const handleProjectImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;

    image.onerror = null;
    image.src = "/img/WIP.png";
  };

  const copyToClipboard = async (field: Exclude<ContactCopyField, null>, value: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const tempInput = document.createElement("textarea");
        tempInput.value = value;
        tempInput.setAttribute("readonly", "");
        tempInput.style.position = "absolute";
        tempInput.style.left = "-9999px";
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      setCopiedContact(field);
      window.setTimeout(() => {
        setCopiedContact((current) => (current === field ? null : current));
      }, 1800);
    } catch {
      setCopiedContact(null);
    }
  };

  const themeToggleLabel =
    language === "es"
      ? theme === "dark"
        ? "Activar modo claro"
        : "Activar modo oscuro"
      : theme === "dark"
        ? "Enable light mode"
        : "Enable dark mode";

  const navItems = [
    { id: "home", label: copy.nav.home },
    { id: "aboutme", label: copy.nav.about },
    { id: "portfolio", label: copy.nav.portfolio },
    { id: "curriculum", label: copy.nav.curriculum },
    { id: "certifications", label: copy.nav.certifications },
    { id: "contacto", label: copy.nav.contact }
  ];

  return (
    <>
      <ScrollManager />

      <div className="contenedor-header">
        <header>
          <div className="logo">
            <Link to={{ pathname: "/", hash: "#home" }}>Walter Enzo Wohl</Link>
          </div>

          <nav id="nav" className={menuVisible ? "responsive" : ""}>
            <ul>
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link to={{ pathname: "/", hash: `#${item.id}` }} onClick={selectMenu}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className={`theme-toggle ${theme === "light" ? "is-light" : "is-dark"}`}
              aria-label={themeToggleLabel}
              title={themeToggleLabel}
              onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            >
              <span className="theme-toggle-thumb" aria-hidden="true">
                <i className={`fa-solid ${theme === "light" ? "fa-sun" : "fa-moon"}`} />
              </span>
            </button>

            <div className="language-switch" role="group" aria-label={copy.languageSwitcherAria}>
              <button type="button" className={language === "en" ? "is-active" : ""} onClick={() => setLanguage("en")}>EN</button>
              <button type="button" className={language === "es" ? "is-active" : ""} onClick={() => setLanguage("es")}>ES</button>
            </div>

            <button
              className="nav-responsive"
              type="button"
              aria-label={language === "es" ? "Abrir menú de navegación" : "Open navigation menu"}
              aria-controls="nav"
              aria-expanded={menuVisible}
              onClick={() => setMenuVisible((prev) => !prev)}
            >
              <i className="fa-solid fa-bars" />
            </button>
          </div>
        </header>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              language={language}
              copy={copy}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              openExperience={openExperience}
              setOpenExperience={setOpenExperience}
              handleProjectImageError={handleProjectImageError}
              copiedContact={copiedContact}
              copyToClipboard={copyToClipboard}
              contactEmail={contactEmail}
              contactPhone={contactPhone}
              contactPhoneHref={contactPhoneHref}
              register={register}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              errors={errors}
              isSending={isSending}
              submitState={submitState}
            />
          }
        />
        <Route path="/case-studies/:slug" element={<CaseStudyPage language={language} handleProjectImageError={handleProjectImageError} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer>
        <a href={isCaseStudyRoute ? "#case-study-top" : "#home"} className="arriba"><i className="fa-solid fa-angles-up" /></a>
        <div className="redes">
          <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/walterenzowohl" aria-label="LinkedIn de Walter Enzo Wohl"><i className="fa-brands fa-linkedin" /></a>
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/WalterEnzoWohl" aria-label="GitHub de Walter Enzo Wohl"><i className="fa-brands fa-github" /></a>
        </div>
        <p className="copyright">
          &copy; {new Date().getFullYear()} Walter Enzo Wohl. {copy.footer}
          {currentCaseStudy ? ` · ${currentCaseStudy.title[language]}` : ""}
        </p>
      </footer>
    </>
  );
}

export default App;

