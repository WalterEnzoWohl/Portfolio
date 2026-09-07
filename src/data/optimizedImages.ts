import catalog from "../assets/optimized/catalog.json";

type ImageEntry = {
  width: number;
  height: number;
  full?: string;
  previews: { src: string; width: number }[];
};

const urls = import.meta.glob("../assets/optimized/**/*.{webp,png,jpg,jpeg,avif}", {
  eager: true,
  import: "default",
  query: "?no-inline"
}) as Record<string, string>;
const resolve = (path: string) => urls[`../assets/optimized/${path}`];

export function getOptimizedImage(source: string) {
  const entry = (catalog as Record<string, ImageEntry>)[source];
  if (!entry) return undefined;
  const preview = entry.previews.find((item) => item.width >= 960) ?? entry.previews.at(-1)!;
  return {
    src: resolve(preview.src),
    srcSet: entry.previews.map((item) => `${resolve(item.src)} ${item.width}w`).join(", "),
    full: entry.full ? resolve(entry.full) : undefined,
    width: entry.width,
    height: entry.height
  };
}

export function getRequiredOptimizedImage(source: string) {
  const image = getOptimizedImage(source);
  if (!image) throw new Error(`Missing optimized image: ${source}. Run npm run images:optimize.`);
  return image;
}
