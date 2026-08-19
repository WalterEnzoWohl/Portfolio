import { type ComponentType, type SVGProps } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { TbAward, TbCode, TbFolder, TbHome, TbMail } from "react-icons/tb";
import type { Language, NavigationSectionId } from "../config/navigation";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type MobileNavigationProps = {
  activeSection: NavigationSectionId;
  language: Language;
  onSectionActivate: (section: NavigationSectionId) => void;
};

const copy = {
  es: {
    navigation: "Navegación móvil",
    home: "Inicio",
    projects: "Proyectos",
    experience: "Experiencia",
    contact: "Contacto",
    certifications: "Certificaciones"
  },
  en: {
    navigation: "Mobile navigation",
    home: "Home",
    projects: "Projects",
    experience: "Experience",
    contact: "Contact",
    certifications: "Certifications"
  }
} as const;

type NavigationActionProps = {
  href: `#${NavigationSectionId}`;
  section: NavigationSectionId;
  activeSection: NavigationSectionId;
  label: string;
  icon: IconComponent;
  onClick?: () => void;
};

function NavigationAction({ href, section, activeSection, label, icon: Icon, onClick }: NavigationActionProps) {
  const isActive = section === activeSection;

  return (
    <Link
      className={`mobile-bottom-action${isActive ? " is-active" : ""}`}
      to={{ pathname: "/", hash: href }}
      aria-current={isActive ? "page" : undefined}
      aria-label={label}
      onClick={onClick}
    >
      {isActive ? <motion.span className="mobile-bottom-active" layoutId="mobile-bottom-active" transition={{ duration: 0.2 }} /> : null}
      <Icon aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}

function MobileNavigation({ activeSection, language, onSectionActivate }: MobileNavigationProps) {
  const text = copy[language];

  return (
    <nav className="mobile-bottom-navigation" aria-label={text.navigation}>
      <NavigationAction href="#home" section="home" activeSection={activeSection} label={text.home} icon={TbHome} onClick={() => onSectionActivate("home")} />
      <NavigationAction href="#portfolio" section="portfolio" activeSection={activeSection} label={text.projects} icon={TbFolder} onClick={() => onSectionActivate("portfolio")} />
      <NavigationAction href="#curriculum" section="curriculum" activeSection={activeSection} label={text.experience} icon={TbCode} onClick={() => onSectionActivate("curriculum")} />
      <NavigationAction href="#contacto" section="contacto" activeSection={activeSection} label={text.contact} icon={TbMail} onClick={() => onSectionActivate("contacto")} />
      <NavigationAction href="#certifications" section="certifications" activeSection={activeSection} label={text.certifications} icon={TbAward} onClick={() => onSectionActivate("certifications")} />
    </nav>
  );
}

export default MobileNavigation;
