import { useState, type CSSProperties } from "react";
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
  onOpen?: () => void;
  openLabel?: string;
};

function ProjectCapture({
  projectNumber,
  capture,
  alt,
  className = "",
  fit = "cover",
  loading = "lazy",
  pendingLabel = "Captura pendiente",
  onOpen,
  openLabel = "Ampliar captura"
}: ProjectCaptureProps) {
  const [failed, setFailed] = useState(false);
  const [naturalRatio, setNaturalRatio] = useState<number>();
  const code = getProjectCaptureCode(projectNumber, capture);
  const source = getProjectCapture(projectNumber, capture);
  const isPending = !source || failed;
  const captureStyle = naturalRatio
    ? ({ "--project-capture-ratio": naturalRatio } as CSSProperties)
    : undefined;

  const classNames = `project-capture project-capture--${fit}${isPending ? " is-pending" : ""}${onOpen ? " is-interactive" : ""}${className ? ` ${className}` : ""}`;
  const content = (
    <>
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
          onLoad={(event) => {
            const image = event.currentTarget;
            if (image.naturalWidth && image.naturalHeight) {
              setNaturalRatio(image.naturalWidth / image.naturalHeight);
            }
          }}
          onError={() => setFailed(true)}
        />
      )}
      {onOpen ? <span className="project-capture-expand" aria-hidden="true"><i className="fa-solid fa-up-right-and-down-left-from-center" /></span> : null}
    </>
  );

  if (onOpen) {
    return (
      <button
        type="button"
        className={classNames}
        data-capture-code={code}
        style={captureStyle}
        onClick={onOpen}
        aria-label={openLabel}
      >
        {content}
      </button>
    );
  }

  return <div className={classNames} data-capture-code={code} style={captureStyle}>{content}</div>;
}

export default ProjectCapture;
