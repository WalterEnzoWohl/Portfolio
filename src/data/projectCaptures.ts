export type ProjectCaptureLetter = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

const captureModules = import.meta.glob(
  "../assets/proyectos/capturas/*.{png,jpg,jpeg,webp,avif}",
  { eager: true, import: "default" }
) as Record<string, string>;

const capturesByCode = new Map<string, string>();

Object.entries(captureModules).forEach(([path, source]) => {
  const filename = path.split("/").at(-1);
  const code = filename?.replace(/\.[^.]+$/, "").toUpperCase();

  if (code) capturesByCode.set(code, source);
});

export function getProjectCaptureCode(projectNumber: number, capture: ProjectCaptureLetter) {
  return `${projectNumber}${capture}`;
}

export function getProjectCapture(projectNumber: number, capture: ProjectCaptureLetter) {
  return capturesByCode.get(getProjectCaptureCode(projectNumber, capture));
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
  const source = capturesByCode.get(code);

  if (!source) throw new Error(`Missing required project capture: ${code}`);
  return source;
}
