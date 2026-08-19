import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import wohlLogo from "../assets/branding/wohl-logo.svg";
import Breadcrumb from "./Breadcrumb";
import MobileNavigation from "./MobileNavigation";
import {
  getNavigationSectionFromLocation,
  getNavigationItem,
  navigationItems,
  type Language,
  type NavigationSectionId
} from "../config/navigation";

type Theme = "dark" | "light";

type DashboardLayoutProps = {
  children: ReactNode;
  language: Language;
  theme: Theme;
  themeToggleRef: RefObject<HTMLButtonElement | null>;
  themeToggleLabel: string;
  onThemeToggle: () => void;
  onLanguageChange: (language: Language) => void;
  breadcrumbDetails?: Array<{ label: string; href?: string }>;
};

const layoutCopy = {
  es: {
    role: "Analista de Datos · Automatización · Desarrollo Web",
    navigation: "Navegación principal",
    openMenu: "Abrir navegación",
    closeMenu: "Cerrar navegación",
    download: "Descargar CV",
    availability: "Disponible para propuestas"
  },
  en: {
    role: "Data Analyst · Automation · Web Development",
    navigation: "Main navigation",
    openMenu: "Open navigation",
    closeMenu: "Close navigation",
    download: "Download CV",
    availability: "Open to opportunities"
  }
} as const;

function DashboardLayout({
  children,
  language,
  theme,
  themeToggleRef,
  themeToggleLabel,
  onThemeToggle,
  onLanguageChange,
  breadcrumbDetails = []
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const syncedHashRef = useRef(location.hash);
  const pendingSectionRef = useRef<NavigationSectionId | null>(null);
  const copy = layoutCopy[language];
  const displayedSection = getNavigationSectionFromLocation(location.pathname, location.hash);

  useEffect(() => {
    document.body.classList.toggle("dashboard-menu-open", isSidebarOpen);

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSidebarOpen(false);
    };

    if (isSidebarOpen) window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.classList.remove("dashboard-menu-open");
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    if (location.pathname !== "/") return;

    const sections = navigationItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    let frame = 0;
    const updateActiveSection = () => {
      const activationLine = Math.max(84, window.innerHeight * 0.22);
      const current = sections.reduce<HTMLElement | null>((selected, section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= activationLine && rect.bottom > activationLine ? section : selected;
      }, null);

      if (!current) return;

      if (pendingSectionRef.current) {
        if (current.id !== pendingSectionRef.current) return;
        pendingSectionRef.current = null;
      }

      const nextHash = `#${current.id}`;
      if (syncedHashRef.current === nextHash) return;

      syncedHashRef.current = nextHash;
      void navigate(
        { pathname: "/", hash: nextHash },
        { replace: true, state: { fromScrollSpy: true }, preventScrollReset: true }
      );
    };
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveSection);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [location.pathname, navigate]);

  useEffect(() => {
    syncedHashRef.current = location.hash;
  }, [location.hash]);

  const displayedNavigationItem = getNavigationItem(displayedSection);

  const closeSidebar = () => setIsSidebarOpen(false);
  const handleSectionActivation = (section: NavigationSectionId) => {
    pendingSectionRef.current = section;
    closeSidebar();
    if (section === "home" && location.pathname === "/" && (location.hash === "#home" || location.hash === "")) {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? "auto" : "smooth" });
      });
    }
  };

  return (
    <div className="dashboard-app">
      <button
        type="button"
        className={`dashboard-sidebar-backdrop ${isSidebarOpen ? "is-visible" : ""}`}
        aria-label={copy.closeMenu}
        tabIndex={isSidebarOpen ? 0 : -1}
        onClick={closeSidebar}
      />

      <aside id="portfolio-sidebar" className={`dashboard-sidebar ${isSidebarOpen ? "is-open" : ""}`} aria-label={copy.navigation}>
        <button type="button" className="dashboard-sidebar-close" onClick={closeSidebar} aria-label={copy.closeMenu}>
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>

        <Link className="dashboard-brand" to={{ pathname: "/", hash: "#home" }} onClick={() => handleSectionActivation("home")} aria-label="Ir al resumen">
          <span className="dashboard-brand-mark">
            <img src={wohlLogo} alt="Logo de Walter Enzo Wohl" width="74" height="88" />
          </span>
          <span className="dashboard-brand-name">Enzo Wohl</span>
          <span className="dashboard-brand-role">{copy.role}</span>
        </Link>

        <nav className="dashboard-nav">
          <ul>
            {navigationItems.map((item) => {
              const isActive = item.id === displayedSection;
              return (
                <li key={item.id}>
                  <Link
                    className={isActive ? "is-active" : ""}
                    to={{ pathname: "/", hash: item.href }}
                    onClick={() => handleSectionActivation(item.id)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {isActive ? (
                      <motion.span
                        className="dashboard-nav-active-indicator"
                        layoutId="dashboard-nav-active-indicator"
                        transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
                      />
                    ) : null}
                    <i className={item.icon} aria-hidden="true" />
                    <span>{item.label[language]}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="dashboard-sidebar-footer">
          <a className="dashboard-cv-link" href="/img/Walter Enzo Wohl CV.pdf" download="WalterEnzoWohl.pdf">
            <i className="fa-solid fa-download" aria-hidden="true" />
            <span>{copy.download}</span>
          </a>
          <p className="dashboard-availability">
            <span aria-hidden="true" />
            {copy.availability}
          </p>
        </div>
      </aside>

      <div className="dashboard-workspace">
        <header className="dashboard-topbar">
          <div className="dashboard-mobile-heading">
            <Link to={{ pathname: "/", hash: "#home" }} onClick={() => handleSectionActivation("home")} aria-label="Ir al resumen">
              <img src={wohlLogo} alt="" width="38" height="44" />
            </Link>
            <strong>{displayedNavigationItem.label[language]}</strong>
          </div>

          <Breadcrumb activeSection={displayedSection} language={language} details={breadcrumbDetails} />

          <div className="dashboard-topbar-actions">
            <button
              type="button"
              className="dashboard-mobile-menu"
              aria-label={copy.openMenu}
              aria-controls="portfolio-sidebar"
              aria-expanded={isSidebarOpen}
              onClick={() => setIsSidebarOpen(true)}
            >
              <i className="fa-solid fa-bars" aria-hidden="true" />
            </button>

            <button
              ref={themeToggleRef}
              type="button"
              className="dashboard-theme-toggle"
              aria-label={themeToggleLabel}
              title={themeToggleLabel}
              onClick={onThemeToggle}
            >
              <i className={`fa-solid ${theme === "light" ? "fa-sun" : "fa-moon"}`} aria-hidden="true" />
            </button>

            <button
              type="button"
              className="dashboard-mobile-language-toggle"
              aria-label={language === "es" ? "Cambiar idioma a inglés" : "Switch language to Spanish"}
              onClick={() => onLanguageChange(language === "es" ? "en" : "es")}
            >
              <span key={language}>{language.toUpperCase()}</span>
            </button>

            <div className="dashboard-language-switch" role="group" aria-label={language === "es" ? "Cambiar idioma" : "Change language"}>
              <button type="button" className={language === "es" ? "is-active" : ""} onClick={() => onLanguageChange("es")}>ES</button>
              <span aria-hidden="true">·</span>
              <button type="button" className={language === "en" ? "is-active" : ""} onClick={() => onLanguageChange("en")}>EN</button>
            </div>
          </div>
        </header>

        {children}
      </div>

      <MobileNavigation
        activeSection={displayedSection}
        language={language}
        onSectionActivate={handleSectionActivation}
      />
    </div>
  );
}

export default DashboardLayout;
