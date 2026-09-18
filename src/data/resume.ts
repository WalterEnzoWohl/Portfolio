import type { Language } from "../config/navigation";

export const resumeDownloads: Record<Language, { href: string; filename: string }> = {
  es: {
    href: "/img/Walter Enzo Wohl CV.pdf",
    filename: "Curriculum Vitae Walter Enzo Wohl.pdf"
  },
  en: {
    href: "/img/Walter Enzo Wohl Resume.pdf",
    filename: "Resume Walter Enzo Wohl.pdf"
  }
};
