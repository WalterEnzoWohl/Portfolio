export type ProjectCaptureLetter = "A" | "B" | "C" | "D";

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

export function getRequiredProjectCapture(projectNumber: number, capture: ProjectCaptureLetter) {
  const code = getProjectCaptureCode(projectNumber, capture);
  const source = capturesByCode.get(code);

  if (!source) throw new Error(`Missing required project capture: ${code}`);
  return source;
}
