import { useEffect, useState, type SyntheticEvent } from "react";
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";
import "./style.css";

type Language = "es" | "en";
type Theme = "dark" | "light";

type LocalizedText = {
  es: string;
  en: string;
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

type Certification = {
  title: LocalizedText;
  provider: LocalizedText;
  year: LocalizedText;
  link: string;
  icon: string;
  skills: string[];
};

type Project = {
  title: LocalizedText;
  category: Exclude<ProjectCategory, "all">;
  description: LocalizedText;
  tools: string[];
  highlights: {
    es: string[];
    en: string[];
  };
  image: string;
  link: string;
};

type CurriculumItem = {
  title: LocalizedText;
  place: LocalizedText;
  date: LocalizedText;
  description: LocalizedText;
};

const uiCopy = {
  es: {
    nav: {
      home: "Inicio",
      about: "SobreMi",
      curriculum: "Currículum",
      certifications: "Certificaciones",
      portfolio: "Portfolio",
      contact: "Contacto"
    },
    languageSwitcherAria: "Cambiar idioma",
    heroRole: "Analista de Datos IT | BI, Reporting y Visualización",
    about: {
      eyebrow: "Perfil profesional",
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
      subtitle: "Formación y experiencia profesional con foco en analítica, mejora operativa y desarrollo.",
      education: "Formación",
      experience: "Experiencia",
      showMore: "Ver más",
      showLess: "Ver menos"
    },
    certifications: {
      title: "Certificaciones",
      subtitle: "Formación validada con las herramientas y habilidades que incorporé en cada etapa.",
      view: "Ver"
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
      viewProject: "Ver proyecto"
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
      curriculum: "Resume",
      certifications: "Certifications",
      portfolio: "Portfolio",
      contact: "Contact"
    },
    languageSwitcherAria: "Change language",
    heroRole: "IT Data Analyst | BI, Reporting & Visualization",
    about: {
      eyebrow: "Professional profile",
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
      subtitle: "Education and professional experience focused on analytics, operational improvement and development.",
      education: "Education",
      experience: "Experience",
      showMore: "Show more",
      showLess: "Show less"
    },
    certifications: {
      title: "Certifications",
      subtitle: "Validated learning with the tools and skills I developed in each stage.",
      view: "View"
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
      viewProject: "View project"
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
    skills: ["Python", "Pandas", "NumPy", "Looker", "Google Sheets", "AppScript", "PostgreSQL"]
  },
  {
    title: { es: "Diplomatura en Desarrollo Web Full Stack", en: "Full Stack Web Development Diploma" },
    provider: { es: "Universidad Tecnológica Nacional", en: "National Technological University" },
    year: { es: "Marzo 2023 - Diciembre 2023", en: "March 2023 - December 2023" },
    link: "/img/Walter Enzo Wohl CV.pdf",
    icon: "fa-solid fa-code",
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Git", "GitHub", "MySQL"]
  },
  {
    title: { es: "Curso de Análisis de Datos", en: "Data Analysis Course" },
    provider: { es: "CREHANA", en: "CREHANA" },
    year: { es: "2025", en: "2025" },
    link: "/img/Walter Enzo Wohl CV.pdf",
    icon: "fa-solid fa-database",
    skills: ["Excel avanzado", "Macros", "Power BI", "SQL"]
  }
];
const projects: Project[] = [
  {
    title: { es: "Análisis de Gastos RRHH", en: "HR Expense Analysis" },
    category: "powerbi",
    description: {
      es: "Dashboard para controlar gastos operativos y oportunidades de optimización en recursos humanos.",
      en: "Dashboard to track operating expenses and optimization opportunities across human resources."
    },
    tools: ["Power BI", "Excel"],
    highlights: {
      es: ["KPIs de costos por área", "Comparativa mensual de desvío"],
      en: ["Cost KPIs by area", "Monthly variance comparison"]
    },
    image: "/img/dashboard-rrhh.png",
    link: "https://app.powerbi.com/view?r=eyJrIjoiNzkzN2M5NDctNGFiMC00NmU3LTg1NzQtYjdiZmRlMDU0MzQ4IiwidCI6ImUwODdhZTVmLTQ2YjQtNDBiOS04ZGZkLTE1MTA4MTQwMTc3MyIsImMiOjR9"
  },
  {
    title: { es: "Informe de Ventas Appol", en: "Appol Sales Report" },
    category: "powerbi",
    description: {
      es: "Informe ejecutivo para análisis comercial con seguimiento de ventas, mix de productos y tendencias.",
      en: "Executive report for commercial analysis with sales tracking, product mix and trend monitoring."
    },
    tools: ["Power BI", "Excel", "DAX"],
    highlights: {
      es: ["Análisis por canal", "Seguimiento de crecimiento YoY"],
      en: ["Channel analysis", "YoY growth tracking"]
    },
    image: "/img/dashboard-appol.png",
    link: "https://app.powerbi.com/view?r=eyJrIjoiYmZkOTYwMDYtNWU1NS00MjZkLTg2MWYtZDAxZmRkYzVhZGUwIiwidCI6ImUwODdhZTVmLTQ2YjQtNDBiOS04ZGZkLTE1MTA4MTQwMTc3MyIsImMiOjR9"
  },
  {
    title: { es: "Métricas de Mailing GCBA", en: "GCBA Mailing Metrics" },
    category: "powerbi",
    description: {
      es: "Reporte de métricas de mailing para campañas de llamados de la Ciudad de Buenos Aires, con seguimiento de envíos, aperturas, clics y rebotes.",
      en: "Mailing metrics report for Buenos Aires City outreach campaigns, tracking sends, opens, clicks and bounce rates."
    },
    tools: ["Looker Studio", "Google Sheets"],
    highlights: {
      es: ["Filtros por campaña y período", "KPIs de aperturas, clics y rebotes"],
      en: ["Campaign and period filters", "Open, click and bounce KPIs"]
    },
    image: "/img/dashboard-mailing.png",
    link: "https://lookerstudio.google.com/reporting/ad58b1c2-d02e-4557-8634-537b8314354a"
  },
  {
    title: { es: "Gestión de Nómina RRHH", en: "HR Payroll Management" },
    category: "powerbi",
    description: {
      es: "Dashboard de recursos humanos para analizar dotación, distribución por área, rango etario y antigüedad del personal.",
      en: "Human resources dashboard to analyze headcount, area distribution, age ranges and employee tenure."
    },
    tools: ["Looker Studio", "Google Sheets"],
    highlights: {
      es: ["Distribución por género y dirección general", "Mapa de empleados y análisis de antigüedad"],
      en: ["Gender and management distribution", "Employee map and tenure analysis"]
    },
    image: "/img/dashboard-nomina.png",
    link: "https://lookerstudio.google.com/reporting/26b9eca6-822c-41f9-836f-f16b76ab2acd"
  },
  {
    title: { es: "WebApp de Gestión de Empleados", en: "Employee Management WebApp" },
    category: "web",
    description: {
      es: "Aplicación web interna para que empleados gestionen solicitudes de vacaciones, licencias médicas y otras ausencias de forma ordenada.",
      en: "Internal web application for employees to manage vacation requests, medical leave and other absences in an organized way."
    },
    tools: ["AppScript", "JavaScript", "Git", "Clasp"],
    highlights: {
      es: ["Autogestión de vacaciones y licencias", "Seguimiento centralizado de ausencias"],
      en: ["Self-service vacation and leave requests", "Centralized absence tracking"]
    },
    image: "/img/WIP.png",
    link: "https://github.com/WalterEnzoWohl"
  }
];

const curriculumData: { education: CurriculumItem[]; experience: CurriculumItem[] } = {
  education: [
    {
      title: { es: "Google Data Analytics", en: "Google Data Analytics" },
      place: { es: "Google | Coursera", en: "Google | Coursera" },
      date: { es: "2025 - Actualidad", en: "2025 - Present" },
      description: {
        es: "Certificación orientada a análisis de datos, limpieza y preparación de información, uso de spreadsheets, SQL, visualización y toma de decisiones basada en datos.",
        en: "Certification focused on data analysis, data cleaning and preparation, spreadsheets, SQL, visualization and data-driven decision making."
      }
    },
    {
      title: { es: "Diplomatura en Desarrollo Web Full Stack", en: "Full Stack Web Development Diploma" },
      place: { es: "Universidad Tecnológica Nacional", en: "National Technological University" },
      date: { es: "Marzo 2023 - Diciembre 2023", en: "March 2023 - December 2023" },
      description: {
        es: "Formación integral orientada al desarrollo de aplicaciones web frontend y backend. Incorporé HTML, CSS, JavaScript, Git, GitHub, Node.js y bases de datos, trabajando con proyectos prácticos y metodologías ágiles.",
        en: "Comprehensive training focused on front-end and back-end web application development. I worked with HTML, CSS, JavaScript, Git, GitHub, Node.js and databases through hands-on projects and agile methodologies."
      }
    },
    {
      title: { es: "Curso de Análisis de Datos", en: "Data Analysis Course" },
      place: { es: "CREHANA", en: "CREHANA" },
      date: { es: "2024 - 2025", en: "2024 - 2025" },
      description: {
        es: "Análisis y visualización de datos usando Excel, SQL, Power BI y Python. Manipulación de grandes volúmenes de información y toma de decisiones basadas en datos.",
        en: "Data analysis and visualization using Excel, SQL, Power BI and Python. Handling large data volumes and supporting data-driven decisions."
      }
    }
  ],
  experience: [
    {
      title: { es: "Analista de Datos", en: "Data Analyst" },
      place: { es: "Gobierno de la Ciudad de Buenos Aires (GCBA)", en: "City Government of Buenos Aires (GCBA)" },
      date: { es: "Septiembre 2025 - Actualidad", en: "September 2025 - Present" },
      description: {
        es: "Análisis de datos y generación de reportes para entornos de gestión pública, con foco en seguimiento de información, visualización de indicadores y soporte a la toma de decisiones.",
        en: "Data analysis and reporting for public management environments, focused on information tracking, KPI visualization and decision support."
      }
    },
    {
      title: { es: "Analista de Datos Junior", en: "Junior Data Analyst" },
      place: { es: "ARBUSTA S.A.", en: "ARBUSTA S.A." },
      date: { es: "Agosto 2024 - Septiembre 2025", en: "August 2024 - September 2025" },
      description: {
        es: "Responsable de análisis de datos en el proyecto MTC para Mercado Libre, control de publicaciones y seguimiento de KPIs. Desarrollo de reportes automatizados en Google Sheets, trabajo con Excel, SQL, Power BI y participación en procesos ETL.",
        en: "Responsible for data analysis in the MTC project for Mercado Libre, publication control and KPI monitoring. Built automated reports in Google Sheets, worked with Excel, SQL, Power BI and supported ETL processes."
      }
    },
    {
      title: { es: "Desarrollador IoT en Pasantía", en: "IoT Development Intern" },
      place: { es: "Grupo MSA S.A", en: "Grupo MSA S.A" },
      date: { es: "Febrero 2024 - Marzo 2024", en: "February 2024 - March 2024" },
      description: {
        es: "Desarrollo de una aplicación IoT para validación de identidad con DNI y huella. Trabajo colaborativo en entorno Ubuntu usando HTML, CSS, JavaScript y React para el frontend.",
        en: "Developed an IoT application for identity validation using ID card and fingerprint. Collaborative work in an Ubuntu environment using HTML, CSS, JavaScript and React for the frontend."
      }
    }
  ]
};
function App() {
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
  const [openEducation, setOpenEducation] = useState<number | null>(null);
  const [openExperience, setOpenExperience] = useState<number | null>(null);
  const [copiedContact, setCopiedContact] = useState<ContactCopyField>(null);

  const copy = uiCopy[language];

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

  const filteredProjects =
    activeCategory === "all" ? projects : projects.filter((project) => project.category === activeCategory);

  const projectCategories = [
    { id: "all" as const, label: copy.portfolio.filters.all, icon: "fa-solid fa-layer-group" },
    { id: "powerbi" as const, label: copy.portfolio.filters.powerbi, icon: "fa-solid fa-chart-simple" },
    { id: "web" as const, label: copy.portfolio.filters.web, icon: "fa-solid fa-code" }
  ];

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

  return (
    <>
      <div className="contenedor-header">
        <header>
          <div className="logo">
            <a href="#home">Walter Enzo Wohl</a>
          </div>

          <nav id="nav" className={menuVisible ? "responsive" : ""}>
            <ul>
              <li><a href="#home" onClick={selectMenu}>{copy.nav.home}</a></li>
              <li><a href="#aboutme" onClick={selectMenu}>{copy.nav.about}</a></li>
              <li><a href="#curriculum" onClick={selectMenu}>{copy.nav.curriculum}</a></li>
              <li><a href="#certifications" onClick={selectMenu}>{copy.nav.certifications}</a></li>
              <li><a href="#portfolio" onClick={selectMenu}>{copy.nav.portfolio}</a></li>
              <li><a href="#contacto" onClick={selectMenu}>{copy.nav.contact}</a></li>
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

      <main>
        <section className="home" id="home">
          <div className="contenedor-banner">
            <div className="contenedor-img">
              <img src="/img/foto-perfil.webp" alt="Foto de perfil de Walter Enzo Wohl" width={320} height={320} fetchPriority="high" />
            </div>
            <div className="contenedor-info">
              <h1>Walter Enzo Wohl</h1>
              <h2>{copy.heroRole}</h2>
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
              <span className="aboutme-eyebrow">{copy.about.eyebrow}</span>
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
                  <a className="aboutme-contact-link" href="#contacto">
                    {copy.about.contact} <i className="fa-solid fa-arrow-up-right-from-square" />
                  </a>
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
        <section id="curriculum" className="curriculum-modern">
          <div className="contenedor-seccion">
            <h2>{copy.curriculum.title}</h2>
            <p className="curriculum-modern-subtitle">{copy.curriculum.subtitle}</p>
            <div className="curriculum-modern-grid">
              <div className="curriculum-modern-col">
                <h3>{copy.curriculum.education}</h3>
                {curriculumData.education.map((item, index) => {
                  const isOpen = openEducation === index;
                  return (
                    <article className="curriculum-modern-item" key={`${item.title.en}-${item.date.en}-${index}`}>
                      <h4>{item.title[language]}</h4>
                      <span className="casa">{item.place[language]}</span>
                      <span className="fecha">{item.date[language]}</span>
                      <button className="toggle-btn" type="button" aria-expanded={isOpen} onClick={() => setOpenEducation((prev) => (prev === index ? null : index))}>
                        {isOpen ? copy.curriculum.showLess : copy.curriculum.showMore}
                        <i className={`fa-solid fa-chevron-down chevron ${isOpen ? "rotated" : ""}`} aria-hidden />
                      </button>
                      <div className={`descripcion-wrapper ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
                        <p className="descripcion">{item.description[language]}</p>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="curriculum-modern-col">
                <h3>{copy.curriculum.experience}</h3>
                {curriculumData.experience.map((item, index) => {
                  const isOpen = openExperience === index;
                  return (
                    <article className="curriculum-modern-item" key={`${item.title.en}-${item.date.en}-${index}`}>
                      <h4>{item.title[language]}</h4>
                      <span className="casa">{item.place[language]}</span>
                      <span className="fecha">{item.date[language]}</span>
                      <button className="toggle-btn" type="button" aria-expanded={isOpen} onClick={() => setOpenExperience((prev) => (prev === index ? null : index))}>
                        {isOpen ? copy.curriculum.showLess : copy.curriculum.showMore}
                        <i className={`fa-solid fa-chevron-down chevron ${isOpen ? "rotated" : ""}`} aria-hidden />
                      </button>
                      <div className={`descripcion-wrapper ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
                        <p className="descripcion">{item.description[language]}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="certifications" className="certifications-modern">
          <div className="contenedor-seccion">
            <h2>{copy.certifications.title}</h2>
            <p className="certifications-modern-subtitle">{copy.certifications.subtitle}</p>
            <div className="certifications-modern-list">
              {certifications.map((certification) => (
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
                  </div>
                  <a href={certification.link} target="_blank" rel="noopener noreferrer" aria-label={`${copy.certifications.view} ${certification.title[language]}`}>
                    {copy.certifications.view}
                  </a>
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
              {filteredProjects.map((project) => (
                <article className="portfolio-modern-card" key={project.title.en}>
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
                    <a href={project.link} target="_blank" rel="noopener noreferrer">{copy.portfolio.viewProject} <i className="fa-solid fa-arrow-up-right-from-square" /></a>
                  </div>
                </article>
              ))}
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

      <footer>
        <a href="#home" className="arriba"><i className="fa-solid fa-angles-up" /></a>
        <div className="redes">
          <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/walterenzowohl" aria-label="LinkedIn de Walter Enzo Wohl"><i className="fa-brands fa-linkedin" /></a>
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/WalterEnzoWohl" aria-label="GitHub de Walter Enzo Wohl"><i className="fa-brands fa-github" /></a>
        </div>
        <p className="copyright">&copy; {new Date().getFullYear()} Walter Enzo Wohl. {copy.footer}</p>
      </footer>
    </>
  );
}

export default App;
