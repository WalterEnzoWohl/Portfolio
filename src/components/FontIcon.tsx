import type { HTMLAttributes } from "react";
import type { IconType } from "react-icons";
import {
  FaAnglesUp,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUpRightFromSquare,
  FaArrowsToCircle,
  FaAward,
  FaBars,
  FaBezierCurve,
  FaBolt,
  FaBriefcase,
  FaBullseye,
  FaChartColumn,
  FaChartPie,
  FaChartSimple,
  FaCheck,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaCircleCheck,
  FaCode,
  FaCodeBranch,
  FaDatabase,
  FaDiagramProject,
  FaDownload,
  FaFilter,
  FaFolderTree,
  FaGears,
  FaGithub,
  FaHouse,
  FaLayerGroup,
  FaLinkSlash,
  FaLinkedin,
  FaMagnifyingGlass,
  FaMoon,
  FaRegCircleCheck,
  FaRegEnvelope,
  FaRegFileLines,
  FaRegFolder,
  FaRegFolderOpen,
  FaRegStar,
  FaRegUser,
  FaRegWindowMaximize,
  FaScrewdriverWrench,
  FaSun,
  FaTriangleExclamation,
  FaUpRightAndDownLeftFromCenter,
  FaWandMagicSparkles,
  FaXmark
} from "react-icons/fa6";

// Keep existing data keys and CSS selectors while shipping only the used SVGs.
const icons: Record<string, IconType> = {
  "fa-angles-up": FaAnglesUp,
  "fa-arrow-left": FaArrowLeft,
  "fa-arrow-right": FaArrowRight,
  "fa-arrow-up-right-from-square": FaArrowUpRightFromSquare,
  "fa-arrows-to-circle": FaArrowsToCircle,
  "fa-award": FaAward,
  "fa-bars": FaBars,
  "fa-bezier-curve": FaBezierCurve,
  "fa-bolt": FaBolt,
  "fa-briefcase": FaBriefcase,
  "fa-bullseye": FaBullseye,
  "fa-chart-column": FaChartColumn,
  "fa-chart-pie": FaChartPie,
  "fa-chart-simple": FaChartSimple,
  "fa-check": FaCheck,
  "fa-chevron-down": FaChevronDown,
  "fa-chevron-left": FaChevronLeft,
  "fa-chevron-right": FaChevronRight,
  "fa-circle-check": FaCircleCheck,
  "fa-code": FaCode,
  "fa-code-branch": FaCodeBranch,
  "fa-database": FaDatabase,
  "fa-diagram-project": FaDiagramProject,
  "fa-download": FaDownload,
  "fa-envelope": FaRegEnvelope,
  "fa-file-lines": FaRegFileLines,
  "fa-filter": FaFilter,
  "fa-folder": FaRegFolder,
  "fa-folder-open": FaRegFolderOpen,
  "fa-folder-tree": FaFolderTree,
  "fa-gears": FaGears,
  "fa-github": FaGithub,
  "fa-house": FaHouse,
  "fa-layer-group": FaLayerGroup,
  "fa-link-slash": FaLinkSlash,
  "fa-linkedin": FaLinkedin,
  "fa-magnifying-glass": FaMagnifyingGlass,
  "fa-moon": FaMoon,
  "fa-screwdriver-wrench": FaScrewdriverWrench,
  "fa-star": FaRegStar,
  "fa-sun": FaSun,
  "fa-triangle-exclamation": FaTriangleExclamation,
  "fa-up-right-and-down-left-from-center": FaUpRightAndDownLeftFromCenter,
  "fa-user": FaRegUser,
  "fa-wand-magic-sparkles": FaWandMagicSparkles,
  "fa-window-maximize": FaRegWindowMaximize,
  "fa-xmark": FaXmark
};

type FontIconProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  className: string;
};

function FontIcon({ className, style, ...props }: FontIconProps) {
  const classes = className.split(/\s+/);
  const name = classes.find((value) => Object.hasOwn(icons, value));
  if (!name) return null;

  const Icon = name === "fa-circle-check" && classes.includes("fa-regular")
    ? FaRegCircleCheck
    : icons[name];

  return (
    <i
      aria-hidden="true"
      {...props}
      className={className}
      style={{ display: "inline-block", width: "1.25em", fontStyle: "normal", lineHeight: 1, textAlign: "center", ...style }}
    >
      <Icon aria-hidden="true" focusable="false" style={{ display: "inline-block", verticalAlign: "-0.125em" }} />
    </i>
  );
}

export default FontIcon;
