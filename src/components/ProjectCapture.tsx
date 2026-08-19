import { useState } from "react";
import {
  getProjectCapture,
  getProjectCaptureCode,
  type ProjectCaptureLetter
} from "../data/projectCaptures";

type ProjectCaptureProps = {
  projectNumber: number;
  capture: ProjectCaptureLetter;
  alt: string;
  className?: string;
  fit?: "cover" | "contain";
  loading?: "eager" | "lazy";
  pendingLabel?: string;
};

function ProjectCapture({
  projectNumber,
  capture,
  alt,
  className = "",
  fit = "cover",
  loading = "lazy",
  pendingLabel = "Captura pendiente"
}: ProjectCaptureProps) {
  const [failed, setFailed] = useState(false);
  const code = getProjectCaptureCode(projectNumber, capture);
  const source = getProjectCapture(projectNumber, capture);
  const isPending = !source || failed;

  return (
    <div
      className={`project-capture project-capture--${fit}${isPending ? " is-pending" : ""}${className ? ` ${className}` : ""}`}
      data-capture-code={code}
    >
      {isPending ? (
        <div className="project-capture-placeholder" role="img" aria-label={`${alt}. ${pendingLabel} ${code}.`}>
          <strong>{code}</strong>
          <span>{pendingLabel}</span>
        </div>
      ) : (
        <img
          src={source}
          alt={alt}
          loading={loading}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export default ProjectCapture;
