import { useEffect, useMemo, useRef, useState, type SyntheticEvent } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { interactiveMotion, staggerContainer, staggerItem } from "../animations/motion";
import type { Language } from "../config/navigation";
import { useMediaQuery } from "../hooks/useMediaQuery";

export type ProjectGalleryCategory = "data" | "web" | "automation";
export type ProjectSortOrder = "recent" | "alphabetical-asc" | "alphabetical-desc";

type LocalizedText = Record<Language, string>;

export type ProjectGalleryItem = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  image: string;
  imageAlt: LocalizedText;
  tools: string[];
  galleryCategories: ProjectGalleryCategory[];
  caseStudySlug?: string;
  caseStudyPath?: string;
  order: number;
};

export type ProjectsGalleryCopy = {
  title: string;
  subtitle: string;
  published: string;
  searchLabel: string;
  searchPlaceholder: string;
  clearSearch: string;
  filtersLabel: string;
  filters: Record<"all" | ProjectGalleryCategory, string>;
  sortLabel: string;
  sortOptions: Record<ProjectSortOrder, string>;
  viewCaseStudy: string;
  comingSoon: string;
  empty: string;
  clearFilters: string;
};

type ActiveFilter = "all" | ProjectGalleryCategory;

const filterIcons: Record<ActiveFilter, string> = {
  all: "fa-solid fa-layer-group",
  data: "fa-solid fa-chart-simple",
  web: "fa-solid fa-code",
  automation: "fa-solid fa-bolt"
};

function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function ProjectCard({
  project,
  language,
  copy,
  index,
  onImageError
}: {
  project: ProjectGalleryItem;
  language: Language;
  copy: ProjectsGalleryCopy;
  index: number;
  onImageError: (event: SyntheticEvent<HTMLImageElement>) => void;
}) {
  const visibleTools = project.tools.slice(0, 3);
  const hiddenTools = Math.max(project.tools.length - visibleTools.length, 0);
  const category = copy.filters[project.galleryCategories[0]];

  return (
    <motion.article
      layout
      className="project-gallery-card"
      variants={staggerItem}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: 8, transition: { duration: 0.16 } }}
      whileHover={interactiveMotion.hover}
      whileTap={interactiveMotion.tap}
      transition={{ layout: { duration: 0.22 }, ...interactiveMotion.transition }}
    >
      {project.caseStudyPath ? (
        <Link className="project-gallery-card-link" to={project.caseStudyPath} aria-label={`${copy.viewCaseStudy}: ${project.title[language]}`}>
          <span className="project-gallery-media">
            <img
              src={project.image}
              alt={project.imageAlt[language]}
              loading={index < 3 ? "eager" : "lazy"}
              decoding="async"
              width="960"
              height="540"
              onError={onImageError}
            />
            <span className="project-gallery-category">{category}</span>
          </span>
          <span className="project-gallery-content">
            <strong className="project-gallery-title">{project.title[language]}</strong>
            <span className="project-gallery-description">{project.description[language]}</span>
            <span className="project-gallery-tools">
              {visibleTools.map((tool) => <span key={tool}>{tool}</span>)}
              {hiddenTools > 0 ? <span aria-label={`${hiddenTools} ${language === "es" ? "tecnologías adicionales" : "additional technologies"}`}>+{hiddenTools}</span> : null}
            </span>
            <span className="project-gallery-action">{copy.viewCaseStudy}<i className="fa-solid fa-arrow-right" aria-hidden="true" /></span>
          </span>
        </Link>
      ) : (
        <div className="project-gallery-card-link is-disabled" aria-disabled="true">
          <span className="project-gallery-media"><img src={project.image} alt={project.imageAlt[language]} loading="lazy" decoding="async" width="960" height="540" onError={onImageError} /><span className="project-gallery-category">{category}</span></span>
          <span className="project-gallery-content"><strong className="project-gallery-title">{project.title[language]}</strong><span className="project-gallery-description">{project.description[language]}</span><span className="project-gallery-action">{copy.comingSoon}</span></span>
        </div>
      )}
    </motion.article>
  );
}

function EmptyProjectsState({ copy, onReset }: { copy: ProjectsGalleryCopy; onReset: () => void }) {
  return (
    <motion.div className="projects-empty-state" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} role="status">
      <i className="fa-regular fa-folder-open" aria-hidden="true" />
      <p>{copy.empty}</p>
      <button type="button" onClick={onReset}>{copy.clearFilters}</button>
    </motion.div>
  );
}

function ProjectsToolbar({
  language,
  copy,
  query,
  filter,
  sortOrder,
  availableFilters,
  onQueryChange,
  onFilterChange,
  onSortChange
}: {
  language: Language;
  copy: ProjectsGalleryCopy;
  query: string;
  filter: ActiveFilter;
  sortOrder: ProjectSortOrder;
  availableFilters: ActiveFilter[];
  onQueryChange: (value: string) => void;
  onFilterChange: (value: ActiveFilter) => void;
  onSortChange: (value: ProjectSortOrder) => void;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const filterSheetRef = useRef<HTMLElement>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    if (!isMobile) setFiltersOpen(false);
  }, [isMobile]);

  useEffect(() => {
    if (!filtersOpen) return;

    const backgroundRegions = [
      document.querySelector<HTMLElement>(".dashboard-workspace"),
      document.querySelector<HTMLElement>(".mobile-bottom-navigation")
    ].filter((element): element is HTMLElement => Boolean(element));
    const previousInert = backgroundRegions.map((element) => element.inert);
    backgroundRegions.forEach((element) => { element.inert = true; });
    document.body.classList.add("mobile-project-filters-open");

    const frame = window.requestAnimationFrame(() => {
      filterSheetRef.current?.querySelector<HTMLButtonElement>(".is-active")?.focus();
    });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setFiltersOpen(false);
        return;
      }
      if (event.key !== "Tab" || !filterSheetRef.current) return;
      const focusable = Array.from(filterSheetRef.current.querySelectorAll<HTMLButtonElement>('button:not([disabled])'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("mobile-project-filters-open");
      backgroundRegions.forEach((element, index) => { element.inert = previousInert[index]; });
      filterTriggerRef.current?.focus();
    };
  }, [filtersOpen]);

  return (
    <div className="projects-toolbar">
      <div className="projects-search">
        <label htmlFor="projects-search-input">{copy.searchLabel}</label>
        <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
        <input id="projects-search-input" type="search" value={query} placeholder={copy.searchPlaceholder} onChange={(event) => onQueryChange(event.target.value)} />
        {query ? <button type="button" onClick={() => onQueryChange("")} aria-label={copy.clearSearch}><i className="fa-solid fa-xmark" aria-hidden="true" /></button> : null}
      </div>

      <div className="projects-filter-list" role="group" aria-label={copy.filtersLabel}>
        {availableFilters.map((item) => (
          <button key={item} type="button" className={filter === item ? "is-active" : ""} aria-pressed={filter === item} onClick={() => onFilterChange(item)}>
            <i className={filterIcons[item]} aria-hidden="true" />{copy.filters[item]}
          </button>
        ))}
      </div>

      <button
        ref={filterTriggerRef}
        type="button"
        className={`projects-mobile-filter-trigger${filter !== "all" ? " has-active-filter" : ""}`}
        aria-haspopup="dialog"
        aria-expanded={filtersOpen}
        onClick={() => setFiltersOpen(true)}
      >
        <i className="fa-solid fa-filter" aria-hidden="true" />
        <span>{language === "es" ? "Filtrar" : "Filter"}</span>
        {filter !== "all" ? <i className="projects-filter-indicator" aria-hidden="true" /> : null}
      </button>

      <div className="projects-sort">
        <label htmlFor="projects-sort-select">{copy.sortLabel}</label>
        <select id="projects-sort-select" value={sortOrder} onChange={(event) => onSortChange(event.target.value as ProjectSortOrder)}>
          <option value="recent">{copy.sortOptions.recent}</option>
          <option value="alphabetical-asc">{copy.sortOptions["alphabetical-asc"]}</option>
          <option value="alphabetical-desc">{copy.sortOptions["alphabetical-desc"]}</option>
        </select>
        <i className="fa-solid fa-chevron-down" aria-hidden="true" />
      </div>

      {createPortal(
        <AnimatePresence>
          {filtersOpen ? (
            <div className="projects-mobile-filter-layer">
              <motion.button
                type="button"
                className="projects-mobile-filter-backdrop"
                aria-label={language === "es" ? "Cerrar filtros" : "Close filters"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => setFiltersOpen(false)}
              />
              <motion.aside
                ref={filterSheetRef}
                className="projects-mobile-filter-sheet"
                role="dialog"
                aria-modal="true"
                aria-labelledby="projects-mobile-filter-title"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="projects-mobile-filter-handle" aria-hidden="true" />
                <header>
                  <h2 id="projects-mobile-filter-title">{copy.filtersLabel}</h2>
                  <button type="button" onClick={() => setFiltersOpen(false)} aria-label={language === "es" ? "Cerrar filtros" : "Close filters"}>
                    <i className="fa-solid fa-xmark" aria-hidden="true" />
                  </button>
                </header>
                <div className="projects-mobile-filter-options" role="group" aria-label={copy.filtersLabel}>
                  {availableFilters.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={filter === item ? "is-active" : ""}
                      aria-pressed={filter === item}
                      onClick={() => {
                        onFilterChange(item);
                        setFiltersOpen(false);
                      }}
                    >
                      <i className={filterIcons[item]} aria-hidden="true" />
                      <span>{copy.filters[item]}</span>
                      {filter === item ? <i className="fa-solid fa-check" aria-hidden="true" /> : null}
                    </button>
                  ))}
                </div>
              </motion.aside>
            </div>
          ) : null}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

function ProjectsGallery({ language, projects, copy, onImageError }: { language: Language; projects: ProjectGalleryItem[]; copy: ProjectsGalleryCopy; onImageError: (event: SyntheticEvent<HTMLImageElement>) => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ActiveFilter>("all");
  const [sortOrder, setSortOrder] = useState<ProjectSortOrder>("recent");
  const availableFilters = useMemo<ActiveFilter[]>(() => {
    const categories = new Set(projects.flatMap((project) => project.galleryCategories));
    const filterOrder: ActiveFilter[] = ["all", "data", "web", "automation"];
    return filterOrder.filter((item) => item === "all" || categories.has(item));
  }, [projects]);

  const visibleProjects = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);
    const filtered = projects.filter((project) => {
      const matchesFilter = filter === "all" || project.galleryCategories.includes(filter);
      const categoryText = project.galleryCategories.map((category) => copy.filters[category]).join(" ");
      const searchable = normalizeSearch([project.title[language], project.description[language], categoryText, ...project.tools].join(" "));
      return matchesFilter && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
    return [...filtered].sort((a, b) => {
      if (sortOrder === "recent") return a.order - b.order;

      const titleComparison = a.title[language].localeCompare(b.title[language], language, {
        sensitivity: "base"
      });
      return sortOrder === "alphabetical-asc" ? titleComparison : -titleComparison;
    });
  }, [copy.filters, filter, language, projects, query, sortOrder]);

  const reset = () => { setQuery(""); setFilter("all"); setSortOrder("recent"); };

  return (
    <MotionConfig reducedMotion="user">
      <section id="portfolio" className="projects-gallery-section" aria-labelledby="projects-title">
        <div className="projects-gallery-shell">
          <header className="projects-page-header">
            <div><h2 id="projects-title">{copy.title}</h2></div>
            <aside className="projects-count" aria-label={`${copy.published}: ${projects.length}`}><i className="fa-regular fa-folder" aria-hidden="true" /><span><small>{copy.published}</small><strong>{projects.length}</strong></span></aside>
          </header>

          <ProjectsToolbar language={language} copy={copy} query={query} filter={filter} sortOrder={sortOrder} availableFilters={availableFilters} onQueryChange={setQuery} onFilterChange={setFilter} onSortChange={setSortOrder} />

          <motion.div className="projects-gallery-grid" variants={staggerContainer} initial="hidden" animate="visible" aria-live="polite">
            <AnimatePresence mode="popLayout">
              {visibleProjects.map((project, index) => <ProjectCard key={project.id} project={project} language={language} copy={copy} index={index} onImageError={onImageError} />)}
            </AnimatePresence>
          </motion.div>
          {!visibleProjects.length ? <EmptyProjectsState copy={copy} onReset={reset} /> : null}
        </div>
      </section>
    </MotionConfig>
  );
}

export default ProjectsGallery;
