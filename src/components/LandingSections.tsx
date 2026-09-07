import type { SyntheticEvent } from "react";
import type { Language } from "../config/navigation";
import { projects } from "../data/projects";
import ProjectsGallery, { type ProjectsGalleryCopy } from "./ProjectsGallery";
import ExperienceSection from "./ExperienceSection";
import CertificationsSection from "./CertificationsSection";
import ContactSection from "./ContactSection";

export default function LandingSections({ language, copy, onImageError }: {
  language: Language;
  copy: ProjectsGalleryCopy;
  onImageError: (event: SyntheticEvent<HTMLImageElement>) => void;
}) {
  return <>
    <ProjectsGallery language={language} projects={projects} copy={copy} onImageError={onImageError} />
    <ExperienceSection language={language} />
    <CertificationsSection language={language} />
    <ContactSection language={language} />
  </>;
}
