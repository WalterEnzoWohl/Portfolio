import { getOptimizedImage } from "./optimizedImages";

export type ProjectCaptureLetter = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

export function getProjectCaptureImage(projectNumber: number, capture: ProjectCaptureLetter) {
  const code = getProjectCaptureCode(projectNumber, capture);
  return ["png", "jpg", "jpeg", "webp", "avif"]
    .map((extension) => getOptimizedImage(`proyectos/capturas/${code}.${extension}`))
    .find(Boolean);
}

export function getProjectCaptureCode(projectNumber: number, capture: ProjectCaptureLetter) {
  return `${projectNumber}${capture}`;
}

export function getProjectCapture(projectNumber: number, capture: ProjectCaptureLetter) {
  return getProjectCaptureImage(projectNumber, capture)?.full;
}

export function getProjectCaptureOrPlaceholder(projectNumber: number, capture: ProjectCaptureLetter) {
  const source = getProjectCapture(projectNumber, capture);
  if (source) return source;

  const code = getProjectCaptureCode(projectNumber, capture);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540"><rect width="960" height="540" fill="#081a29"/><rect x="2" y="2" width="956" height="536" rx="20" fill="none" stroke="#18c8b0" stroke-opacity=".5" stroke-width="4"/><text x="480" y="270" fill="#24d8c0" font-family="Arial,sans-serif" font-size="92" font-weight="700" text-anchor="middle" dominant-baseline="middle">${code}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function getRequiredProjectCapture(projectNumber: number, capture: ProjectCaptureLetter) {
  const code = getProjectCaptureCode(projectNumber, capture);
  const source = getProjectCapture(projectNumber, capture);

  if (!source) throw new Error(`Missing required project capture: ${code}`);
  return source;
}
