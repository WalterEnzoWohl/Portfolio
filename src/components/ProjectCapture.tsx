import { useState, type CSSProperties } from "react";
import {
  getProjectCaptureImage,
  getProjectCaptureCode,
  type ProjectCaptureLetter
} from "../data/projectCaptures";
import FontIcon from "./FontIcon";

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
  fullResolution?: boolean;
  sizes?: string;
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
  openLabel = "Ampliar captura",
  fullResolution = false,
  sizes = "(max-width: 767px) calc(100vw - 48px), (max-width: 1024px) 65vw, 55vw"
}: ProjectCaptureProps) {
  const [failed, setFailed] = useState(false);
  const code = getProjectCaptureCode(projectNumber, capture);
  const image = getProjectCaptureImage(projectNumber, capture);
  const source = fullResolution ? image?.full : image?.src;
  const isPending = !source || failed;
  const captureStyle = image
    ? ({ "--project-capture-ratio": image.width / image.height } as CSSProperties)
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
          srcSet={fullResolution ? undefined : image?.srcSet}
          sizes={fullResolution ? undefined : sizes}
          width={image?.width}
          height={image?.height}
          alt={alt}
          draggable={false}
          loading={loading}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
      {onOpen ? <span className="project-capture-expand" aria-hidden="true"><FontIcon className="fa-solid fa-up-right-and-down-left-from-center" /></span> : null}
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
