import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  prerender: ["/", "/about"],
  buildDirectory: "dist",
} satisfies Config;
