export type Language = "es" | "en";

export type NavigationSectionId = "home" | "portfolio" | "curriculum" | "certifications" | "contacto";

export type NavigationItem = {
  id: NavigationSectionId;
  href: `#${NavigationSectionId}`;
  icon: string;
  label: Record<Language, string>;
};

export const navigationItems: NavigationItem[] = [
  { id: "home", href: "#home", icon: "fa-solid fa-house", label: { es: "Resumen", en: "Overview" } },
  { id: "portfolio", href: "#portfolio", icon: "fa-regular fa-folder", label: { es: "Proyectos", en: "Projects" } },
  { id: "curriculum", href: "#curriculum", icon: "fa-solid fa-code", label: { es: "Experiencia", en: "Experience" } },
  { id: "certifications", href: "#certifications", icon: "fa-solid fa-award", label: { es: "Certificaciones", en: "Certifications" } },
  { id: "contacto", href: "#contacto", icon: "fa-regular fa-envelope", label: { es: "Contacto", en: "Contact" } }
];

export const defaultNavigationSection: NavigationSectionId = "home";

export function isNavigationSection(value: string): value is NavigationSectionId {
  return navigationItems.some((item) => item.id === value);
}

export function getNavigationItem(id: NavigationSectionId) {
  return navigationItems.find((item) => item.id === id) ?? navigationItems[0];
}

export function getNavigationSectionFromLocation(pathname: string, hash: string): NavigationSectionId {
  if (pathname.startsWith("/proyectos")) return "portfolio";

  const section = hash.replace("#", "");
  return isNavigationSection(section) ? section : defaultNavigationSection;
}
