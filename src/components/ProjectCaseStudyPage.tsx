import type { SyntheticEvent } from "react";
import { useParams } from "react-router-dom";
import type { Language } from "../config/navigation";
import { getDataCaseStudy } from "../data/projectCaseStudies";
import { getWebCaseStudy } from "../data/webCaseStudies";
import { getFitnessCaseStudy } from "../data/fitnessCaseStudy";
import { projects } from "../data/projects";
import ProjectCaseStudy from "./ProjectCaseStudy";
import WebProjectCaseStudy from "./WebProjectCaseStudy";
import FitnessProjectCaseStudy from "./FitnessProjectCaseStudy";

export default function ProjectCaseStudyPage({ language, onImageError }: {
  language: Language;
  onImageError: (event: SyntheticEvent<HTMLImageElement>) => void;
}) {
  const { slug } = useParams();
  const dataDetail = getDataCaseStudy(slug);
  const webDetail = getWebCaseStudy(slug);
  const fitnessDetail = getFitnessCaseStudy(slug);
  const projectId = dataDetail?.projectId ?? webDetail?.projectId ?? fitnessDetail?.projectId;
  const project = projects.find((item) => item.id === projectId);
  const shared = { project, projects, language, onImageError };

  if (fitnessDetail) return <FitnessProjectCaseStudy detail={fitnessDetail} {...shared} />;
  if (webDetail) return <WebProjectCaseStudy detail={webDetail} {...shared} />;
  return <ProjectCaseStudy detail={dataDetail} {...shared} />;
}
