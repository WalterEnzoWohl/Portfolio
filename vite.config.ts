import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Keep the React runtime cached when portfolio content changes.
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|scheduler|react-router|react-router-dom)\//.test(id.replaceAll("\\", "/"))) {
            return "react-vendor";
          }
        }
      }
    }
  }
});
