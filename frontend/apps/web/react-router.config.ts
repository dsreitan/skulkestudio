import type { Config } from "@react-router/dev/config";
import { getPages } from "./app/api";

export default {
  ssr: false,
  buildDirectory: "dist",

  async prerender() {
    const pages = await getPages("tv-aksjonen");
    return ["/", "/tv-aksjonen", ...pages.map((page) => `/${page.id}`)];
  },
} satisfies Config;
