import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

const API_TARGET = process.env.VITE_API_URL ?? "http://localhost:5000";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), vanillaExtractPlugin()],
  server: {
    proxy: {
      "/api": { target: API_TARGET, changeOrigin: true },
      "/login": { target: API_TARGET, changeOrigin: true },
      "/logout": { target: API_TARGET, changeOrigin: true },
    },
  },
});
