import { useEffect, useState, type ReactNode, type RefObject } from "react";
import { Link } from "react-router-dom";
import wohlLogo from "../../wohl_logo_black.svg";
import Breadcrumb from "./Breadcrumb";
import MobileNavigation from "./MobileNavigation";
import {
  defaultNavigationSection,
  getNavigationItem,
  isNavigationSection,
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
  activeSectionOverride?: NavigationSectionId;
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

function getInitialSection(): NavigationSectionId {
  const hash = window.location.hash.replace("#", "");
  return isNavigationSection(hash) ? hash : defaultNavigationSection;
}

function DashboardLayout({
  children,
  language,
  theme,
  themeToggleRef,
  themeToggleLabel,
  onThemeToggle,
  onLanguageChange,
  activeSectionOverride,
  breadcrumbDetails = []
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavigationSectionId>(getInitialSection);
  const copy = layoutCopy[language];

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
    if (activeSectionOverride) {
      setActiveSection(activeSectionOverride);
      return;
    }

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

      if (current && isNavigationSection(current.id)) setActiveSection(current.id);
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
  }, [activeSectionOverride]);

  const displayedSection = activeSectionOverride ?? activeSection;
  const displayedNavigationItem = getNavigationItem(displayedSection);

  const closeSidebar = () => setIsSidebarOpen(false);
  const selectSection = (section: NavigationSectionId) => {
    setActiveSection(section);
    closeSidebar();
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

        <Link className="dashboard-brand" to={{ pathname: "/", hash: "#home" }} onClick={() => selectSection("home")}>
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
                    onClick={() => selectSection(item.id)}
                    aria-current={isActive ? "page" : undefined}
                  >
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
            <Link to={{ pathname: "/", hash: "#home" }} onClick={() => selectSection("home")} aria-label={navigationItems[0].label[language]}>
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
      />
    </div>
  );
}

export default DashboardLayout;
