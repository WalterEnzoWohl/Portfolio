import { MotionConfig, motion, useReducedMotion, type Variants } from "motion/react";
import type { IconType } from "react-icons";
import {
  TbArrowRight,
  TbBrandCss3,
  TbBrandHtml5,
  TbBrandJavascript,
  TbBrandPython,
  TbBrandReact,
  TbBrandUbuntu,
  TbCalendar,
  TbChartDots3,
  TbChartHistogram,
  TbChartLine,
  TbChartPie,
  TbCheck,
  TbCodeCircle2,
  TbDatabase,
  TbDeviceDesktopAnalytics,
  TbDownload,
  TbFileSpreadsheet,
  TbTool,
  TbTransform
} from "react-icons/tb";
import type { Language } from "../config/navigation";
import {
  experienceSectionCopy,
  professionalExperiences,
  type ContributionIconKey,
  type ExperienceContribution,
  type ExperienceTechnology,
  type ProfessionalExperience,
  type TechnologyIconKey
} from "../data/experience";

type ExperienceSectionProps = {
  language: Language;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

const contributionIcons: Record<ContributionIconKey, IconType> = {
  analysis: TbChartLine,
  visualization: TbChartPie,
  tools: TbTool
};

const technologyIcons: Record<TechnologyIconKey, IconType> = {
  python: TbBrandPython,
  pandas: TbChartDots3,
  sql: TbDatabase,
  looker: TbDeviceDesktopAnalytics,
  sheets: TbFileSpreadsheet,
  "apps-script": TbCodeCircle2,
  "power-bi": TbChartHistogram,
  excel: TbFileSpreadsheet,
  etl: TbTransform,
  react: TbBrandReact,
  javascript: TbBrandJavascript,
  html: TbBrandHtml5,
  css: TbBrandCss3,
  ubuntu: TbBrandUbuntu
};

const headerReveal: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeOut } }
};

const featuredCardReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOut, delayChildren: 0.08, staggerChildren: 0.07 }
  }
};

const historicalCardReveal: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (order: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.34,
      ease: easeOut,
      delay: order * 0.09,
      delayChildren: order * 0.09 + 0.04,
      staggerChildren: 0.04
    }
  })
};

const contentReveal: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: easeOut } }
};

const logoReveal: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.28, ease: easeOut } }
};

const markerReveal: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, delay: 0.08 } }
};

const lineDraw: Variants = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: 0.55, ease: easeOut } }
};

const contributionContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.085 } }
};

const contributionReveal: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: easeOut } }
};

const technologyContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } }
};

const technologyReveal: Variants = {
  hidden: { opacity: 0, x: -5 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: easeOut } }
};

function CompanyLogo({ experience, language }: { experience: ProfessionalExperience; language: Language }) {
  const logoClassName = [
    "experience-company-logo",
    experience.logo.image ? "experience-company-logo--image" : "",
    experience.logo.format ? `experience-company-logo--${experience.logo.format}` : ""
  ].filter(Boolean).join(" ");

  return (
    <motion.div className={logoClassName} variants={logoReveal}>
      {experience.logo.image ? (
        <img src={experience.logo.image} alt={experience.logo.alt[language]} width="112" height="76" decoding="async" />
      ) : (
        <span role="img" aria-label={experience.logo.alt[language]}>
          <span aria-hidden="true">{experience.logo.initials}</span>
        </span>
      )}
    </motion.div>
  );
}

function ExperienceMarker({ sequence }: { sequence: string }) {
  return (
    <div className="experience-marker" aria-hidden="true">
      <motion.span className="experience-marker-number" variants={markerReveal}>{sequence}</motion.span>
      <motion.span className="experience-marker-dot" variants={markerReveal} />
      <motion.span className="experience-marker-line" variants={lineDraw} />
    </div>
  );
}

function ContributionCard({ contribution, language }: { contribution: ExperienceContribution; language: Language }) {
  const Icon = contribution.icon ? contributionIcons[contribution.icon] : null;

  return (
    <motion.article className="experience-contribution" variants={contributionReveal}>
      {Icon ? <Icon aria-hidden="true" focusable="false" /> : null}
      <div>
        <h4>{contribution.title[language]}</h4>
        {contribution.description ? <p>{contribution.description[language]}</p> : null}
      </div>
    </motion.article>
  );
}

function TechnologyItem({ technology }: { technology: ExperienceTechnology }) {
  const Icon = technologyIcons[technology.icon];

  return (
    <motion.li variants={technologyReveal}>
      <Icon aria-hidden="true" focusable="false" />
      <span>{technology.name}</span>
    </motion.li>
  );
}

function ExperienceCard({
  experience,
  language,
  historicalOrder,
  reduceMotion
}: {
  experience: ProfessionalExperience;
  language: Language;
  historicalOrder: number;
  reduceMotion: boolean;
}) {
  const copy = experienceSectionCopy[language];
  const initial = reduceMotion ? false : "hidden";
  const animationProps = experience.featured
    ? { initial, whileInView: "visible" as const, viewport: { once: true, amount: 0.12 } }
    : { initial, whileInView: "visible" as const, viewport: { once: true, amount: 0.22 } };

  return (
    <motion.article
      className={`experience-card ${experience.featured ? "experience-card--featured" : "experience-card--historical"}`}
      custom={historicalOrder}
      variants={experience.featured ? featuredCardReveal : historicalCardReveal}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ duration: 0.2, ease: easeOut }}
      {...animationProps}
    >
      <ExperienceMarker sequence={experience.sequence} />

      <div className="experience-card-content">
        <motion.header className="experience-card-header" variants={contentReveal}>
          <CompanyLogo experience={experience} language={language} />
          <div className="experience-card-heading">
            <h3>{experience.role[language]}</h3>
            <strong>{experience.company[language]}</strong>
            <div className="experience-period">
              <TbCalendar aria-hidden="true" focusable="false" />
              <span>{experience.period[language]}</span>
              {experience.current ? <span className="experience-current-badge">{copy.current}</span> : null}
            </div>
          </div>
        </motion.header>

        <motion.p className="experience-description" variants={contentReveal}>{experience.description[language]}</motion.p>

        {experience.featured ? (
          <motion.div className="experience-contribution-grid" variants={contributionContainer}>
            {experience.contributions.map((contribution) => (
              <ContributionCard key={contribution.title.en} contribution={contribution} language={language} />
            ))}
          </motion.div>
        ) : (
          <motion.ul className="experience-contribution-list" variants={contributionContainer}>
            {experience.contributions.map((contribution) => (
              <motion.li key={contribution.title.en} variants={contributionReveal}>
                <TbCheck aria-hidden="true" focusable="false" />
                <span>{contribution.title[language]}</span>
              </motion.li>
            ))}
          </motion.ul>
        )}

        <motion.ul className="experience-technologies" aria-label={copy.technologyList} variants={technologyContainer}>
          {experience.technologies.map((technology) => (
            <TechnologyItem key={`${experience.id}-${technology.name}`} technology={technology} />
          ))}
        </motion.ul>

        {experience.relatedProjectsHref ? (
          <motion.a className="experience-related-link" href={experience.relatedProjectsHref} aria-label={copy.relatedProjectsAria} variants={contentReveal}>
            <span>{copy.relatedProjects}</span>
            <TbArrowRight aria-hidden="true" focusable="false" />
          </motion.a>
        ) : null}
      </div>
    </motion.article>
  );
}

function ExperienceSection({ language }: ExperienceSectionProps) {
  const copy = experienceSectionCopy[language];
  const reduceMotion = Boolean(useReducedMotion());
  const featuredExperience = professionalExperiences.find((experience) => experience.featured);
  const historicalExperiences = professionalExperiences.filter((experience) => !experience.featured);

  return (
    <MotionConfig reducedMotion="user">
      <section id="curriculum" className="experience-dashboard" aria-labelledby="experience-title">
        <div className="experience-dashboard-shell">
          <motion.header className="experience-dashboard-header" variants={headerReveal} initial={reduceMotion ? false : "hidden"} whileInView="visible" viewport={{ once: true, amount: 0.7 }}>
            <div>
              <h2 id="experience-title">{copy.title}</h2>
              <p>{copy.subtitle}</p>
            </div>
            <a className="experience-download" href="/img/Walter Enzo Wohl CV.pdf" download="WalterEnzoWohl.pdf">
              <span>{copy.downloadCv}</span>
              <TbDownload aria-hidden="true" focusable="false" />
            </a>
          </motion.header>

          {featuredExperience ? (
            <ExperienceCard experience={featuredExperience} language={language} historicalOrder={0} reduceMotion={reduceMotion} />
          ) : null}

          <div className="experience-history-grid">
            {historicalExperiences.map((experience, index) => (
              <ExperienceCard key={experience.id} experience={experience} language={language} historicalOrder={index} reduceMotion={reduceMotion} />
            ))}
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

export default ExperienceSection;
