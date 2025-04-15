import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  base: "/",



  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        dashboard: resolve(__dirname, "src/pages/dashboard.html"),
        nutrition: resolve(__dirname, "src/pages/nutrition.html"),
        header: resolve(__dirname, "src/partials/header.html"),
        footer: resolve(__dirname, "src/partials/footer.html"),
        workouts: resolve(__dirname, "src/pages/workouts.html"),
        goals: resolve(__dirname, "src/pages/goals.html"),
        routes: resolve(__dirname, "src/pages/routes.html"),
      
      },
    },
  },
});