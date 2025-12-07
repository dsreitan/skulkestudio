import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), vanillaExtractPlugin()], ssr: { noExternal: ["styled-components"] },
});
