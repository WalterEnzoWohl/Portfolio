import { useEffect, useState, type SyntheticEvent } from "react";
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";
import "./style.css";

type ContactFormValues = {
  name: string;
  phonenumber: string;
  email: string;
  title: string;
  message: string;
};

type SubmitState = {
  type: "success" | "error";
  message: string;
} | null;

type ProjectCategory = "all" | "powerbi" | "web";

type SkillCategory = {
  title: string;
  icon: string;
  skills: string[];
};

type Certification = {
  title: string;
  provider: string;
  year: string;
  link: string;
};

type Project = {
  title: string;
  category: Exclude<ProjectCategory, "all">;
  description: string;
  tools: string[];
  highlights: string[];
  image: string;
  link: string;
};

type CurriculumItem = {
  titulo: string;
  institucion?: string;
  empresa?: string;
  fecha: string;
  descripcion: string;
};

type CurriculumData = {
  formacion: CurriculumItem[];
  experiencia: CurriculumItem[];
};

const skillCategories: SkillCategory[] = [
  {
    title: "Data Analysis",
    icon: "fa-solid fa-database",
    skills: ["Excel avanzado", "Macros/VBA", "SQL", "Power BI", "Tableau"]
  },
  {
    title: "Python & Automation",
    icon: "fa-solid fa-chart-column",
    skills: ["Python", "Pandas", "NumPy", "ETL"]
  },
  {
    title: "Development",
    icon: "fa-solid fa-code",
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"]
  },
  {
    title: "Tools & Delivery",
    icon: "fa-solid fa-screwdriver-wrench",
    skills: ["Git", "GitHub", "Azure DevOps", "MySQL", "PostgreSQL"]
  }
];

const certifications: Certification[] = [
  {
    title: "Google Data Analytics",
    provider: "Google | Coursera",
    year: "Actualidad",
    link: "/img/Walter Enzo Wohl CV.pdf"
  },
  {
    title: "Diplomatura en Desarrollo Web Full Stack",
    provider: "Universidad Tecnológica Nacional",
    year: "2023",
    link: "/img/Walter Enzo Wohl CV.pdf"
  },
  {
    title: "Curso de Análisis de Datos",
    provider: "CREHANA",
    year: "2025",
    link: "/img/Walter Enzo Wohl CV.pdf"
  }
];

const projectCategories: { id: ProjectCategory; label: string; icon: string }[] = [
  { id: "all", label: "Todos los proyectos", icon: "fa-solid fa-layer-group" },
  { id: "powerbi", label: "Power BI", icon: "fa-solid fa-chart-simple" },
  { id: "web", label: "Desarrollo Web", icon: "fa-solid fa-code" }
];

const projects: Project[] = [
  {
    title: "Análisis de Gastos RRHH",
    category: "powerbi",
    description: "Dashboard para controlar gastos operativos y oportunidades de optimización en recursos humanos.",
    tools: ["Power BI", "Excel"],
    highlights: ["KPIs de costos por área", "Comparativa mensual de desvío"],
    image: "/img/d2.webp",
    link: "https://app.powerbi.com/view?r=eyJrIjoiNzkzN2M5NDctNGFiMC00NmU3LTg1NzQtYjdiZmRlMDU0MzQ4IiwidCI6ImUwODdhZTVmLTQ2YjQtNDBiOS04ZGZkLTE1MTA4MTQwMTc3MyIsImMiOjR9"
  },
  {
    title: "Informe de Ventas Appol",
    category: "powerbi",
    description: "Informe ejecutivo para análisis comercial con seguimiento de ventas, mix de productos y tendencias.",
    tools: ["Power BI", "Excel", "DAX"],
    highlights: ["Análisis por canal", "Seguimiento de crecimiento YoY"],
    image: "/img/D3.png",
    link: "https://app.powerbi.com/view?r=eyJrIjoiYmZkOTYwMDYtNWU1NS00MjZkLTg2MWYtZDAxZmRkYzVhZGUwIiwidCI6ImUwODdhZTVmLTQ2YjQtNDBiOS04ZGZkLTE1MTA4MTQwMTc3MyIsImMiOjR9"
  },
  {
    title: "Seguimiento de Reportes por Recurso",
    category: "powerbi",
    description: "Control de productividad y calidad por recurso con enfoque en cumplimiento y mejora continua.",
    tools: ["Power BI", "SQL", "Python"],
    highlights: ["Trazabilidad por recurso", "Detección de cuellos de botella"],
    image: "/img/D4.png",
    link: "https://github.com/WalterEnzoWohl"
  },
  {
    title: "Portfolio Fullstack",
    category: "web",
    description: "Sitio portfolio desarrollado con enfoque responsive, performance y experiencia de usuario.",
    tools: ["React", "TypeScript", "Vite"],
    highlights: ["Arquitectura modular", "Formulario de contacto integrado"],
    image: "/img/banner.png",
    link: "https://portfoliowohl.vercel.app/"
  }
];

function App() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");
  const [isSending, setIsSending] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>(null);
  const [curriculum, setCurriculum] = useState<CurriculumData>({ formacion: [], experiencia: [] });
  const [curriculumError, setCurriculumError] = useState<string | null>(null);
  const [openFormacion, setOpenFormacion] = useState<number | null>(null);
  const [openExperiencia, setOpenExperiencia] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormValues>();

  useEffect(() => {
    let isMounted = true;

    fetch("/data/cv.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo cargar el CV.");
        }
        return response.json() as Promise<CurriculumData>;
      })
      .then((data) => {
        if (isMounted) {
          setCurriculum(data);
          setCurriculumError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCurriculumError("No se pudo cargar la sección de currículum.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const onSubmit = async (data: ContactFormValues) => {
    setIsSending(true);
    setSubmitState(null);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "default_service";
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "template_bixc80n";
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "lhs0IH3WpDcnuUKOr";

    try {
      await emailjs.send(serviceId, templateId, data, { publicKey });
      setSubmitState({ type: "success", message: "Mensaje enviado con éxito." });
      reset();
    } catch {
      setSubmitState({
        type: "error",
        message: "No se pudo enviar el mensaje. Probá nuevamente en unos minutos."
      });
    } finally {
      setIsSending(false);
    }
  };

  const selectMenu = () => {
    setMenuVisible(false);
  };

  const filteredProjects =
    activeCategory === "all" ? projects : projects.filter((project) => project.category === activeCategory);

  const handleProjectImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;

    image.onerror = null;
    image.src = "/img/WIP.png";
  };

  return (
    <>
      <div className="contenedor-header">
        <header>
          <div className="logo">
            <a href="#home">Walter Enzo Wohl</a>
          </div>

          <nav id="nav" className={menuVisible ? "responsive" : ""}>
            <ul>
              <li>
                <a href="#home" onClick={selectMenu}>
                  Home
                </a>
              </li>
              <li>
                <a href="#aboutme" onClick={selectMenu}>
                  About Me
                </a>
              </li>
              <li>
                <a href="#curriculum" onClick={selectMenu}>
                  Currículum
                </a>
              </li>
              <li>
                <a href="#skills" onClick={selectMenu}>
                  Skills
                </a>
              </li>
              <li>
                <a href="#certifications" onClick={selectMenu}>
                  Certificaciones
                </a>
              </li>
              <li>
                <a href="#portfolio" onClick={selectMenu}>
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#contacto" onClick={selectMenu}>
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <button
            className="nav-responsive"
            type="button"
            aria-label="Abrir menú de navegación"
            aria-controls="nav"
            aria-expanded={menuVisible}
            onClick={() => setMenuVisible((prev) => !prev)}
          >
            <i className="fa-solid fa-bars" />
          </button>
        </header>
      </div>

      <main>
        <section className="home" id="home">
          <div className="contenedor-banner">
            <div className="contenedor-img">
              <img
                src="/img/foto-perfil.webp"
                alt="Foto de perfil de Walter Enzo Wohl"
                width={320}
                height={320}
                fetchPriority="high"
              />
            </div>
            <div className="contenedor-info">
              <h1>Walter Enzo Wohl</h1>
              <h2>Analista de Datos IT | BI, Reporting y Visualización</h2>
              <div className="redes">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.linkedin.com/in/walterenzowohl"
                  aria-label="LinkedIn de Walter Enzo Wohl"
                >
                  <i className="fa-brands fa-linkedin" />
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/WalterEnzoWohl"
                  aria-label="GitHub de Walter Enzo Wohl"
                >
                  <i className="fa-brands fa-github" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="aboutme" className="aboutme">
          <div className="contenedor-seccion">
            <div className="aboutme-header">
              <span className="aboutme-eyebrow">Perfil Profesional</span>
              <h2>About Me</h2>
            </div>

            <div className="aboutme-layout">
              <article className="aboutme-story">
                <p>
                  <span>Hola, soy Walter Enzo Wohl.</span> Soy <strong>Analista de Datos IT</strong> con experiencia en
                  análisis, reporting y visualización para acompañar decisiones de negocio y operación. Trabajo con
                  Excel, SQL, Power BI, Tableau y Python para convertir información dispersa en indicadores claros,
                  dashboards accionables y procesos más ordenados. También cuento con base en desarrollo web y
                  herramientas de colaboración como Git, GitHub y Azure DevOps, lo que me permite moverme con comodidad
                  entre datos, producto y ejecución.
                </p>

                <div className="aboutme-actions">
                  <a className="btn-descarga" href="/img/Walter Enzo Wohl CV.pdf" download="WalterEnzoWohl.pdf">
                    Descargar CV <i className="fa-solid fa-download" />
                    <span className="overlay" />
                  </a>
                  <a className="aboutme-contact-link" href="#contacto">
                    Contactarme <i className="fa-solid fa-arrow-up-right-from-square" />
                  </a>
                </div>
              </article>

              <aside className="aboutme-value">
                <h3>Lo que puedo aportar</h3>
                <ul className="aboutme-value-list">
                  <li>
                    <h4>Reporting y seguimiento de KPIs</h4>
                    <p>Diseño reportes y tableros para ordenar información y mejorar el control operativo.</p>
                  </li>
                  <li>
                    <h4>Visualización para toma de decisiones</h4>
                    <p>Presento hallazgos de forma clara para que equipos y referentes puedan actuar más rápido.</p>
                  </li>
                  <li>
                    <h4>Ejecución transversal</h4>
                    <p>Combino analítica, automatización y criterio técnico para resolver necesidades de punta a punta.</p>
                  </li>
                </ul>
              </aside>
            </div>

            <div className="aboutme-pillars">
              <article className="aboutme-pillar">
                <i className="fa-solid fa-chart-line" />
                <h4>Decision Making</h4>
                <p>Datos claros para priorizar mejor y decidir con más contexto.</p>
              </article>
              <article className="aboutme-pillar">
                <i className="fa-solid fa-layer-group" />
                <h4>Data Storytelling</h4>
                <p>Contexto, visualización y síntesis para comunicar mejor cada hallazgo.</p>
              </article>
              <article className="aboutme-pillar">
                <i className="fa-solid fa-rocket" />
                <h4>Execution</h4>
                <p>Implementación práctica con foco en impacto, orden y continuidad operativa.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="curriculum" className="curriculum-modern">
          <div className="contenedor-seccion">
            <h2>Currículum</h2>
            <p className="curriculum-modern-subtitle">
              Formación y experiencia profesional con foco en analítica, mejora operativa y desarrollo.
            </p>
            {curriculumError ? <p className="curriculum-modern-error">{curriculumError}</p> : null}
            <div className="curriculum-modern-grid">
              <div className="curriculum-modern-col">
                <h3>Formación</h3>
                {curriculum.formacion.map((item, index) => {
                  const isOpen = openFormacion === index;
                  return (
                    <article className="curriculum-modern-item" key={`${item.titulo}-${item.fecha}-${index}`}>
                      <h4>{item.titulo}</h4>
                      <span className="casa">{item.institucion ?? "-"}</span>
                      <span className="fecha">{item.fecha}</span>
                      <button
                        className="toggle-btn"
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFormacion((prev) => (prev === index ? null : index))}
                      >
                        {isOpen ? "Ver menos " : "Ver más "}
                        <i className={`fa-solid fa-chevron-down chevron ${isOpen ? "rotated" : ""}`} aria-hidden />
                      </button>
                      <div className={`descripcion-wrapper ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
                        <p className="descripcion">{item.descripcion}</p>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="curriculum-modern-col">
                <h3>Experiencia</h3>
                {curriculum.experiencia.map((item, index) => {
                  const isOpen = openExperiencia === index;
                  return (
                    <article className="curriculum-modern-item" key={`${item.titulo}-${item.fecha}-${index}`}>
                      <h4>{item.titulo}</h4>
                      <span className="casa">{item.empresa ?? "-"}</span>
                      <span className="fecha">{item.fecha}</span>
                      <button
                        className="toggle-btn"
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenExperiencia((prev) => (prev === index ? null : index))}
                      >
                        {isOpen ? "Ver menos " : "Ver más "}
                        <i className={`fa-solid fa-chevron-down chevron ${isOpen ? "rotated" : ""}`} aria-hidden />
                      </button>
                      <div className={`descripcion-wrapper ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
                        <p className="descripcion">{item.descripcion}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="skills-modern">
          <div className="contenedor-seccion">
            <h2>Skills & Expertise</h2>
            <p className="skills-modern-subtitle">
              Tecnologías y herramientas con las que trabajo para resolver problemas de datos y producto.
            </p>
            <div className="skills-modern-grid">
              {skillCategories.map((category) => (
                <article className="skills-modern-card" key={category.title}>
                  <header className="skills-modern-header">
                    <span className="skills-modern-icon">
                      <i className={category.icon} />
                    </span>
                    <h3>{category.title}</h3>
                  </header>
                  <div className="skills-modern-tags">
                    {category.skills.map((skill) => (
                      <span key={`${category.title}-${skill}`}>{skill}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="certifications" className="certifications-modern">
          <div className="contenedor-seccion">
            <h2>Certificaciones</h2>
            <p className="certifications-modern-subtitle">Formación validada y aprendizaje continuo.</p>
            <div className="certifications-modern-list">
              {certifications.map((certification) => (
                <article className="certifications-modern-item" key={certification.title}>
                  <div className="certifications-modern-icon">
                    <i className="fa-solid fa-award" />
                  </div>
                  <div className="certifications-modern-content">
                    <h3>{certification.title}</h3>
                    <p>
                      {certification.provider} • {certification.year}
                    </p>
                  </div>
                  <a
                    href={certification.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ver ${certification.title}`}
                  >
                    Ver
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="portfolio" className="portfolio-modern">
          <div className="contenedor-seccion">
            <h2>Portfolio</h2>
            <p className="portfolio-modern-subtitle">
              Proyectos orientados a análisis de datos y desarrollo web con foco en impacto real.
            </p>

            <div className="portfolio-modern-filters">
              {projectCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={activeCategory === category.id ? "is-active" : ""}
                >
                  <i className={category.icon} />
                  {category.label}
                </button>
              ))}
            </div>

            <div className="portfolio-modern-grid">
              {filteredProjects.map((project) => (
                <article className="portfolio-modern-card" key={project.title}>
                  <div className="portfolio-modern-media">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      onError={handleProjectImageError}
                    />
                    <span className="portfolio-modern-badge">
                      {project.category === "powerbi" ? "Power BI" : "Web Development"}
                    </span>
                  </div>
                  <div className="portfolio-modern-content">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="portfolio-modern-tools">
                      {project.tools.map((tool) => (
                        <span key={`${project.title}-${tool}`}>{tool}</span>
                      ))}
                    </div>
                    <ul>
                      {project.highlights.map((highlight) => (
                        <li key={`${project.title}-${highlight}`}>{highlight}</li>
                      ))}
                    </ul>
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      Ver proyecto <i className="fa-solid fa-arrow-up-right-from-square" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contacto" className="contact-modern">
          <div className="contenedor-seccion">
            <h2>CONTACTO</h2>
            <p className="contact-modern-subtitle">
              Contame tu objetivo y te respondo con una propuesta clara para ayudarte con análisis, BI, reporting o automatización.
            </p>
            <div className="contact-atelier">
              <div className="contact-spotlight">
                <span className="contact-pill">Disponible para proyectos y propuestas laborales</span>
                <h3>Construyamos algo que tenga impacto real</h3>
                <p>
                  Si necesitás ordenar información, crear dashboards o mejorar el seguimiento de indicadores,
                  conversemos. Trabajo con foco en resultados, claridad y ejecución prolija.
                </p>

                <div className="contact-cards">
                  <a href="mailto:walterenzowohl@gmail.com" className="contact-card-link">
                    <i className="fa-solid fa-envelope" />
                    <div>
                      <small>Email</small>
                      <strong>walterenzowohl@gmail.com</strong>
                    </div>
                  </a>
                  <a href="tel:+541141419407" className="contact-card-link">
                    <i className="fa-solid fa-phone" />
                    <div>
                      <small>Teléfono</small>
                      <strong>+54 11 4141 9407</strong>
                    </div>
                  </a>
                </div>

                <div className="contact-modern-socials">
                  <a
                    href="https://github.com/WalterEnzoWohl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub de Walter Enzo Wohl"
                  >
                    <i className="fa-brands fa-github" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/walterenzowohl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn de Walter Enzo Wohl"
                  >
                    <i className="fa-brands fa-linkedin" />
                    <span>LinkedIn</span>
                  </a>
                </div>

                <div className="contact-modern-info">
                  <ul>
                    <li>
                      <i className="fa-solid fa-location-dot" /> GBA | Buenos Aires | Argentina
                    </li>
                    <li>
                      <i className="fa-solid fa-clock" /> Respuesta habitual: dentro de 24 horas
                    </li>
                  </ul>
                </div>
              </div>

              <div className="contact-modern-form-wrap">
                <form id="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <label className="form-label" htmlFor="name">Nombre</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Tu nombre"
                    {...register("name", { required: "El nombre es obligatorio." })}
                  />
                  {errors.name ? <small className="error-message">{errors.name.message}</small> : null}

                  <label className="form-label" htmlFor="phonenumber">Teléfono</label>
                  <input
                    type="text"
                    id="phonenumber"
                    placeholder="Número de teléfono"
                    inputMode="numeric"
                    {...register("phonenumber", {
                      required: "El teléfono es obligatorio.",
                      pattern: {
                        value: /^[0-9+\s()-]+$/,
                        message: "Ingresá un teléfono válido."
                      }
                    })}
                  />
                  {errors.phonenumber ? <small className="error-message">{errors.phonenumber.message}</small> : null}

                  <label className="form-label" htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Dirección de correo"
                    {...register("email", {
                      required: "El email es obligatorio.",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Ingresá un email válido."
                      }
                    })}
                  />
                  {errors.email ? <small className="error-message">{errors.email.message}</small> : null}

                  <label className="form-label" htmlFor="title">Asunto</label>
                  <input
                    type="text"
                    id="title"
                    placeholder="Asunto"
                    {...register("title", { required: "El asunto es obligatorio." })}
                  />
                  {errors.title ? <small className="error-message">{errors.title.message}</small> : null}

                  <label className="form-label" htmlFor="message">Mensaje</label>
                  <textarea
                    id="message"
                    cols={30}
                    rows={8}
                    placeholder="Mensaje"
                    {...register("message", { required: "El mensaje es obligatorio." })}
                  />
                  {errors.message ? <small className="error-message">{errors.message.message}</small> : null}

                  <button type="submit" id="button" disabled={isSending}>
                    {isSending ? "Enviando..." : "Enviar mensaje"}
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
        <a href="#home" className="arriba">
          <i className="fa-solid fa-angles-up" />
        </a>
        <div className="redes">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/in/walterenzowohl"
            aria-label="LinkedIn de Walter Enzo Wohl"
          >
            <i className="fa-brands fa-linkedin" />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/WalterEnzoWohl"
            aria-label="GitHub de Walter Enzo Wohl"
          >
            <i className="fa-brands fa-github" />
          </a>
        </div>
        <p className="copyright">&copy; {new Date().getFullYear()} Walter Enzo Wohl. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}

export default App;

