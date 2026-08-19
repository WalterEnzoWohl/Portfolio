import type { ComponentType, SVGAttributes } from "react";
import { motion } from "motion/react";
import {
  SiCss,
  SiGoogleappsscript,
  SiGooglesheets,
  SiHtml5,
  SiJavascript,
  SiLooker,
  SiN8N,
  SiNodedotjs,
  SiPandas,
  SiPython,
  SiReact
} from "react-icons/si";
import { PiMicrosoftExcelLogo } from "react-icons/pi";
import { TbBrandGoogleBigQuery, TbChartInfographic, TbDatabase, TbTransform } from "react-icons/tb";
import { interactiveMotion, staggerItem } from "../animations/motion";
import type { Language } from "../config/navigation";
import type { TechnologyIconKey, WorkArea, WorkAreaTechnology } from "../data/workAreas";

type TechnologyIcon = ComponentType<SVGAttributes<SVGElement> & { size?: string | number }>;

const technologyIcons: Record<Exclude<TechnologyIconKey, "htmlcss">, TechnologyIcon> = {
  sql: TbDatabase,
  python: SiPython,
  excel: PiMicrosoftExcelLogo,
  powerbi: TbChartInfographic,
  looker: SiLooker,
  sheets: SiGooglesheets,
  pandas: SiPandas,
  powerquery: TbTransform,
  bigquery: TbBrandGoogleBigQuery,
  javascript: SiJavascript,
  react: SiReact,
  appsscript: SiGoogleappsscript,
  n8n: SiN8N,
  nodejs: SiNodedotjs
};

type TechnologyItemProps = {
  technology: WorkAreaTechnology;
};

export function TechnologyItem({ technology }: TechnologyItemProps) {
  return (
    <span className="work-area-technology">
      <span className="work-area-technology-icon" aria-hidden="true">
        {technology.icon === "htmlcss" ? (
          <span className="work-area-combined-icon"><SiHtml5 /><SiCss /></span>
        ) : (() => {
          const Icon = technologyIcons[technology.icon];
          return <Icon />;
        })()}
      </span>
      <span className="work-area-technology-name">{technology.name}</span>
    </span>
  );
}

type WorkAreaCardProps = {
  area: WorkArea;
  language: Language;
  onOpen: (trigger: HTMLButtonElement) => void;
  standalone?: boolean;
};

function WorkAreaCard({ area, language, onOpen, standalone = false }: WorkAreaCardProps) {
  const accessibleLabel = language === "es" ? `Abrir área ${area.title.es}` : `Open ${area.title.en} area`;

  return (
    <motion.button
      type="button"
      className="overview-area-card"
      variants={staggerItem}
      initial={standalone ? "visible" : undefined}
      animate={standalone ? "visible" : undefined}
      whileHover={interactiveMotion.hover}
      whileTap={interactiveMotion.tap}
      transition={interactiveMotion.transition}
      onClick={(event) => onOpen(event.currentTarget)}
      aria-haspopup="dialog"
      aria-label={accessibleLabel}
    >
      <span className="work-area-card-heading">
        <span className="overview-area-icon"><i className={area.icon} aria-hidden="true" /></span>
        <strong>{area.title[language]}</strong>
      </span>
      <span className="work-area-technologies">
        {area.technologies.map((technology) => <TechnologyItem key={technology.name} technology={technology} />)}
      </span>
      <i className="work-area-arrow fa-solid fa-arrow-right" aria-hidden="true" />
    </motion.button>
  );
}

export default WorkAreaCard;
