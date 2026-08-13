import type { Variants } from "motion/react";

const easeOut = [0.22, 1, 0.36, 1] as const;

export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: easeOut } }
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.24, ease: easeOut } }
};

export const drawerBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, transition: { duration: 0.16 } }
};

export const drawerPanel: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.26, ease: easeOut } },
  exit: { opacity: 0, x: 24, transition: { duration: 0.18, ease: easeOut } }
};

export const drawerSheet: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.26, ease: easeOut } },
  exit: { opacity: 0, y: 30, transition: { duration: 0.18, ease: easeOut } }
};

export const pageTransition = sectionReveal;

export const interactiveMotion = {
  hover: { y: -2 },
  tap: { y: 0, scale: 0.99 },
  transition: { duration: 0.18, ease: easeOut }
} as const;
