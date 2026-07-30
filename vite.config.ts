import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ isSsrBuild }) => ({
  base: "/",
  plugins: [react()],
  build: {
    target: "es2020",
    sourcemap: false,
    rolldownOptions: {
      output: isSsrBuild ? { entryFileNames: "static-render.js" } : undefined,
    },
  },
}));
