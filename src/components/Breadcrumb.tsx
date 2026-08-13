import { getNavigationItem, type Language, type NavigationSectionId } from "../config/navigation";
import { Link } from "react-router-dom";

export type BreadcrumbDetail = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  activeSection: NavigationSectionId;
  language: Language;
  details?: BreadcrumbDetail[];
};

function Breadcrumb({ activeSection, language, details = [] }: BreadcrumbProps) {
  const section = getNavigationItem(activeSection);
  const items: BreadcrumbDetail[] = [
    { label: "Portfolio", href: activeSection === "home" ? undefined : "/#home" },
    { label: section.label[language], href: details.length ? `/${section.href}` : undefined },
    ...details
  ];

  return (
    <nav className="dashboard-breadcrumb" aria-label={language === "es" ? "Ruta de navegación" : "Breadcrumb"}>
      <ol>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`}>
              {index > 0 ? <i className="fa-solid fa-chevron-right" aria-hidden="true" /> : null}
              {item.href && !isCurrent ? <Link to={item.href}>{item.label}</Link> : <span aria-current={isCurrent ? "page" : undefined}>{item.label}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
