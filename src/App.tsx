import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction, type SyntheticEvent } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";
import DashboardLayout from "./components/DashboardLayout";
import OverviewDashboard from "./components/OverviewDashboard";
import ProjectsGallery from "./components/ProjectsGallery";
import ProjectCaseStudy from "./components/ProjectCaseStudy";
import { getDataCaseStudy } from "./data/projectCaseStudies";
import { projects, recentOverviewProjectSlugs } from "./data/projects";
import "./style.css";
import "./dashboard.css";
import "./overview.css";
import "./projects.css";
import "./project-case-study.css";

type Language = "es" | "en";
type Theme = "dark" | "light";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => {
    finished: Promise<void>;
  };
};

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

type Certification = {
  title: LocalizedText;
  provider: LocalizedText;
  year: LocalizedText;
  link: string;
  icon: string;
  skills: string[];
  description: LocalizedText;
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

const uiCopy = {
  es: {
    nav: {
      home: "Inicio",
      about: "SobreMi",
      portfolio: "Portfolio",
      curriculum: "Experiencia",
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
      title: "Experiencia",
      subtitle: "Análisis de datos, automatización y desarrollo aplicados a resolver necesidades operativas reales.",
      experience: "Experiencia",
      downloadCv: "Descargar CV",
      currentBadge: "Actualidad",
      spotlightCurrent: "Rol actual",
      spotlightExperience: "Trayectoria",
      spotlightExperienceUnit: "Datos, automatización y desarrollo",
      spotlightFocus: "Enfoque",
      spotlightFocusValue: "Herramientas internas y visualización",
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
      title: "Proyectos",
      subtitle: "",
      published: "Proyectos publicados",
      searchLabel: "Buscar proyectos",
      searchPlaceholder: "Buscar proyecto",
      clearSearch: "Limpiar búsqueda",
      filtersLabel: "Filtrar proyectos",
      filters: {
        all: "Todos",
        data: "Datos y visualización",
        web: "Desarrollo web",
        automation: "Automatización"
      },
      sortLabel: "Ordenar proyectos",
      sortOptions: {
        recent: "Más recientes",
        "alphabetical-asc": "A a la Z",
        "alphabetical-desc": "Z a la A"
      },
      viewCaseStudy: "Ver caso de estudio",
      comingSoon: "Próximamente",
      empty: "No encontramos proyectos con estos filtros.",
      clearFilters: "Limpiar filtros"
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
      curriculum: "Experience",
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
      title: "Experience",
      subtitle: "Data analysis, automation and development applied to real operational needs.",
      experience: "Experience",
      downloadCv: "Download CV",
      currentBadge: "Present",
      spotlightCurrent: "Current role",
      spotlightExperience: "Background",
      spotlightExperienceUnit: "Data, automation and development",
      spotlightFocus: "Focus",
      spotlightFocusValue: "Internal tools and visualization",
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
      title: "Projects",
      subtitle: "",
      published: "Published projects",
      searchLabel: "Search projects",
      searchPlaceholder: "Search project",
      clearSearch: "Clear search",
      filtersLabel: "Filter projects",
      filters: {
        all: "All",
        data: "Data & visualization",
        web: "Web development",
        automation: "Automation"
      },
      sortLabel: "Sort projects",
      sortOptions: {
        recent: "Most recent",
        "alphabetical-asc": "A to Z",
        "alphabetical-desc": "Z to A"
      },
      viewCaseStudy: "View case study",
      comingSoon: "Coming soon",
      empty: "We couldn't find projects with these filters.",
      clearFilters: "Clear filters"
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
  const latestExperience = curriculumData.experience[0];
  const featuredProject = projects.find((project) => project.caseStudySlug === "mailing-gcba") ?? projects[0];
  const recentProjects = recentOverviewProjectSlugs.flatMap((slug) => {
    const project = projects.find((item) => item.caseStudySlug === slug);
    return project ? [project] : [];
  });
  const curriculumSpotlights = [
    {
      label: copy.curriculum.spotlightCurrent,
      value: `${latestExperience.title[language]} · ${latestExperience.place[language]}`
    },
    {
      label: copy.curriculum.spotlightExperience,
      value: copy.curriculum.spotlightExperienceUnit
    },
    {
      label: copy.curriculum.spotlightFocus,
      value: copy.curriculum.spotlightFocusValue
    }
  ];

  return (
    <main className="dashboard-main">
      <OverviewDashboard
        language={language}
        featuredProject={featuredProject}
        recentProjects={recentProjects}
        projects={projects}
        onImageError={handleProjectImageError}
      />

      <ProjectsGallery language={language} projects={projects} copy={copy.portfolio} onImageError={handleProjectImageError} />

      <section id="curriculum" className="curriculum-modern experience-section">
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
type DataProjectCaseStudyPageProps = {
  language: Language;
  handleProjectImageError: (event: SyntheticEvent<HTMLImageElement>) => void;
  theme: Theme;
  themeToggleRef: React.RefObject<HTMLButtonElement | null>;
  themeToggleLabel: string;
  onThemeToggle: () => void;
  onLanguageChange: (language: Language) => void;
};

function DataProjectCaseStudyPage({ language, theme, themeToggleRef, themeToggleLabel, onThemeToggle, onLanguageChange, handleProjectImageError }: DataProjectCaseStudyPageProps) {
  const { slug } = useParams();
  const detail = getDataCaseStudy(slug);
  const project = detail ? projects.find((item) => item.id === detail.projectId) : undefined;

  return (
    <DashboardLayout
      language={language}
      theme={theme}
      themeToggleRef={themeToggleRef}
      themeToggleLabel={themeToggleLabel}
      onThemeToggle={onThemeToggle}
      onLanguageChange={onLanguageChange}
      activeSectionOverride="portfolio"
      breadcrumbDetails={project ? [{ label: project.title[language] }] : []}
    >
      <ProjectCaseStudy detail={detail} project={project} projects={projects} language={language} onImageError={handleProjectImageError} />
    </DashboardLayout>
  );
}

function App() {
  const location = useLocation();
  const contactEmail = "walterenzowohl@gmail.com";
  const contactPhone = "+54 11 4141 9407";
  const contactPhoneHref = "+541141419407";
  const themeToggleRef = useRef<HTMLButtonElement | null>(null);
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
  const [isSending, setIsSending] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>(null);
  const [openExperience, setOpenExperience] = useState<number | null>(null);
  const [copiedContact, setCopiedContact] = useState<ContactCopyField>(null);

  const copy = uiCopy[language];
  const isDataCaseStudyRoute = location.pathname.startsWith("/proyectos/");
  const currentDataCaseStudyProject = useMemo(() => {
    if (!isDataCaseStudyRoute) return null;
    const slug = location.pathname.split("/").filter(Boolean).at(-1);
    const detail = getDataCaseStudy(slug);
    return detail ? projects.find((item) => item.id === detail.projectId) ?? null : null;
  }, [isDataCaseStudyRoute, location.pathname]);

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
    document.title = currentDataCaseStudyProject
      ? `${currentDataCaseStudyProject.title[language]} | Walter Enzo Wohl`
      : `Portfolio | Walter Enzo Wohl`;
  }, [currentDataCaseStudyProject, language]);

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

  const switchThemeWithTransition = async () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    const trigger = themeToggleRef.current;
    const rect = trigger?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    root.style.setProperty("--theme-transition-x", `${(x / window.innerWidth) * 100}%`);
    root.style.setProperty("--theme-transition-y", `${(y / window.innerHeight) * 100}%`);
    root.setAttribute("data-theme-transition", nextTheme === "dark" ? "to-dark" : "to-light");

    const clearTransitionState = () => {
      root.removeAttribute("data-theme-transition");
      root.style.removeProperty("--theme-transition-x");
      root.style.removeProperty("--theme-transition-y");
    };

    const transitionDocument = document as ViewTransitionDocument;

    if (!transitionDocument.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTheme(nextTheme);
      window.setTimeout(clearTransitionState, 350);
      return;
    }

    try {
      const transition = transitionDocument.startViewTransition(() => {
        setTheme(nextTheme);
      });

      await transition.finished;
    } finally {
      clearTransitionState();
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

  return (
    <>
      <ScrollManager />

      <Routes>
        <Route
          path="/"
          element={
            <DashboardLayout
              language={language}
              theme={theme}
              themeToggleRef={themeToggleRef}
              themeToggleLabel={themeToggleLabel}
              onThemeToggle={() => void switchThemeWithTransition()}
              onLanguageChange={setLanguage}
            >
              <LandingPage
                language={language}
                copy={copy}
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
            </DashboardLayout>
          }
        />
        <Route path="/proyectos/:slug" element={<DataProjectCaseStudyPage language={language} theme={theme} themeToggleRef={themeToggleRef} themeToggleLabel={themeToggleLabel} onThemeToggle={() => void switchThemeWithTransition()} onLanguageChange={setLanguage} handleProjectImageError={handleProjectImageError} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="dashboard-page-footer">
        <a href={isDataCaseStudyRoute ? "#case-study-top" : "#home"} className="arriba"><i className="fa-solid fa-angles-up" /></a>
        <div className="redes">
          <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/walterenzowohl" aria-label="LinkedIn de Walter Enzo Wohl"><i className="fa-brands fa-linkedin" /></a>
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/WalterEnzoWohl" aria-label="GitHub de Walter Enzo Wohl"><i className="fa-brands fa-github" /></a>
        </div>
        <p className="copyright">
          &copy; {new Date().getFullYear()} Walter Enzo Wohl. {copy.footer}
          {currentDataCaseStudyProject ? ` · ${currentDataCaseStudyProject.title[language]}` : ""}
        </p>
      </footer>
    </>
  );
}

export default App;

